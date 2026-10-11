import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { summarizeReviewTone } from '../src/ui/reviewTone.ts';
const screen = readFileSync(new URL('../src/ui/PracticeScreen.tsx',import.meta.url),'utf8');
const css = readFileSync(new URL('../src/styles/practice.css',import.meta.url),'utf8');

test('mixed evidence never gets all-supported styling', () => {
  assert.equal(summarizeReviewTone('supported','supported','supported'),'supported');
  assert.equal(summarizeReviewTone('supported','reconsider','supported'),'mixed');
  assert.equal(summarizeReviewTone('reconsider','supported','reconsider'),'mixed');
  assert.equal(summarizeReviewTone('supported','conditional','supported'),'mixed');
  assert.equal(summarizeReviewTone('reconsider','conditional','reconsider'),'mixed');
  assert.equal(summarizeReviewTone('reconsider','reconsider','reconsider'),'reconsider');
  assert.equal(summarizeReviewTone('conditional','conditional','conditional'),'conditional');
});
test('review has actionable lead, grouped criteria and compact locked answers', () => {
  const lead = screen.indexOf('data-testid="review-takeaway"');
  const improvement = screen.indexOf('data-testid="immediate-improvement"');
  const scene = screen.indexOf('className="bs-review-scene"');
  const cards = screen.indexOf('className="bs-review-feedback"');
  const submitted = screen.indexOf('className="bs-review-choices"');
  assert.ok(lead < improvement && improvement < scene && scene < cards && cards < submitted);
  assert.equal(screen.match(/className="bs-review-choices"/g)?.length,1);
  assert.match(screen,/overallPresentation === 'supported' \? t.keepDoing : t.change/);
  assert.match(screen,/regionSelectionForViewport\(scene, attempt\)/);
  assert.match(screen,/data-testid="recognition-remediation"/);
  assert.match(screen,/data-testid="reason-remediation"/);
  assert.equal(screen.match(/className="bs-provisional"/g)?.length,1);
});
test('review UI uses neutral lock and never equates submission with correctness', () => {
  assert.match(screen,/className="bs-locked-icon"/);
  assert.match(screen,/t.submissionNeutral/);
  assert.doesNotMatch(screen,/bs-lock-symbol[^\n]*>✓/);
});
test('CSS uses viewport sticky desktop scene, mobile single column and no nested scroll', () => {
  assert.match(css,/\.bs-phase--answering \.bs-scene-panel\{position:sticky/);
  assert.match(css,/\.bs-phase--answering \.bs-scene-panel\{position:static/);
  assert.match(css,/\.bs-workspace,\.bs-review-scene-grid,\.bs-criteria,\.bs-review-choices dl\{grid-template-columns:minmax\(0,1fr\)/);
  assert.doesNotMatch(css,/overflow-y\s*:\s*(auto|scroll)/);
  assert.match(css,/object-fit:contain/);
  assert.match(css,/Noto Sans Devanagari/);
});
test('locale, controls, storage warnings and endings remain available', () => {
  assert.match(screen,/onLocaleChange\('hi'\)/);
  assert.match(screen,/onNextEnding/);
  assert.match(screen,/onReplayEndings/);
  assert.match(screen,/onRestart/);
  assert.match(screen,/role="status">\{storageLabel\}/);
  assert.match(screen,/className="bs-storage-detail"/);
  assert.match(screen,/!allTrainingEndingsSeen/);
});
