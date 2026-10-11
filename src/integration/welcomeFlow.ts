/** Welcome UI state is ephemeral. It never becomes an AttemptState or a saved record. */
export type WelcomePreview = 'unopened' | 'choices' | 'no-one' | 'pedestrian';
export interface WelcomeFlow { readonly entered: boolean; readonly preview: WelcomePreview }
export const INITIAL_WELCOME_FLOW: WelcomeFlow = { entered: false, preview: 'unopened' };
export type WelcomeAction = { readonly type: 'explore' | 'no-one' | 'pedestrian' | 'start' };
export function welcomeReducer(flow: WelcomeFlow, action: WelcomeAction): WelcomeFlow {
  if (action.type === 'start') return flow.entered ? flow : { ...flow, entered: true };
  if (flow.entered) return flow;
  if (action.type === 'explore') return flow.preview === 'unopened' ? { ...flow, preview: 'choices' } : flow;
  if (flow.preview === 'unopened') return flow;
  if (action.type === 'no-one' || action.type === 'pedestrian') return { ...flow, preview: action.type };
  return flow;
}
