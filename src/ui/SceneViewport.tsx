import { useEffect, useRef, useState, type MouseEvent } from 'react';
import type { Continuation, Locale, SceneDefinition } from '../contracts/scene.ts';
import { translate } from '../contracts/scene.ts';
import type { RegionSelection } from '../engine/attempt.ts';
import { clientToNormalized, hitRegion } from '../engine/geometry.ts';
import { cachedPhase, phaseFor, type AssetPhase, type AssetStatus } from './assetStatus.ts';

interface SceneViewportProps {
  readonly scene: SceneDefinition;
  readonly locale: Locale;
  readonly selected: RegionSelection | null;
  readonly canSelect: boolean;
  readonly ending: Continuation | null;
  readonly review: boolean;
  readonly onSelectRegion: (selection: RegionSelection) => void;
  /** Used by PracticeScreen to gate all pre-answer controls on essential artwork. */
  readonly onBaseStatusChange?: (src: string, phase: AssetPhase) => void;
}

function useAsset(src: string) {
  const elementRef = useRef<HTMLImageElement>(null);
  const [status, setStatus] = useState<AssetStatus>({ src, phase: 'loading' });
  const phase = phaseFor(status, src); // A newly supplied src is loading immediately.
  useEffect(() => {
    const img = elementRef.current;
    if (img) setStatus({ src, phase: cachedPhase(img.complete, img.naturalWidth) });
  }, [src]);
  return {
    elementRef, phase,
    onLoad: () => setStatus({ src, phase: 'loaded' }),
    onError: () => setStatus({ src, phase: 'error' }),
  };
}

function AssetNotice({ phase, locale, overlay = false }: { phase: AssetPhase; locale: Locale; overlay?: boolean }) {
  if (phase === 'loaded') return null;
  const message = phase === 'loading'
    ? (overlay ? (locale === 'hi' ? 'आगे का चित्र लोड हो रहा है…' : 'Loading the ending image…')
      : (locale === 'hi' ? 'सड़क का चित्र लोड हो रहा है…' : 'Loading the road scene…'))
    : (overlay ? (locale === 'hi' ? 'आगे का चित्र नहीं खुल सका। इंटरनेट जाँचकर पेज फिर लोड करें।' : 'The ending image failed to load. Check your connection and reload the page.')
      : (locale === 'hi' ? 'सड़क का चित्र नहीं खुल सका। इंटरनेट जाँचकर पेज फिर लोड करें। उत्तर देना अभी बंद है।'
        : 'The road scene could not load. Check your connection and reload the page. Answering is disabled.'));
  return <div className={`bs-image-notice${overlay ? ' bs-image-notice--overlay' : ''}`} role={phase === 'error' ? 'alert' : 'status'}>
    <span aria-hidden="true">{phase === 'error' ? '⚠' : '◌'}</span> {message}
  </div>;
}

function EndingLayer({ image, bounds, locale }: { image: Continuation['layers'][number]['image']; bounds: Continuation['layers'][number]['bounds']; locale: Locale }) {
  const asset = useAsset(image.src);
  return <>
    <img key={image.src} ref={asset.elementRef} className="bs-ending-layer"
      style={{ left: `${bounds.x * 100}%`, top: `${bounds.y * 100}%`, width: `${bounds.width * 100}%`, height: `${bounds.height * 100}%` }}
      src={image.src} alt={translate(image.alt, locale)} draggable={false}
      onLoad={asset.onLoad} onError={asset.onError} />
    <AssetNotice phase={asset.phase} locale={locale} overlay />
  </>;
}

/** Preserve the full 1672×941 image footprint while loading or on failure. */
export function SceneViewport({ scene, locale, selected, canSelect, ending, review, onSelectRegion, onBaseStatusChange }: SceneViewportProps) {
  const asset = useAsset(scene.base.src);
  useEffect(() => { onBaseStatusChange?.(scene.base.src, asset.phase); }, [scene.base.src, asset.phase, onBaseStatusChange]);
  function handleSceneClick(event: MouseEvent<HTMLDivElement>) {
    if (!canSelect || asset.phase !== 'loaded') return;
    const frame = event.currentTarget.getBoundingClientRect();
    const point = clientToNormalized(event.clientX, event.clientY, frame, scene.base.width, scene.base.height);
    if (!point) return;
    const regionId = hitRegion(point, scene.tapRegions);
    if (regionId !== null) onSelectRegion({ kind: 'region', regionId });
  }
  return <div className="bs-scene-wrap">
    <div className={`bs-scene-frame${canSelect && asset.phase === 'loaded' ? ' bs-scene-frame--interactive' : ''}`}
      style={{ aspectRatio: `${scene.base.width} / ${scene.base.height}` }} onClick={handleSceneClick}
      data-testid="scene-frame" aria-busy={asset.phase === 'loading'}>
      <img key={scene.base.src} ref={asset.elementRef} className="bs-scene-image" src={scene.base.src}
        alt={translate(scene.base.alt, locale)} draggable={false} onLoad={asset.onLoad} onError={asset.onError} />
      {canSelect && asset.phase === 'loaded' && scene.tapRegions.map(region =>
        <div key={region.id} aria-hidden="true"
          className={`bs-hit-area${selected?.kind === 'region' && selected.regionId === region.id ? ' bs-hit-area--selected' : ''}`}
          style={{ left: `${region.bounds.x * 100}%`, top: `${region.bounds.y * 100}%`, width: `${region.bounds.width * 100}%`, height: `${region.bounds.height * 100}%` }} />
      )}
      {review && selected?.kind === 'region' && scene.tapRegions.filter(r => r.id === selected.regionId).map(r =>
        <div key={`selected-${r.id}`} className="bs-review-area bs-review-area--selected" aria-hidden="true"
          style={{ left: `${r.bounds.x * 100}%`, top: `${r.bounds.y * 100}%`, width: `${r.bounds.width * 100}%`, height: `${r.bounds.height * 100}%` }}>
          <span>{locale === 'en' ? 'YOUR MARK' : 'आपका चयन'}</span></div>
      )}
      {review && scene.rubric.acceptedRegionIds.map(id => scene.tapRegions.find(r => r.id === id)).filter(r => r != null).map(r =>
        <div key={`target-${r.id}`} className="bs-review-area bs-review-area--target" aria-hidden="true"
          style={{ left: `${r.bounds.x * 100}%`, top: `${r.bounds.y * 100}%`, width: `${r.bounds.width * 100}%`, height: `${r.bounds.height * 100}%` }}>
          <span>{locale === 'en' ? 'LESSON FOCUS' : 'पाठ का लक्ष्य'}</span></div>
      )}
      {ending?.layers.map(layer => <EndingLayer key={layer.id + ':' + layer.image.src} image={layer.image} bounds={layer.bounds} locale={locale} />)}
      <AssetNotice phase={asset.phase} locale={locale} />
      <div className="bs-scene-corners" aria-hidden="true"><span /><span /><span /><span /></div>
    </div>
  </div>;
}
