/** Presentation-only lesson guidance. No schema, scored classification or stored-record changes. */
import { translate, type Locale, type SceneDefinition, type Translated } from '../contracts/scene.ts';
import type { LockedAttempt } from '../engine/attempt.ts';

export type LessonDisposition = 'supported' | 'conditional' | 'reconsider';
export interface LessonPresentation {
  readonly takeaway: string;
  readonly recognition: LessonDisposition;
  readonly response: LessonDisposition;
  readonly reason: LessonDisposition;
  readonly responseMeaning: string;
  readonly nextStep: string;
  readonly why: string;
  readonly alternatives: readonly string[];
  readonly expectedRegion: string;
  readonly selectedRegion: string;
  readonly regionExplanation: string;
  readonly endingMessage: string | null;
}

const copy = {
  en: {
    recognized: 'Your selected area matches the lesson’s intended visibility focus.',
    otherRegion: 'Your selected area differs from the visibility focus in this draft lesson.',
    noRegion: 'You selected no blocked region, but this illustration contains a screened area.',
    correctlyNone: 'You chose none: the target side-street entrance is visible without the parked van.',
    falseRegion: 'You marked an area, but the target entrance has no relevant parked-vehicle obstruction.',
    matchesResponse: 'This response is one of the alternatives supported by this draft lesson.',
    considerResponse: 'This response needs more justification in the pictured conditions.',
    conditionalResponse: 'This response depends on conditions not established by the illustration.',
    matchesReason: 'Your reason matches the draft lesson’s visibility principle.',
    considerReason: 'Your reason does not fully account for the conditions shown.',
    selected: 'You marked', none: 'No relevant blocked region', expectedNone: 'No target obstruction',
    responseFocus: 'Your response', reasonFocus: 'Your main reason',
    matchedPrefix: 'You spotted the target visibility condition.',
    missedPrefix: 'First, revisit where visibility is or is not blocked.',
    mixedPrefix: 'Your observation and action need separate consideration.',
    reasonMismatch: 'Your stated reason also needs a rethink.',
    reasonMatch: 'Your stated reason addresses the visibility question.',
  },
  hi: {
    recognized: 'आपने जिस जगह को चुना, वह इस पाठ में लक्षित अधूरे दृश्य से मेल खाती है।',
    otherRegion: 'आपने जिस जगह को चुना, वह इस पाठ में लक्षित अधूरे दृश्य से अलग है।',
    noRegion: 'आपने कोई बाधित हिस्सा नहीं चुना, लेकिन इस चित्र में एक हिस्सा ओझल है।',
    correctlyNone: 'आपने «कोई नहीं» चुना: यहाँ खड़ी वैन नहीं है और लक्षित प्रवेश दिख रहा है।',
    falseRegion: 'आपने एक हिस्सा चुना, लेकिन यहाँ लक्ष्य प्रवेश को खड़ी गाड़ी नहीं छिपा रही।',
    matchesResponse: 'यह कदम इस प्रारंभिक पाठ के समर्थित विकल्पों में से एक है।',
    considerResponse: 'इस चित्र की परिस्थितियों में यह कदम दोबारा सोचने योग्य है।',
    conditionalResponse: 'यह कदम ऐसी परिस्थितियों पर निर्भर है जो चित्र से स्पष्ट नहीं हैं।',
    matchesReason: 'आपका कारण इस प्रारंभिक पाठ के दृश्य संबंधी सिद्धांत से मेल खाता है।',
    considerReason: 'आपका कारण चित्र की स्थितियों को पूरी तरह ध्यान में नहीं रखता।',
    selected: 'आपका चुना हिस्सा', none: 'कोई संबंधित बाधित हिस्सा नहीं', expectedNone: 'लक्षित दृश्य रुकावट नहीं',
    responseFocus: 'आपका कदम', reasonFocus: 'आपका मुख्य कारण',
    matchedPrefix: 'आपने लक्षित दृश्य स्थिति पहचान ली।',
    missedPrefix: 'पहले देखें कि कहाँ दृश्य बाधित है या नहीं है।',
    mixedPrefix: 'आपके अवलोकन और कदम का आकलन अलग-अलग करना ज़रूरी है।',
    reasonMismatch: 'आपके दिए कारण पर भी दोबारा विचार करें।',
    reasonMatch: 'आपका कारण दृश्य संबंधी सवाल को पहचानता है।',
  }
} as const;

