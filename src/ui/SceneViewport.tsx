import type { MouseEvent } from 'react';
import type { Continuation, Locale, SceneDefinition } from '../contracts/scene.ts';
import { translate } from '../contracts/scene.ts';
import type { RegionSelection } from '../engine/attempt.ts';
import { clientToNormalized, hitRegion } from '../engine/geometry.ts';

interface SceneViewportProps {
  readonly scene: SceneDefinition;
  readonly locale: Locale;
  readonly selected: RegionSelection | null;
  readonly canSelect: boolean;
  readonly ending: Continuation | null;
  readonly onSelectRegion: (selection: RegionSelection) => void;
}

/** The frame uses the natural base-asset ratio; its images are never cropped. */
export function SceneViewport({ scene, locale, selected, canSelect, ending, onSelectRegion }: SceneViewportProps) {
  function handleSceneClick(event: MouseEvent<HTMLDivElement>) {
    if (!canSelect) return;
    const frame = event.currentTarget.getBoundingClientRect();
    const point = clientToNormalized(event.clientX, event.clientY, frame, scene.base.width, scene.base.height);
    if (!point) return; // Ignore clicks in any contain letterbox.
    const regionId = hitRegion(point, scene.tapRegions);
    if (regionId !== null) onSelectRegion({ kind: 'region', regionId });
    // No background-click inference of 'none': that is an explicit button.
  }

  return (
    <div className="bs-scene-wrap">
      <div
        className={`bs-scene-frame${canSelect ? ' bs-scene-frame--interactive' : ''}`}
        style={{ aspectRatio: `${scene.base.width} / ${scene.base.height}` }}
        onClick={handleSceneClick}
        data-testid="scene-frame"
      >
        <img className="bs-scene-image" src={scene.base.src} alt={translate(scene.base.alt, locale)} draggable={false} />
        {canSelect && scene.tapRegions.map((region) => (
          <div
            key={region.id}
            aria-hidden="true"
            className={`bs-hit-area${selected?.kind === 'region' && selected.regionId === region.id ? ' bs-hit-area--selected' : ''}`}
            style={{ left: `${region.bounds.x * 100}%`, top: `${region.bounds.y * 100}%`, width: `${region.bounds.width * 100}%`, height: `${region.bounds.height * 100}%` }}
          />
        ))}
        {ending?.layers.map((layer) => (
          <img
            key={layer.id}
            className="bs-ending-layer"
            style={{ left: `${layer.bounds.x * 100}%`, top: `${layer.bounds.y * 100}%`, width: `${layer.bounds.width * 100}%`, height: `${layer.bounds.height * 100}%` }}
            src={layer.image.src}
            alt={translate(layer.image.alt, locale)}
            draggable={false}
          />
        ))}
        <div className="bs-scene-corners" aria-hidden="true"><span /><span /><span /><span /></div>
      </div>
    </div>
  );
}
