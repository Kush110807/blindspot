import { useCallback, useState } from 'react';
import { sceneProgressLabel } from '../integration/sceneProgress.ts';
import type { AssetPhase } from './assetStatus.ts';
import type { PracticeScreenProps } from '../contracts/integration.ts';
import type { Locale, Translated } from '../contracts/scene.ts';
import { translate } from '../contracts/scene.ts';
import { canLock } from '../engine/attempt.ts';
import { SceneViewport } from './SceneViewport.tsx';
import { summarizeReviewTone } from './reviewTone.ts';
import { buildLessonPresentation, regionSelectionForViewport, type LessonDisposition } from '../integration/lessonPresentation.ts';
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
    nextUnavailable: 'See both endings before continuing',
    supported: 'Aligned', conditional: 'Conditional', reconsider: 'Reconsider',
    draftComparison: 'Provisional lesson comparison — not an instructor-validated score',
    keyTakeaway: 'Your decision, explained', yourChoice: 'Your choice', itsMeaning: 'What it means in this scene',
    change: 'What to do differently', whyBetter: 'Why this addresses the visibility question',
    alternatives: 'Draft-supported alternatives', details: 'Read the detailed explanation',
    observationLabel: 'Recognition', responseLabel: 'Response', reasoningLabel: 'Reasoning',
    regionCompare: 'Your marked area vs lesson focus', markedArea: 'Your selected area', focusArea: 'Lesson’s intended area',
    clearNone: 'No target obstruction is present here. Keep observing the road for other hazards.',
    tryAgain: 'Try this scene again', complete: 'All three scenes completed', completionHelp: 'Your answers are saved locally when storage is available. These are practice comparisons, not validated scores.',
    outcomeLink: 'What this ending means for your response',
    continuationDetails: 'Why the outcome does not change the initial decision',
    responseDetails: 'Full response explanation',
    recognitionMatches: 'Your mark matches the lesson’s intended visibility focus.',
    recognitionDiffers: 'Compare your mark with the highlighted lesson area.',
    responseMatches: 'This action fits one of the draft-supported approaches.',
    responseDepends: 'This action requires additional checks not shown here.',
    responseDiffers: 'This action leaves the scene’s key concern unresolved.',
    reasonMatches: 'Your reason addresses the concern in the initial view.',
    reasonDiffers: 'Your reason overlooks something in the initial view.',
    noChange: 'Your action is draft-supported. Keep adapting as you approach, and address any recognition or reasoning gaps shown above.',
    improveCriterion: 'How to improve this part',
    nextScene: 'Continue to next scene', seenBoth: 'View both endings to continue.', backWelcome: 'Back to welcome',
    keepDoing: 'What to keep doing', submissionNeutral: 'Submitted, not scored',
    yourDecision: 'Your submitted decision', visualReview: 'Scene and outcome',
    assessmentScene: 'Initial assessment scene', feedbackGroup: 'Feedback by criterion',
    lessonDetails: 'More lesson context and draft alternatives', storageDetail: 'Storage details',
    statusMixed: 'Mixed choices', statusSupported: 'Aligned with the lesson',
    statusConditional: 'Conditions matter', statusReconsider: 'Reconsider the decision',
    detailIntro: 'Additional context', outcomeNoGuarantee: 'The ending does not determine whether the original choice was justified.',
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
    nextUnavailable: 'आगे बढ़ने से पहले दोनों अंत देखें',
    supported: 'मेल खाता है', conditional: 'शर्तों पर निर्भर', reconsider: 'फिर विचार करें',
    draftComparison: 'प्रारंभिक पाठ से तुलना — प्रशिक्षक द्वारा प्रमाणित स्कोर नहीं',
    keyTakeaway: 'आपके निर्णय का अर्थ', yourChoice: 'आपकी पसंद', itsMeaning: 'इस दृश्य में इसका मतलब',
    change: 'अगली बार क्या बदलें', whyBetter: 'यह दृश्य की समस्या को क्यों समझता है',
    alternatives: 'प्रारंभिक पाठ के समर्थित विकल्प', details: 'पूरा स्पष्टीकरण पढ़ें',
    observationLabel: 'पहचान', responseLabel: 'कदम', reasoningLabel: 'कारण',
    regionCompare: 'आपकी चुनी जगह और पाठ का लक्ष्य', markedArea: 'आपकी चुनी जगह', focusArea: 'पाठ का लक्षित हिस्सा',
    clearNone: 'यहाँ लक्षित रुकावट नहीं है। सड़क के अन्य संभावित जोखिमों पर नज़र रखें।',
    tryAgain: 'इस दृश्य को फिर आज़माएँ', complete: 'तीनों दृश्य पूरे हो गए', completionHelp: 'स्टोरेज उपलब्ध होने पर उत्तर आपके डिवाइस में सहेजे जाते हैं। ये अभ्यास की तुलनाएँ हैं, प्रमाणित स्कोर नहीं।',
    outcomeLink: 'आपके कदम के संदर्भ में इस अंत का मतलब',
    continuationDetails: 'अंत बदलने से शुरुआती निर्णय का आधार क्यों नहीं बदलता',
    responseDetails: 'कदम का पूरा स्पष्टीकरण',
    recognitionMatches: 'आपका चुना हिस्सा पाठ के लक्षित दृश्य से मेल खाता है।',
    recognitionDiffers: 'अपनी चुनी जगह की तुलना पाठ में चिह्नित हिस्से से करें।',
    responseMatches: 'यह कदम मसौदे के समर्थित विकल्पों में से एक है।',
    responseDepends: 'इस कदम के लिए ऐसी अतिरिक्त जाँच ज़रूरी है जो यहाँ नहीं दिखाई गई।',
    responseDiffers: 'यह कदम दृश्य की मुख्य अनिश्चितता दूर नहीं करता।',
    reasonMatches: 'आपका कारण शुरुआती दृश्य के सवाल पर ध्यान देता है।',
    reasonDiffers: 'आपका कारण शुरुआती दृश्य की एक ज़रूरी बात छोड़ता है।',
    noChange: 'आपका कदम इस प्रारंभिक पाठ में समर्थित है। पास आते समय स्थिति देखते रहें और ऊपर बताई गई पहचान या कारण की कमी भी सुधारें।',
    improveCriterion: 'इस हिस्से को कैसे सुधारें',
    nextScene: 'अगले दृश्य पर जाएँ', seenBoth: 'आगे जाने के लिए दोनों परिणाम देखें।', backWelcome: 'स्वागत पृष्ठ पर जाएँ',
    keepDoing: 'आगे भी क्या करते रहें', submissionNeutral: 'उत्तर दर्ज हुआ, अंक नहीं मिले',
    yourDecision: 'आपका दर्ज किया गया निर्णय', visualReview: 'दृश्य और परिणाम',
    assessmentScene: 'मूल अभ्यास दृश्य', feedbackGroup: 'हर हिस्से पर प्रतिक्रिया',
    lessonDetails: 'अधिक संदर्भ और प्रारंभिक विकल्प', storageDetail: 'संग्रह की जानकारी',
    statusMixed: 'मिश्रित विकल्प', statusSupported: 'पाठ से मेल खाता है',
    statusConditional: 'परिस्थितियाँ महत्त्वपूर्ण हैं', statusReconsider: 'निर्णय पर फिर विचार करें',
    detailIntro: 'अधिक जानकारी', outcomeNoGuarantee: 'अंत के आधार पर शुरुआती निर्णय को सही या गलत नहीं माना जा सकता।',
  },
};

