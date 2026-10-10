import type { NormalizedPoint, NormalizedRect, TapRegion } from '../contracts/scene.ts';

export interface PixelRect { readonly left: number; readonly top: number; readonly width: number; readonly height: number }
/** Geometry for object-fit:contain, including horizontal and vertical letterboxing. */
export function containedImageRect(container: PixelRect, imageWidth: number, imageHeight: number): PixelRect | null {
  if (![container.left, container.top, container.width, container.height, imageWidth, imageHeight].every(Number.isFinite) ||
      container.width <= 0 || container.height <= 0 || imageWidth <= 0 || imageHeight <= 0) return null;
  const scale = Math.min(container.width / imageWidth, container.height / imageHeight);
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  return { left: container.left + (container.width - width) / 2,
    top: container.top + (container.height - height) / 2, width, height };
}
export function clientToNormalized(clientX: number, clientY: number, container: PixelRect,
  imageWidth: number, imageHeight: number): NormalizedPoint | null {
  if (!Number.isFinite(clientX) || !Number.isFinite(clientY)) return null;
  const rect = containedImageRect(container, imageWidth, imageHeight);
  if (!rect || clientX < rect.left || clientX > rect.left + rect.width ||
      clientY < rect.top || clientY > rect.top + rect.height) return null;
  return { x: (clientX - rect.left) / rect.width, y: (clientY - rect.top) / rect.height };
}
export function hitRegion(point: NormalizedPoint, regions: readonly TapRegion[]): string | null {
  return regions.find(region => {
    const { x, y, width, height } = region.bounds;
    return point.x >= x && point.x <= x + width && point.y >= y && point.y <= y + height;
  })?.id ?? null;
}
/** For accessible overlays, correctly align a normalized region within letterboxed image. */
export function regionToClientRect(bounds: NormalizedRect, container: PixelRect,
  imageWidth: number, imageHeight: number): PixelRect | null {
  const displayed = containedImageRect(container, imageWidth, imageHeight);
  if (!displayed) return null;
  return { left: displayed.left + bounds.x * displayed.width,
    top: displayed.top + bounds.y * displayed.height,
    width: bounds.width * displayed.width, height: bounds.height * displayed.height };
}
