import type { ViewportState } from '../screen/ViewportState';

export interface CursorProps {
    x: number;
    y: number;
    cursorPos: { x: number, y: number };
    viewport: ViewportState;
    setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
    setCursorPos: React.Dispatch<React.SetStateAction<{ x: number, y: number }>>;
}
