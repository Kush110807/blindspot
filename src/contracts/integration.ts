/** M1 B/C integration surface. Types only: no M2 scene, UI, or navigation implementation. */
import type { Locale, ReasonId, RegionId, ResponseId, SceneDefinition } from './scene.ts';
import type { AttemptState, RegionSelection } from '../engine/attempt.ts';
import type { FeedbackParts, ReviewedCriteria } from '../engine/feedback.ts';
import type { StorageStatus } from '../records/localRecords.ts';

/** B exports `scenes` from `src/content/scenes/index.ts` as this exact type. */
export type SceneCatalogue = readonly SceneDefinition[];

/** C exports named `PracticeScreen` from `src/ui/PracticeScreen.tsx`. */
export interface PracticeScreenProps {
  /** Immutable inputs from A. C does not own answer state, persistence or routing. */
  readonly scene: SceneDefinition;
  readonly attempt: AttemptState;
  readonly locale: Locale;
  /** A supplies only when locked; never show in assessment before locking. */
  readonly feedback: FeedbackParts | null;
  /** A supplies null while provisional, regardless of candidate rubric data. */
  readonly reviewedCriteria: ReviewedCriteria | null;
  readonly storageStatus: StorageStatus;
  /** A determines whether navigation is permissible, including last-scene/locked state. */
  readonly canNextScene: boolean;
  /** Intent-only callbacks; A calls engine transitions and handles side effects. */
  readonly onBegin: () => void;
  readonly onSelectRegion: (selection: RegionSelection) => void;
  readonly onSelectResponse: (responseId: ResponseId) => void;
  readonly onSelectReason: (reasonId: ReasonId) => void;
  readonly onLock: () => void;
  readonly onStartReview: () => void;
  readonly onNextEnding: () => void;
  readonly onReplayEndings: () => void;
  /** Explicit reset, not a silent back-navigation unlock. */
  readonly onRestart: () => void;
  readonly onNextScene: () => void;
  readonly onLocaleChange: (locale: Locale) => void;
  /** Navigate to welcome without modifying the active practice session. */
  readonly onBackToWelcome: () => void;
}

/** Optional aliases for selectable view props; B still authors all regions. */
export type PracticeRegionId = RegionId;
