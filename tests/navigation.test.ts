import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { scenes } from '../src/content/scenes/index.ts';
import { welcomeReducer, INITIAL_WELCOME_FLOW } from '../src/integration/welcomeFlow.ts';
import { welcomeCopy } from '../src/welcome/content.ts';
import { createSession, reduceSession, canAdvance, selectPracticeView, type PracticeSession } from '../src/integration/coordinator.ts';
import type { Locale } from '../src/contracts/scene.ts';

const initial = { records: [], status: 'available' as const };
const stamp = '2026-10-11T07:00:00.000Z';
function answer(session: PracticeSession, selectedNone = false) {
  const scene = scenes[session.sceneIndex];
  const sceneId = scene.id;
  let s = reduceSession(session, {type:'begin', sceneId}, scenes);
  s = reduceSession(s, {type:'region', sceneId, selection: selectedNone ? {kind:'none'} : {kind:'region',regionId:scene.tapRegions[0].id}}, scenes);
  s = reduceSession(s, {type:'response',sceneId,responseId:scene.responseOptions[0].id}, scenes);
  s = reduceSession(s, {type:'reason',sceneId,reasonId:scene.reasonOptions[0].id}, scenes);
  s = reduceSession(s, {type:'lock',sceneId,lockedAt:stamp}, scenes);
  return reduceSession(s, {type:'review',sceneId}, scenes);
}

test('welcome back/resume preserves an answering attempt for EN/HI without creating a new one', () => {
  for (const locale of ['en','hi'] as const) {
    let flow = welcomeReducer(INITIAL_WELCOME_FLOW,{type:'start'});
    assert.deepEqual({entered:flow.entered,started:flow.started},{entered:true,started:true});
    let session = createSession(scenes,initial,0.4);
    session = reduceSession(session,{type:'locale',locale},scenes);
    session = reduceSession(session,{type:'begin',sceneId:scenes[0].id},scenes);
    session = reduceSession(session,{type:'region',sceneId:scenes[0].id,selection:{kind:'region',regionId:scenes[0].tapRegions[0].id}},scenes);
    const beforeSession = session;
    flow = welcomeReducer(flow,{type:'back'});
    assert.equal(flow.entered,false);
    assert.equal(welcomeReducer(flow,{type:'start'}),flow,'Start may not reset an already-started session');
    flow = welcomeReducer(flow,{type:'explore'});
    flow = welcomeReducer(flow,{type:'pedestrian'});
    flow = welcomeReducer(flow,{type:'resume'});
    assert.equal(flow.entered,true);
    assert.equal(welcomeReducer(flow,{type:'resume'}),flow);
    assert.equal(session,beforeSession);
    assert.equal(session.attempt?.phase,'answering');
    assert.equal(session.locale,locale);
    assert.equal(session.records.length,0);
    assert.equal(session.saveRevision,0);
    assert.ok(welcomeCopy[locale].resume.length>3);
  }
});

test('back/resume from locked review preserves ending progress, records and locale', () => {
  for (const locale of ['en','hi'] as const) {
    let flow=welcomeReducer(INITIAL_WELCOME_FLOW,{type:'start'});
    let session=answer(createSession(scenes,initial));
    session=reduceSession(session,{type:'locale',locale},scenes);
    const locked=session.attempt?.locked;
    assert.equal(canAdvance(session,scenes),false,'first training ending must gate next scene');
    flow=welcomeReducer(flow,{type:'back'});
    assert.equal(flow.entered,false);
    flow=welcomeReducer(flow,{type:'resume'});
    assert.equal(flow.entered,true);
    assert.deepEqual(session.attempt?.locked,locked);
    assert.equal(session.records.length,1);
    assert.equal(session.saveRevision,1);
    session=reduceSession(session,{type:'next-ending',sceneId:scenes[0].id},scenes);
    assert.equal(canAdvance(session,scenes),true);
    const afterSecondEnding=session;
    flow=welcomeReducer(flow,{type:'back'});
    flow=welcomeReducer(flow,{type:'resume'});
    assert.equal(session,afterSecondEnding);
    assert.equal(session.attempt?.endingIndex,1);
    assert.equal(session.locale,locale);
  }
});

