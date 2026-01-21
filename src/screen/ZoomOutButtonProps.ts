import type { ScreenSize } from './ScreenSize';
import type { ViewportState } from './ViewportState';

export interface ZoomOutButtonProps {
    screenSize: ScreenSize;
    setViewport: (state: ViewportState) => void;
}
