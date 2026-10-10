/** A-owned integration switch. Reviewed B and C exports connect here.
 * Keep authored data in B-owned files and presentation in C-owned files.
 */
import type { ComponentType } from 'react';
import type { PracticeScreenProps, SceneCatalogue } from '../contracts/integration.ts';
import { scenes as authoredScenes } from '../content/scenes/index.ts';
import { PracticeScreen as AuthoredPracticeScreen } from '../ui/PracticeScreen.tsx';

export const scenes: SceneCatalogue = authoredScenes;
export const PracticeScreen: ComponentType<PracticeScreenProps> = AuthoredPracticeScreen;
