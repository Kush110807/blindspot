import type { SceneDefinition } from '../../contracts/scene.ts';

/** Authored example only: initial evidence is identical in both continuations. */
export const busTrainingScene: SceneDefinition = {
  schemaVersion: 1,
  sceneVersion: '1.0.0-provisional',
  id: 'bus-training-01',
  purpose: 'training',
  condition: 'blocked-view',
  title: {
    en: 'The parked bus',
    hi: 'सड़क किनारे खड़ी बस',
  },
  prompt: {
    en: 'Look at the road ahead. Which area needs attention? Choose a response and your main reason before locking.',
    hi: 'सामने की सड़क देखें। किस हिस्से पर ध्यान देना ज़रूरी है? उत्तर लॉक करने से पहले अपना कदम और मुख्य कारण चुनें।',
  },
  visibleConditions: [
    {
      en: 'A bus is stopped on the left side of the road; part of the roadside beyond it is out of view.',
      hi: 'सड़क के बाईं ओर एक बस खड़ी है; उसके आगे सड़क किनारे का कुछ हिस्सा दिखाई नहीं दे रहा।',
    },
    {
      en: 'You have space to ease off progressively; a vehicle in the opposite lane makes overtaking unsuitable here.',
      hi: 'आप धीरे-धीरे रफ़्तार कम कर सकते हैं; सामने से आती गाड़ी के कारण यहाँ ओवरटेक करना उचित नहीं है।',
    },
  ],
  base: {
    src: '/scenes/bus-training-01/base.svg',
    width: 1280,
    height: 720,
    alt: {
      en: 'Illustrated rider-eye road view: a large parked bus on the left, an approaching vehicle in the opposite lane, and the far roadside partly screened by the bus. No pedestrian is visible.',
      hi: 'राइडर की नज़र से बनी सड़क की तस्वीर: बाईं ओर एक बड़ी खड़ी बस, विपरीत लेन में आती गाड़ी और बस के आगे आंशिक रूप से छिपा सड़क किनारा। कोई पैदल यात्री दिखाई नहीं दे रहा।',
    },
  },
  tapRegions: [
    {
      id: 'space-beyond-bus',
      label: {
        en: 'Space beside and beyond the far edge of the bus',
        hi: 'बस के अगले किनारे के पास और उसके आगे की जगह',
      },
      bounds: { x: 0.48, y: 0.39, width: 0.13, height: 0.29 },
    },
    {
      id: 'lane-directly-ahead',
      label: { en: 'Lane directly ahead', hi: 'सीधे सामने की लेन' },
      bounds: { x: 0.43, y: 0.71, width: 0.16, height: 0.13 },
    },
    {
      id: 'opposite-lane-vehicle',
      label: { en: 'Vehicle in the opposite lane', hi: 'विपरीत लेन की गाड़ी' },
      bounds: { x: 0.72, y: 0.49, width: 0.14, height: 0.23 },
    },
    {
      id: 'near-left-pavement',
      label: { en: 'Near-left pavement', hi: 'बाईं ओर पास का फुटपाथ' },
      bounds: { x: 0.03, y: 0.54, width: 0.15, height: 0.27 },
    },
  ],
  responseOptions: [
    {
      id: 'horn-hold-speed',
      label: { en: 'Sound the horn and hold speed.', hi: 'हॉर्न बजाकर वही रफ़्तार बनाए रखें।' },
    },
    {
      id: 'ease-prepare-to-stop',
      label: {
        en: 'Ease off progressively and prepare to stop.',
        hi: 'धीरे-धीरे रफ़्तार घटाएँ और रुकने के लिए तैयार रहें।',
      },
    },
    {
      id: 'brief-slow-then-resume',
      label: {
        en: 'Slow briefly, then resume speed before the view clears.',
        hi: 'थोड़ी देर धीमे होकर, दृश्य साफ़ होने से पहले फिर रफ़्तार बढ़ाएँ।',
      },
    },
    {
      id: 'stay-back-reassess',
      label: {
        en: 'Stay back and reassess before passing the bus.',
        hi: 'बस से पीछे रहकर आगे निकलने से पहले स्थिति दोबारा जाँचें।',
      },
    },
  ],
  reasonOptions: [
    {
      id: 'width-means-safe',
      label: {
        en: 'The road looks wide enough, so passing is safe.',
        hi: 'सड़क काफ़ी चौड़ी दिखती है, इसलिए आगे निकलना सुरक्षित है।',
      },
    },
    {
      id: 'no-one-visible',
      label: {
        en: 'No one is visible right now, so the way must be clear.',
        hi: 'अभी कोई दिखाई नहीं दे रहा, इसलिए रास्ता साफ़ ही होगा।',
      },
    },
    {
      id: 'bus-hides-conflict',
      label: {
        en: 'The bus hides a roadside area where someone could emerge.',
        hi: 'बस सड़क किनारे का हिस्सा छिपा रही है, जहाँ से कोई अचानक सामने आ सकता है।',
      },
    },
    {
      id: 'horn-clears-risk',
      label: {
        en: 'Using the horn removes the risk behind the bus.',
        hi: 'हॉर्न बजाने से बस के पीछे छिपा जोखिम दूर हो जाता है।',
      },
    },
  ],
  noneLabel: {
    en: 'No relevant blocked region',
    hi: 'दृश्य बाधित करने वाला कोई संबंधित हिस्सा नहीं',
  },
  continuations: [
    {
      id: 'no-one-emerges',
      title: { en: 'Ending 1 · Nobody emerges', hi: 'अंत 1 · कोई सामने नहीं आता' },
      narrative: {
        en: 'Nobody appears beside the bus. That outcome does not show that the hidden roadside was clear when you decided. Consider your recorded response and reason using the original view.',
        hi: 'बस के पास से कोई सामने नहीं आता। लेकिन इससे यह साबित नहीं होता कि फैसला लेते समय छिपा सड़क किनारा खाली था। अपने चुने गए कदम और कारण को शुरुआती दृश्य के आधार पर परखें।',
      },
      layers: [],
    },
    {
      id: 'pedestrian-emerges',
      title: { en: 'Ending 2 · A pedestrian emerges', hi: 'अंत 2 · एक पैदल यात्री सामने आता है' },
      narrative: {
        en: 'A pedestrian becomes visible near the bus. This is an illustrated possibility, not a predicted crash. Judge the recorded response against the same information available before either ending.',
        hi: 'बस के पास से एक पैदल यात्री दिखाई देता है। यह केवल एक संभावित स्थिति का चित्र है, किसी दुर्घटना की भविष्यवाणी नहीं। दोनों अंतों से पहले उपलब्ध एक ही जानकारी के आधार पर अपने कदम को परखें।',
      },
      layers: [
        {
          id: 'pedestrian-at-bus-edge',
          image: {
            src: '/scenes/bus-training-01/pedestrian-emerges.svg',
            width: 180,
            height: 270,
            alt: {
              en: 'Non-graphic illustrated pedestrian walking out beside the bus, shown only after the answer is locked.',
              hi: 'बस के पास से निकलता एक चित्रित पैदल यात्री, जो उत्तर लॉक होने के बाद ही दिखता है; कोई दुर्घटना नहीं दिखाई गई है।',
            },
          },
          bounds: { x: 0.495, y: 0.425, width: 0.14, height: 0.375 },
        },
      ],
    },
  ],
  feedback: {
    recognition: {
      en: 'In the original view, the bus screens part of the roadside beyond it. The approaching opposite-lane vehicle is a separate visible constraint; neither outcome tells us what was visible before the decision.',
      hi: 'शुरुआती दृश्य में बस अपने आगे सड़क किनारे के हिस्से को छिपा रही है। सामने से आती गाड़ी एक अलग, दिखाई देने वाली बाधा है; किसी भी अंत से यह नहीं बदलता कि फैसला लेते समय क्या दिख रहा था।',
    },
    responses: {
      'horn-hold-speed': {
        en: 'A horn may alert someone, but it does not restore the missing view. Keeping the same speed depends on an assumption that the hidden area is clear.',
        hi: 'हॉर्न किसी को सचेत कर सकता है, लेकिन उससे छिपा हिस्सा दिखाई नहीं देने लगता। वही रफ़्तार बनाए रखना इस अनुमान पर निर्भर करता है कि ओझल जगह खाली है।',
      },
      'ease-prepare-to-stop': {
        en: 'Easing off progressively and preparing to stop leaves room to respond while visibility is incomplete. Whether and when to stop still depends on the actual road conditions.',
        hi: 'धीरे-धीरे रफ़्तार घटाकर रुकने के लिए तैयार रहने से अधूरा दृश्य होने पर प्रतिक्रिया देने की गुंजाइश रहती है। कब और कहाँ रुकना चाहिए, यह वास्तविक सड़क की स्थिति पर निर्भर करेगा।',
      },
      'brief-slow-then-resume': {
        en: 'A brief reduction does not make the concealed roadside visible. Resuming speed before the view improves can leave the original uncertainty unresolved.',
        hi: 'थोड़ी देर रफ़्तार कम करने से ओझल सड़क किनारा दिखने नहीं लगता। दृश्य साफ़ होने से पहले फिर तेज़ होने पर शुरुआती अनिश्चितता बनी रह सकती है।',
      },
      'stay-back-reassess': {
        en: 'Holding back and checking again avoids committing to a pass while the roadside is screened, especially with a vehicle approaching in the opposite lane.',
        hi: 'पीछे रहकर दोबारा जाँचने से सड़क किनारा छिपा होने पर आगे निकलने का फैसला टलता है, खासकर जब विपरीत लेन से गाड़ी आ रही हो।',
      },
    },
    reasons: {
      'width-means-safe': {
        en: 'Road width alone does not reveal movement beside or ahead of a stopped bus, and the opposite lane is occupied in this scene.',
        hi: 'सिर्फ सड़क की चौड़ाई से खड़ी बस के पास या आगे की हलचल का पता नहीं चलता, और इस दृश्य में विपरीत लेन में गाड़ी भी है।',
      },
      'no-one-visible': {
        en: 'Not seeing a person is different from being able to see an area clearly enough to know whether anyone is there.',
        hi: 'किसी का दिखाई न देना और किसी जगह को इतना साफ़ देख पाना कि वहाँ किसी के होने या न होने का पता चले—दो अलग बातें हैं।',
      },
      'bus-hides-conflict': {
        en: 'This reason identifies the original information gap: something could move into view from the roadside screened by the bus.',
        hi: 'यह कारण शुरुआती दृश्य की कमी को पहचानता है: बस से छिपे सड़क किनारे से कोई सामने आ सकता है।',
      },
      'horn-clears-risk': {
        en: 'A horn cannot guarantee that a person will hear, react or remain outside the rider’s path; visibility still needs to be addressed.',
        hi: 'हॉर्न से यह गारंटी नहीं होती कि कोई उसे सुनेगा, प्रतिक्रिया देगा या रास्ते से दूर रहेगा; अधूरे दृश्य की समस्या बनी रहती है।',
      },
    },
  },
  rubric: {
    acceptedRegionIds: ['space-beyond-bus'],
    acceptsNone: false,
    acceptedResponseIds: ['ease-prepare-to-stop', 'stay-back-reassess'],
    acceptedReasonIds: ['bus-hides-conflict'],
  },
  contentReview: { status: 'provisional' },
};
