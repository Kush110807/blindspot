import type { SceneDefinition } from '../../contracts/scene.ts';

/** Unfamiliar layout for a later, unscored blocked-view practice assessment. */
export const unfamiliarBlockedScene: SceneDefinition = {
  schemaVersion: 1,
  sceneVersion: '1.2.3-provisional',
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
    src: '/scenes/unfamiliar-blocked-01/base.png',
    width: 1672,
    height: 941,
    alt: {
      en: 'Semi-realistic rider-eye view: a white delivery van partly screens the right-hand side-road approach while its junction mouth and approaching lane remain identifiable; traffic is farther ahead on the left.',
      hi: 'राइडर की नज़र से वास्तविकता के करीब दृश्य: सफेद डिलीवरी वैन दाईं ओर की जोड़ने वाली सड़क का कुछ हिस्सा छिपाती है, पर प्रवेश और मुख्य लेन दिखते हैं; बाईं ओर आगे ट्रैफ़िक मौजूद है।',
    },
  },
  tapRegions: [
    {
      id: 'beside-delivery-van',
      label: {
        en: 'Side-road junction partly concealed beyond the delivery van',
        hi: 'डिलीवरी वैन के पीछे आंशिक रूप से छिपा बगल की सड़क का प्रवेश',
      },
      bounds: { x: 0.742, y: 0.248, width: 0.165, height: 0.279 },
    },
    {
      id: 'far-left-vehicle',
      label: { en: 'Vehicle farther ahead on the left', hi: 'बाईं ओर आगे की गाड़ी' },
      bounds: { x: 0.225, y: 0.265, width: 0.095, height: 0.14 },
    },
    {
      id: 'near-lane-surface',
      label: { en: 'Near section of your lane', hi: 'अपनी लेन का नज़दीकी हिस्सा' },
      bounds: { x: 0.38, y: 0.61, width: 0.18, height: 0.13 },
    },
    {
      id: 'right-side-pavement',
      label: { en: 'Pavement beyond the right curb', hi: 'दाएँ किनारे के आगे का फुटपाथ' },
      bounds: { x: 0.90, y: 0.50, width: 0.09, height: 0.14 },
    },
  ],
  responseOptions: [
    {
      id: 'keep-speed-assume-clear',
      label: {
        en: 'Keep your current pace; your lane ahead appears open.',
        hi: 'सामने अपनी लेन खुली दिखती है, इसलिए अभी की रफ़्तार बनाए रखें।',
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
        en: 'Edge toward the centre of your lane for a wider view past the van.',
        hi: 'वैन के आगे बेहतर देखने के लिए अपनी लेन के बीच की ओर थोड़ा खिसकें।',
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
      id: 'stationary-van-focus-ahead',
      label: {
        en: 'The van is stopped, so the main thing to watch is the lane straight ahead.',
        hi: 'वैन खड़ी है, इसलिए सबसे ज़्यादा ध्यान सीधे सामने की लेन पर देना चाहिए।',
      },
    },
    {
      id: 'van-limits-side-view',
      label: {
        en: 'The van interrupts the sightline into the side-street entrance.',
        hi: 'वैन के कारण बगल वाली सड़क के प्रवेश का पूरा दृश्य नहीं मिलता।',
      },
    },
    {
      id: 'centre-improves-sightline',
      label: {
        en: 'A position closer to my lane centre could help me see farther past the van.',
        hi: 'अपनी लेन के बीच के पास चलने से वैन के आगे कुछ ज़्यादा दिखाई दे सकता है।',
      },
    },
    {
      id: 'no-one-visible-van',
      label: {
        en: 'I have not seen any cross-traffic yet, so the side street is probably quiet.',
        hi: 'अभी तक बगल की सड़क से कोई गाड़ी नहीं दिखी, इसलिए शायद वहाँ कम आवाजाही है।',
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
        en: 'An open lane directly ahead does not establish that the partly screened side entrance is clear. Continuing at the same pace without accounting for that view can reduce time to respond to something entering from the side.',
        hi: 'सीधे सामने लेन खुली दिखने से यह साबित नहीं होता कि आंशिक रूप से छिपी बगल की सड़क भी साफ़ है। उस अधूरे दृश्य को ध्यान में रखे बिना वही रफ़्तार बनाए रखने से बगल से आने वाली किसी चीज़ पर प्रतिक्रिया के लिए समय कम पड़ सकता है।',
      },
      'ease-monitor-side-entry': {
        en: 'Reducing speed and watching the side entry leaves room to revise the approach while part of the view is screened.',
        hi: 'रफ़्तार घटाकर बगल के प्रवेश पर नज़र रखने से दृश्य अधूरा होने पर अपना कदम बदलने की गुंजाइश रहती है।',
      },
      'shift-center-to-see': {
        en: 'Changing position within the lane might reveal more of the entrance, but it can also change available space near other traffic. This illustration does not establish that a lateral move is appropriate; visibility, lane position and surrounding movement all need checking.',
        hi: 'अपनी लेन में थोड़ा खिसकने से प्रवेश कुछ अधिक दिख सकता है, लेकिन दूसरी गाड़ियों के पास उपलब्ध जगह भी बदल सकती है। इस चित्र से यह तय नहीं होता कि ऐसा कदम उचित है; दृश्य, लेन में स्थिति और आसपास की आवाजाही सब देखनी होगी।',
      },
      'wait-for-better-view': {
        en: 'Keeping space and checking again avoids committing to the screened side entrance before its conditions are clearer.',
        hi: 'दूरी बनाकर फिर जाँचने से बगल का प्रवेश स्पष्ट होने से पहले उस हिस्से के पास से गुज़रने का फैसला टलता है।',
      },
    },
    reasons: {
      'stationary-van-focus-ahead': {
        en: 'The van being stationary may matter for its own movement, but it does not answer whether a person or vehicle could approach through the screened entrance. Watching only straight ahead leaves that uncertainty unresolved.',
        hi: 'वैन का खड़ा होना उसकी अपनी हलचल के लिए मायने रखता है, लेकिन उससे यह नहीं पता चलता कि छिपे प्रवेश से कोई व्यक्ति या गाड़ी आ सकती है या नहीं। केवल सीधे सामने देखने से यह अनिश्चितता बनी रहती है।',
      },
      'van-limits-side-view': {
        en: 'This identifies the visibility gap created by the van at the side-street entrance, without predicting that a person or vehicle will emerge.',
        hi: 'यह वैन के कारण बगल वाली सड़क के प्रवेश पर अधूरे दृश्य को पहचानता है, बिना यह दावा किए कि कोई व्यक्ति या गाड़ी ज़रूर निकलेगी।',
      },
      'centre-improves-sightline': {
        en: 'Moving slightly within the lane might improve the angle of view, but that alone does not address how to approach a partly hidden entrance. A lateral move needs its own space-and-traffic check; it is not evidence that the entrance is clear.',
        hi: 'अपनी लेन में थोड़ा खिसकने से देखने का कोण बेहतर हो सकता है, लेकिन सिर्फ इससे आंशिक रूप से छिपे प्रवेश के पास कैसे बढ़ना है, यह तय नहीं होता। बगल में खिसकने से पहले जगह और ट्रैफ़िक भी जाँचना ज़रूरी है; इससे प्रवेश साफ़ होने का प्रमाण नहीं मिलता।',
      },
      'no-one-visible-van': {
        en: 'Not seeing cross-traffic yet is limited evidence when the van screens part of the entrance; a quiet-looking moment is not confirmation that the side street is empty.',
        hi: 'अभी बगल से कोई गाड़ी न दिखना पर्याप्त जानकारी नहीं है, क्योंकि वैन प्रवेश का कुछ हिस्सा छिपा रही है। कुछ पल शांति दिखने से सड़क खाली होने की पुष्टि नहीं होती।',
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
