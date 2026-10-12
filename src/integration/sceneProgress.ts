import type { Locale } from '../contracts/scene.ts';

/** The accepted prototype has exactly three scenes in this sequence. */
export const SCENE_ORDER = ['bus-training-01', 'unfamiliar-blocked-01', 'matched-clear-01'] as const;
export function sceneProgressLabel(sceneId: string, locale: Locale): string {
  const ordinal = SCENE_ORDER.findIndex(id => id === sceneId) + 1;
  if (!ordinal) return locale === 'hi' ? 'अभ्यास दृश्य' : 'Practice scene';
  return locale === 'hi' ? `दृश्य ${ordinal} (कुल ${SCENE_ORDER.length})` : `Scene ${ordinal} of ${SCENE_ORDER.length}`;
}
