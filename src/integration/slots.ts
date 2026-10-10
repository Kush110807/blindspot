/** A-owned integration switch. Empty until B and C deliver reviewed owned-file patches.
 * After integration, A replaces these two values with the exact frozen named exports:
 *   import { scenes as authoredScenes } from '../content/scenes/index.ts';
 *   import { PracticeScreen as AuthoredPracticeScreen } from '../ui/PracticeScreen.tsx';
 *   export const scenes: SceneCatalogue = authoredScenes;
 *   export const PracticeScreen: ComponentType<PracticeScreenProps> | null = AuthoredPracticeScreen;
 * Do not copy scene content or UI into this file.
 */
import type { ComponentType } from 'react';
import type { PracticeScreenProps, SceneCatalogue } from '../contracts/integration.ts';
export const scenes: SceneCatalogue = [];
export const PracticeScreen: ComponentType<PracticeScreenProps> | null = null;
