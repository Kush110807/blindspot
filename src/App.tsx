import { useEffect, useReducer, useRef } from 'react';
import { WelcomePage } from './welcome/WelcomePage.tsx';
import { INITIAL_WELCOME_FLOW, welcomeReducer, type WelcomeAction } from './integration/welcomeFlow.ts';
import { SCENE_SCHEMA_VERSION } from './contracts/scene.ts';
import type { PracticeScreenProps } from './contracts/integration.ts';
import { catalogueErrors } from './integration/coordinator.ts';
import { scenes, PracticeScreen } from './integration/slots.ts';
import { usePracticeCoordinator } from './integration/usePracticeCoordinator.ts';

/** A owns composition; B/C exports are connected in integration/slots.ts after review. */
export default function App() {
  const { session, dispatch, view, sceneId } = usePracticeCoordinator(scenes);
  // Independent welcome reducer: its example is never a practice attempt.
  const [welcome, welcomeDispatch] = useReducer(welcomeReducer, INITIAL_WELCOME_FLOW);
  const startGuard = useRef(false);
  const handleWelcome = (action: WelcomeAction) => {
    if (action.type === 'start') {
      if (startGuard.current) return;
      startGuard.current = true;
      // Do not dispatch `begin`: entering practice must show Scene 1 observation.
    }
    welcomeDispatch(action);
  };
  useEffect(() => {
    if (!welcome.entered) return;
    window.scrollTo(0, 0);
    const heading = document.querySelector<HTMLElement>('.bs-main h1');
    if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
  }, [welcome.entered]);
  const problems = catalogueErrors(scenes);
  const Screen = PracticeScreen;
  if (Screen && view && problems.length === 0) {
    if (!welcome.entered) return <WelcomePage locale={session.locale} flow={welcome} onAction={handleWelcome}
      onLocaleChange={locale => dispatch({ type: 'locale', locale })} />;
    const callbacks: Pick<PracticeScreenProps,
      'onBegin' | 'onSelectRegion' | 'onSelectResponse' | 'onSelectReason' |
      'onLock' | 'onStartReview' | 'onNextEnding' | 'onReplayEndings' |
      'onRestart' | 'onNextScene' | 'onLocaleChange'> = {
      onBegin: () => dispatch({ type: 'begin', sceneId }),
      onSelectRegion: selection => dispatch({ type: 'region', sceneId, selection }),
      onSelectResponse: responseId => dispatch({ type: 'response', sceneId, responseId }),
      onSelectReason: reasonId => dispatch({ type: 'reason', sceneId, reasonId }),
      onLock: () => dispatch({ type: 'lock', sceneId, lockedAt: new Date().toISOString() }),
      onStartReview: () => dispatch({ type: 'review', sceneId }),
      onNextEnding: () => dispatch({ type: 'next-ending', sceneId }),
      onReplayEndings: () => dispatch({ type: 'replay', sceneId }),
      onRestart: () => dispatch({ type: 'restart', sceneId, shuffleSeed: Math.random() }),
      onNextScene: () => dispatch({ type: 'next-scene', sceneId, shuffleSeed: Math.random() }),
      onLocaleChange: locale => dispatch({ type: 'locale', locale })
    };
    return <Screen {...view} {...callbacks} />;
  }
  // No fictional teaching scene while B and C work in separate branches.
  return (
    <main className="page">
      <div className="shell">
        <div className="eyebrow">ROAD SAFETY · FOUNDATION BUILD</div>
        <header className="header">
          <div aria-hidden="true" className="mark"><span /></div>
          <div><h1>BlindSpot</h1><p>Practice decisions when the road ahead is hidden.</p></div>
        </header>
        <section className="hero" aria-label="Foundation build status">
          <div className="hero-info">
            <p className="kicker">MILESTONES 00 / 01</p>
            <h2>The foundation is in place.</h2>
            <p className="hero-copy">The React + TypeScript foundation is ready. Training scenes, tap-to-answer controls and paired continuations will appear after their separate content and interface branches are integrated.</p>
            <div className="status"><span className="pulse"/> Foundation screen mounted</div>
          </div>
          <div className="placeholder" aria-label="Illustrative scene placeholder, no riding scenario is shown">
            <div className="sky"/><div className="horizon"/><div className="road"/><div className="roadstripe"/>
            <div className="placeholder-label">Authored scene artwork is pending integration</div>
          </div>
        </section>
        <section className="details" aria-label="Contract diagnostics">
          <h3>Foundation diagnostics</h3>
          <dl>
            <div><dt>Scene schema</dt><dd>v{SCENE_SCHEMA_VERSION}</dd></div>
            <div><dt>Local records</dt><dd>{session.storageStatus === 'available' ? `Available · ${session.records.length} saved` : session.storageStatus === 'corrupt' ? 'Corrupt data detected · in-memory fallback' : 'Unavailable · in-memory practice will still work'}</dd></div>
            <div><dt>Learning content</dt><dd>Waiting for authored scenes and interface</dd></div>
            <div><dt>Instructor review</dt><dd>Not completed; all content provisional</dd></div>
          </dl>
        </section>
        <p className="disclaimer">Prototype foundation only. No riding advice, learner assessment or safety-performance claims are made by this screen.</p>
      </div>
    </main>
  );
}
