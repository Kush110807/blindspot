import type { Locale } from '../contracts/scene.ts';
import type { WelcomeFlow, WelcomeAction } from '../integration/welcomeFlow.ts';
import { welcomeCopy } from './content.ts';
import { busTrainingScene } from '../content/scenes/busTraining.ts';
import '../styles/welcome.css';

interface WelcomeProps {
  readonly locale: Locale;
  readonly flow: WelcomeFlow;
  readonly onAction: (action: WelcomeAction) => void;
  readonly onLocaleChange: (locale: Locale) => void;
}
/** Self-contained preview: no coordinator action, persistence or attempt state. */
export function WelcomePage({locale, flow, onAction, onLocaleChange}: WelcomeProps) {
  const t=welcomeCopy[locale];
  const actor=busTrainingScene.continuations[1].layers[0];
  const actorVisible=flow.preview === 'pedestrian';
  const renderImage=(showActor: boolean)=><div className="welcome-image-frame" data-testid="welcome-bus-frame" style={{aspectRatio:`${busTrainingScene.base.width}/${busTrainingScene.base.height}`}}>
    <img className="welcome-base-image" src={busTrainingScene.base.src} alt={t.heroAlt}/>
    {showActor && <img data-testid="welcome-pedestrian-layer" className="welcome-actor" src={actor.image.src} alt={locale==='en'?'A pedestrian emerges from the area concealed beyond the bus.':'बस के आगे छिपे हिस्से से एक पैदल यात्री सामने आता है।'} style={{left:`${actor.bounds.x*100}%`,top:`${actor.bounds.y*100}%`,width:`${actor.bounds.width*100}%`,height:`${actor.bounds.height*100}%`}} />}
  </div>;
  const start=()=>onAction({type:flow.started?'resume':'start'});
  const startLabel=flow.started ? t.resume : t.begin;
  return <div className="welcome" lang={locale}>
    <header className="welcome-nav"><div className="welcome-nav-inner">
      <div className="welcome-brand"><span className="welcome-brand-mark" aria-hidden="true">◔</span><span><strong>BlindSpot</strong><small>{t.brandSub}</small></span></div>
      <div className="welcome-nav-actions"><div className="welcome-lang" role="group" aria-label={locale==='en'?'Language':'भाषा'}>
        <button type="button" onClick={()=>onLocaleChange('en')} aria-pressed={locale==='en'} className={locale==='en'?'active':''}>EN</button>
        <button type="button" onClick={()=>onLocaleChange('hi')} aria-pressed={locale==='hi'} className={locale==='hi'?'active':''}>हिंदी</button></div>
        <button type="button" onClick={start} className={`welcome-nav-start${flow.started ? ' welcome-nav-resume' : ''}`}>{flow.started ? t.resume : t.navToPractice} <span aria-hidden="true">↗</span></button>
      </div></div></header>
    <main id="welcome-main" className="welcome-inner">
      <section className="welcome-hero" aria-labelledby="welcome-heading"><div className="welcome-hero-copy">
        <p className="welcome-eyebrow">{t.eyebrow}</p>
        <h1 id="welcome-heading">{t.heroLine1}<br/><em>{t.heroLine2}</em></h1>
        <p className="welcome-description">{t.description}</p>
        <button type="button" className="welcome-primary" onClick={start}>{startLabel} <span aria-hidden="true">↗</span></button>
        <p className="welcome-support">{t.support}</p>
      </div><div className="welcome-hero-art">{renderImage(false)}<p className="welcome-image-caption">{locale==='en'?'The first decision begins before the outcome.':'पहला फ़ैसला नतीजा दिखने से पहले होता है।'}</p></div></section>
      <section className="welcome-principle welcome-section" aria-labelledby="welcome-principle-heading">
        <div className="welcome-section-intro"><p className="welcome-small-label">{t.principleTag}</p><h2 id="welcome-principle-heading">{t.principleTitle}</h2><p>{t.principleExplanation}</p></div>
        <div className="welcome-demo"><div className="welcome-demo-image">{renderImage(actorVisible)}</div><div className="welcome-demo-controls">
          {flow.preview==='unopened' ? <button type="button" className="welcome-secondary" onClick={()=>onAction({type:'explore'})}>{t.explore} <span aria-hidden="true">→</span></button> : <div className="welcome-outcome-options" role="group" aria-label={t.principleTitle}>
            <button type="button" className={flow.preview==='no-one'?'selected':''} aria-pressed={flow.preview==='no-one'} onClick={()=>onAction({type:'no-one'})}>{t.nobody}</button>
            <button type="button" className={flow.preview==='pedestrian'?'selected':''} aria-pressed={flow.preview==='pedestrian'} onClick={()=>onAction({type:'pedestrian'})}>{t.pedestrian}</button>
          </div>}
        </div></div>
      </section>
      <section className="welcome-steps welcome-section" aria-labelledby="welcome-steps-heading"><div className="welcome-section-intro"><p className="welcome-small-label">01 — 03</p><h2 id="welcome-steps-heading">{t.stepTitle}</h2></div><div className="welcome-steps-list">{t.steps.map(step=><article key={step.number} className="welcome-step"><span className="welcome-step-number">{step.number}</span><div><h3>{step.title}</h3><p>{step.detail}</p></div></article>)}</div></section>
      <section className="welcome-scope welcome-section" aria-labelledby="welcome-scope-heading"><div className="welcome-section-intro"><p className="welcome-small-label">{locale==='en'?'Inside the prototype':'प्रोटोटाइप में'}</p><h2 id="welcome-scope-heading">{t.scopeTitle}</h2></div><div className="welcome-scope-list">{t.scope.map((item,i)=><article key={i}><span aria-hidden="true">0{i+1}</span><div><h3>{item.title}</h3><p>{item.detail}</p></div></article>)}</div><p className="welcome-limits">{t.limits}</p></section>
      <section className="welcome-roadmap welcome-section" aria-labelledby="welcome-roadmap-heading"><div className="welcome-section-intro"><p className="welcome-small-label">{locale==='en'?'Build · Evaluate · Expand':'बनाएँ · जाँचें · विस्तार करें'}</p><h2 id="welcome-roadmap-heading">{t.roadmapTitle}</h2></div><div className="welcome-roadmap-list">{t.roadmap.map((step,i)=><article key={i} className={i===0?'is-current':''}><div className="welcome-roadmap-marker"><span aria-hidden="true">{i+1}</span></div><div><h3>{step.title}</h3><p>{step.detail}</p></div></article>)}</div></section>
      <section className="welcome-closing" aria-label={t.closingTitle}><h2>{t.closingTitle}</h2><button type="button" className="welcome-primary" onClick={start}>{startLabel} <span aria-hidden="true">↗</span></button><p>{t.provisional}</p></section>
    </main><footer className="welcome-footer">BlindSpot <span>·</span> {locale==='en'?'A road-visibility learning prototype':'सड़क पर दृश्यता सीखने का प्रोटोटाइप'}</footer>
  </div>
}
