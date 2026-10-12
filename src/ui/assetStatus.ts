/** Image availability is per URL. A status from a previous scene must never unlock a new image. */
export type AssetPhase = 'loading' | 'loaded' | 'error';
export interface AssetStatus { readonly src: string; readonly phase: AssetPhase }
export const phaseFor = (status: AssetStatus, src: string): AssetPhase =>
  status.src === src ? status.phase : 'loading';

/** `complete` also becomes true after a failed fetch; naturalWidth distinguishes success. */
export function cachedPhase(complete: boolean, naturalWidth: number): AssetPhase {
  return !complete ? 'loading' : naturalWidth > 0 ? 'loaded' : 'error';
}
