import test from 'node:test';
import assert from 'node:assert/strict';
import { scenes } from '../src/content/scenes/index.ts';
import { buildLessonPresentation } from '../src/integration/lessonPresentation.ts';
import type { LockedAttempt, RegionSelection } from '../src/engine/attempt.ts';
import type { SceneDefinition } from '../src/contracts/scene.ts';

function locked(scene: SceneDefinition, selection: RegionSelection, responseId: string, reasonId: string): LockedAttempt {
  return {
    recordVersion: 1, schemaVersion: scene.schemaVersion, sceneId: scene.id,
    sceneVersion: scene.sceneVersion, purpose: scene.purpose, regionSelection: selection,
    responseId, reasonId, displayedOrder: {
      responses: [...scene.responseOptions.map(c => c.id)].reverse(),
      reasons: [...scene.reasonOptions.map(c => c.id)].reverse()
    }, lockedAt: '2026-10-10T11:00:00.000Z'
  };
}

test('supported bus response and reason present draft guidance without correctness scoring', () => {
  const scene = scenes[0];
  const attempt = locked(scene, { kind: 'region', regionId: 'space-beyond-bus' }, 'ease-prepare-to-stop', 'bus-hides-conflict');
  const result = buildLessonPresentation(scene, attempt, 'en', 'no-one-emerges');
  assert.ok(result);
  assert.equal(result.recognition, 'supported'); assert.equal(result.response, 'supported'); assert.equal(result.reason, 'supported');
  assert.equal(result.alternatives.length, 2);
  assert.match(result.endingMessage ?? '', /Nobody appeared/);
  assert.match(result.why, /guarantees an outcome/);
  assert.equal(scene.contentReview.status, 'provisional');
});

test('mixed answers keep recognition distinct from a mistaken response and reason', () => {
  const scene = scenes[0];
  const attempt = locked(scene, { kind: 'region', regionId: 'space-beyond-bus' }, 'horn-hold-speed', 'horn-clears-risk');
  const result = buildLessonPresentation(scene, attempt, 'en', 'pedestrian-emerges');
  assert.ok(result);
  assert.equal(result.recognition, 'supported');
  assert.equal(result.response, 'reconsider'); assert.equal(result.reason, 'reconsider');
  assert.match(result.takeaway, /separate consideration/);
  assert.match(result.responseMeaning, /horn/);
  assert.match(result.endingMessage ?? '', /despite the horn/);
});

test('missed recognition can coexist with a supported response and reason', () => {
  const scene = scenes[1];
  const result = buildLessonPresentation(scene,
    locked(scene, { kind: 'none' }, 'ease-monitor-side-entry', 'van-limits-side-view'), 'en');
  assert.ok(result); assert.equal(result.recognition, 'reconsider');
  assert.equal(result.response, 'supported'); assert.equal(result.reason, 'supported');
  assert.match(result.regionExplanation, /screens/);
});

test('lateral manoeuvre is conditional, not falsely graded as categorically unsafe', () => {
  const scene = scenes[1];
  const result = buildLessonPresentation(scene,
    locked(scene, {kind:'region',regionId:'beside-delivery-van'}, 'shift-center-to-see', 'centre-improves-sightline'), 'hi');
  assert.ok(result); assert.equal(result.response, 'conditional');
  assert.match(result.responseMeaning, /ट्रैफ़िक/);
  assert.ok(result.alternatives.every(a => a.length > 0));
});

test('clear-view none is recognized and does not imply a road free of hazards', () => {
  const scene = scenes[2];
  const result = buildLessonPresentation(scene,
    locked(scene, { kind: 'none' }, 'ease-and-check', 'side-street-still-needs-checking'), 'en');
  assert.ok(result); assert.equal(result.recognition, 'supported');
  assert.equal(result.response, 'supported'); assert.equal(result.reason, 'supported');
  assert.match(result.regionExplanation, /does not mean the road has no hazards/);
  assert.match(result.why, /Caution is not automatically an error/);
});

