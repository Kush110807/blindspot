import { useState } from 'react';
import { SCENE_SCHEMA_VERSION } from './contracts/scene.ts';
import { loadRecords, readBrowserStorage } from './records/localRecords.ts';

/** M0/M1 mount check only. Future UI and scene navigation intentionally excluded. */
export default function App() {
  const [storage] = useState(() => loadRecords(readBrowserStorage()));
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
            <p className="hero-copy">A minimal mount screen for the React + TypeScript project. Training scenes, tap-to-answer controls and paired continuations are intentionally reserved for later milestones.</p>
            <div className="status"><span className="pulse"/> Foundation screen mounted</div>
          </div>
          <div className="placeholder" aria-label="Illustrative scene placeholder, no riding scenario is shown">
            <div className="sky"/><div className="horizon"/><div className="road"/><div className="roadstripe"/>
            <div className="placeholder-label">Scene artwork arrives in M2/M3</div>
          </div>
        </section>
        <section className="details" aria-label="Contract diagnostics">
          <h3>Foundation diagnostics</h3>
          <dl>
            <div><dt>Scene schema</dt><dd>v{SCENE_SCHEMA_VERSION}</dd></div>
            <div><dt>Local records</dt><dd>{storage.status === 'available' ? `Available · ${storage.records.length} saved` : storage.status === 'corrupt' ? 'Corrupt data detected · fallback active' : 'Unavailable · in-memory practice will still work'}</dd></div>
            <div><dt>Learning content</dt><dd>Not implemented (M2/M3)</dd></div>
            <div><dt>Instructor review</dt><dd>Not yet completed</dd></div>
          </dl>
        </section>
        <p className="disclaimer">Prototype foundation only. No riding advice, learner assessment or safety-performance claims are made by this screen.</p>
      </div>
    </main>
  );
}
