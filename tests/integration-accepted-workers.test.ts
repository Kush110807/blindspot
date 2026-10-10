/** Integration tests use the accepted B catalogue and A state engine, not test fixtures. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { scenes } from '../src/content/scenes/index.ts';
import { catalogueErrors, createSession, canAdvance, reduceSession, selectPracticeView,
  persistSessionRecords, type PracticeSession, type PracticeAction } from '../src/integration/coordinator.ts';
import { clientToNormalized, hitRegion } from '../src/engine/geometry.ts';
import { loadRecords, STORAGE_KEY } from '../src/records/localRecords.ts';
import { translate } from '../src/contracts/scene.ts';

const stamp = '2026-10-10T15:00:00.000Z';
const clean = { status: 'available' as const, records: [] };
function apply(state: PracticeSession, action: PracticeAction): PracticeSession {
  return reduceSession(state, action, scenes);
}
function answerAndLock(state: PracticeSession, selection: 'none' | 'region' = 'region'): PracticeSession {
  const scene = scenes[state.sceneIndex];
  state = apply(state, { type: 'begin', sceneId: scene.id });
  state = apply(state, { type: 'region', sceneId: scene.id,
    selection: selection === 'none' ? { kind: 'none' } : { kind: 'region', regionId: scene.tapRegions[0].id } });
  state = apply(state, { type: 'response', sceneId: scene.id, responseId: scene.responseOptions[1].id });
  state = apply(state, { type: 'reason', sceneId: scene.id, reasonId: scene.reasonOptions[1].id });
  assert.equal(selectPracticeView(state, scenes)?.feedback, null);
  state = apply(state, { type: 'lock', sceneId: scene.id, lockedAt: stamp });
  assert.equal(state.attempt?.phase, 'locked');
  assert.equal(selectPracticeView(state, scenes)?.feedback, null);
  return state;
}

test('accepted B source catalogue is exact, provisional and references actual bundled SVG assets', () => {
  assert.equal(scenes.length, 3);
  assert.deepEqual(catalogueErrors(scenes), []);
  for (const scene of scenes) {
    assert.equal(scene.contentReview.status, 'provisional');
    assert.equal(scene.schemaVersion, 1);
    assert.equal(scene.base.src.startsWith('/scenes/'), true);
    for (const asset of [scene.base, ...scene.continuations.flatMap(c => c.layers.map(l => l.image))]) {
      assert.ok(existsSync(`public${asset.src}`), `missing image ${asset.src}`);
      assert.match(readFileSync(`public${asset.src}`, 'utf8'), /<svg\b/);
      for (const locale of ['en', 'hi'] as const) assert.ok(translate(asset.alt, locale).trim());
    }
    for (const locale of ['en', 'hi'] as const) {
      for (const item of [...scene.visibleConditions, scene.noneLabel, ...scene.responseOptions.map(o => o.label),
        ...scene.reasonOptions.map(o => o.label), ...scene.tapRegions.map(r => r.label)]) {
        assert.ok(translate(item, locale).trim(), `${scene.id} missing ${locale} translation`);
      }
    }
  }
});

test('training: original selection locks once; both endings and replay cannot rewrite it', () => {
  let session = createSession(scenes, clean, 0.12);
  session = answerAndLock(session);
  const locked = session.attempt!.locked;
  assert.equal(session.records.length, 1);
  assert.equal(session.saveRevision, 1);
  const wrong = apply(session, { type: 'response', sceneId: scenes[0].id, responseId: scenes[0].responseOptions[0].id });
  assert.equal(wrong, session);
  session = apply(session, { type: 'review', sceneId: scenes[0].id });
  assert.equal(session.attempt!.endingIndex, 0);
  assert.equal(canAdvance(session, scenes), false);
  assert.equal(selectPracticeView(session, scenes)?.feedback?.provisional, true);
  assert.equal(selectPracticeView(session, scenes)?.reviewedCriteria, null);
  session = apply(session, { type: 'next-ending', sceneId: scenes[0].id });
  assert.equal(session.attempt!.endingIndex, 1);
  assert.equal(canAdvance(session, scenes), true);
  session = apply(session, { type: 'replay', sceneId: scenes[0].id });
  assert.equal(session.attempt!.endingIndex, 0);
  assert.equal(canAdvance(session, scenes), false);
  assert.deepEqual(session.attempt!.locked, locked);
  assert.equal(session.records.length, 1);
});

test('all three approved scenes advance in order and clear-view none is a stable locked selection', () => {
  let session = createSession(scenes, clean, 0.77);
  session = answerAndLock(session);
  session = apply(session, { type: 'review', sceneId: scenes[0].id });
  assert.equal(apply(session, { type: 'next-scene', sceneId: scenes[0].id, shuffleSeed: 0.3 }), session);
  session = apply(session, { type: 'next-ending', sceneId: scenes[0].id });
  session = apply(session, { type: 'next-scene', sceneId: scenes[0].id, shuffleSeed: 0.3 });
  assert.equal(session.sceneIndex, 1);
  assert.equal(session.attempt?.sceneId, 'unfamiliar-blocked-01');
  session = answerAndLock(session);
  session = apply(session, { type: 'locale', locale: 'hi' });
  assert.equal(session.attempt?.locked?.sceneId, scenes[1].id);
  session = apply(session, { type: 'review', sceneId: scenes[1].id });
  assert.equal(selectPracticeView(session, scenes)?.feedback?.provisional, true);
  assert.equal(selectPracticeView(session, scenes)?.reviewedCriteria, null);
  assert.equal(canAdvance(session, scenes), true);
  session = apply(session, { type: 'next-scene', sceneId: scenes[1].id, shuffleSeed: 0.4 });
  assert.equal(session.sceneIndex, 2);
  session = answerAndLock(session, 'none');
  assert.deepEqual(session.attempt!.locked!.regionSelection, { kind: 'none' });
  session = apply(session, { type: 'review', sceneId: scenes[2].id });
  assert.equal(selectPracticeView(session, scenes)?.feedback?.provisional, true);
  assert.equal(selectPracticeView(session, scenes)?.reviewedCriteria, null);
  assert.equal(canAdvance(session, scenes), false);
  assert.equal(session.records.length, 3);
  assert.equal(session.saveRevision, 3);
});

test('language changes preserve locked semantic selections and stored option order', () => {
  let session = answerAndLock(createSession(scenes, clean, 0.21));
  const before = structuredClone(session.attempt?.locked);
  session = apply(session, { type: 'locale', locale: 'hi' });
  assert.deepEqual(session.attempt?.locked, before);
  session = apply(session, { type: 'locale', locale: 'en' });
  assert.deepEqual(session.attempt?.locked, before);
});

test('actual B tap region maps through scaled viewport and ignores outside image', () => {
  const scene = scenes[0], region = scene.tapRegions[0];
  const rectangle = { left: 100, top: 100, width: 375, height: 260 };
  const point = clientToNormalized(100 + 375 * (region.bounds.x + region.bounds.width / 2),
    100 + 260 * (region.bounds.y + region.bounds.height / 2), rectangle, scene.base.width, scene.base.height);
  assert.ok(point);
  assert.equal(hitRegion(point, scene.tapRegions), region.id);
  assert.equal(clientToNormalized(70, 90, rectangle, scene.base.width, scene.base.height), null);
});

test('corrupt/unavailable storage never blocks actual scene decisions and corrupt data is preserved', () => {
  let value = '{not json';
  const store = { getItem: (_: string) => value, setItem: (_: string, v: string) => { value = v; } };
  let session = createSession(scenes, loadRecords(store));
  assert.equal(session.storageStatus, 'corrupt');
  session = answerAndLock(session);
  assert.equal(persistSessionRecords(session, store).saved, false);
  assert.equal(value, '{not json');
  assert.equal(session.records.length, 1);
  const blocked = { getItem(_k: string): string | null { throw Error('blocked'); }, setItem(_k: string, _v: string): void { throw Error('blocked'); } };
  session = createSession(scenes, loadRecords(blocked));
  assert.equal(session.storageStatus, 'unavailable');
  session = answerAndLock(session);
  assert.equal(persistSessionRecords(session, blocked).saved, false);
  assert.equal(session.records.length, 1);
});
