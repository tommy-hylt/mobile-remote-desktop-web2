import { useRef } from 'react';
import type { ScreenSize } from './ScreenSize';
import type { ViewportState } from './ViewportState';
import { useScreenImages } from './useScreenImages';
import { useTouchZoom } from './useTouchZoom';
import './Screen.css';

interface ScreenProps {
  viewport: ViewportState;
  screenSize: ScreenSize;
  onViewportChange: (viewport: ViewportState) => void;
}

export const Screen = ({ viewport, screenSize, onViewportChange }: ScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { images, fetchCapture } = useScreenImages(viewport, screenSize);

  useTouchZoom(containerRef, viewport, screenSize, onViewportChange);

  if (images.length === 0) {
    return (
      <div ref={containerRef} className="screen-Screen" onClick={() => fetchCapture()}>
        <p>Loading remote screen...</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="screen-Screen"
      onClick={() => fetchCapture()}
      style={{ overflow: 'hidden', position: 'relative', width: '100vw', height: '100dvh' }}
    >
      {images.map((img, index) => {
        const left = img.area.x * viewport.scale + viewport.u;
        const top = img.area.y * viewport.scale + viewport.v;
        const width = img.area.w * viewport.scale;
        const height = img.area.h * viewport.scale;

        return (
          <img
            key={index}
            src={img.url}
            alt={`Remote Screen ${index}`}
            className="image"
            style={{
              position: 'absolute',
              left: `${left}px`,
              top: `${top}px`,
              width: `${width}px`,
              height: `${height}px`,
              pointerEvents: 'none',
              objectFit: 'fill',
            }}
          />
        );
      })}
    </div>
  );
};