interface DraftLessonNotes {
  readonly nextStep: Translated;
  readonly why: Translated;
  readonly regionExplanation: Translated;
  readonly responseMeanings: Readonly<Record<string, Translated>>;
  readonly conditionalResponseIds: readonly string[];
}
const lessons: Record<string, DraftLessonNotes> = {
  'bus-training-01': {
    nextStep: { en: 'Ease off and prepare to stop, or stay back and reassess before passing.', hi: 'रफ़्तार घटाकर रुकने के लिए तैयार रहें, या पीछे रहकर आगे निकलने से पहले फिर जाँचें।' },
    why: { en: 'The bus hides the far roadside, and opposing traffic rules out a simple pass. Keeping time and space to reassess addresses what cannot yet be seen; no action guarantees an outcome.', hi: 'बस आगे का सड़क किनारा छिपाती है और विपरीत ट्रैफ़िक के कारण आसानी से आगे निकलना उचित नहीं। समय और दूरी रखने से स्थिति फिर जाँची जा सकती है; सुरक्षित परिणाम की गारंटी नहीं है।' },
    regionExplanation: { en: 'The space beyond the far edge of the bus is screened. The opposite-lane vehicle is visible, but is a different constraint.', hi: 'बस के अगले किनारे के पार की जगह ओझल है। विपरीत लेन की गाड़ी दिख रही है, लेकिन वह दूसरी बाधा है।' },
    responseMeanings: {
      'horn-hold-speed': { en: 'The horn does not reveal the screened roadside; unchanged speed leaves the uncertainty unresolved.', hi: 'हॉर्न से ओझल किनारा दिखाई नहीं देता; वही रफ़्तार रखने से अनिश्चितता बनी रहती है।' },
      'ease-prepare-to-stop': { en: 'Easing off and preparing to stop makes room to respond to an unseen conflict.', hi: 'रफ़्तार घटाने और रुकने की तैयारी से अनदेखी स्थिति में प्रतिक्रिया की गुंजाइश रहती है।' },
      'brief-slow-then-resume': { en: 'Brief slowing does not clear the view; speeding up before it clears restores the uncertainty.', hi: 'थोड़ी देर धीमा चलने से ओझल हिस्सा साफ़ नहीं होता; दृश्य साफ़ होने से पहले फिर रफ़्तार बढ़ाने पर वही अनिश्चितता रहती है।' },
      'stay-back-reassess': { en: 'Remaining back creates space to reassess the blocked view before passing.', hi: 'पीछे रहने से आगे निकलने से पहले अधूरे दृश्य को फिर जाँचने की जगह मिलती है।' },
    }, conditionalResponseIds: [],
  },
  'unfamiliar-blocked-01': {
    nextStep: { en: 'Ease off while monitoring the side entrance, or hold back and reassess before passing the van.', hi: 'बगल के प्रवेश पर नज़र रखते हुए धीमे हों, या वैन के पास से जाने से पहले पीछे रहकर दोबारा जाँचें।' },
    why: { en: 'The stopped van screens the side entrance even though the lane ahead is open. An adjusted pace or extra separation leaves room to respond to traffic emerging there.', hi: 'सामने लेन खुली होने पर भी खड़ी वैन बगल के प्रवेश को छिपाती है। नियंत्रित रफ़्तार या ज़्यादा दूरी से वहाँ से आने वाली गाड़ियों पर प्रतिक्रिया देना आसान हो सकता है।' },
    regionExplanation: { en: 'The van partially screens the side-street entrance; its stationary status does not make that hidden approach visible.', hi: 'वैन बगल की सड़क के प्रवेश को आंशिक रूप से छिपाती है; उसके खड़े होने से वह जगह दिखाई नहीं देने लगती।' },
    responseMeanings: {
      'keep-speed-assume-clear': { en: 'A clear path straight ahead does not establish that the partly hidden side entrance is clear.', hi: 'सीधे सामने का रास्ता खुला होने से आंशिक रूप से छिपे बगल के प्रवेश का साफ़ होना साबित नहीं होता।' },
      'ease-monitor-side-entry': { en: 'Easing off and watching the entrance leaves time to adapt while visibility is limited.', hi: 'धीमे होकर प्रवेश पर नज़र रखने से अधूरे दृश्य में कदम बदलने का समय मिलता है।' },
      'shift-center-to-see': { en: 'A lane-position change might improve sightlines, but it needs its own traffic and space check; this view cannot establish it is suitable.', hi: 'लेन में जगह बदलने से कुछ अधिक दिख सकता है, पर पहले आसपास की जगह और ट्रैफ़िक देखना होगा; यह चित्र इसकी उपयुक्तता तय नहीं करता।' },
      'wait-for-better-view': { en: 'Holding back avoids committing to a partly hidden side entrance too early.', hi: 'पीछे रहने से आंशिक रूप से छिपे प्रवेश के पास जल्दबाज़ी में जाने से बचा जा सकता है।' },
    }, conditionalResponseIds: ['shift-center-to-see'],
  },
  'matched-clear-01': {
    nextStep: { en: 'Continue at a controllable pace while scanning the visible entrance; easing off slightly may also be reasonable.', hi: 'दिखते हुए प्रवेश पर नज़र रखते हुए नियंत्रित रफ़्तार रखें; थोड़ा धीमा होना भी उचित हो सकता है।' },
    why: { en: 'The target parked-vehicle obstruction is absent, but a visible side entrance can still have turning traffic. Caution is not automatically an error, and a clear view is not a reason to speed up.', hi: 'यहाँ लक्ष्य रुकावट नहीं है, लेकिन दिखाई देते प्रवेश से भी गाड़ियाँ मुड़ सकती हैं। सावधानी अपने-आप गलत नहीं है और साफ़ दृश्य तेज़ चलने का कारण नहीं है।' },
    regionExplanation: { en: 'The van from the matched blocked-view scene is absent, so the target entrance is not screened. This does not mean the road has no hazards.', hi: 'पिछले ओझल-दृश्य वाले चित्र की वैन यहाँ नहीं है, इसलिए लक्ष्य प्रवेश खुला दिख रहा है। इसका मतलब पूरी सड़क जोखिम-मुक्त होना नहीं है।' },
    responseMeanings: {
      'scan-controllable-pace': { en: 'Keeping a controllable pace and checking the visible entrance addresses changing traffic without inventing an obstruction.', hi: 'नियंत्रित रफ़्तार और दिखाई देते प्रवेश पर नज़र रखने से बिना काल्पनिक रुकावट माने बदलते ट्रैफ़िक पर ध्यान रहता है।' },
      'ease-and-check': { en: 'Slightly easing off can be sensible caution; the absence of this obstruction does not make slowing an error.', hi: 'थोड़ा धीमा होना उचित सावधानी हो सकती है; इस रुकावट का न होना धीमे चलने को गलत नहीं बनाता।' },
      'speed-up-to-pass-sooner': { en: 'The visible entrance is not a reason to accelerate; faster travel may reduce time to react to turning traffic.', hi: 'प्रवेश दिखने से रफ़्तार बढ़ाने का आधार नहीं मिलता; तेज़ी से मुड़ती गाड़ियों पर प्रतिक्रिया का समय घट सकता है।' },
      'horn-and-maintain-pace': { en: 'A horn might alert others, but continuing at the same pace depends on traffic, observation and space—not the horn alone.', hi: 'हॉर्न ध्यान खींच सकता है, लेकिन वही रफ़्तार रखना ट्रैफ़िक, निगरानी और जगह पर निर्भर है, केवल हॉर्न पर नहीं।' },
    }, conditionalResponseIds: ['horn-and-maintain-pace'],
  },
};

