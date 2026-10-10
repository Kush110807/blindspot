/** BlindSpot data contract v1. Changes require integration-owner approval. */
export const SCENE_SCHEMA_VERSION = 1 as const;
export type Locale = 'en' | 'hi';
export type Translated = Readonly<Record<Locale, string>>;

/** IDs are semantic and stable; never infer a response from visual option order. */
export type SceneId = string;
export type RegionId = string;
export type ResponseId = string;
export type ReasonId = string;
export type EndingId = string;
export type FeedbackKey = string;

export type NormalizedPoint = Readonly<{ x: number; y: number }>;
/** All four values are fractions of the natural, *uncropped* scene asset bounds. */
export type NormalizedRect = Readonly<{
  x: number;
  y: number;
  width: number;
  height: number;
}>;

export interface SceneAsset {
  /** A bundled project asset path, e.g. /scenes/bus/base.svg. Not a URL to a service. */
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: Translated;
}
export interface TapRegion {
  readonly id: RegionId;
  /** Neutral location name for keyboard alternatives; must not disclose correctness. */
  readonly label: Translated;
  readonly bounds: NormalizedRect;
}
export interface Choice<Id extends string> {
  readonly id: Id;
  readonly label: Translated;
}
export interface ContinuationLayer {
  readonly id: string;
  readonly image: SceneAsset;
  /** Normalised placement relative to the exact same base-image bounds. */
  readonly bounds: NormalizedRect;
}
export interface Continuation {
  readonly id: EndingId;
  readonly title: Translated;
  readonly narrative: Translated;
  readonly layers: readonly ContinuationLayer[];
}
export interface FeedbackContent {
  /** An explanation of the original visibility conditions; never based on the ending. */
  readonly recognition: Translated;
  /** The displayed fragment is looked up by response ID, not index. */
  readonly responses: Readonly<Record<ResponseId, Translated>>;
  /** The displayed fragment is looked up by reason ID, not index. */
  readonly reasons: Readonly<Record<ReasonId, Translated>>;
  /** Optional independently keyed, reusable observation for the scene. */
  readonly shared?: Readonly<Record<FeedbackKey, Translated>>;
}
export interface SceneRubric {
  /** ID-based criteria; only classify as accepted after verified instructor review. */
  readonly acceptedRegionIds: readonly RegionId[];
  readonly acceptsNone: boolean;
  readonly acceptedResponseIds: readonly ResponseId[];
  readonly acceptedReasonIds: readonly ReasonId[];
}
export type ContentReview =
  | Readonly<{ status: 'provisional' }>
  | Readonly<{ status: 'instructor-reviewed'; reviewerRef: string; reviewedOn: string }>;

export interface SceneDefinition {
  readonly schemaVersion: typeof SCENE_SCHEMA_VERSION;
  readonly sceneVersion: string;
  readonly id: SceneId;
  /** Training shows both continuations; assessment reveals no hints before lock. */
  readonly purpose: 'training' | 'assessment';
  readonly condition: 'blocked-view' | 'clear-view-control';
  readonly title: Translated;
  readonly prompt: Translated;
  /** Only conditions visible or neutrally stated before answering. */
  readonly visibleConditions: readonly Translated[];
  readonly base: SceneAsset;
  readonly tapRegions: readonly TapRegion[];
  readonly responseOptions: readonly Choice<ResponseId>[];
  readonly reasonOptions: readonly Choice<ReasonId>[];
  readonly noneLabel: Translated;
  /** Exactly two for a training scene; empty for an assessment scene. */
  readonly continuations: readonly Continuation[];
  readonly feedback: FeedbackContent;
  readonly rubric: SceneRubric;
  readonly contentReview: ContentReview;
}

export function translate(value: Translated, locale: Locale): string {
  return value[locale];
}

export function areRectBoundsValid(rect: NormalizedRect): boolean {
  return Object.values(rect).every(Number.isFinite) && rect.x >= 0 && rect.y >= 0 &&
    rect.width > 0 && rect.height > 0 && rect.x + rect.width <= 1 && rect.y + rect.height <= 1;
}

