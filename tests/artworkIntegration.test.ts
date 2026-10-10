import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { scenes } from '../src/content/scenes/index.ts';
import { validateScene } from '../src/contracts/scene.ts';

const projectRoot = process.cwd();
function pngDimensions(assetPath: string) {
  const file = join(projectRoot, 'public', assetPath.replace(/^\//, ''));
  assert.equal(existsSync(file), true, `${assetPath} should be in public`);
  const data = readFileSync(file);
  assert.equal(data.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', 'valid PNG signature');
  return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
}

test('revised scenes preserve stable IDs, unvalidated status and schema but bump visual evidence versions', () => {
  assert.deepEqual(scenes.map(s => s.id), ['bus-training-01', 'unfamiliar-blocked-01', 'matched-clear-01']);
  for (const scene of scenes) {
    assert.equal(scene.schemaVersion, 1);
    assert.equal(scene.sceneVersion, '1.2.0-provisional');
    assert.equal(scene.contentReview.status, 'provisional');
    assert.deepEqual(validateScene(scene), []);
    assert.deepEqual(pngDimensions(scene.base.src), { width: scene.base.width, height: scene.base.height });
    assert.deepEqual({ width: scene.base.width, height: scene.base.height }, { width: 1672, height: 941 });
  }
});

test('training endings reuse the exact same initial bus base with transparent full-frame actor overlay only for second ending', () => {
  const scene = scenes[0];
  assert.equal(scene.continuations.length, 2);
  assert.equal(scene.continuations[0].layers.length, 0);
  assert.equal(scene.continuations[1].layers.length, 1);
  const layer = scene.continuations[1].layers[0];
  assert.deepEqual(layer.bounds, {x:0,y:0,width:1,height:1});
  assert.deepEqual(pngDimensions(layer.image.src), {width:1672,height:941});
  assert.equal(scene.base.src, '/scenes/bus-training-01/base.png');
  assert.equal(scene.rubric.acceptedRegionIds[0], 'space-beyond-bus');
});

test('matched scenes expose the same viewport geometry; blocked scene alone has the van', () => {
  assert.equal(scenes[1].condition, 'blocked-view');
  assert.equal(scenes[2].condition, 'clear-view-control');
  assert.equal(scenes[1].rubric.acceptsNone, false);
  assert.equal(scenes[2].rubric.acceptsNone, true);
  assert.deepEqual(pngDimensions('/scenes/unfamiliar-blocked-01/van-shadow-layer.png'), {width:1672,height:941});
  const blockedOptions = scenes[1].responseOptions.map(o => o.id);
  const clearOptions = scenes[2].responseOptions.map(o => o.id);
  assert.equal(new Set(blockedOptions).size, blockedOptions.length);
  assert.equal(new Set(clearOptions).size, clearOptions.length);
});


test('final PDF-sourced tap areas stay within normalized viewport and distinguish blocked and clear junctions', () => {
  const bus = scenes[0];
  const blocked = scenes[1];
  const clear = scenes[2];
  for (const scene of scenes) {
    for (const region of scene.tapRegions) {
      const b = region.bounds;
      assert.ok(b.x >= 0 && b.y >= 0 && b.width > 0 && b.height > 0);
      assert.ok(b.x + b.width <= 1 && b.y + b.height <= 1);
    }
  }
  const busHidden = bus.tapRegions.find(r => r.id === 'space-beyond-bus')!.bounds;
  const opposing = bus.tapRegions.find(r => r.id === 'opposite-lane-vehicle')!.bounds;
  const vanScreen = blocked.tapRegions.find(r => r.id === 'beside-delivery-van')!.bounds;
  const openEntry = clear.tapRegions.find(r => r.id === 'open-right-entry')!.bounds;
  assert.ok(busHidden.x < opposing.x, 'bus-side hidden hazard is left of opposing SUV');
  assert.ok(vanScreen.x < openEntry.x, 'occluding van forward edge lies left of open side-road approach');
  assert.notDeepEqual(vanScreen, openEntry);
  assert.equal(blocked.rubric.acceptedRegionIds[0], 'beside-delivery-van');
  assert.deepEqual(clear.rubric.acceptedRegionIds, []);
  assert.equal(clear.rubric.acceptsNone, true);
});
