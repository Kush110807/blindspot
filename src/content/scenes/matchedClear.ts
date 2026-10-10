import type { SceneDefinition } from '../../contracts/scene.ts';

/** Matched composition to unfamiliar-blocked-01, without the stationary van. */
export const matchedClearScene: SceneDefinition = {
  schemaVersion: 1,
  sceneVersion: '1.0.0-provisional',
  id: 'matched-clear-01',
  purpose: 'assessment',
  condition: 'clear-view-control',
  title: { en: 'The open side-street view', hi: 'बगल की सड़क का खुला दृश्य' },
  prompt: {
    en: 'Inspect this view. Mark one area, or choose none. Then choose a response and your main reason.',
    hi: 'इस दृश्य को देखें। एक हिस्सा चुनें या “कोई नहीं” चुनें। फिर अपना कदम और मुख्य कारण चुनें।',
  },
  visibleConditions: [
    {
      en: 'You are approaching a small side-street entrance on the right.',
      hi: 'आप दाईं ओर की एक छोटी जोड़ने वाली सड़क के पास पहुँच रहे हैं।',
    },
    {
      en: 'The entrance and the nearby part of the road are visible. Your lane ahead remains available.',
      hi: 'प्रवेश और उसके पास की सड़क दिखाई दे रही है। आपके सामने अपनी लेन में आगे बढ़ने की जगह है।',
    },
  ],
  base: {
    src: '/scenes/matched-clear-01/base.svg',
    width: 1280,
    height: 720,
    alt: {
      en: 'Rider-eye view of the same street and right-hand side entrance as the delivery-van scene, now with no van covering the entrance. A small vehicle is farther ahead on the left; the road is not described as hazard-free.',
      hi: 'डिलीवरी वैन वाले दृश्य की वही सड़क और दाईं ओर का प्रवेश, लेकिन इस बार उसे छिपाने वाली वैन नहीं है। बाईं ओर कुछ दूरी पर छोटी गाड़ी दिख रही है; सड़क को पूरी तरह जोखिम-मुक्त नहीं बताया गया है।',
    },
  },
  tapRegions: [
    {
      id: 'open-right-entry',
      label: { en: 'Area at the right-hand side-street entrance', hi: 'दाईं ओर की जोड़ने वाली सड़क का प्रवेश' },
      bounds: { x: 0.555, y: 0.40, width: 0.16, height: 0.27 },
    },
    {
      id: 'far-left-vehicle',
      label: { en: 'Vehicle farther ahead on the left', hi: 'बाईं ओर आगे की गाड़ी' },
      bounds: { x: 0.26, y: 0.53, width: 0.15, height: 0.17 },
    },
    {
      id: 'near-lane-surface',
      label: { en: 'Near section of your lane', hi: 'अपनी लेन का नज़दीकी हिस्सा' },
      bounds: { x: 0.40, y: 0.73, width: 0.17, height: 0.12 },
    },
    {
      id: 'right-side-pavement',
      label: { en: 'Pavement beyond the right curb', hi: 'दाएँ किनारे के आगे का फुटपाथ' },
      bounds: { x: 0.87, y: 0.60, width: 0.12, height: 0.23 },
    },
  ],
  responseOptions: [
    {
      id: 'scan-controllable-pace',
      label: {
        en: 'Continue at a controllable pace while checking the side entrance.',
        hi: 'बगल के प्रवेश पर नज़र रखते हुए ऐसी रफ़्तार से आगे बढ़ें जिसे नियंत्रित कर सकें।',
      },
    },
    {
      id: 'ease-and-check',
      label: {
        en: 'Ease off a little and keep scanning the entrance.',
        hi: 'थोड़ी रफ़्तार घटाकर प्रवेश पर नज़र बनाए रखें।',
      },
    },
    {
      id: 'accelerate-because-clear',
      label: {
        en: 'Accelerate because the entrance is visible.',
        hi: 'प्रवेश दिख रहा है, इसलिए रफ़्तार बढ़ाएँ।',
      },
    },
    {
      id: 'stop-because-any-side-street',
      label: {
        en: 'Stop indefinitely because every side street must be blocked.',
        hi: 'अनिश्चित समय तक रुकें, क्योंकि हर बगल वाली सड़क पर दृश्य बाधित ही होगा।',
      },
    },
  ],
  reasonOptions: [
    {
      id: 'open-view-still-scan',
      label: {
        en: 'The target entrance can be seen, but it still needs monitoring.',
        hi: 'यह प्रवेश दिखाई दे रहा है, फिर भी उस पर नज़र बनाए रखना ज़रूरी है।',
      },
    },
    {
      id: 'visible-means-no-risk',
      label: {
        en: 'A visible entrance means no road user can appear.',
        hi: 'प्रवेश दिखाई देता है, इसलिए कोई सड़क उपयोगकर्ता सामने नहीं आ सकता।',
      },
    },
    {
      id: 'every-side-street-blocked',
      label: {
        en: 'Any side street is automatically a hidden-view obstruction.',
        hi: 'हर बगल वाली सड़क अपने-आप दृश्य बाधित करने वाली जगह होती है।',
      },
    },
    {
      id: 'faster-is-easier',
      label: {
        en: 'Higher speed makes the entrance easier to assess.',
        hi: 'तेज़ गति से प्रवेश की स्थिति को समझना आसान होता है।',
      },
    },
  ],
  noneLabel: {
    en: 'No relevant blocked region',
    hi: 'दृश्य बाधित करने वाला कोई संबंधित हिस्सा नहीं',
  },
  continuations: [],
  feedback: {
    recognition: {
      en: 'The target side-street entrance is visible here because the van is absent. Selecting no relevant blocked region refers only to that obstruction; it does not mean the road has no hazards.',
      hi: 'इस दृश्य में वैन नहीं है, इसलिए बगल वाली सड़क का वह प्रवेश दिख रहा है। “कोई संबंधित बाधित हिस्सा नहीं” का मतलब सिर्फ उस रुकावट का न होना है; इसका मतलब पूरी सड़क का जोखिम-मुक्त होना नहीं है।',
    },
    responses: {
      'scan-controllable-pace': {
        en: 'Maintaining an adaptable pace and observing the visible entrance separates normal attention from the need to respond to a hidden-view obstruction.',
        hi: 'नियंत्रित रफ़्तार और दिखाई दे रहे प्रवेश पर ध्यान रखना, सामान्य सतर्कता और ओझल हिस्से से निपटने की अलग ज़रूरत के बीच अंतर करता है।',
      },
      'ease-and-check': {
        en: 'A small speed reduction while checking the entrance can be reasonable. This draft does not treat appropriate caution as an error simply because the target obstruction is absent.',
        hi: 'प्रवेश को देखते हुए थोड़ी रफ़्तार घटाना उचित हो सकता है। इस मसौदे में लक्ष्य रुकावट न होने के कारण उचित सावधानी को गलत नहीं माना गया है।',
      },
      'accelerate-because-clear': {
        en: 'Being able to see the entrance does not justify accelerating without checking other road users and the situation ahead.',
        hi: 'प्रवेश दिखाई देने का मतलब यह नहीं कि दूसरे सड़क उपयोगकर्ताओं और आगे की स्थिति को देखे बिना तेज़ होना उचित है।',
      },
      'stop-because-any-side-street': {
        en: 'The particular blocked view being tested is absent. A blanket assumption that every side street requires an indefinite stop does not use the available visual evidence.',
        hi: 'जिस बाधित दृश्य की यहाँ जाँच है, वह मौजूद नहीं है। हर बगल वाली सड़क पर अनिश्चित समय तक रुकना ज़रूरी मानना उपलब्ध दृश्य जानकारी का उपयोग नहीं करता।',
      },
    },
    reasons: {
      'open-view-still-scan': {
        en: 'This separates recognising a visible entrance from remaining observant; no relevant blocked region is not the same as no possible hazard.',
        hi: 'यह दिखाई दे रहे प्रवेश को पहचानने और सतर्क बने रहने में अंतर करता है; “कोई संबंधित ओझल हिस्सा नहीं” का मतलब “कोई जोखिम नहीं” नहीं है।',
      },
      'visible-means-no-risk': {
        en: 'Clear sightlines reduce this specific uncertainty but do not rule out traffic or other changes in the scene.',
        hi: 'साफ़ दृश्य से यह खास अनिश्चितता घटती है, लेकिन सड़क पर दूसरे लोगों की गतिविधि या बदलाव की संभावना खत्म नहीं होती।',
      },
      'every-side-street-blocked': {
        en: 'The entrance is shown in the illustration, so an assumption that it must be concealed does not fit these initial conditions.',
        hi: 'चित्र में प्रवेश दिखाई दे रहा है, इसलिए उसे निश्चित रूप से ओझल मानना इन शुरुआती परिस्थितियों से मेल नहीं खाता।',
      },
      'faster-is-easier': {
        en: 'Riding faster does not by itself improve sightlines or the time available to interpret a changing view.',
        hi: 'तेज़ चलने से अपने-आप दृश्य साफ़ नहीं होता और बदलती स्थिति को समझने के लिए अधिक समय भी नहीं मिलता।',
      },
    },
  },
  rubric: {
    acceptedRegionIds: [],
    acceptsNone: true,
    acceptedResponseIds: ['scan-controllable-pace', 'ease-and-check'],
    acceptedReasonIds: ['open-view-still-scan'],
  },
  contentReview: { status: 'provisional' },
};
