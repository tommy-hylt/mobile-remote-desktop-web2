import { useState, useCallback, useEffect } from 'react';
import type { ViewportState } from './ViewportState';
import type { ScreenSize } from './ScreenSize';
import type { Rect } from './Rect';

export interface ScreenImage {
    url: string;
    area: Rect;
    hash: string | null;
}

export const useScreenImages = (viewport: ViewportState, screenSize: ScreenSize) => {
    const [images, setImages] = useState<ScreenImage[]>([]);
    const [latestHash, setLatestHash] = useState<string | null>(null);

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
            const headers: HeadersInit = latestHash ? { 'Last-Hash': latestHash } : {};
            const response = await fetch(`/capture?area=${x},${y},${w},${h}`, { headers });

            if (response.status === 204) return;
            if (!response.ok) return;

            const nextHash = response.headers.get('Next-Hash');
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            setLatestHash(nextHash);

            setImages((prev) => {
                const newArea = { x, y, w, h };
                const oldImages = prev.filter((img) => getCoverageRatio(img.area, newArea) < 1);

                const sortedImages = [...oldImages].sort(
                    (a, b) => getCoverageRatio(a.area, newArea) - getCoverageRatio(b.area, newArea));
                const keptImages = oldImages.filter(c => sortedImages.indexOf(c) < 3 - 1);

                const newImage = { url, area: newArea, hash: nextHash };
                return [...keptImages, newImage];
            });
        } catch (error) {
            console.error(error);
        }
    }, [viewport, screenSize, latestHash]);

    useEffect(() => {
        const timer = setInterval(fetchCapture, 1000);
        return () => clearInterval(timer);
    }, [fetchCapture]);

    return { images, fetchCapture };
};

const getCoverageRatio = (subject: Rect, covering: Rect): number => {
    const x = Math.max(subject.x, covering.x);
    const y = Math.max(subject.y, covering.y);
    const w = Math.min(subject.x + subject.w, covering.x + covering.w) - x;
    const h = Math.min(subject.y + subject.h, covering.y + covering.h) - y;

    if (w <= 0 || h <= 0) return 0;

    const intersectionArea = w * h;
    const subjectArea = subject.w * subject.h;

    return subjectArea > 0 ? intersectionArea / subjectArea : 0;
};
