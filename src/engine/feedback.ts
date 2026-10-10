import { translate, type Locale, type SceneDefinition } from '../contracts/scene.ts';
import type { LockedAttempt } from './attempt.ts';

export interface FeedbackParts {
  readonly recognition: string;
  readonly response: string;
  readonly reason: string;
  readonly provisional: boolean;
}
export type ReviewedCriteria = Readonly<{ recognition: boolean; response: boolean; reason: boolean }>;

/** Never use the continuation/ending as evidence about the initial decision. */
export function getFeedback(scene: SceneDefinition, locked: LockedAttempt | null, locale: Locale): FeedbackParts | null {
  if (!locked || locked.sceneId !== scene.id || locked.sceneVersion !== scene.sceneVersion ||
      locked.schemaVersion !== scene.schemaVersion) return null;
  const response = scene.feedback.responses[locked.responseId];
  const reason = scene.feedback.reasons[locked.reasonId];
  if (!response || !reason) return null;
  return {
    recognition: translate(scene.feedback.recognition, locale),
    response: translate(response, locale), reason: translate(reason, locale),
    provisional: scene.contentReview.status === 'provisional'
  };
}
/** No scored/classified learner evaluation until instructor review exists. */
export function getReviewedCriteria(scene: SceneDefinition, locked: LockedAttempt | null): ReviewedCriteria | null {
  if (scene.contentReview.status !== 'instructor-reviewed' || !locked ||
      locked.sceneId !== scene.id || locked.sceneVersion !== scene.sceneVersion ||
      locked.schemaVersion !== scene.schemaVersion) return null;
  return {
    recognition: locked.regionSelection.kind === 'none' ? scene.rubric.acceptsNone :
      scene.rubric.acceptedRegionIds.includes(locked.regionSelection.regionId),
    response: scene.rubric.acceptedResponseIds.includes(locked.responseId),
    reason: scene.rubric.acceptedReasonIds.includes(locked.reasonId)
  };
}
