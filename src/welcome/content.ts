import type { Locale } from '../contracts/scene.ts';

type Step = { readonly number: string; readonly title: string; readonly detail: string };
type Scope = { readonly title: string; readonly detail: string };
type Roadmap = { readonly title: string; readonly detail: string };
interface WelcomeCopy {
  readonly eyebrow: string; readonly brandSub: string; readonly heroLine1: string; readonly heroLine2: string;
  readonly description: string; readonly begin: string; readonly support: string; readonly heroAlt: string;
  readonly principleTitle: string; readonly principleTag: string; readonly explore: string;
  readonly nobody: string; readonly pedestrian: string; readonly principleExplanation: string;
  readonly stepTitle: string; readonly steps: readonly Step[];
  readonly scopeTitle: string; readonly scope: readonly Scope[]; readonly limits: string;
  readonly roadmapTitle: string; readonly roadmap: readonly Roadmap[];
  readonly closingTitle: string; readonly provisional: string; readonly navToPractice: string;
}
export const welcomeCopy: Record<Locale, WelcomeCopy> = {
  en: {
    eyebrow: 'Road-safety learning for two-wheeler riders', brandSub: 'Look beyond what is visible',
    heroLine1: 'The road looks clear.', heroLine2: 'What can’t you see?',
    description: 'BlindSpot helps you practise decisions around blocked visibility. Identify the hidden area, choose your response, and understand why a lucky ending doesn’t necessarily justify the choice.',
    begin: 'Begin the 3-scene practice', support: 'English / हिन्दी · Browser-based prototype · No sign-up',
    heroAlt: 'Rider-eye road view: a parked red-and-white bus partly hides the roadside, while an opposing white car approaches.',
    principleTitle: 'One view. Two possible endings.', principleTag: 'Preview of the training principle',
    explore: 'Explore the example', nobody: 'Nobody emerges', pedestrian: 'A pedestrian emerges',
    principleExplanation: 'The visible evidence was the same. The ending changed. BlindSpot asks you to judge the decision using what the rider could know beforehand.',
    stepTitle: 'How practice works', steps: [
      {number:'01',title:'Notice',detail:'Inspect the scene and select an area with blocked visibility, or choose none when appropriate.'},
      {number:'02',title:'Decide',detail:'Choose your response and main reason. Lock the decision before seeing the outcome.'},
      {number:'03',title:'Reconsider',detail:'Review separate feedback on what you noticed, your response and your reason, then apply the principle in an unfamiliar scene.'},
    ],
    scopeTitle: 'Three scenes. One principle to carry forward.', scope: [
      {title:'Parked-bus training',detail:'One blocked view, followed by two possible endings to test outcome bias.'},
      {title:'An unfamiliar road layout',detail:'Practise responding when a different road feature interrupts visibility.'},
      {title:'A visibility comparison',detail:'Decide where an obstruction is relevant—and where it is not.'},
    ],
    limits: 'This prototype demonstrates the learning interaction. It has not demonstrated improved on-road behaviour or reduced crashes.',
    roadmapTitle: 'From three scenes to a tested training tool.', roadmap: [
      {title:'CURRENT PROTOTYPE',detail:'Three scenes, English/Hindi choices, paired training endings and criterion-specific corrective feedback.'},
      {title:'PLANNED VALIDATION',detail:'Qualified instructor and Hindi-language review; matched unfamiliar assessments; neutral outcome-bias questions; and a comparison study.'},
      {title:'FUTURE PRODUCT',detail:'A reviewed scenario library covering more hazard families, optional progress tracking and instructor tools, informed by evaluation of learning transfer and retention.'},
    ],
    closingTitle:'Practise the decision before the outcome.',
    provisional:'Prototype guidance is provisional and awaits qualified instructor review.',
    navToPractice:'Begin practice',
  },
  hi: {
    eyebrow:'दोपहिया वाहन चालकों के लिए सड़क-सुरक्षा अभ्यास',brandSub:'जो दिख नहीं रहा, उस पर भी ध्यान दें',
    heroLine1:'सड़क साफ़ दिख रही है।',heroLine2:'क्या आपकी नज़र से छिपा है?',
    description:'BlindSpot आपको ऐसे फ़ैसलों का अभ्यास कराता है जहाँ पूरा रास्ता दिखाई नहीं देता। छिपे हिस्से को पहचानें, अपना कदम चुनें और समझें कि बिना किसी घटना के गुज़र जाना उस फ़ैसले के सही होने का प्रमाण क्यों नहीं है।',
    begin:'तीन दृश्यों का अभ्यास शुरू करें',support:'English / हिन्दी · ब्राउज़र पर प्रोटोटाइप · साइन-अप नहीं',
    heroAlt:'दोपहिया चालक की नज़र से सड़क: लाल-सफ़ेद खड़ी बस के आगे का किनारा छिपा है और दूसरी दिशा से सफ़ेद कार आ रही है।',
    principleTitle:'एक ही दृश्य। दो संभावित अंत।',principleTag:'सीखने के सिद्धांत का पूर्वावलोकन',
    explore:'उदाहरण देखें',nobody:'कोई सामने नहीं आता',pedestrian:'एक पैदल यात्री सामने आता है',
    principleExplanation:'शुरुआत में दिखाई देने वाली जानकारी एक ही थी। बस अंत बदल गया। BlindSpot में फ़ैसला उस आधार पर परखा जाता है जो चालक पहले जान सकता था।',
    stepTitle:'अभ्यास कैसे होता है',steps:[
      {number:'01',title:'पहचानें',detail:'दृश्य देखें और जहाँ रास्ता छिपा है वह हिस्सा चुनें; ज़रूरत हो तो “कोई नहीं” चुनें।'},
      {number:'02',title:'फ़ैसला करें',detail:'अपना कदम और मुख्य कारण चुनें। नतीजा देखने से पहले फ़ैसले को लॉक करें।'},
      {number:'03',title:'दोबारा सोचें',detail:'आपने क्या देखा, क्या किया और क्यों किया—इन तीनों पर अलग प्रतिक्रिया देखें, फिर नए दृश्य में वही सिद्धांत अपनाएँ।'},
    ],
    scopeTitle:'तीन दृश्य। एक उपयोगी सिद्धांत।',scope:[
      {title:'खड़ी बस के पास अभ्यास',detail:'शुरू में एक ही छिपा हुआ दृश्य, फिर दो अलग संभावित अंत।'},
      {title:'अपरिचित सड़क का दृश्य',detail:'नई तरह के रास्ते में अधूरे दृश्य के अनुसार फ़ैसला लेने का अभ्यास।'},
      {title:'दिखाई देने और न देने की तुलना',detail:'समझें कि किस जगह पर रुकावट सचमुच मौजूद है और कहाँ नहीं।'},
    ],
    limits:'यह प्रोटोटाइप सीखने की प्रक्रिया दिखाता है। इससे सड़क पर व्यवहार सुधरने या दुर्घटनाएँ घटने का प्रमाण अभी नहीं मिला है।',
    roadmapTitle:'तीन दृश्यों से जाँचे-परखे प्रशिक्षण तक।',roadmap:[
      {title:'वर्तमान प्रोटोटाइप',detail:'तीन दृश्य, अंग्रेज़ी/हिन्दी विकल्प, अभ्यास के दो अंत और पहचान, कदम व कारण पर अलग सुधार-सुझाव।'},
      {title:'प्रस्तावित जाँच',detail:'योग्य प्रशिक्षकों और हिन्दी भाषा-विशेषज्ञों द्वारा समीक्षा; मेल खाते नए आकलन; नतीजे से पक्षपात को जाँचने वाले तटस्थ प्रश्न; और तुलनात्मक अध्ययन।'},
      {title:'भविष्य का उत्पाद',detail:'समीक्षा किए हुए अधिक सड़क-परिस्थितियों के दृश्य, वैकल्पिक प्रगति-सुविधा और प्रशिक्षकों के लिए साधन—सीख का उपयोग व याद रहने की जाँच के आधार पर।'},
    ],
    closingTitle:'नतीजे से पहले फ़ैसले का अभ्यास करें।',
    provisional:'प्रोटोटाइप की सलाह अभी प्रारंभिक है और योग्य प्रशिक्षकों की समीक्षा बाकी है।',
    navToPractice:'अभ्यास शुरू करें',
  }
};
