import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { cachedPhase, phaseFor } from '../src/ui/assetStatus.ts';
import { sceneProgressLabel } from '../src/integration/sceneProgress.ts';
import { scenes } from '../src/content/scenes/index.ts';

const screen = readFileSync('src/ui/PracticeScreen.tsx', 'utf8');
const viewport = readFileSync('src/ui/SceneViewport.tsx', 'utf8');

test('progress appears for each scene in both languages without changing scene IDs', () => {
  const expectedEn = ['Scene 1 of 3', 'Scene 2 of 3', 'Scene 3 of 3'];
  const expectedHi = ['दृश्य 1 (कुल 3)', 'दृश्य 2 (कुल 3)', 'दृश्य 3 (कुल 3)'];
  assert.deepEqual(scenes.map(s => sceneProgressLabel(s.id, 'en')), expectedEn);
  assert.deepEqual(scenes.map(s => sceneProgressLabel(s.id, 'hi')), expectedHi);
  assert.match(screen, /data-testid="scene-progress"/);
});

test('image loading handles complete cached assets, errors and non-cached fetches', () => {
  assert.equal(cachedPhase(true, 1672), 'loaded');
  assert.equal(cachedPhase(true, 0), 'error');
  assert.equal(cachedPhase(false, 0), 'loading');
  assert.equal(cachedPhase(false, 1672), 'loading');
  assert.equal(phaseFor({src: '/old.png', phase: 'loaded'}, '/new.png'), 'loading');
  assert.equal(phaseFor({src: '/new.png', phase: 'error'}, '/new.png'), 'error');
});

test('scene image has stable layout, actual load/error handlers and localized status', () => {
  assert.match(viewport, /aspectRatio: `\$\{scene\.base\.width\} \/ \$\{scene\.base\.height\}`/);
  assert.match(viewport, /onLoad=\{asset\.onLoad\}/);
  assert.match(viewport, /onError=\{asset\.onError\}/);
  assert.match(viewport, /cachedPhase\(img\.complete, img\.naturalWidth\)/);
  assert.match(viewport, /role=\{phase === 'error' \? 'alert' : 'status'\}/);
  assert.match(viewport, /asset\.phase !== 'loaded'/);
  assert.match(viewport, /onBaseStatusChange\?\.\(scene\.base\.src, asset\.phase\)/);
  assert.match(viewport, /<EndingLayer key=/);
});

test('all pre-answer actions are disabled and guarded when the required image is unavailable', () => {
  assert.match(screen, /const artworkReady = assetState\.src === scene\.base\.src && assetState\.phase === 'loaded'/);
  assert.match(screen, /canSelect=\{isAnswering && artworkReady\}/);
  assert.match(screen, /onBaseStatusChange=\{onBaseStatusChange\}/);
  assert.match(screen, /disabled=\{!artworkReady\}/);
  assert.match(screen, /disabled=\{!artworkReady \|\| !canLock\(attempt\)\}/);
  assert.match(screen, /if \(artworkReady && canLock\(attempt\)\) onLock\(\)/);
});

test('assessment pre-answer image descriptions are neutral in both languages', () => {
  for (const scene of scenes.slice(1)) {
    for (const locale of ['en', 'hi'] as const) {
      const description = scene.base.alt[locale];
      assert.ok(description.length > 35);
      assert.doesNotMatch(description, /minus the van|removed van|blocked image|comparison|intended answer|छाया नहीं|वैन वाले दृश्य|सही उत्तर|छिपाती है/i);
    }
  }
});

test('single instructor-review caveat remains visible; statuses do not repeatedly advertise draft scoring', () => {
  assert.match(screen, /<div className="bs-provisional" role="note">/);
  assert.doesNotMatch(screen, /supported: 'Supported in this draft'/);
  assert.doesNotMatch(screen, /statusSupported: 'Draft-supported overall'/);
  assert.match(screen, /summarizeReviewTone/);
});