const endingMessages: Record<string, Readonly<Record<string, Translated>>> = {
  'no-one-emerges': {
    'horn-hold-speed': { en: 'Nobody appeared, but your horn and unchanged speed did not reveal the hidden roadside.', hi: 'कोई सामने नहीं आया, लेकिन हॉर्न और वही रफ़्तार रखने से ओझल किनारा दिखाई नहीं दिया।' },
    'ease-prepare-to-stop': { en: 'Nobody appeared; easing off still addressed the view you could not check.', hi: 'कोई सामने नहीं आया; धीमे होना फिर भी अधूरे दृश्य के अनुसार था।' },
    'brief-slow-then-resume': { en: 'Nobody appeared, but resuming speed before the view cleared left the same uncertainty.', hi: 'कोई सामने नहीं आया, पर दृश्य साफ़ होने से पहले फिर तेज़ चलने से अनिश्चितता बनी रही।' },
    'stay-back-reassess': { en: 'Nobody appeared; staying back still left time to reassess the hidden roadside.', hi: 'कोई सामने नहीं आया; पीछे रहने से छिपे किनारे को दोबारा जाँचने का समय रहा।' },
  },
  'pedestrian-emerges': {
    'horn-hold-speed': { en: 'Someone appeared; holding speed could leave less time to respond despite the horn.', hi: 'कोई सामने आया; हॉर्न के बावजूद वही रफ़्तार रखने से प्रतिक्रिया का समय घट सकता है।' },
    'ease-prepare-to-stop': { en: 'Someone appeared; a reduced speed may help you react, but cannot guarantee an outcome.', hi: 'कोई सामने आया; धीमी रफ़्तार प्रतिक्रिया में मदद कर सकती है, लेकिन परिणाम की गारंटी नहीं देती।' },
    'brief-slow-then-resume': { en: 'Someone appeared; your renewed speed may leave less time to react to their arrival.', hi: 'कोई सामने आया; फिर रफ़्तार बढ़ाने से उसकी मौजूदगी पर प्रतिक्रिया का समय घट सकता है।' },
    'stay-back-reassess': { en: 'Someone appeared; staying back may preserve response space, without guaranteeing safety.', hi: 'कोई सामने आया; पीछे रहकर प्रतिक्रिया की जगह मिल सकती है, लेकिन सुरक्षा की गारंटी नहीं है।' },
  },
};

