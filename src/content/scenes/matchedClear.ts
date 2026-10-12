import type { SceneDefinition } from '../../contracts/scene.ts';

/** Matched composition to unfamiliar-blocked-01, without the stationary van. */
export const matchedClearScene: SceneDefinition = {
  schemaVersion: 1,
  sceneVersion: '1.2.0-provisional',
  id: 'matched-clear-01',
  purpose: 'assessment',
  condition: 'clear-view-control',
  title: { en: 'Near the side-street entrance', hi: 'बगल वाली सड़क के प्रवेश के पास' },
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
      en: 'A small vehicle is farther ahead on the left; there is room to continue in your lane.',
      hi: 'बाईं ओर कुछ दूरी पर एक छोटी गाड़ी है; आपकी लेन में आगे बढ़ने की जगह है।',
    },
  ],
  base: {
    src: '/scenes/matched-clear-01/base.png',
    width: 1672,
    height: 941,
    alt: {
      en: 'Rider-eye view of a tree-lined Indian street. A narrow road joins from the right beside a boundary wall, with a scooter and other traffic farther ahead.',
      hi: 'राइडर की नज़र से पेड़ों वाली भारतीय सड़क का दृश्य। दाईं ओर चारदीवारी के पास एक छोटी सड़क जुड़ती है और आगे स्कूटर व दूसरी गाड़ियाँ दिखाई देती हैं।',
    },
  },
  tapRegions: [
    {
      id: 'open-right-entry',
      label: { en: 'Area at the right-hand side-street entrance', hi: 'दाईं ओर की जोड़ने वाली सड़क का प्रवेश' },
      bounds: { x: 0.773, y: 0.270, width: 0.167, height: 0.247 },
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
      id: 'speed-up-to-pass-sooner',
      label: {
        en: 'Increase speed a little to get past the visible entrance sooner.',
        hi: 'दिखाई दे रहे प्रवेश के पास से जल्दी निकलने के लिए थोड़ी रफ़्तार बढ़ाएँ।',
      },
    },
    {
      id: 'horn-and-maintain-pace',
      label: {
        en: 'Give a brief horn and maintain your pace past the entrance.',
        hi: 'प्रवेश के पास से गुज़रते समय हल्का हॉर्न दें और अपनी रफ़्तार बनाए रखें।',
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
      id: 'quiet-entrance-less-attention',
      label: {
        en: 'The entrance looks quiet at the moment, so it needs less attention now.',
        hi: 'प्रवेश अभी शांत दिखता है, इसलिए फिलहाल उस पर कम ध्यान देने की ज़रूरत है।',
      },
    },
    {
      id: 'side-street-still-needs-checking',
      label: {
        en: 'Even without a parked vehicle, traffic could turn out of a side street as I approach.',
        hi: 'खड़ी गाड़ी न होने पर भी पास पहुँचने तक बगल की सड़क से कोई गाड़ी मुड़कर आ सकती है।',
      },
    },
    {
      id: 'passing-faster-reduces-exposure',
      label: {
        en: 'Getting past the entrance sooner leaves less chance for cross-traffic to reach me.',
        hi: 'प्रवेश के पास से जल्दी निकलने पर बगल की गाड़ी के मेरे सामने आने की संभावना कम रहती है।',
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
      'speed-up-to-pass-sooner': {
        en: 'Crossing the visible entrance sooner may feel efficient, but speed should follow the actual surrounding traffic and available reaction space. A clear sightline by itself is not a reason to accelerate.',
        hi: 'दिखाई दे रहे प्रवेश के पास से जल्दी निकलना सुविधाजनक लग सकता है, लेकिन रफ़्तार आसपास की गाड़ियों और प्रतिक्रिया के लिए उपलब्ध जगह के अनुसार होनी चाहिए। सिर्फ साफ़ दृश्य रफ़्तार बढ़ाने का कारण नहीं है।',
      },
      'horn-and-maintain-pace': {
        en: 'A brief horn may draw attention, but it does not replace checking the side entrance as traffic changes. In this scene, maintaining pace can be reasonable only with continued observation and enough space to respond, not on the horn alone.',
        hi: 'हल्का हॉर्न किसी का ध्यान खींच सकता है, लेकिन बदलते ट्रैफ़िक में बगल के प्रवेश को देखते रहने की जगह नहीं ले सकता। यहाँ रफ़्तार बनाए रखना तभी उचित हो सकता है जब नज़र रखी जाए और प्रतिक्रिया की पर्याप्त जगह हो, सिर्फ हॉर्न के भरोसे नहीं।',
      },
    },
    reasons: {
      'open-view-still-scan': {
        en: 'This separates recognising a visible entrance from remaining observant; no relevant blocked region is not the same as no possible hazard.',
        hi: 'यह दिखाई दे रहे प्रवेश को पहचानने और सतर्क बने रहने में अंतर करता है; “कोई संबंधित ओझल हिस्सा नहीं” का मतलब “कोई जोखिम नहीं” नहीं है।',
      },
      'quiet-entrance-less-attention': {
        en: 'A quiet-looking entrance is not a guarantee that a person or vehicle will not approach as you get closer. Its being visible still allows—and calls for—ongoing observation.',
        hi: 'अभी शांत दिखने वाला प्रवेश यह गारंटी नहीं देता कि पास पहुँचने तक कोई व्यक्ति या गाड़ी नहीं आएगी। प्रवेश दिखाई देता है, इसलिए बदलती स्थिति पर नज़र रखना संभव भी है और ज़रूरी भी।',
      },
      'side-street-still-needs-checking': {
        en: 'This is a defensible reason to continue monitoring: an entrance can remain visible while another road user later turns into view. It does not require labelling the entrance as a blocked region.',
        hi: 'इस कारण से प्रवेश पर नज़र बनाए रखना उचित है: प्रवेश दिखने के बावजूद बाद में कोई गाड़ी वहाँ से मुड़कर आ सकती है। इसका मतलब प्रवेश को ओझल हिस्सा मानना नहीं है।',
      },
      'passing-faster-reduces-exposure': {
        en: 'Spending less time near the entrance does not necessarily reduce conflict risk: increasing speed can leave less time to notice and respond to turning traffic. The visible conditions do not support a faster pass by default.',
        hi: 'प्रवेश के पास कम समय बिताने से जोखिम ज़रूरी नहीं कि घटे: रफ़्तार बढ़ाने पर मुड़ती गाड़ियों को देखने और प्रतिक्रिया देने के लिए समय कम हो सकता है। इस दृश्य में अपने-आप तेज़ निकलने का आधार नहीं है।',
      },
    },
  },
  rubric: {
    acceptedRegionIds: [],
    acceptsNone: true,
    acceptedResponseIds: ['scan-controllable-pace', 'ease-and-check'],
    acceptedReasonIds: ['open-view-still-scan', 'side-street-still-needs-checking'],
  },
  contentReview: { status: 'provisional' },
};
