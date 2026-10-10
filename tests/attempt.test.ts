import test from 'node:test';
import assert from 'node:assert/strict';
import { beginAnswering, canLock, canRevealFeedback, chooseReason, chooseRegion, chooseResponse,
  createAttempt, currentEndingId, lockAttempt, nextEnding, replayEndings, startReview } from '../src/engine/attempt.ts';
import { getFeedback, getReviewedCriteria } from '../src/engine/feedback.ts';
import { fixture } from './fixture.ts';

test('incomplete attempts cannot lock; submitted answers cannot change or silently unlock', () => {
  const scene = fixture();
  const state = beginAnswering(createAttempt(scene, () => 0.4));
  assert.equal(canLock(state), false);
  assert.equal(lockAttempt(state, scene), state);
  const complete = chooseReason(chooseResponse(chooseRegion(state, { kind: 'region', regionId: 'left-edge' }, scene), 'wait', scene), 'limited-view', scene);
  assert.equal(canLock(complete), true);
  const locked = lockAttempt(complete, scene, '2026-10-10T12:00:00.000Z');
  assert.equal(locked.locked?.regionSelection.kind, 'region');
  assert.equal(locked.locked?.responseId, 'wait');
  assert.equal(chooseResponse(locked, 'continue', scene), locked);
  assert.equal(chooseRegion(locked, { kind: 'none' }, scene), locked);
  assert.equal(beginAnswering(locked), locked);
  assert.equal(lockAttempt(locked, scene), locked);
});
test('feedback is locked, indexed by IDs, and does not depend on which ending plays', () => {
  const scene = fixture();
  let s = beginAnswering(createAttempt(scene, () => 0));
  s = chooseReason(chooseResponse(chooseRegion(s, { kind: 'region', regionId: 'left-edge' }, scene), 'continue', scene), 'assumption', scene);
  assert.equal(canRevealFeedback(s), false);
  assert.equal(getFeedback(scene, s.locked, 'en'), null);
  s = lockAttempt(s, scene, '2026-10-10T12:00:00.000Z');
  assert.equal(canRevealFeedback(s), true);
  const before = getFeedback(scene, s.locked, 'en');
  assert.equal(before?.response, 'Reason to continue');
  assert.equal(before?.reason, 'An assumption is not proof');
  assert.equal(before?.provisional, true);
  assert.equal(getReviewedCriteria(scene, s.locked), null);
  s = startReview(s);
  assert.equal(currentEndingId(s, scene), 'nothing');
  const after = nextEnding(s, scene);
  assert.equal(currentEndingId(after, scene), 'actor');
  const replay = replayEndings(after, scene);
  assert.equal(currentEndingId(replay, scene), 'nothing');
  assert.deepEqual(replay.locked, after.locked);
  assert.deepEqual(getFeedback(scene, after.locked, 'en'), before);
});
test('shuffled display order does not alter ID-based response/reason feedback and recorded order', () => {
  const scene = fixture();
  const initial = createAttempt(scene, () => 0);
  assert.deepEqual(initial.displayedOrder.responses, ['continue', 'wait']);
  let s = beginAnswering(initial);
  s = chooseReason(chooseResponse(chooseRegion(s, { kind: 'none' }, scene), 'wait', scene), 'limited-view', scene);
  s = lockAttempt(s, scene, '2026-10-10T12:00:00.000Z');
  assert.deepEqual(s.locked?.displayedOrder.responses, ['continue', 'wait']);
  assert.equal(getFeedback(scene, s.locked, 'hi')?.response, 'रुकने का कारण');
});
test('clear-view assessment supports explicit none; no pre-lock guidance or ending', () => {
  const scene = fixture('assessment', 'clear-view-control');
  let s = beginAnswering(createAttempt(scene, () => 0.6));
  s = chooseRegion(s, { kind: 'none' }, scene);
  s = chooseReason(chooseResponse(s, 'wait', scene), 'limited-view', scene);
  assert.equal(getFeedback(scene, s.locked, 'en'), null);
  s = lockAttempt(s, scene);
  assert.equal(s.locked?.regionSelection.kind, 'none');
  assert.equal(currentEndingId(startReview(s), scene), null);
});
test('instructor review gates criteria; continuations never enter classification', () => {
  const scene = { ...fixture(), contentReview: { status: 'instructor-reviewed' as const, reviewerRef: 'test-review', reviewedOn: '2026-10-10' } };
  let s = beginAnswering(createAttempt(scene));
  s = chooseReason(chooseResponse(chooseRegion(s, { kind: 'region', regionId: 'left-edge' }, scene), 'wait', scene), 'limited-view', scene);
  s = lockAttempt(s, scene);
  assert.deepEqual(getReviewedCriteria(scene, s.locked), { recognition: true, response: true, reason: true });
  const changedEndings = { ...scene, continuations: [...scene.continuations].reverse() };
  assert.deepEqual(getReviewedCriteria(changedEndings, s.locked), { recognition: true, response: true, reason: true });
});
