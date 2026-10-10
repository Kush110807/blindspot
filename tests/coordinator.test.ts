import test from 'node:test';
import assert from 'node:assert/strict';
import { catalogueErrors, canAdvance, createSession, persistSessionRecords, reduceSession,
  seededRandom, selectPracticeView, type PracticeAction, type PracticeSession } from '../src/integration/coordinator.ts';
import { loadRecords, STORAGE_KEY } from '../src/records/localRecords.ts';
import { fixture } from './fixture.ts';
import type { SceneDefinition } from '../src/contracts/scene.ts';

const loaded = { records: [], status: 'available' as const };
const stamp = '2026-10-10T12:00:00.000Z';
function act(session: PracticeSession, action: PracticeAction, scenes: readonly SceneDefinition[]): PracticeSession {
  return reduceSession(session, action, scenes);
}
function completed(session: PracticeSession, scenes: readonly SceneDefinition[], selection: 'none' | 'region' = 'region') {
  const sceneId = scenes[session.sceneIndex].id;
  let s = act(session, { type: 'begin', sceneId }, scenes);
  s = act(s, { type: 'region', sceneId, selection: selection === 'none' ? { kind: 'none' } : { kind: 'region', regionId: 'left-edge' } }, scenes);
  s = act(s, { type: 'response', sceneId, responseId: 'wait' }, scenes);
  s = act(s, { type: 'reason', sceneId, reasonId: 'limited-view' }, scenes);
  return s;
}
function catalogue(): SceneDefinition[] {
  return [
    { ...fixture(), id: 'bus-training-01' },
    { ...fixture('assessment'), id: 'unfamiliar-blocked-01' },
    { ...fixture('assessment', 'clear-view-control'), id: 'matched-clear-01' }
  ];
}

test('catalogue permits exactly the three expected authored conditions, rejects missing or invented reviewed content', () => {
  const scenes = catalogue();
  assert.deepEqual(catalogueErrors(scenes), []);
  assert.ok(catalogueErrors(scenes.slice(0, 1)).some(e => e.includes('three')));
  assert.ok(catalogueErrors([scenes[0], scenes[0], scenes[2]]).some(e => e.includes('Duplicate')));
  assert.ok(catalogueErrors([{ ...scenes[0], contentReview: { status: 'instructor-reviewed', reviewerRef: 'fake', reviewedOn: '2026-10-10' } }, scenes[1], scenes[2]]).some(e => e.includes('provisional')));
});

test('no feedback before review; separate IDs retained across locale switch and shuffled option order', () => {
  const scenes = catalogue();
  let s = createSession(scenes, loaded, 0.12);
  const originalOrder = s.attempt?.displayedOrder;
  assert.equal(selectPracticeView(s, scenes)?.feedback, null);
  s = completed(s, scenes);
  assert.equal(selectPracticeView(s, scenes)?.feedback, null);
  s = act(s, { type: 'locale', locale: 'hi' }, scenes);
  assert.deepEqual(s.attempt?.displayedOrder, originalOrder);
  assert.equal(s.attempt?.responseId, 'wait');
  assert.equal(s.locale, 'hi');
  assert.equal(selectPracticeView(s, scenes)?.feedback, null);
  s = act(s, { type: 'lock', sceneId: scenes[0].id, lockedAt: stamp }, scenes);
  assert.equal(selectPracticeView(s, scenes)?.feedback, null, 'locked screen must require explicit review');
  assert.deepEqual(s.attempt?.locked?.displayedOrder, originalOrder);
  assert.equal(s.records.length, 1);
  s = act(s, { type: 'review', sceneId: scenes[0].id }, scenes);
  assert.equal(selectPracticeView(s, scenes)?.feedback?.response, 'रुकने का कारण');
  assert.equal(selectPracticeView(s, scenes)?.feedback?.provisional, true);
  assert.equal(selectPracticeView(s, scenes)?.reviewedCriteria, null);
});

test('incomplete and repeated locks do not persist extra records; late stale intents are ignored', () => {
  const scenes = catalogue();
  let s = createSession(scenes, loaded);
  s = act(s, { type: 'lock', sceneId: scenes[0].id, lockedAt: stamp }, scenes);
  assert.equal(s.records.length, 0);
  s = completed(s, scenes);
  s = act(s, { type: 'lock', sceneId: 'wrong-scene', lockedAt: stamp }, scenes);
  assert.equal(s.records.length, 0);
  const locked = act(s, { type: 'lock', sceneId: scenes[0].id, lockedAt: stamp }, scenes);
  assert.equal(locked.records.length, 1);
  assert.equal(locked.saveRevision, 1);
  assert.equal(act(locked, { type: 'lock', sceneId: scenes[0].id, lockedAt: stamp }, scenes), locked);
  assert.equal(act(locked, { type: 'response', sceneId: scenes[0].id, responseId: 'continue' }, scenes), locked);
  assert.equal(act(locked, { type: 'region', sceneId: scenes[0].id, selection: { kind: 'none' } }, scenes), locked);
  assert.equal(locked.records[0].responseId, 'wait');
});