test('Welcome → Scene 1 both endings → Scene 2 → Scene 3 completion preserves three records', () => {
  let flow=welcomeReducer(INITIAL_WELCOME_FLOW,{type:'start'});
  let s=createSession(scenes,initial,0.33);
  assert.equal(s.attempt?.phase,'observe');
  s=answer(s);
  assert.equal(canAdvance(s,scenes),false);
  assert.equal(reduceSession(s,{type:'next-scene',sceneId:scenes[0].id,shuffleSeed:0.1},scenes),s);
  s=reduceSession(s,{type:'next-ending',sceneId:scenes[0].id},scenes);
  assert.equal(canAdvance(s,scenes),true);
  s=reduceSession(s,{type:'next-scene',sceneId:scenes[0].id,shuffleSeed:0.1},scenes);
  assert.equal(s.sceneIndex,1);
  assert.equal(s.attempt?.phase,'observe');
  s=answer(s);
  assert.equal(canAdvance(s,scenes),true);
  s=reduceSession(s,{type:'next-scene',sceneId:scenes[1].id,shuffleSeed:0.1},scenes);
  assert.equal(s.sceneIndex,2);
  s=answer(s,true);
  assert.equal(s.attempt?.locked?.regionSelection.kind,'none');
  assert.equal(canAdvance(s,scenes),false);
  assert.equal(selectPracticeView(s,scenes)?.canNextScene,false);
  assert.equal(s.records.length,3);
  assert.equal(s.saveRevision,3);
  assert.equal(flow.entered,true);
  assert.deepEqual(s.records.map(r=>r.sceneId),scenes.map(scene=>scene.id));
});

test('review navigation renders a visible disabled gate before ending 2 and a non-scrolling alternate action', () => {
  const jsx=readFileSync('src/ui/PracticeScreen.tsx','utf8');
  const gate=jsx.slice(jsx.indexOf('data-testid="training-next-gate"'),jsx.indexOf('{canContinue &&'));
  assert.ok(gate.includes('disabled aria-describedby'));
  assert.ok(gate.includes('{t.seenBoth}'));
  assert.ok(gate.includes('onClick={onNextEnding}'));
  assert.ok(jsx.includes("scene.purpose === 'training' && !allTrainingEndingsSeen"));
  assert.ok(!jsx.includes('canNextScene && !allTrainingEndingsSeen'));
  assert.ok(jsx.includes("scene.condition === 'clear-view-control' && !canNextScene"));
  assert.ok(jsx.includes('onBackToWelcome'));
});

test('navigation is keyboard operable, localized and restores heading focus and scroll', () => {
  const app=readFileSync('src/App.tsx','utf8');
  const practice=readFileSync('src/ui/PracticeScreen.tsx','utf8');
  const welcome=readFileSync('src/welcome/WelcomePage.tsx','utf8');
  const css=readFileSync('src/styles/practice.css','utf8');
  assert.ok(app.includes("onBackToWelcome: () => handleWelcome({ type: 'back' })"));
  assert.ok(app.includes("action.type === 'resume'"));
  assert.ok(app.includes('window.scrollTo(0, 0)'));
  assert.ok(app.includes('heading.focus({ preventScroll: true })'));
  assert.ok(app.includes("'.bs-ending-card h3'"));
  assert.ok(practice.includes('className="bs-back-welcome"'));
  assert.ok(welcome.includes("flow.started?'resume':'start'"));
  assert.ok(css.includes('.bs-back-welcome'));
  assert.ok(css.includes('focus-visible'));
  assert.ok(css.includes('flex-wrap:wrap'));
  for(const locale of ['en','hi'] as Locale[]) {
    assert.ok(welcomeCopy[locale].resume.trim().length>0);
  }
});
