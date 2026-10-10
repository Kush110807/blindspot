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

test('review metadata must have nonblank reference and strict, real calendar date', () => {
  const original = fixture();
  const invalid = [
    undefined,
    { status: 'unsupported' },
    { status: 'instructor-reviewed' },
    { status: 'instructor-reviewed', reviewerRef: '', reviewedOn: '2026-10-10' },
    { status: 'instructor-reviewed', reviewerRef: '  ', reviewedOn: '2026-10-10' },
    { status: 'instructor-reviewed', reviewerRef: 'test-only', reviewedOn: '' },
    { status: 'instructor-reviewed', reviewerRef: 'test-only', reviewedOn: 'yesterday' },
    { status: 'instructor-reviewed', reviewerRef: 'test-only', reviewedOn: '2026-02-30' },
    { status: 'instructor-reviewed', reviewerRef: 'test-only', reviewedOn: '2026-00-12' },
  ];
  for (const contentReview of invalid) {
    const scene = { ...original, contentReview: contentReview as typeof original.contentReview };
    assert.ok(validateScene(scene).includes('Invalid instructor review metadata'), JSON.stringify(contentReview));
  }
  const valid = { ...original, contentReview: { status: 'instructor-reviewed' as const, reviewerRef: 'test-only', reviewedOn: '2026-10-10' } };
  assert.deepEqual(validateScene(valid), []);
});

test('base asset requires English/Hindi alt and finite positive dimensions', () => {
  const original = fixture();
  const brokenAssets = [
    { ...original.base, alt: { en: 'Base', hi: '' } },
    { ...original.base, alt: { en: '', hi: 'चित्र' } },
    { ...original.base, width: NaN },
    { ...original.base, height: Infinity },
    { ...original.base, width: -5 },
    { ...original.base, height: 0 },
  ];
  for (const base of brokenAssets) {
    assert.ok(validateScene({ ...original, base }).includes('Invalid base asset'));
  }
});

test('overlay image assets require bilingual alt and finite positive dimensions', () => {
  const original = fixture();
  const image = { ...original.base, src: '/scenes/fixture/overlay.svg' };
  const layer = { id: 'actor-layer', bounds: { x: 0.1, y: 0.1, width: 0.3, height: 0.3 }, image };
  const withLayer = (asset: typeof image) => ({ ...original, continuations: [
    { ...original.continuations[0], layers: [{ ...layer, image: asset }] }, original.continuations[1]
  ] });
  assert.deepEqual(validateScene(withLayer(image)), []);
  for (const badImage of [
    { ...image, alt: { en: 'Actor', hi: ' ' } },
    { ...image, width: Infinity },
    { ...image, height: NaN },
    { ...image, width: 0 },
    { ...image, height: -1 },
  ]) {
    assert.ok(validateScene(withLayer(badImage)).includes('Invalid continuation'));
  }
});
