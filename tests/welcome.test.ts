import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { INITIAL_WELCOME_FLOW, welcomeReducer } from '../src/integration/welcomeFlow.ts';
import { welcomeCopy } from '../src/welcome/content.ts';
import { scenes } from '../src/content/scenes/index.ts';
import { createSession } from '../src/integration/coordinator.ts';

test('welcome preview is isolated and has no link to actual attempts, ending progression or records', () => {
  const session = createSession(scenes, {records:[],status:'available'},.4);
  const initialAttempt=session.attempt;
  let ui=welcomeReducer(INITIAL_WELCOME_FLOW,{type:'explore'});
  ui=welcomeReducer(ui,{type:'pedestrian'});
  assert.equal(ui.preview,'pedestrian');
  ui=welcomeReducer(ui,{type:'no-one'});
  assert.equal(ui.preview,'no-one');
  assert.equal(session.attempt,initialAttempt);
  assert.equal(session.attempt?.phase,'observe');
  assert.equal(session.records.length,0);
  assert.equal(session.saveRevision,0);
});

test('Start moves welcome to practice once; later demo actions cannot change it', () => {
  const once=welcomeReducer(INITIAL_WELCOME_FLOW,{type:'start'});
  assert.equal(once.entered,true);
  assert.equal(welcomeReducer(once,{type:'start'}),once);
  assert.equal(welcomeReducer(once,{type:'pedestrian'}),once);
  assert.equal(welcomeReducer(once,{type:'explore'}),once);
});

test('demo requires explicit explore, and both outcomes use identical bus base with only the actor for second ending', () => {
  assert.equal(welcomeReducer(INITIAL_WELCOME_FLOW,{type:'pedestrian'}),INITIAL_WELCOME_FLOW);
  const bus=scenes[0];
  assert.equal(bus.continuations[0].layers.length,0);
  assert.equal(bus.continuations[1].layers.length,1);
  assert.deepEqual(bus.continuations[1].layers[0].bounds,{x:0,y:0,width:1,height:1});
  const jsx=readFileSync('src/welcome/WelcomePage.tsx','utf8');
  assert.match(jsx,/busTrainingScene\.base\.src/);
  assert.match(jsx,/renderImage\(actorVisible\)/);
  assert.doesNotMatch(jsx,/onNextEnding|onReplayEndings|localStorage|saveRecords|reduceSession/);
});

test('natural English/Hindi welcome content includes scope, roadmap and provisional limitation', () => {
  for(const language of ['en','hi'] as const){
    const t=welcomeCopy[language];
    assert.equal(t.steps.length,3);
    assert.equal(t.scope.length,3);
    assert.equal(t.roadmap.length,3);
    for (const value of [t.description,t.principleExplanation,t.limits,t.provisional,t.begin,...t.steps.map(s=>s.detail),...t.scope.map(s=>s.detail),...t.roadmap.map(s=>s.detail)]){
      assert.ok(value.trim().length>24);
    }
  }
});

test('application start preserves shared locale, stays in observe, resets scroll and focuses heading', () => {
  const jsx=readFileSync('src/App.tsx','utf8');
  assert.match(jsx,/startGuard\.current/);
  assert.match(jsx,/if \(startGuard\.current\) return/);
  assert.match(jsx,/!welcome\.entered/);
  assert.match(jsx,/session\.locale/);
  assert.match(jsx,/dispatch\(\{ type: 'locale', locale \}\)/);
  assert.match(jsx,/window\.scrollTo\(0, 0\)/);
  assert.match(jsx,/heading\.focus\(\{ preventScroll: true \}\)/);
  // Navigation does not secretly skip the observation state.
  assert.doesNotMatch(jsx.slice(jsx.indexOf('const handleWelcome'),jsx.indexOf('useEffect')),/dispatch\(\{ type: 'begin'/);
});

test('hero always uses the observation base; demonstration alone can add the pedestrian', () => {
  const jsx=readFileSync('src/welcome/WelcomePage.tsx','utf8');
  assert.match(jsx,/welcome-hero-art">\{renderImage\(false\)\}/);
  assert.match(jsx,/welcome-demo-image">\{renderImage\(actorVisible\)\}/);
  assert.doesNotMatch(jsx,/unfamiliarBlockedScene|matchedClearScene|assessment-blocked/);
});

test('welcome is independently responsive without clipping artwork or new packages', () => {
  const css=readFileSync('src/styles/welcome.css','utf8');
  assert.match(css,/object-fit:contain/);
  assert.match(css,/@media\(max-width:700px\)/);
  assert.match(css,/focus-visible/);
  assert.match(css,/Noto Sans Devanagari/);
  const manifest=JSON.parse(readFileSync('package.json','utf8'));
  assert.deepEqual(Object.keys(manifest.dependencies).sort(),['react','react-dom']);
  assert.equal(manifest.devDependencies.vite,'6.4.4');
});
