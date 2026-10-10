import type { SceneDefinition } from '../../contracts/scene.ts';

/** Unfamiliar layout for a later, unscored blocked-view practice assessment. */
export const unfamiliarBlockedScene: SceneDefinition = {
  schemaVersion: 1,
  sceneVersion: '1.0.0-provisional',
  id: 'unfamiliar-blocked-01',
  purpose: 'assessment',
  condition: 'blocked-view',
  title: { en: 'Approaching the side street', hi: 'बगल वाली सड़क के पास' },
  prompt: {
    en: 'Inspect the new layout. Mark one area, or choose none. Then choose a response and the main reason for it.',
    hi: 'सड़क का यह नया दृश्य देखें। एक हिस्सा चुनें या “कोई नहीं” चुनें। फिर अपना कदम और उसका मुख्य कारण चुनें।',
  },
  visibleConditions: [
    {
      en: 'You are approaching a small side-street entrance on the right.',
      hi: 'आप दाईं ओर की एक छोटी जोड़ने वाली सड़क के पास पहुँच रहे हैं।',
    },
    {
      en: 'A delivery van is stopped near that side of the street; your lane ahead remains available.',
      hi: 'उस तरफ एक डिलीवरी वैन खड़ी है; आपके सामने अपनी लेन में आगे बढ़ने की जगह है।',
    },
  ],
  base: {
    src: '/scenes/unfamiliar-blocked-01/base.svg',
    width: 1280,
    height: 720,
    alt: {
      en: 'Rider-eye illustration of a street with a side-street entrance to the right, a large stationary delivery van near the entrance, and another small vehicle farther ahead on the left. No person is shown emerging.',
      hi: 'राइडर की नज़र से सड़क का चित्र: दाईं ओर जोड़ने वाली सड़क का प्रवेश, उसके पास खड़ी बड़ी डिलीवरी वैन और बाईं ओर कुछ दूर एक छोटी गाड़ी। कोई व्यक्ति निकलता नहीं दिखाया गया है।',
    },
  },
  tapRegions: [
    {
      id: 'beside-delivery-van',
      label: {
        en: 'Area beside the left edge of the delivery van',
        hi: 'डिलीवरी वैन के बाएँ किनारे के पास की जगह',
      },
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
      id: 'keep-speed-assume-clear',
      label: {
        en: 'Keep your pace because the van is stationary.',
        hi: 'वैन खड़ी है, इसलिए अपनी रफ़्तार बनाए रखें।',
      },
    },
    {
      id: 'ease-monitor-side-entry',
      label: {
        en: 'Ease off and stay ready to respond near the side entrance.',
        hi: 'रफ़्तार घटाएँ और बगल के प्रवेश के पास प्रतिक्रिया देने के लिए तैयार रहें।',
      },
    },
    {
      id: 'shift-center-to-see',
      label: {
        en: 'Move toward the road centre immediately to see around the van.',
        hi: 'वैन के आगे देखने के लिए तुरंत सड़क के बीच की ओर जाएँ।',
      },
    },
    {
      id: 'wait-for-better-view',
      label: {
        en: 'Hold back and reassess before riding beside the van.',
        hi: 'वैन के पास से जाने से पहले पीछे रहकर स्थिति दोबारा जाँचें।',
      },
    },
  ],
  reasonOptions: [
    {
      id: 'stationary-means-no-movement',
      label: {
        en: 'A stopped vehicle means no one else can enter the lane.',
        hi: 'गाड़ी खड़ी है, इसलिए कोई दूसरा लेन में नहीं आ सकता।',
      },
    },
    {
      id: 'van-limits-side-view',
      label: {
        en: 'The vehicle limits what can be seen from the side entrance.',
        hi: 'वैन के कारण बगल की सड़क के प्रवेश से आने वाली चीज़ें पूरी नहीं दिखतीं।',
      },
    },
    {
      id: 'centre-always-gives-room',
      label: {
        en: 'Riding in the centre always leaves more room to react.',
        hi: 'सड़क के बीच में चलने से हमेशा प्रतिक्रिया की ज़्यादा जगह मिलती है।',
      },
    },
    {
      id: 'no-one-visible-van',
      label: {
        en: 'No one is visible beside the van, so nothing can enter.',
        hi: 'वैन के पास कोई दिख नहीं रहा, इसलिए वहाँ से कुछ नहीं आ सकता।',
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
      en: 'The stopped van partly screens the entrance to the side street. The visibility question concerns that entrance, not whether the van itself is moving.',
      hi: 'खड़ी वैन बगल वाली सड़क के प्रवेश को आंशिक रूप से छिपा रही है। यहाँ सवाल उस प्रवेश के अधूरे दृश्य का है, न कि वैन के खुद चलने का।',
    },
    responses: {
      'keep-speed-assume-clear': {
        en: 'A stationary van does not show what may be moving beyond it. Keeping pace on that assumption may leave too little time to react.',
        hi: 'खड़ी वैन यह नहीं बता सकती कि उसके आगे क्या चल रहा है। सिर्फ इसी अनुमान पर रफ़्तार बनाए रखने से प्रतिक्रिया का समय कम पड़ सकता है।',
      },
      'ease-monitor-side-entry': {
        en: 'Reducing speed and watching the side entry leaves room to revise the approach while part of the view is screened.',
        hi: 'रफ़्तार घटाकर बगल के प्रवेश पर नज़र रखने से दृश्य अधूरा होने पर अपना कदम बदलने की गुंजाइश रहती है।',
      },
      'shift-center-to-see': {
        en: 'Moving laterally for a better view can create another conflict. The drawing does not establish a safe path toward the road centre.',
        hi: 'सिर्फ आगे देखने के लिए लेन में खिसकने से दूसरा टकराव हो सकता है। चित्र में सड़क के बीच की ओर जाने का रास्ता सुरक्षित होने का प्रमाण नहीं है।',
      },
      'wait-for-better-view': {
        en: 'Keeping space and checking again avoids committing to the screened side entrance before its conditions are clearer.',
        hi: 'दूरी बनाकर फिर जाँचने से बगल का प्रवेश स्पष्ट होने से पहले उस हिस्से के पास से गुज़रने का फैसला टलता है।',
      },
    },
    reasons: {
      'stationary-means-no-movement': {
        en: 'Stopping of the van and movement at the entrance are different things. One does not establish the other.',
        hi: 'वैन का खड़ा होना और बगल के प्रवेश पर दूसरी हलचल होना दो अलग बातें हैं। एक से दूसरे का पता नहीं चलता।',
      },
      'van-limits-side-view': {
        en: 'This identifies the visibility gap created by the van at the side-street entrance, without predicting that a person or vehicle will emerge.',
        hi: 'यह वैन के कारण बगल वाली सड़क के प्रवेश पर अधूरे दृश्य को पहचानता है, बिना यह दावा किए कि कोई व्यक्ति या गाड़ी ज़रूर निकलेगी।',
      },
      'centre-always-gives-room': {
        en: 'The road centre is not automatically a safe escape space; moving there requires awareness of the actual traffic and lane layout.',
        hi: 'सड़क का बीच वाला हिस्सा अपने-आप सुरक्षित जगह नहीं होता; वहाँ जाने से पहले असली ट्रैफ़िक और लेन की स्थिति समझनी होती है।',
      },
      'no-one-visible-van': {
        en: 'An unseen area should not be treated as empty merely because no one can currently be seen in it.',
        hi: 'किसी जगह में अभी कोई दिखाई न दे, तो केवल इस आधार पर उस ओझल जगह को खाली नहीं माना जा सकता।',
      },
    },
  },
  rubric: {
    acceptedRegionIds: ['beside-delivery-van'],
    acceptsNone: false,
    acceptedResponseIds: ['ease-monitor-side-entry', 'wait-for-better-view'],
    acceptedReasonIds: ['van-limits-side-view'],
  },
  contentReview: { status: 'provisional' },
};