const tr = (value: Translated, locale: Locale) => translate(value, locale);

export function PracticeScreen(props: PracticeScreenProps) {
  const {
    scene, attempt, locale, feedback, storageStatus, canNextScene,
    onBegin, onSelectRegion, onSelectResponse, onSelectReason, onLock,
    onStartReview, onNextEnding, onReplayEndings, onRestart, onNextScene, onLocaleChange, onBackToWelcome,
  } = props;
  const t = copy[locale];
  const [assetState, setAssetState] = useState<{ src: string; phase: AssetPhase }>(
    { src: scene.base.src, phase: 'loading' }
  );
  const artworkReady = assetState.src === scene.base.src && assetState.phase === 'loaded';
  const onBaseStatusChange = useCallback((src: string, phase: AssetPhase) => {
    setAssetState(previous => previous.src === src && previous.phase === phase ? previous : { src, phase });
  }, []);

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
  const lesson = canReview ? buildLessonPresentation(scene, submitted, locale, currentEnding?.id ?? null) : null;
  const statusText = (status: LessonDisposition) => status === 'supported' ? t.supported : status === 'conditional' ? t.conditional : t.reconsider;
  // Styling is derived from all three provisional criteria. A supported action alone
  // must never turn an otherwise mixed/reconsideration review green.
  const overallPresentation = lesson
    ? summarizeReviewTone(lesson.recognition, lesson.response, lesson.reason) : 'reconsider';
  const compactCriterion = (criterion: 'recognition' | 'response' | 'reason') => {
    if (!lesson) return '';
    if (criterion === 'recognition') return lesson.recognition === 'supported' ? t.recognitionMatches : t.recognitionDiffers;
    if (criterion === 'reason') return lesson.reason === 'supported' ? t.reasonMatches : t.reasonDiffers;
    return lesson.response === 'supported' ? t.responseMatches : lesson.response === 'conditional' ? t.responseDepends : t.responseDiffers;
  };

  const statusOverall = overallPresentation === 'supported' ? t.statusSupported :
    overallPresentation === 'conditional' ? t.statusConditional :
    overallPresentation === 'mixed' ? t.statusMixed : t.statusReconsider;
  const showStorageWarning = storageStatus !== 'available';
  const immediateGuidance = !lesson ? '' : overallPresentation === 'supported' ? t.noChange :
    lesson.response === 'supported'
      ? [lesson.recognitionRemediation, lesson.reasonRemediation].filter((value): value is string => Boolean(value)).join(' ')
      : lesson.response === 'conditional' ? `${lesson.responseMeaning} ${lesson.nextStep}` : lesson.nextStep;

  const scenePanel = (
    <section className="bs-scene-panel" aria-label={t.visual}>
      <div className="bs-panel-head">
        <span>{currentEnding ? tr(currentEnding.title, locale) : t.visual}</span>
        <span className="bs-panel-subtle">{currentEnding ? t.continuation : t.original}</span>
      </div>
      <SceneViewport scene={scene} locale={locale} selected={regionSelectionForViewport(scene, attempt)}
        canSelect={isAnswering && artworkReady} ending={currentEnding} review={canReview}
        onBaseStatusChange={onBaseStatusChange} onSelectRegion={selection => { if (artworkReady) onSelectRegion(selection); }}/>
      {isAnswering && <p className="bs-map-caption">{t.regionHelp}</p>}
      {canReview && lesson && <div className="bs-region-comparison" data-testid="region-comparison">
        <h3>{t.regionCompare}</h3>
        <dl><div><dt><span className="bs-marked-dot"/>{t.markedArea}</dt><dd>{lesson.selectedRegion}</dd></div>
          <div><dt><span className="bs-target-dot"/>{t.focusArea}</dt><dd>{lesson.expectedRegion}</dd></div></dl>
        <p>{lesson.regionExplanation}</p>
        {scene.condition === 'clear-view-control' && <p className="bs-clear-note">{t.clearNone}</p>}
      </div>}
      {!canReview && <div className="bs-conditions">
        <h2>{t.visible}</h2>
        <ul>{scene.visibleConditions.map((condition, index) => <li key={index}>{tr(condition, locale)}</li>)}</ul>
      </div>}
    </section>
  );

  return (
    <div className={`bs-app bs-phase--${attempt.phase}${canReview ? ' bs-app--review' : ''}`} lang={locale}>
      <header className="bs-topbar"><div className="bs-topbar-inner">
        <div className="bs-brand" aria-label="BlindSpot"><span className="bs-brand-icon" aria-hidden="true"><span/></span>
          <span><strong>BlindSpot</strong><small>{t.brandSub}</small></span></div>
        <div className="bs-topbar-tools"><button type="button" className="bs-back-welcome" onClick={onBackToWelcome}><span aria-hidden="true">←</span> {t.backWelcome}</button><span className="bs-topbar-mode">{scene.purpose === 'training' ? t.training : t.assessment}</span>
          <div className="bs-lang" role="group" aria-label={t.unchanged}>
            <button type="button" className={locale === 'en' ? 'bs-lang-active' : ''} aria-pressed={locale === 'en'} onClick={() => onLocaleChange('en')}>EN</button>
            <button type="button" className={locale === 'hi' ? 'bs-lang-active' : ''} aria-pressed={locale === 'hi'} onClick={() => onLocaleChange('hi')}>हिंदी</button>
          </div></div></div></header>
      <main className="bs-main">
        <nav className="bs-progress" aria-label={`${t.module}: ${[t.observe, t.decide, t.review][phaseStep]}`}>
          {[t.observe, t.decide, t.review].map((step, index) => <div key={index}
            className={`bs-step${index === phaseStep ? ' bs-step--active' : ''}${index < phaseStep ? ' bs-step--done' : ''}`}
            aria-current={index === phaseStep ? 'step' : undefined}>
            <span className="bs-step-number">{index < phaseStep ? '✓' : index + 1}</span>{step}</div>)}
        </nav>
        <div className="bs-intro"><div><p className="bs-scene-count" data-testid="scene-progress">{sceneProgressLabel(scene.id, locale)}</p><p className="bs-kicker">{scene.purpose === 'training' ? t.training : t.assessment}</p>
          <h1>{tr(scene.title, locale)}</h1>
          <p>{canReview ? t.reviewHint : tr(scene.prompt, locale)}</p></div></div>

        {canReview && lesson && <>
          <section className={`bs-review-lead bs-review-lead--${overallPresentation}`} aria-label={t.keyTakeaway}>
            <div className="bs-review-lead-top"><span className="bs-overall-label" data-testid="overall-presentation">{statusOverall}</span>
</div>
            <h2>{t.keyTakeaway}</h2>
            <p className="bs-review-takeaway" data-testid="review-takeaway">{lesson.takeaway}</p>
            <div className="bs-immediate-step" data-testid="immediate-improvement">
              <h3>{overallPresentation === 'supported' ? t.keepDoing : t.change}</h3>
              <p>{immediateGuidance}</p>
            </div>
          </section>
          <section className="bs-review-scene" aria-label={t.visualReview}>
            <h2>{t.visualReview}</h2>
            <div className="bs-review-scene-grid">
              {scenePanel}
              <div className="bs-review-outcome">
                {currentEnding ? <section className="bs-ending-card" data-testid="ending-review">
                  <div className="bs-ending-label">{t.ended} · {attempt.endingIndex + 1} / {scene.continuations.length}</div>
                  <h3>{tr(currentEnding.title, locale)}</h3>
                  {lesson.endingMessage && <p className="bs-ending-takeaway">{lesson.endingMessage}</p>}
                  <details className="bs-expand"><summary>{t.continuationDetails}</summary>
                    <p>{tr(currentEnding.narrative, locale)}</p><p>{t.outcomeNoGuarantee}</p>
                  </details>
                  {attempt.endingIndex < scene.continuations.length - 1 && <button type="button" className="bs-primary" onClick={onNextEnding}>
                    {t.nextEnding}<span aria-hidden="true">→</span></button>}
                  {attempt.endingIndex === scene.continuations.length - 1 && <button type="button" className="bs-secondary" onClick={onReplayEndings}>
                    {t.replay}<span aria-hidden="true">↺</span></button>}
                </section> : <section className="bs-assessment-info">
                  <h3>{t.assessmentScene}</h3><p>{t.assessmentReview}</p>
                  <h3>{t.visible}</h3><ul>{scene.visibleConditions.map((condition, index) => <li key={index}>{tr(condition, locale)}</li>)}</ul>
                </section>}
              </div>
            </div>
          </section>
          <section className="bs-review-feedback" aria-label={t.feedbackGroup}>
            <h2>{t.feedbackGroup}</h2>
            <div className="bs-criteria">
              {([['recognition', t.observationLabel], ['response', t.responseLabel], ['reason', t.reasoningLabel]] as const)
                .map(([criterion, label]) => <article className={`bs-criterion bs-criterion--${lesson[criterion]}`} key={criterion} data-testid={`criterion-${criterion}`}>
                  <div className="bs-criterion-heading"><h3>{label}</h3>
                    <span className={`bs-criterion-status bs-criterion-status--${lesson[criterion]}`}>{statusText(lesson[criterion])}</span></div>
                  <p>{compactCriterion(criterion)}</p>
                  {criterion === 'recognition' && lesson.recognitionRemediation && <div className="bs-criterion-remediation" data-testid="recognition-remediation">
                    <strong>{t.improveCriterion}</strong><p>{lesson.recognitionRemediation}</p></div>}
                  {criterion === 'reason' && lesson.reasonRemediation && <div className="bs-criterion-remediation" data-testid="reason-remediation">
                    <strong>{t.improveCriterion}</strong><p>{lesson.reasonRemediation}</p></div>}
                </article>)}
            </div>
            <section className="bs-review-choices" aria-label={t.yourDecision}>
              <h3>{t.yourDecision}</h3>
              <dl>{submittedChoices.map(({ label, value }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
            </section>
            <details className="bs-expand bs-review-extra"><summary>{t.lessonDetails}</summary>
              <h3>{t.itsMeaning}</h3><p>{lesson.responseMeaning}</p>
              <h3>{t.whyBetter}</h3><p>{lesson.why}</p>
              <h3>{t.alternatives}</h3><ul>{lesson.alternatives.map((option) => <li key={option}>{option}</li>)}</ul>
              {feedback && <div className="bs-detailed-feedback">
                <p><strong>{t.observationLabel}:</strong> {feedback.recognition}</p>
                <p><strong>{t.responseLabel}:</strong> {feedback.response}</p>
                <p><strong>{t.reasoningLabel}:</strong> {feedback.reason}</p></div>}
            </details>
          </section>
          <div className="bs-provisional" role="note"><span aria-hidden="true">ⓘ</span> {t.draft}</div>
          <div className="bs-review-controls">
            {scene.purpose === 'training' && !allTrainingEndingsSeen && <div className="bs-next-gate" data-testid="training-next-gate">
              <button type="button" className="bs-secondary bs-next-disabled" disabled aria-describedby="bs-ending-gate-help">{t.nextScene}<span aria-hidden="true">→</span></button>
              <p id="bs-ending-gate-help" className="bs-next-hint">{t.seenBoth}</p>
              <button type="button" className="bs-primary" onClick={onNextEnding}>{t.nextEnding}<span aria-hidden="true">→</span></button>
            </div>}
            {canContinue && <button type="button" className="bs-primary" onClick={onNextScene}>{t.nextScene}<span aria-hidden="true">→</span></button>}
            {scene.condition === 'clear-view-control' && !canNextScene && <section className="bs-completed" data-testid="practice-completed" role="status">
              <h2>{t.complete}</h2><p>{t.completionHelp}</p></section>}
            <button type="button" className="bs-secondary" onClick={onRestart}>{t.tryAgain}<span aria-hidden="true">↺</span></button>
          </div>
        </>}

        {!canReview && <div className="bs-workspace">
          {scenePanel}
          <section className="bs-action-panel" aria-live="polite" aria-label={[t.observe, t.decide, t.review][phaseStep]}>
            {isObserving && <>
              <h2>{t.observeTitle}</h2><p className="bs-action-description">{t.observeBody}</p>
              <button type="button" className="bs-primary bs-observe-cta" onClick={() => { if (artworkReady) onBegin(); }} disabled={!artworkReady}>{t.start}<span aria-hidden="true">→</span></button>
            </>}
            {isAnswering && <>
              <h2>{t.regionQuestion}</h2><p className="bs-action-description">{t.regionHint}</p>
              <div className="bs-field"><h3>{t.selectable}</h3>
                <div className="bs-region-options" role="group" aria-label={t.selectable}>
                  {scene.tapRegions.map((region) => <button type="button" key={region.id} className={`bs-region-option${attempt.regionSelection?.kind === 'region' && attempt.regionSelection.regionId === region.id ? ' bs-option--selected' : ''}`}
                    aria-pressed={attempt.regionSelection?.kind === 'region' && attempt.regionSelection.regionId === region.id}
                    disabled={!artworkReady} onClick={() => { if (artworkReady) onSelectRegion({kind:'region',regionId:region.id}); }}><span className="bs-option-radio" aria-hidden="true" />{tr(region.label,locale)}</button>)}
                  <button type="button" className={`bs-region-option bs-none-option${attempt.regionSelection?.kind === 'none' ? ' bs-option--selected' : ''}`}
                    aria-pressed={attempt.regionSelection?.kind === 'none'} disabled={!artworkReady} onClick={() => { if (artworkReady) onSelectRegion({kind:'none'}); }}><span className="bs-option-radio" aria-hidden="true" />{tr(scene.noneLabel,locale)}</button>
                </div></div>
              <div className="bs-field"><h3>{t.answer}</h3><div className="bs-choice-options" role="group" aria-label={t.answer}>
                {orderedResponses.map((option) => <button type="button" className={`bs-choice-option${attempt.responseId === option.id ? ' bs-option--selected' : ''}`}
                  key={option.id} aria-pressed={attempt.responseId === option.id} disabled={!artworkReady} onClick={() => { if (artworkReady) onSelectResponse(option.id); }}><span className="bs-option-radio" aria-hidden="true" />{tr(option.label,locale)}</button>)}</div></div>
              <div className="bs-field"><h3>{t.reason}</h3><div className="bs-choice-options" role="group" aria-label={t.reason}>
                {orderedReasons.map((option) => <button type="button" className={`bs-choice-option${attempt.reasonId === option.id ? ' bs-option--selected' : ''}`}
                  key={option.id} aria-pressed={attempt.reasonId === option.id} disabled={!artworkReady} onClick={() => { if (artworkReady) onSelectReason(option.id); }}><span className="bs-option-radio" aria-hidden="true" />{tr(option.label,locale)}</button>)}</div></div>
              <div className="bs-answer-submit"><p aria-live="polite">{!artworkReady ? (locale === 'hi' ? 'चित्र उपलब्ध होने पर उत्तर दिया जा सकता है।' : 'Answering is available once the scene image loads.') : canLock(attempt) ? t.ready : t.incomplete}</p>
                <button type="button" className="bs-primary" onClick={() => { if (artworkReady && canLock(attempt)) onLock(); }} disabled={!artworkReady || !canLock(attempt)}>{t.lock}<span aria-hidden="true">→</span></button></div>
            </>}
            {isLocked && <>
              <div className="bs-locked-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg></div>
              <h2>{t.lockedTitle}</h2><p className="bs-action-description">{t.lockedBody}</p>
              <span className="bs-lock-neutral">{t.submissionNeutral}</span>
              {submitted && <section className="bs-summary" aria-label={t.confirmed}>
                <h3>{t.confirmed}</h3><dl>{submittedChoices.map(({label,value}) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
              </section>}
              <button type="button" className="bs-primary" onClick={onStartReview}>{t.seeReview}<span aria-hidden="true">→</span></button>
            </>}
            {isReview && <p>{t.noExplanation}</p>}
          </section>
        </div>}
        <footer className="bs-footer">
          <span>BlindSpot · {t.module}</span>
          {showStorageWarning ? <span className="bs-storage-warning" role="status">{storageLabel}</span> :
            <details className="bs-storage-detail"><summary>{t.storageDetail}</summary><span>{storageLabel}</span></details>}
        </footer>
      </main>
    </div>
  );
}
