import { useState, useCallback, useEffect } from 'react';
import type { ViewportState } from './ViewportState';
import type { ScreenSize } from './ScreenSize';
import type { Rect } from './Rect';

export interface ScreenImage {
    url: string;
    area: Rect;
}

export const useScreenImages = (viewport: ViewportState, screenSize: ScreenSize) => {
    const [images, setImages] = useState<ScreenImage[]>([]);

    const fetchCapture = useCallback(async () => {
        const visibleX = -viewport.u / viewport.scale;
        const visibleY = -viewport.v / viewport.scale;
        const visibleW = window.innerWidth / viewport.scale;
        const visibleH = window.innerHeight / viewport.scale;

        const x = Math.round(Math.max(0, visibleX));
        const y = Math.round(Math.max(0, visibleY));
        const w = Math.round(Math.min(screenSize.width - x, visibleW));
        const h = Math.round(Math.min(screenSize.height - y, visibleH));

        if (w <= 0 || h <= 0) return;

        try {
            const response = await fetch(`/capture?area=${x},${y},${w},${h}`);
            if (!response.ok || response.status === 204) return;

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            setImages((prev) => {
                const newImage: ScreenImage = { url, area: { x, y, w, h } };
                const newImages = [...prev, newImage];
                return newImages.length > 3 ? newImages.slice(newImages.length - 3) : newImages;
            });
        } catch (error) {
            console.error(error);
        }
    }, [viewport, screenSize]);

    useEffect(() => {
        const timer = setTimeout(fetchCapture, 100);
        return () => clearTimeout(timer);
    }, [fetchCapture]);

    return { images, fetchCapture };
};
