import type { PracticeScreenProps } from '../contracts/integration.ts';
import type { Locale, Translated } from '../contracts/scene.ts';
import { translate } from '../contracts/scene.ts';
import { canLock } from '../engine/attempt.ts';
import { SceneViewport } from './SceneViewport.tsx';
import '../styles/practice.css';

const copy: Record<Locale, Record<string, string>> = {
  en: {
    brandSub: 'See what you cannot see', training: 'GUIDED PRACTICE', assessment: 'INDEPENDENT PRACTICE',
    observe: 'Observe', decide: 'Decide', review: 'Review', module: 'SCENE PRACTICE',
    visual: 'THE SCENE', original: 'INITIAL VIEW', continuation: 'ENDING VIEW',
    observeTitle: 'Look before you decide.', observeBody: 'Study the complete scene and the visible conditions. You will make your choice on the next step.',
    visible: 'VISIBLE CONDITIONS', start: 'I’ve observed the scene', selection: 'YOUR OBSERVATION',
    regionQuestion: 'Which area has blocked visibility, if any?', regionHint: 'Select the area whose view is blocked. If no area has blocked visibility, choose the explicit none option below. You can tap a marked area or use the list.',
    none: 'No relevant blocked region', answer: 'YOUR RESPONSE', reason: 'MAIN REASON',
    incomplete: 'Choose a location, a response, and a reason to continue.',
    ready: 'Your three choices are ready to lock.', lock: 'Lock my decision',
    lockedTitle: 'Decision locked.', lockedBody: 'Your choices are now fixed. Review the explanation without changing your original answer.',
    seeReview: 'See review', reviewTitle: 'What the scene shows', reviewHint: 'Explanations refer to the initial view, not to how an ending turns out.',
    recognition: 'What was visible', responseNote: 'Your response', reasonNote: 'Your reasoning',
    draft: 'Instructional content is provisional and has not been instructor-validated.',
    ended: 'TRAINING ENDING', nextEnding: 'View the other ending', replay: 'Replay both endings',
    assessmentReview: 'There are no animated endings in independent practice.',
    startNew: 'Restart scene', next: 'Next scene', finished: 'End of available scenes',
    confirmed: 'Your submitted choices', submittedRegion: 'Area with blocked visibility', submittedResponse: 'Response chosen', submittedReason: 'Main reason chosen',
    stored: 'Local storage available', offline: 'Local storage unavailable · practice continues', corrupt: 'Local storage needs attention · practice continues',
    unchanged: 'Switch language without resetting your choices', selectable: 'SELECT A LOCATION',
    endingNotice: 'Both endings start from the same initial conditions. Neither is proof of a validated safety outcome.',
    noExplanation: 'Review text is not available for this attempt.',
    lockedTag: 'SUBMITTED', reviewedTag: 'REVIEW MODE', regionHelp: 'Every outlined location is a neutral selection option, not a correctness hint.',
    nextUnavailable: 'Next scene is not available yet',
  },
  hi: {
    brandSub: 'जो दिखाई नहीं देता, उसे समझें', training: 'निर्देशित अभ्यास', assessment: 'स्वतंत्र अभ्यास',
    observe: 'देखें', decide: 'चुनें', review: 'समीक्षा', module: 'दृश्य अभ्यास',
    visual: 'दृश्य', original: 'शुरुआती दृश्य', continuation: 'आगे का दृश्य',
    observeTitle: 'पहले ध्यान से देखें।', observeBody: 'पूरा दृश्य और दिखाई देने वाली स्थितियाँ देखें। अगला कदम आपका निर्णय है।',
    visible: 'दिखाई देने वाली स्थितियाँ', start: 'मैंने दृश्य देख लिया है', selection: 'आपका अवलोकन',
    regionQuestion: 'किस क्षेत्र में देखने में रुकावट है, यदि कहीं है?', regionHint: 'जिस क्षेत्र का दृश्य बाधित है, उसे चुनें। यदि कहीं भी देखने में रुकावट नहीं है, तो नीचे “कोई नहीं” वाला विकल्प चुनें। चित्र पर टैप करें या सूची से चुनें।',
    none: 'कोई संबंधित छिपा हुआ क्षेत्र नहीं', answer: 'आपका निर्णय', reason: 'मुख्य कारण',
    incomplete: 'आगे बढ़ने के लिए स्थान, प्रतिक्रिया और कारण चुनें।',
    ready: 'तीनों विकल्प तय हैं। अब अपना उत्तर लॉक करें।', lock: 'मेरा निर्णय लॉक करें',
    lockedTitle: 'निर्णय लॉक हो गया।', lockedBody: 'अब आपके विकल्प नहीं बदलेंगे। अपना मूल उत्तर बदले बिना स्पष्टीकरण देखें।',
    seeReview: 'समीक्षा देखें', reviewTitle: 'दृश्य से क्या पता चलता है', reviewHint: 'स्पष्टीकरण शुरुआती दृश्य पर आधारित है, किसी अंतिम परिणाम पर नहीं।',
    recognition: 'क्या दिखाई दे रहा था', responseNote: 'आपकी प्रतिक्रिया', reasonNote: 'आपके निर्णय का कारण',
    draft: 'सीखने की यह सामग्री प्रारंभिक है; प्रशिक्षक द्वारा इसकी पुष्टि नहीं हुई है।',
    ended: 'प्रशिक्षण का परिणाम', nextEnding: 'दूसरा परिणाम देखें', replay: 'दोनों परिणाम फिर देखें',
    assessmentReview: 'स्वतंत्र अभ्यास में आगे के दृश्य नहीं दिखाए जाते।',
    startNew: 'नए सिरे से शुरू करें', next: 'अगला दृश्य', finished: 'उपलब्ध दृश्य पूरे हुए',
    confirmed: 'आपके दिए गए उत्तर', submittedRegion: 'बाधित दृश्य वाला क्षेत्र', submittedResponse: 'चुनी गई प्रतिक्रिया', submittedReason: 'चुना गया मुख्य कारण',
    stored: 'स्थानीय स्टोरेज उपलब्ध है', offline: 'स्थानीय स्टोरेज उपलब्ध नहीं · अभ्यास जारी रहेगा', corrupt: 'स्थानीय स्टोरेज में समस्या · अभ्यास जारी रहेगा',
    unchanged: 'भाषा बदलने पर आपके चुने हुए उत्तर नहीं बदलेंगे', selectable: 'स्थान चुनें',
    endingNotice: 'दोनों परिणाम एक जैसी शुरुआती स्थिति से शुरू होते हैं। इन्हें प्रमाणित सुरक्षा परिणाम न समझें।',
    noExplanation: 'इस प्रयास की समीक्षा उपलब्ध नहीं है।',
    lockedTag: 'जमा हुआ', reviewedTag: 'समीक्षा मोड', regionHelp: 'चिह्नित क्षेत्र केवल तटस्थ विकल्प हैं, सही उत्तर का संकेत नहीं।',
    nextUnavailable: 'अभी अगला दृश्य उपलब्ध नहीं है',
  },
};