function unique(values: readonly string[]): boolean { return new Set(values).size === values.length; }
/** Metadata check, not proof of real instructor qualification or approval. */
export function hasValidInstructorReview(review: ContentReview): boolean {
  if (!review || review.status !== 'instructor-reviewed' ||
      typeof review.reviewerRef !== 'string' || review.reviewerRef.trim().length === 0 ||
      typeof review.reviewedOn !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(review.reviewedOn)) return false;
  const parsed = new Date(`${review.reviewedOn}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === review.reviewedOn;
}
function hasTranslation(value: Translated | undefined): boolean {
  return !!value && typeof value.en === 'string' && value.en.trim().length > 0 &&
    typeof value.hi === 'string' && value.hi.trim().length > 0;
}

/** Asset metadata must describe a bundled image with accessible text in both locales. */
export function isValidSceneAsset(asset: SceneAsset): boolean {
  return !!asset && typeof asset.src === 'string' && asset.src.startsWith('/') &&
    Number.isFinite(asset.width) && asset.width > 0 &&
    Number.isFinite(asset.height) && asset.height > 0 && hasTranslation(asset.alt);
}

/** Content validation for B's scenes. Reports errors; never silently rewrites IDs. */
export function validateScene(scene: SceneDefinition): string[] {
  const errors: string[] = [];
  const regions = scene.tapRegions.map(r => r.id);
  const responses = scene.responseOptions.map(r => r.id);
  const reasons = scene.reasonOptions.map(r => r.id);
  const endings = scene.continuations.map(c => c.id);
  if (scene.schemaVersion !== SCENE_SCHEMA_VERSION) errors.push('Unsupported schema version');
  if (!scene.id.trim() || !scene.sceneVersion.trim()) errors.push('Missing scene ID or version');
  if (!isValidSceneAsset(scene.base)) errors.push('Invalid base asset');
  if (!hasTranslation(scene.title) || !hasTranslation(scene.prompt) || !hasTranslation(scene.noneLabel)) errors.push('Missing UI translation');
  if (scene.visibleConditions.length === 0 || scene.visibleConditions.some(c => !hasTranslation(c))) errors.push('Missing visible conditions');
  if (!unique(regions) || !unique(responses) || !unique(reasons) || !unique(endings)) errors.push('Duplicate ID');
  if (responses.length < 2 || reasons.length < 2) errors.push('Need response and reason choices');
  if (scene.tapRegions.some(r => !r.id.trim() || !areRectBoundsValid(r.bounds) || !hasTranslation(r.label))) errors.push('Invalid tap region');
  if (scene.responseOptions.some(c => !c.id.trim() || !hasTranslation(c.label)) ||
      scene.reasonOptions.some(c => !c.id.trim() || !hasTranslation(c.label))) errors.push('Invalid choice');
  if (scene.condition === 'blocked-view' && scene.tapRegions.length === 0) errors.push('Blocked-view scene requires tap regions');
  if (scene.condition === 'clear-view-control' && !scene.rubric.acceptsNone) errors.push('Clear-view control must accept none');
  if (scene.purpose === 'training' && endings.length !== 2) errors.push('Training must define two continuations');
  if (scene.purpose === 'assessment' && endings.length !== 0) errors.push('Assessment must not contain training continuations');
  if (scene.continuations.some(c => !c.id.trim() || !hasTranslation(c.title) || !hasTranslation(c.narrative) ||
      c.layers.some(l => !l.id.trim() || !areRectBoundsValid(l.bounds) || !isValidSceneAsset(l.image)))) errors.push('Invalid continuation');
  if (scene.contentReview?.status !== 'provisional' && !hasValidInstructorReview(scene.contentReview)) errors.push('Invalid instructor review metadata');
  if (scene.rubric.acceptedRegionIds.some(id => !regions.includes(id)) ||
      scene.rubric.acceptedResponseIds.some(id => !responses.includes(id)) ||
      scene.rubric.acceptedReasonIds.some(id => !reasons.includes(id))) errors.push('Rubric refers to missing ID');
  if (!hasTranslation(scene.feedback.recognition) ||
      responses.some(id => !hasTranslation(scene.feedback.responses[id])) ||
      reasons.some(id => !hasTranslation(scene.feedback.reasons[id]))) errors.push('Missing feedback by stable ID');
  return errors;
}
