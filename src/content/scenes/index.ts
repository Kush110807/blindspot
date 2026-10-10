import type { SceneCatalogue } from '../../contracts/integration.ts';
import { busTrainingScene } from './busTraining.ts';
import { unfamiliarBlockedScene } from './unfamiliarBlocked.ts';
import { matchedClearScene } from './matchedClear.ts';

/** Exactly three scenes in the frozen handoff order. A owns progression. */
export const scenes: SceneCatalogue = [
  busTrainingScene,
  unfamiliarBlockedScene,
  matchedClearScene,
];