const tr = (value: Translated, locale: Locale) => translate(value, locale);

export function PracticeScreen(props: PracticeScreenProps) {
  const {
    scene, attempt, locale, feedback, storageStatus, canNextScene,
    onBegin, onSelectRegion, onSelectResponse, onSelectReason, onLock,
    onStartReview, onNextEnding, onReplayEndings, onRestart, onNextScene, onLocaleChange,
  } = props;
  const t = copy[locale];
  const isObserving = attempt.phase === 'observe';
  const isAnswering = attempt.phase === 'answering';
  const isLocked = attempt.phase === 'locked';
  const isReview = attempt.phase === 'review';
  const validLock = attempt.locked !== null && attempt.sceneId === scene.id &&
    attempt.locked.sceneId === scene.id && attempt.locked.sceneVersion === scene.sceneVersion &&
    attempt.locked.schemaVersion === scene.schemaVersion;
  const canReview = isReview && validLock;
  const currentEnding = canReview && scene.purpose === 'training' && attempt.locked?.purpose === 'training'
    ? (scene.continuations[attempt.endingIndex] ?? null) : null;
  const orderedResponses = attempt.displayedOrder.responses.flatMap((id) => {
    const option = scene.responseOptions.find((entry) => entry.id === id);
    return option ? [option] : [];
  });
  const orderedReasons = attempt.displayedOrder.reasons.flatMap((id) => {
    const option = scene.reasonOptions.find((entry) => entry.id === id);
    return option ? [option] : [];
  });
  // Locked/review summaries must NEVER read mutable in-progress selections.
  // The locked snapshot is the only source of submitted semantic IDs.
  const submitted = validLock ? attempt.locked : null;
  const submittedRegionId = submitted?.regionSelection.kind === 'region'
    ? submitted.regionSelection.regionId : null;
  const submittedRegionOption = scene.tapRegions.find((region) => region.id === submittedRegionId);
  const submittedRegion = submitted?.regionSelection.kind === 'none'
    ? tr(scene.noneLabel, locale)
    : submittedRegionOption ? tr(submittedRegionOption.label, locale) : '—';
  const submittedResponse = scene.responseOptions.find((option) => option.id === submitted?.responseId);
  const submittedReason = scene.reasonOptions.find((option) => option.id === submitted?.reasonId);
  const submittedChoices = submitted ? [
    { label: t.submittedRegion, value: submittedRegion },
    { label: t.submittedResponse, value: submittedResponse ? tr(submittedResponse.label, locale) : '—' },
    { label: t.submittedReason, value: submittedReason ? tr(submittedReason.label, locale) : '—' },
  ] : [];
  const storageLabel = storageStatus === 'available' ? t.stored : storageStatus === 'corrupt' ? t.corrupt : t.offline;
  const phaseStep = isObserving ? 0 : isAnswering ? 1 : 2;
  const allTrainingEndingsSeen = scene.purpose !== 'training' ||
    attempt.endingIndex >= scene.continuations.length - 1;
  const canContinue = canNextScene && allTrainingEndingsSeen;

  return (
    <div className="bs-app" lang={locale}>
      <div className="bs-ambient bs-ambient--one" aria-hidden="true" />
      <div className="bs-ambient bs-ambient--two" aria-hidden="true" />
      <header className="bs-topbar">
        <div className="bs-topbar-inner">
          <div className="bs-brand" aria-label="BlindSpot">
            <span className="bs-brand-icon" aria-hidden="true"><span /></span>
            <span><strong>BLIND<span>SPOT</span></strong><small>{t.brandSub}</small></span>
          </div>
          <div className="bs-topbar-tools">
            <span className="bs-topbar-mode">{scene.purpose === 'training' ? t.training : t.assessment}</span>
            <div className="bs-lang" role="group" aria-label={t.unchanged}>
              <button type="button" className={locale === 'en' ? 'bs-lang-active' : ''} aria-pressed={locale === 'en'} onClick={() => onLocaleChange('en')}>EN</button>
              <button type="button" className={locale === 'hi' ? 'bs-lang-active' : ''} aria-pressed={locale === 'hi'} onClick={() => onLocaleChange('hi')}>हिं</button>
            </div>
          </div>
        </div>
      </header>

      <main className="bs-main">
        <div className="bs-progress" aria-label={`${t.module}: ${[t.observe, t.decide, t.review][phaseStep]}`}>
          {[t.observe, t.decide, t.review].map((step, index) => (
            <div className={`bs-step${index === phaseStep ? ' bs-step--active' : ''}${index < phaseStep ? ' bs-step--done' : ''}`} key={index}
              aria-current={index === phaseStep ? 'step' : undefined}>
              <span className="bs-step-number">{index < phaseStep ? '✓' : `0${index + 1}`}</span>
              <span>{step}</span>
            </div>
          ))}
        </div>

        <div className="bs-intro">
          <div className="bs-intro-text">
            <span className="bs-kicker"><span className="bs-kicker-line" /> {t.module} <span className="bs-kicker-divider">/</span> {scene.purpose === 'training' ? t.training : t.assessment}</span>
            <h1>{tr(scene.title, locale)}</h1>
            <p>{tr(scene.prompt, locale)}</p>
          </div>
          <span className="bs-status-badge"><span />{isReview ? t.reviewedTag : isLocked ? t.lockedTag : scene.purpose === 'training' ? t.training : t.assessment}</span>
        </div>

        <div className="bs-workspace">
          <section className="bs-scene-panel" aria-label={t.visual}>
            <div className="bs-panel-head"><span className="bs-panel-kicker"><span className="bs-panel-dot" /> {t.visual}</span><span className="bs-panel-subtle">{currentEnding ? t.continuation : t.original}</span></div>
            <SceneViewport scene={scene} locale={locale} selected={attempt.regionSelection} canSelect={isAnswering}
              ending={currentEnding} onSelectRegion={onSelectRegion} />
            {isAnswering && <p className="bs-map-caption"><span aria-hidden="true">◎</span> {t.regionHelp}</p>}
            <div className="bs-conditions">
              <div className="bs-conditions-head"><span className="bs-list-index">01</span><h2>{t.visible}</h2></div>
              <ul>{scene.visibleConditions.map((condition, index) => <li key={index}><span className="bs-condition-bullet" />{tr(condition, locale)}</li>)}</ul>
            </div>
          </section>

          <section className="bs-action-panel" aria-live="polite" aria-label={[t.observe, t.decide, t.review][phaseStep]}>
            {isObserving && <>
              <div className="bs-action-overline"><span className="bs-small-square" /> 01 / {t.observe}</div>
              <h2>{t.observeTitle}</h2>
              <p className="bs-action-description">{t.observeBody}</p>
              <div className="bs-observe-card" aria-hidden="true"><span className="bs-observe-eye">◎</span><span className="bs-observe-grid" /></div>
              <div className="bs-panel-footer"><button type="button" className="bs-primary" onClick={onBegin}>{t.start}<span aria-hidden="true">↗</span></button></div>
            </>}

            {isAnswering && <>
              <div className="bs-action-overline"><span className="bs-small-square" /> 02 / {t.selection}</div>
              <h2>{t.regionQuestion}</h2>
              <p className="bs-action-description">{t.regionHint}</p>
              <div className="bs-field"><div className="bs-field-title"><span>01</span><h3>{t.selectable}</h3>{attempt.regionSelection && <span className="bs-selected-dot" aria-label="selected">✓</span>}</div>
                <div className="bs-region-options" role="group" aria-label={t.selectable}>
                  {scene.tapRegions.map((region) => <button type="button" key={region.id}
                    className={`bs-region-option${attempt.regionSelection?.kind === 'region' && attempt.regionSelection.regionId === region.id ? ' bs-option--selected' : ''}`}
                    aria-pressed={attempt.regionSelection?.kind === 'region' && attempt.regionSelection.regionId === region.id}
                    onClick={() => onSelectRegion({ kind: 'region', regionId: region.id })}><span className="bs-option-radio" />{tr(region.label, locale)}</button>)}
                  <button type="button" className={`bs-region-option bs-none-option${attempt.regionSelection?.kind === 'none' ? ' bs-option--selected' : ''}`}
                    aria-pressed={attempt.regionSelection?.kind === 'none'} onClick={() => onSelectRegion({ kind: 'none' })}>
                    <span className="bs-option-radio" />{tr(scene.noneLabel, locale)}</button>
                </div>
              </div>
              <div className="bs-field"><div className="bs-field-title"><span>02</span><h3>{t.answer}</h3>{attempt.responseId && <span className="bs-selected-dot" aria-label="selected">✓</span>}</div>
                <div className="bs-choice-options" role="group" aria-label={t.answer}>
                  {orderedResponses.map((option) => <button type="button" className={`bs-choice-option${attempt.responseId === option.id ? ' bs-option--selected' : ''}`}
                    key={option.id} aria-pressed={attempt.responseId === option.id} onClick={() => onSelectResponse(option.id)}><span className="bs-option-radio" />{tr(option.label, locale)}</button>)}
                </div>
              </div>
              <div className="bs-field"><div className="bs-field-title"><span>03</span><h3>{t.reason}</h3>{attempt.reasonId && <span className="bs-selected-dot" aria-label="selected">✓</span>}</div>
                <div className="bs-choice-options" role="group" aria-label={t.reason}>
                  {orderedReasons.map((option) => <button type="button" className={`bs-choice-option${attempt.reasonId === option.id ? ' bs-option--selected' : ''}`}
                    key={option.id} aria-pressed={attempt.reasonId === option.id} onClick={() => onSelectReason(option.id)}><span className="bs-option-radio" />{tr(option.label, locale)}</button>)}
                </div>
              </div>
              <div className="bs-panel-footer"><p className="bs-action-help" aria-live="polite">{canLock(attempt) ? t.ready : t.incomplete}</p>
                <button type="button" className="bs-primary" onClick={onLock} disabled={!canLock(attempt)}>{t.lock}<span aria-hidden="true">↗</span></button></div>
            </>}

            {isLocked && <>
              <div className="bs-action-overline"><span className="bs-small-square" /> {t.lockedTag}</div>
              <div className="bs-lock-symbol" aria-hidden="true">✓</div>
              <h2>{t.lockedTitle}</h2><p className="bs-action-description">{t.lockedBody}</p>
              {submitted && <section className="bs-summary" aria-label={t.confirmed}>
                <h3>{t.confirmed}</h3>
                <dl className="bs-submitted-list">{submittedChoices.map(({ label, value }) =>
                  <div className="bs-submitted-item" key={label}><dt>{label}</dt><dd>{value}</dd></div>
                )}</dl>
              </section>}
              <div className="bs-panel-footer"><button type="button" className="bs-primary" onClick={onStartReview}>{t.seeReview}<span aria-hidden="true">↗</span></button></div>
            </>}

            {isReview && <>
              <div className="bs-action-overline"><span className="bs-small-square" /> 03 / {t.review}</div>
              <h2>{t.reviewTitle}</h2><p className="bs-action-description">{t.reviewHint}</p>
              {canReview && submitted && <section className="bs-summary bs-summary--review" aria-label={t.confirmed}>
                <h3>{t.confirmed}</h3>
                <dl className="bs-submitted-list">{submittedChoices.map(({ label, value }) =>
                  <div className="bs-submitted-item" key={label}><dt>{label}</dt><dd>{value}</dd></div>
                )}</dl>
              </section>}
              {canReview && feedback ? <div className="bs-feedback">
                <article><span className="bs-feedback-number">01</span><div><h3>{t.recognition}</h3><p>{feedback.recognition}</p></div></article>
                <article><span className="bs-feedback-number">02</span><div><h3>{t.responseNote}</h3><p>{feedback.response}</p></div></article>
                <article><span className="bs-feedback-number">03</span><div><h3>{t.reasonNote}</h3><p>{feedback.reason}</p></div></article>
              </div> : <p className="bs-action-description">{t.noExplanation}</p>}
              {canReview && currentEnding ? <div className="bs-ending-card">
                <span className="bs-ending-label">{t.ended} · {attempt.endingIndex + 1} / {scene.continuations.length}</span>
                <h3>{tr(currentEnding.title, locale)}</h3><p>{tr(currentEnding.narrative, locale)}</p>
                <p className="bs-ending-note">{t.endingNotice}</p>
                {attempt.endingIndex < scene.continuations.length - 1 ?
                  <button type="button" className="bs-secondary bs-full" onClick={onNextEnding}>{t.nextEnding}<span aria-hidden="true">→</span></button> :
                  <button type="button" className="bs-secondary bs-full" onClick={onReplayEndings}>{t.replay}<span aria-hidden="true">↺</span></button>}
              </div> : scene.purpose === 'assessment' && <p className="bs-assessment-note">{t.assessmentReview}</p>}
              {(scene.contentReview.status === 'provisional' || feedback?.provisional) &&
                <div className="bs-provisional"><span aria-hidden="true">ⓘ</span><span>{t.draft}</span></div>}
              <div className="bs-panel-footer bs-panel-footer--review"><button type="button" className="bs-secondary" onClick={onRestart}>{t.startNew}<span aria-hidden="true">↺</span></button>
                <button type="button" className="bs-primary" disabled={!canContinue} onClick={onNextScene} title={!canContinue ? t.nextUnavailable : undefined}>{t.next}<span aria-hidden="true">→</span></button></div>
            </>}
          </section>
        </div>
        <footer className="bs-footer"><span>BLINDSPOT <span className="bs-footer-dim">/</span> PRACTICE INTERFACE</span><span className={storageStatus === 'available' ? '' : 'bs-footer-alert'}><span className="bs-footer-dot" />{storageLabel}</span></footer>
      </main>
    </div>
  );
}
