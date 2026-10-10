/** A-owned coordinator: stable B/C interface, no authored scenes or UI implementation. */
import { validateScene, type Locale, type ReasonId, type ResponseId, type SceneDefinition } from '../contracts/scene.ts';
import {
  beginAnswering, chooseReason, chooseRegion, chooseResponse, createAttempt, lockAttempt,
  nextEnding, replayEndings, startReview,
  type AttemptState, type LockedAttempt, type RegionSelection
} from '../engine/attempt.ts';
import { getFeedback, type FeedbackParts } from '../engine/feedback.ts';
import { saveRecords, type KeyValueStorage, type LoadedRecords, type SaveResult, type StorageStatus } from '../records/localRecords.ts';
import type { PracticeScreenProps, SceneCatalogue } from '../contracts/integration.ts';

export interface PracticeSession {
  readonly sceneIndex: number;
  readonly attempt: AttemptState | null;
  readonly locale: Locale;
  /** In-memory records survive unavailable storage; never include draft choices. */
  readonly records: readonly LockedAttempt[];
  readonly storageStatus: StorageStatus;
  /** Incremented once for each newly locked answer, never on a replay or language toggle. */
  readonly saveRevision: number;
}
export type PracticeAction =
  | { readonly type: 'begin'; readonly sceneId: string }
  | { readonly type: 'region'; readonly sceneId: string; readonly selection: RegionSelection }
  | { readonly type: 'response'; readonly sceneId: string; readonly responseId: ResponseId }
  | { readonly type: 'reason'; readonly sceneId: string; readonly reasonId: ReasonId }
  | { readonly type: 'lock'; readonly sceneId: string; readonly lockedAt: string }
  | { readonly type: 'review'; readonly sceneId: string }
  | { readonly type: 'next-ending'; readonly sceneId: string }
  | { readonly type: 'replay'; readonly sceneId: string }
  | { readonly type: 'restart'; readonly sceneId: string; readonly shuffleSeed: number }
  | { readonly type: 'next-scene'; readonly sceneId: string; readonly shuffleSeed: number }
  | { readonly type: 'locale'; readonly locale: Locale }
  | { readonly type: 'storage-result'; readonly revision: number; readonly status: StorageStatus };

/** Optional A-side catalogue gate; invalid B content must not reach the learner. */
export function catalogueErrors(scenes: SceneCatalogue): string[] {
  const errors = scenes.flatMap((scene, i) => validateScene(scene).map(err => `Scene ${i + 1} (${scene.id}): ${err}`));
  if (scenes.length !== 3) errors.push('Exactly three authored prototype scenes required');
  const expected: readonly (readonly [SceneDefinition['purpose'], SceneDefinition['condition']])[] = [
    ['training', 'blocked-view'], ['assessment', 'blocked-view'], ['assessment', 'clear-view-control']
  ];
  expected.forEach(([purpose, condition], i) => {
    if (scenes[i] && (scenes[i].purpose !== purpose || scenes[i].condition !== condition))
      errors.push(`Scene ${i + 1} has incorrect purpose or condition`);
  });
  if (new Set(scenes.map(scene => scene.id)).size !== scenes.length) errors.push('Duplicate scene ID across catalogue');
  const expectedIds = ['bus-training-01', 'unfamiliar-blocked-01', 'matched-clear-01'];
  scenes.forEach((scene, i) => {
    if (scene.id !== expectedIds[i]) errors.push(`Scene ${i + 1} has unexpected ID`);
    if (scene.contentReview.status !== 'provisional') errors.push(`Scene ${i + 1} must remain provisional`);
  });
  return errors;
}

