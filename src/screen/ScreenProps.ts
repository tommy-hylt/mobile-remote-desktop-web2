import type { ScreenSize } from './ScreenSize';
import type { ViewportState } from './ViewportState';

export interface ScreenProps {
    viewport: ViewportState;
    screenSize: ScreenSize;
    setViewport: (viewport: ViewportState) => void;
}
