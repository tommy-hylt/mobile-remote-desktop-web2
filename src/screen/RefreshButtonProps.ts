import type { Rect } from './Rect';
export interface RefreshButtonProps {
    fire: (area: Rect) => void;
    area: Rect;
    loading: number;
}