test('horn in clear-view control is conditional; scrambled display order does not change mappings', () => {
  const scene = scenes[2];
  const result = buildLessonPresentation(scene,
    locked(scene, {kind:'region',regionId:'open-right-entry'}, 'horn-and-maintain-pace', 'quiet-entrance-less-attention'), 'en');
  assert.ok(result); assert.equal(result.recognition,'reconsider');
  assert.equal(result.response,'conditional'); assert.equal(result.reason,'reconsider');
  assert.match(result.responseMeaning,/horn/);
});

test('rejects mismatched ID, version, schema and unknown response without generating guidance', () => {
  const scene = scenes[0];
  const attempt = locked(scene,{kind:'none'},'horn-hold-speed','horn-clears-risk');
  for (const corrupt of [
    {...attempt,sceneId:'other'}, {...attempt,sceneVersion:'0'}, {...attempt,schemaVersion:0 as 1},
    {...attempt,responseId:'missing'}
  ]) assert.equal(buildLessonPresentation(scene, corrupt, 'en'), null);
  assert.equal(buildLessonPresentation(scene, null, 'hi'), null);
});

test('both language versions have region explanation, supported alternatives and practice takeaway for all authored responses', () => {
  for (const scene of scenes) for (const response of scene.responseOptions) for (const locale of ['en','hi'] as const) {
    const r = buildLessonPresentation(scene,locked(scene,{kind:'none'},response.id,scene.reasonOptions[0].id),locale);
    assert.ok(r, `${scene.id}/${response.id}/${locale}`);
    for (const text of [r.takeaway,r.regionExplanation,r.nextStep,r.why,r.responseMeaning,r.expectedRegion]) assert.ok(text.trim().length > 8);
    assert.deepEqual(r.alternatives.length,scene.rubric.acceptedResponseIds.length);
  }
});

test('retry after review creates a new attempt, preserves earlier locked record and does not become an edit', async () => {
  const { createSession, reduceSession } = await import('../src/integration/coordinator.ts');
  const catalogue = scenes;
  let session = createSession(catalogue, {records: [], status:'available'}, 0.25);
  const id = catalogue[0].id;
  session = reduceSession(session, {type:'begin',sceneId:id},catalogue);
  session = reduceSession(session, {type:'region',sceneId:id,selection:{kind:'region',regionId:'space-beyond-bus'}},catalogue);
  session = reduceSession(session, {type:'response',sceneId:id,responseId:'horn-hold-speed'},catalogue);
  session = reduceSession(session, {type:'reason',sceneId:id,reasonId:'horn-clears-risk'},catalogue);
  session = reduceSession(session, {type:'lock',sceneId:id,lockedAt:'2026-10-10T15:00:00Z'},catalogue);
  const previous = session.records[0];
  session = reduceSession(session, {type:'review',sceneId:id},catalogue);
  session = reduceSession(session, {type:'restart',sceneId:id,shuffleSeed:0.58},catalogue);
  assert.equal(session.attempt?.phase,'observe');
  assert.equal(session.attempt?.locked,null);
  assert.equal(session.records.length,1);
  assert.deepEqual(session.records[0],previous);
  session = reduceSession(session, {type:'begin',sceneId:id},catalogue);
  session = reduceSession(session, {type:'region',sceneId:id,selection:{kind:'region',regionId:'space-beyond-bus'}},catalogue);
  session = reduceSession(session, {type:'response',sceneId:id,responseId:'stay-back-reassess'},catalogue);
  session = reduceSession(session, {type:'reason',sceneId:id,reasonId:'bus-hides-conflict'},catalogue);
  session = reduceSession(session, {type:'lock',sceneId:id,lockedAt:'2026-10-10T15:01:00Z'},catalogue);
  assert.equal(session.records.length,2);
  assert.equal(session.records[0],previous);
  assert.equal(session.records[0].responseId,'horn-hold-speed');
  assert.equal(session.records[1].responseId,'stay-back-reassess');
});

test('a supported response with a weak reason remains a mixed answer', () => {
  const scene = scenes[0];
  const view = buildLessonPresentation(scene,
    locked(scene, {kind:'region',regionId:'space-beyond-bus'}, 'stay-back-reassess', 'width-means-safe'), 'en');
  assert.ok(view);
  assert.equal(view.recognition,'supported'); assert.equal(view.response,'supported');
  assert.equal(view.reason,'reconsider');
  assert.match(view.takeaway,/reason also needs a rethink/);
});
