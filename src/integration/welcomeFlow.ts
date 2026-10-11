/** Welcome state is ephemeral. Practice attempts, records and language remain A-owned. */
export type WelcomePreview = 'unopened' | 'choices' | 'no-one' | 'pedestrian';
export interface WelcomeFlow {
  readonly entered: boolean;
  /** Once practice was entered, subsequent visits to welcome must resume, never restart. */
  readonly started: boolean;
  readonly preview: WelcomePreview;
}
export const INITIAL_WELCOME_FLOW: WelcomeFlow = { entered: false, started: false, preview: 'unopened' };
export type WelcomeAction = { readonly type: 'explore' | 'no-one' | 'pedestrian' | 'start' | 'back' | 'resume' };
export function welcomeReducer(flow: WelcomeFlow, action: WelcomeAction): WelcomeFlow {
  if (action.type === 'start') {
    return flow.started ? flow : { ...flow, entered: true, started: true };
  }
  if (action.type === 'back') {
    return !flow.started || !flow.entered ? flow : { ...flow, entered: false };
  }
  if (action.type === 'resume') {
    return !flow.started || flow.entered ? flow : { ...flow, entered: true };
  }
  if (flow.entered) return flow;
  if (action.type === 'explore') return flow.preview === 'unopened' ? { ...flow, preview: 'choices' } : flow;
  if (flow.preview === 'unopened') return flow;
  if (action.type === 'no-one' || action.type === 'pedestrian') return { ...flow, preview: action.type };
  return flow;
}
