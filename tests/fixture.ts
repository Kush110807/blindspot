import type { SceneDefinition, Translated } from '../src/contracts/scene.ts';
const t = (en: string, hi: string): Translated => ({ en, hi });
/** Tests only. This is not reviewed user-facing instruction or competition content. */
export function fixture(purpose: 'training' | 'assessment' = 'training',
  condition: 'blocked-view' | 'clear-view-control' = 'blocked-view'): SceneDefinition {
  return {
    schemaVersion: 1, sceneVersion: 'fixture-v1', id: 'fixture-only', purpose, condition,
    title: t('Sample', 'नमूना'), prompt: t('Observe', 'देखें'),
    visibleConditions: [t('View ahead', 'आगे का दृश्य')],
    base: { src: '/scenes/fixture/base.svg', width: 1000, height: 600, alt: t('Empty diagram', 'रिक्त चित्र') },
    tapRegions: [{ id: 'left-edge', label: t('Area to the left', 'बाईं ओर का क्षेत्र'), bounds: { x: 0.05, y: 0.2, width: 0.3, height: 0.4 } }],
    responseOptions: [{ id: 'wait', label: t('Wait', 'रुकें') }, { id: 'continue', label: t('Continue', 'आगे बढ़ें') }],
    reasonOptions: [{ id: 'limited-view', label: t('Limited view', 'सीमित दृश्य') }, { id: 'assumption', label: t('Assumption', 'अनुमान') }],
    noneLabel: t('No relevant blocked region', 'कोई संबंधित अवरुद्ध क्षेत्र नहीं'),
    continuations: purpose === 'training' ? [
      { id: 'nothing', title: t('No actor', 'कोई नहीं'), narrative: t('No actor enters', 'कोई नहीं आता'), layers: [] },
      { id: 'actor', title: t('Actor enters', 'व्यक्ति आता है'), narrative: t('Actor enters frame', 'व्यक्ति सामने आता है'), layers: [] }
    ] : [],
    feedback: {
      recognition: t('Examine the view before an outcome.', 'परिणाम से पहले दृश्य देखें।'),
      responses: { wait: t('Reason to wait', 'रुकने का कारण'), continue: t('Reason to continue', 'आगे बढ़ने का कारण') },
      reasons: { 'limited-view': t('View limitation matters', 'दृश्य का अवरोध महत्वपूर्ण है'), assumption: t('An assumption is not proof', 'अनुमान प्रमाण नहीं है') }
    },
    rubric: { acceptedRegionIds: condition === 'blocked-view' ? ['left-edge'] : [],
      acceptsNone: condition === 'clear-view-control', acceptedResponseIds: ['wait'], acceptedReasonIds: ['limited-view'] },
    contentReview: { status: 'provisional' }
  };
}
