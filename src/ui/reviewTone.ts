import type { LessonDisposition } from '../integration/lessonPresentation.ts';

/** Presentation tone only. Never interprets provisional content as validated scoring. */
export type ReviewTone = LessonDisposition | 'mixed';
export function summarizeReviewTone(
  recognition: LessonDisposition, response: LessonDisposition, reason: LessonDisposition,
): ReviewTone {
  const parts = [recognition, response, reason];
  if (parts.every((part) => part === 'supported')) return 'supported';
  if (parts.some((part) => part === 'supported') ||
      (parts.includes('conditional') && parts.includes('reconsider'))) return 'mixed';
  return parts.includes('conditional') ? 'conditional' : 'reconsider';
}
