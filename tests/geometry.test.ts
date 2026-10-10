import test from 'node:test';
import assert from 'node:assert/strict';
import { clientToNormalized, containedImageRect, hitRegion, regionToClientRect } from '../src/engine/geometry.ts';
import { fixture } from './fixture.ts';

test('image fitted into portrait container is letterboxed vertically', () => {
  const box = { left: 10, top: 20, width: 300, height: 400 };
  const rect = containedImageRect(box, 1000, 500);
  assert.deepEqual(rect, { left: 10, top: 145, width: 300, height: 150 });
  assert.equal(clientToNormalized(160, 80, box, 1000, 500), null);
  assert.deepEqual(clientToNormalized(160, 220, box, 1000, 500), { x: 0.5, y: 0.5 });
});
test('image fitted into wide container is letterboxed horizontally', () => {
  const box = { left: 0, top: 0, width: 400, height: 100 };
  const rect = containedImageRect(box, 100, 100);
  assert.deepEqual(rect, { left: 150, top: 0, width: 100, height: 100 });
  assert.equal(clientToNormalized(30, 50, box, 100, 100), null);
});
test('normalized rect maps to pixel region and hit testing honours that region', () => {
  const scene = fixture();
  const box = { left: 0, top: 0, width: 1000, height: 600 };
  const region = regionToClientRect(scene.tapRegions[0].bounds, box, 1000, 600);
  assert.deepEqual(region, { left: 50, top: 120, width: 300, height: 240 });
  const p = clientToNormalized(150, 250, box, 1000, 600);
  assert.equal(p && hitRegion(p, scene.tapRegions), 'left-edge');
  assert.equal(p && hitRegion({ x: 0.9, y: 0.9 }, scene.tapRegions), null);
});