test('training cannot skip the second continuation; next scene requires review and proper identity', () => {
  const scenes = catalogue();
  let s = completed(createSession(scenes, loaded), scenes);
  s = act(s, { type: 'lock', sceneId: scenes[0].id, lockedAt: stamp }, scenes);
  assert.equal(canAdvance(s, scenes), false);
  s = act(s, { type: 'review', sceneId: scenes[0].id }, scenes);
  assert.equal(canAdvance(s, scenes), false);
  assert.equal(act(s, { type: 'next-scene', sceneId: scenes[0].id, shuffleSeed: 0.5 }, scenes), s);
  s = act(s, { type: 'next-ending', sceneId: scenes[0].id }, scenes);
  assert.equal(canAdvance(s, scenes), true);
  s = act(s, { type: 'replay', sceneId: scenes[0].id }, scenes);
  assert.equal(canAdvance(s, scenes), false);
  s = act(s, { type: 'next-ending', sceneId: scenes[0].id }, scenes);
  const formerLocked = s.attempt?.locked;
  s = act(s, { type: 'next-scene', sceneId: scenes[0].id, shuffleSeed: 0.5 }, scenes);
  assert.equal(s.sceneIndex, 1);
  assert.equal(s.attempt?.phase, 'observe');
  assert.equal(s.attempt?.locked, null);
  assert.deepEqual(s.records[0], formerLocked);
  assert.equal(act(s, { type: 'response', sceneId: scenes[0].id, responseId: 'continue' }, scenes), s);
});

test('clear-view explicit none completes assessment; final scene has no further next navigation', () => {
  const scenes = catalogue();
  let s = createSession(scenes, loaded);
  s = { ...s, sceneIndex: 2, attempt: createSession([scenes[2]], loaded).attempt };
  s = completed(s, scenes, 'none');
  s = act(s, { type: 'lock', sceneId: scenes[2].id, lockedAt: stamp }, scenes);
  assert.equal(s.attempt?.locked?.regionSelection.kind, 'none');
  s = act(s, { type: 'review', sceneId: scenes[2].id }, scenes);
  assert.equal(selectPracticeView(s, scenes)?.feedback?.provisional, true);
  assert.equal(canAdvance(s, scenes), false);
});

test('persistence roundtrip only on locked records, storage corrupt/unavailable leaves live practice usable', () => {
  const scenes = catalogue();
  let s = completed(createSession(scenes, loaded), scenes);
  const values = new Map<string, string>();
  let writes = 0;
  const store = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { writes++; values.set(key, value); } };
  assert.equal(s.saveRevision, 0);
  s = act(s, { type: 'lock', sceneId: scenes[0].id, lockedAt: stamp }, scenes);
  assert.deepEqual(persistSessionRecords(s, store), { saved: true, status: 'available' });
  assert.equal(writes, 1);
  assert.deepEqual(loadRecords(store).records, s.records);
  const corrupted = { ...s, storageStatus: 'corrupt' as const };
  assert.deepEqual(persistSessionRecords(corrupted, store), { saved: false, status: 'corrupt' });
  assert.equal(writes, 1);
  const unavailable = { ...s, storageStatus: 'unavailable' as const };
  assert.deepEqual(persistSessionRecords(unavailable, null), { saved: false, status: 'unavailable' });
  assert.equal(values.has(STORAGE_KEY), true);
  const failed = { getItem: () => null, setItem: () => { throw new Error('storage blocked'); } };
  assert.deepEqual(persistSessionRecords(s, failed), { saved: false, status: 'unavailable' });
  const newStatus = act(s, { type: 'storage-result', revision: s.saveRevision, status: 'unavailable' }, scenes);
  assert.equal(newStatus.storageStatus, 'unavailable');
  assert.equal(act(newStatus, { type: 'storage-result', revision: -1, status: 'corrupt' }, scenes), newStatus);
});

test('deterministic shuffled attempts make React strict-mode reducer replay stable', () => {
  const scenes = catalogue();
  const s = createSession(scenes, loaded);
  const event: PracticeAction = { type: 'restart', sceneId: scenes[0].id, shuffleSeed: 0.239 };
  assert.deepEqual(act(s, event, scenes), act(s, event, scenes));
  assert.deepEqual([seededRandom(0.239)(), seededRandom(0.239)()], [seededRandom(0.239)(), seededRandom(0.239)()]);
});

test('changing scene revision prevents disclosure of prior feedback, next navigation and replay', () => {
  const scenes = catalogue();
  let s = completed(createSession(scenes, loaded), scenes);
  s = act(s, { type: 'lock', sceneId: scenes[0].id, lockedAt: stamp }, scenes);
  s = act(s, { type: 'review', sceneId: scenes[0].id }, scenes);
  const changed = [{ ...scenes[0], sceneVersion: 'changed-version' }, scenes[1], scenes[2]];
  assert.equal(selectPracticeView(s, changed)?.feedback, null);
  assert.equal(canAdvance(s, changed), false);
  assert.equal(act(s, { type: 'next-ending', sceneId: scenes[0].id }, changed), s);
});
