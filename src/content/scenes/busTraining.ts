import type { SceneDefinition } from '../../contracts/scene.ts';

/** Authored example only: initial evidence is identical in both continuations. */
export const busTrainingScene: SceneDefinition = {
  schemaVersion: 1,
  sceneVersion: '1.2.0-provisional',
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
    src: '/scenes/bus-training-01/base.png',
    width: 1672,
    height: 941,
    alt: {
      en: 'Semi-realistic rider-eye street view: a parked red-and-white bus on the left screens the pavement beyond its front, and a white SUV approaches in the opposite lane. No pedestrian is initially visible.',
      hi: 'राइडर की नज़र से सड़क का वास्तविकता के करीब दृश्य: बाईं ओर लाल-सफेद खड़ी बस अपने अगले सिरे के आगे का फुटपाथ छिपाती है और विपरीत लेन में सफेद एसयूवी आती दिखती है। शुरुआत में कोई पैदल यात्री दिखाई नहीं देता।',
    },
  },
  tapRegions: [
    {
      id: 'space-beyond-bus',
      label: {
        en: 'Space beside and beyond the far edge of the bus',
        hi: 'बस के अगले किनारे के पास और उसके आगे की जगह',
      },
      bounds: { x: 0.438, y: 0.285, width: 0.115, height: 0.235 },
    },
    {
      id: 'lane-directly-ahead',
      label: { en: 'Lane directly ahead', hi: 'सीधे सामने की लेन' },
      bounds: { x: 0.47, y: 0.63, width: 0.13, height: 0.14 },
    },
    {
      id: 'opposite-lane-vehicle',
      label: { en: 'Vehicle in the opposite lane', hi: 'विपरीत लेन की गाड़ी' },
      bounds: { x: 0.602, y: 0.313, width: 0.142, height: 0.192 },
    },
    {
      id: 'near-left-pavement',
      label: { en: 'Near-left pavement', hi: 'बाईं ओर पास का फुटपाथ' },
      bounds: { x: 0.01, y: 0.50, width: 0.20, height: 0.15 },
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
            src: '/scenes/bus-training-01/pedestrian-emerges.png',
            width: 1672,
            height: 941,
            alt: {
              en: 'Pedestrian walking from beyond the front of the bus toward the rider’s path; visible only in the locked second ending.',
              hi: 'बस के अगले सिरे के आगे से राइडर के संभावित रास्ते की ओर आता पैदल यात्री, जो उत्तर लॉक होने के बाद दूसरे अंत में ही दिखता है; कोई टक्कर नहीं दिखाई गई है।',
            },
          },
          bounds: { x: 0, y: 0, width: 1, height: 1 },
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
        en: 'If nobody emerges, passing without incident does not prove the hidden roadside was clear when you decided; sounding the horn did not reveal it. If a pedestrian emerges, holding speed can leave less time to respond, even if the horn was heard. The original blocked view—not the ending—makes relying on the horn and unchanged speed a weak choice.',
        hi: 'अगर कोई सामने नहीं आता, तो बिना घटना के निकल जाना यह साबित नहीं करता कि फैसला लेते समय ओझल सड़क किनारा खाली था; हॉर्न से वह हिस्सा दिखाई नहीं दिया। अगर पैदल यात्री सामने आता है, तो वही रफ़्तार बनाए रखने से प्रतिक्रिया के लिए समय कम पड़ सकता है, भले ही उसने हॉर्न सुना हो। फैसला दोनों अंतों से पहले के अधूरे दृश्य पर आधारित होना चाहिए।',
      },
      'ease-prepare-to-stop': {
        en: 'If nobody emerges, easing off was still a response to the limited view, even if no stop proves necessary. If a pedestrian emerges, progressively reducing speed and preparing to stop may leave more time to respond; it cannot guarantee avoiding a conflict. In either ending, the choice addresses the uncertainty visible at the start, with stopping dependent on actual conditions.',
        hi: 'अगर कोई सामने नहीं आता, तब भी रफ़्तार घटाना शुरुआती अधूरे दृश्य के अनुसार सावधानी थी, भले रुकना ज़रूरी न पड़े। अगर पैदल यात्री सामने आता है, तो धीरे-धीरे रफ़्तार घटाने और रुकने के लिए तैयार रहने से प्रतिक्रिया का ज़्यादा समय मिल सकता है; टकराव टलने की गारंटी नहीं है। दोनों अंतों में कब और कहाँ रुकना है, यह वास्तविक स्थिति पर निर्भर करेगा।',
      },
      'brief-slow-then-resume': {
        en: 'If nobody emerges, getting through uneventfully does not show that it was sound to resume speed before the roadside came into view. If a pedestrian emerges, the renewed speed can reduce the time available to respond to that late appearance. In both endings, the brief slowdown alone never resolved the original visibility gap.',
        hi: 'अगर कोई सामने नहीं आता, तब भी बिना घटना के निकलना यह साबित नहीं करता कि सड़क किनारा दिखने से पहले फिर रफ़्तार बढ़ाना उचित था। अगर पैदल यात्री सामने आता है, तो दोबारा बढ़ी रफ़्तार के कारण प्रतिक्रिया के लिए समय कम हो सकता है। दोनों अंतों में थोड़ी देर धीमे चलने से शुरुआती ओझल हिस्सा साफ़ नहीं हुआ था।',
      },
      'stay-back-reassess': {
        en: 'If nobody emerges, staying back still avoids committing to a pass on an unverified view. If a pedestrian emerges, the extra separation may allow more time to notice and respond, but it does not guarantee a safe outcome. In either ending, the screened roadside and opposing traffic are reasons to reassess before passing.',
        hi: 'अगर कोई सामने नहीं आता, तब भी पीछे रहकर जाँचना बिना पुष्टि के आगे निकलने से बचाता है। अगर पैदल यात्री सामने आता है, तो बनी हुई दूरी उसे देखने और प्रतिक्रिया देने के लिए अधिक समय दे सकती है, लेकिन सुरक्षित परिणाम की गारंटी नहीं है। दोनों अंतों में छिपा सड़क किनारा और सामने से आती गाड़ी आगे निकलने से पहले स्थिति दोबारा जाँचने के कारण हैं।',
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