/** Deterministic replay-safe shuffle source; action payload supplies random seed outside reducer. */
export function seededRandom(seed: number): () => number {
  if (!Number.isFinite(seed)) throw new Error('Invalid shuffle seed');
  let value = Math.floor(seed * 4294967296) >>> 0;
  return () => {
    value = (value + 0x6D2B79F5) >>> 0;
    let t = Math.imul(value ^ (value >>> 15), 1 | value);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createSession(scenes: SceneCatalogue, loaded: LoadedRecords, shuffleSeed = 0.45): PracticeSession {
  return {
    sceneIndex: 0, attempt: scenes[0] ? createAttempt(scenes[0], seededRandom(shuffleSeed)) : null,
    locale: 'en', records: [...loaded.records], storageStatus: loaded.status, saveRevision: 0
  };
}

export function canAdvance(session: PracticeSession, scenes: SceneCatalogue): boolean {
  const scene = scenes[session.sceneIndex];
  return !!scene && !!session.attempt && session.attempt.sceneId === scene.id &&
    (scene.purpose !== 'training' || session.attempt.endingIndex === scene.continuations.length - 1) &&
    session.attempt.phase === 'review' && session.attempt.locked?.sceneId === scene.id &&
    session.attempt.locked?.sceneVersion === scene.sceneVersion &&
    session.attempt.locked?.schemaVersion === scene.schemaVersion &&
    session.sceneIndex < scenes.length - 1;
}

/** Pure reducer. Never read/write browser storage or sample randomness inside this function. */
export function reduceSession(session: PracticeSession, action: PracticeAction, scenes: SceneCatalogue): PracticeSession {
  if (action.type === 'locale') {
    return action.locale !== 'en' && action.locale !== 'hi' ? session : { ...session, locale: action.locale };
  }
  if (action.type === 'storage-result') {
    return action.revision !== session.saveRevision || action.status === session.storageStatus
      ? session : { ...session, storageStatus: action.status };
  }
  const scene = scenes[session.sceneIndex];
  const attempt = session.attempt;
  if (!scene || !attempt || attempt.sceneId !== scene.id || action.sceneId !== scene.id) return session;
  if (action.type === 'next-scene') {
    if (!canAdvance(session, scenes)) return session;
    const next = scenes[session.sceneIndex + 1];
    return { ...session, sceneIndex: session.sceneIndex + 1, attempt: createAttempt(next, seededRandom(action.shuffleSeed)) };
  }
  if (action.type === 'restart') {
    return { ...session, attempt: createAttempt(scene, seededRandom(action.shuffleSeed)) };
  }
  let updated: AttemptState;
  switch (action.type) {
    case 'begin': updated = beginAnswering(attempt); break;
    case 'region': updated = chooseRegion(attempt, action.selection, scene); break;
    case 'response': updated = chooseResponse(attempt, action.responseId, scene); break;
    case 'reason': updated = chooseReason(attempt, action.reasonId, scene); break;
    case 'lock': {
      updated = lockAttempt(attempt, scene, action.lockedAt);
      if (updated === attempt || !updated.locked) return session;
      return { ...session, attempt: updated, records: [...session.records, updated.locked], saveRevision: session.saveRevision + 1 };
    }
    case 'review': updated = startReview(attempt); break;
    case 'next-ending': updated = nextEnding(attempt, scene); break;
    case 'replay': updated = replayEndings(attempt, scene); break;
  }
  return updated === attempt ? session : { ...session, attempt: updated };
}

export interface PracticeViewData {
  readonly scene: SceneDefinition;
  readonly attempt: AttemptState;
  readonly locale: Locale;
  readonly feedback: FeedbackParts | null;
  readonly reviewedCriteria: PracticeScreenProps['reviewedCriteria'];
  readonly storageStatus: StorageStatus;
  readonly canNextScene: boolean;
}
/** Explicit provisional-only policy: no validated correctness scores during this prototype. */
export function selectPracticeView(session: PracticeSession, scenes: SceneCatalogue): PracticeViewData | null {
  const scene = scenes[session.sceneIndex];
  const attempt = session.attempt;
  if (!scene || !attempt || attempt.sceneId !== scene.id) return null;
  const reviewMatches = attempt.phase === 'review' && !!attempt.locked &&
    attempt.locked.sceneId === scene.id && attempt.locked.sceneVersion === scene.sceneVersion &&
    attempt.locked.schemaVersion === scene.schemaVersion;
  return {
    scene, attempt, locale: session.locale, storageStatus: session.storageStatus,
    feedback: reviewMatches ? getFeedback(scene, attempt.locked, session.locale) : null,
    reviewedCriteria: null,
    canNextScene: canAdvance(session, scenes)
  };
}

/** Keep stable IDs and versioned locked records; no navigation implicitly unlocks an attempt. */

/** Do not overwrite corrupt records; failed writes never block in-memory practice. */
export function persistSessionRecords(session: PracticeSession, storage: KeyValueStorage | null): SaveResult {
  return session.storageStatus === 'available' ? saveRecords(storage, session.records) :
    { saved: false, status: session.storageStatus };
}