export function buildLessonPresentation(scene: SceneDefinition, locked: LockedAttempt | null, locale: Locale, endingId: string | null = null): LessonPresentation | null {
  if (!locked || locked.sceneId !== scene.id || locked.sceneVersion !== scene.sceneVersion || locked.schemaVersion !== scene.schemaVersion) return null;
  const notes = lessons[scene.id];
  if (!notes || !scene.responseOptions.some(o => o.id === locked.responseId) || !scene.reasonOptions.some(o => o.id === locked.reasonId)) return null;
  const t = copy[locale];
  const recognitionMatches = locked.regionSelection.kind === 'none'
    ? scene.rubric.acceptsNone : scene.rubric.acceptedRegionIds.includes(locked.regionSelection.regionId);
  const response: LessonDisposition = notes.conditionalResponseIds.includes(locked.responseId) ? 'conditional' :
    scene.rubric.acceptedResponseIds.includes(locked.responseId) ? 'supported' : 'reconsider';
  const reason: LessonDisposition = scene.rubric.acceptedReasonIds.includes(locked.reasonId) ? 'supported' : 'reconsider';
  const selected = locked.regionSelection.kind === 'none' ? translate(scene.noneLabel, locale) :
    translate(scene.tapRegions.find(r => r.id === locked.regionSelection.regionId)?.label ?? scene.noneLabel, locale);
  const expected = scene.rubric.acceptsNone ? t.expectedNone : scene.rubric.acceptedRegionIds
    .map(id => scene.tapRegions.find(r => r.id === id)).filter(r => r != null).map(r => translate(r.label, locale)).join(' / ');
  const meaning = notes.responseMeanings[locked.responseId];
  if (!meaning) return null;
  const baseTakeaway = recognitionMatches ? t.matchedPrefix : t.missedPrefix;
  const mixed = recognitionMatches && response !== 'supported';
  const prefix = mixed ? t.mixedPrefix : baseTakeaway;
  const takeaway = `${prefix} ${translate(meaning, locale)} ${reason === 'reconsider' ? t.reasonMismatch : ''}`.trim();
  return {
    takeaway,
    recognition: recognitionMatches ? 'supported' : 'reconsider', response, reason,
    responseMeaning: translate(meaning, locale), nextStep: translate(notes.nextStep, locale), why: translate(notes.why, locale),
    alternatives: scene.rubric.acceptedResponseIds.flatMap(id => { const option = scene.responseOptions.find(o => o.id === id); return option ? [translate(option.label, locale)] : []; }),
    expectedRegion: expected, selectedRegion: selected,
    regionExplanation: translate(notes.regionExplanation, locale),
    endingMessage: endingId ? translate(endingMessages[endingId]?.[locked.responseId] ?? {en: '', hi: ''}, locale) || null : null,
  };
}
