import type { EndingId, ReasonId, RegionId, ResponseId, SceneDefinition, SceneId } from '../contracts/scene.ts';

export type RegionSelection =
  | Readonly<{ kind: 'none' }>
  | Readonly<{ kind: 'region'; regionId: RegionId }>;
export type AttemptPhase = 'observe' | 'answering' | 'locked' | 'review';
export interface OptionOrder {
  readonly responses: readonly ResponseId[];
  readonly reasons: readonly ReasonId[];
}
/** Serialised answer snapshot: no PII, no raw image coordinates, no score. */
export interface LockedAttempt {
  readonly recordVersion: 1;
  readonly schemaVersion: 1;
  readonly sceneId: SceneId;
  readonly sceneVersion: string;
  readonly purpose: 'training' | 'assessment';
  readonly regionSelection: RegionSelection;
  readonly responseId: ResponseId;
  readonly reasonId: ReasonId;
  readonly displayedOrder: OptionOrder;
  readonly lockedAt: string;
}
export interface AttemptState {
  readonly phase: AttemptPhase;
  readonly sceneId: SceneId;
  readonly regionSelection: RegionSelection | null;
  readonly responseId: ResponseId | null;
  readonly reasonId: ReasonId | null;
  readonly displayedOrder: OptionOrder;
  readonly locked: LockedAttempt | null;
  readonly endingIndex: number;
}

export function shuffledIds(ids: readonly string[], random: () => number = Math.random): string[] {
  const result = [...ids];
  for (let i = result.length - 1; i > 0; i--) {
    const sample = random();
    if (!Number.isFinite(sample) || sample < 0 || sample >= 1) throw new Error('Random source out of range');
    const j = Math.floor(sample * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function createAttempt(scene: SceneDefinition, random?: () => number): AttemptState {
  return {
    phase: 'observe', sceneId: scene.id, regionSelection: null, responseId: null, reasonId: null,
    displayedOrder: {
      responses: shuffledIds(scene.responseOptions.map(c => c.id), random),
      reasons: shuffledIds(scene.reasonOptions.map(c => c.id), random)
    },
    locked: null, endingIndex: 0
  };
}
export function beginAnswering(state: AttemptState): AttemptState {
  return state.phase === 'observe' ? { ...state, phase: 'answering' } : state;
}
export function chooseRegion(state: AttemptState, selection: RegionSelection, scene: SceneDefinition): AttemptState {
  if (state.phase !== 'answering' || state.sceneId !== scene.id) return state;
  if (selection.kind === 'region' && !scene.tapRegions.some(r => r.id === selection.regionId)) return state;
  return { ...state, regionSelection: selection };
}
export function chooseResponse(state: AttemptState, id: ResponseId, scene: SceneDefinition): AttemptState {
  if (state.phase !== 'answering' || state.sceneId !== scene.id || !scene.responseOptions.some(r => r.id === id)) return state;
  return { ...state, responseId: id };
}
export function chooseReason(state: AttemptState, id: ReasonId, scene: SceneDefinition): AttemptState {
  if (state.phase !== 'answering' || state.sceneId !== scene.id || !scene.reasonOptions.some(r => r.id === id)) return state;
  return { ...state, reasonId: id };
}
export function canLock(state: AttemptState): boolean {
  return state.phase === 'answering' && state.regionSelection !== null && state.responseId !== null && state.reasonId !== null;
}
/** Lock is an immutable, one-way transition. Invalid/incomplete states remain untouched. */
export function lockAttempt(state: AttemptState, scene: SceneDefinition, lockedAt = new Date().toISOString()): AttemptState {
  if (!canLock(state) || state.sceneId !== scene.id || state.locked ||
      !state.responseId || !state.reasonId || !state.regionSelection) return state;
  const locked: LockedAttempt = {
    recordVersion: 1, schemaVersion: scene.schemaVersion, sceneId: scene.id,
    sceneVersion: scene.sceneVersion, purpose: scene.purpose,
    regionSelection: state.regionSelection, responseId: state.responseId, reasonId: state.reasonId,
    displayedOrder: {
      responses: [...state.displayedOrder.responses],
      reasons: [...state.displayedOrder.reasons]
    }, lockedAt
  };
  return { ...state, locked, phase: 'locked', endingIndex: 0 };
}
/** Assessment hints may be rendered only after a valid lock. */
export function canRevealFeedback(state: AttemptState): boolean {
  return state.locked !== null && (state.phase === 'locked' || state.phase === 'review');
}
export function startReview(state: AttemptState): AttemptState {
  return state.phase === 'locked' && state.locked ? { ...state, phase: 'review' } : state;
}
export function currentEndingId(state: AttemptState, scene: SceneDefinition): EndingId | null {
  if (state.phase !== 'review' || !state.locked || scene.purpose !== 'training') return null;
  return scene.continuations[state.endingIndex]?.id ?? null;
}
export function nextEnding(state: AttemptState, scene: SceneDefinition): AttemptState {
  if (state.phase !== 'review' || !state.locked || scene.purpose !== 'training' ||
      state.endingIndex >= scene.continuations.length - 1) return state;
  return { ...state, endingIndex: state.endingIndex + 1 };
}

/** Replay continuations without restarting or mutating the locked answer. */
export function replayEndings(state: AttemptState, scene: SceneDefinition): AttemptState {
  if (state.phase !== 'review' || !state.locked || scene.purpose !== 'training') return state;
  return { ...state, endingIndex: 0 };
}
