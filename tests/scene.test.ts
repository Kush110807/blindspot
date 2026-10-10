import test from 'node:test';
import assert from 'node:assert/strict';
import { validateScene } from '../src/contracts/scene.ts';
import { fixture } from './fixture.ts';

test('valid bilingual training fixture and separate assessment fixture', () => {
  assert.deepEqual(validateScene(fixture()), []);
  assert.deepEqual(validateScene(fixture('assessment', 'clear-view-control')), []);
});
test('a training scene must have both continuations', () => {
  const original = fixture();
  const broken = { ...original, continuations: [original.continuations[0]] };
  assert.ok(validateScene(broken).some(v => v.includes('two continuations')));
});
test('rubric must reference stable IDs present in scene', () => {
  const scene = fixture();
  const broken = { ...scene, rubric: { ...scene.rubric, acceptedResponseIds: ['choice-position-2'] } };
  assert.ok(validateScene(broken).some(v => v.includes('missing ID')));
});
test('missing language is rejected', () => {
  const scene = fixture();
  const broken = { ...scene, title: { en: 'Test', hi: '' } };
  assert.ok(validateScene(broken).some(v => v.includes('translation')));
});
