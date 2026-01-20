import { useState, useRef, useEffect, useCallback } from 'react';
import type { Rect } from './Rect';
import type { ScreenImage } from './ScreenImage';
import type { RequestItem, QueuingItem, FiringItem, EndedItem } from './RequestItem';

export const useCaptureManager = (screenSize: { width: number; height: number }) => {
    const [lastImage, setLastImage] = useState<ScreenImage | null>(null);
    const itemsRef = useRef<RequestItem[]>([]);
    const latestHashRef = useRef<string | null>(null);

    const updateItems = (callback: (items: RequestItem[]) => RequestItem[]) => {
        itemsRef.current = callback(itemsRef.current);
    };

    const handleSuccess = useCallback((url: string, area: Rect, hash: string | null) => {
        setLastImage({ url, area, hash });
    }, []);

    const executeFetch = async (item: FiringItem, area: Rect) => {
        const { x, y, w, h } = area;

        if (w <= 0 || h <= 0) {
            updateItems(prev => prev.filter(i => i !== item));
            return;
        }

        try {
            const headers: HeadersInit = latestHashRef.current ? { 'Last-Hash': latestHashRef.current } : {};
            const response = await fetch(`/capture?area=${x},${y},${w},${h}`, {
                headers,
                signal: item.controller.signal
            });

            const duration = Date.now() - item.time;

            if (response.status === 204 || !response.ok) {
                updateItems(prev => prev.map(i => i === item ? { status: 'ended', time: item.time, duration } as EndedItem : i));
                return;
            }

            const nextHash = response.headers.get('Next-Hash');
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            latestHashRef.current = nextHash;
            handleSuccess(url, area, nextHash);

            updateItems(prev => prev.map(i => i === item ? { status: 'ended', time: item.time, duration } as EndedItem : i));

        } catch (error) {
            if (error instanceof Error && error.name !== 'AbortError') {
                updateItems(prev => prev.map(i => i === item ? { status: 'ended', time: item.time, duration: 3000 } as EndedItem : i));
                console.error(error);
            }
        }
    };

    const enqueue = useCallback((area: Rect) => {
        updateItems(items => {
            const others = items.filter(i => i.status !== 'queuing');
            const newItem: QueuingItem = { status: 'queuing', area, time: Date.now() };
            return [...others, newItem];
        });
    }, []);

    useEffect(() => {
        const tick = () => {
            const now = Date.now();
            const items = itemsRef.current;

            items.forEach(item => {
                if (item.status === 'firing' && now - item.time > 180000) {
                    item.controller.abort();
                    updateItems(prev => prev.map(i => i === item ? { status: 'ended', time: item.time, duration: 180000 } as EndedItem : i));
                }
            });

            let lastFire = 0;
            items.forEach(i => {
                if ((i.status === 'firing' || i.status === 'ended') && i.time > lastFire) lastFire = i.time;
            });

            const endedItems = items.filter(i => i.status === 'ended') as EndedItem[];
            const recent = endedItems.slice(-5);
            const avgDuration = recent.length > 0
                ? recent.reduce((sum, item) => sum + item.duration, 0) / recent.length
                : 1000;

            const interval = Math.min(Math.max(avgDuration / 2, 0), 30000);
            const queuingItem = items.find(i => i.status === 'queuing') as QueuingItem | undefined;

            if (queuingItem && (now - lastFire > interval)) {
                const controller = new AbortController();
                const firingItem: FiringItem = { status: 'firing', time: now, controller };
                updateItems(prev => prev.map(i => i === queuingItem ? firingItem : i));
                executeFetch(firingItem, queuingItem.area);
            }
        };

        const t = setInterval(tick, 200);
        return () => clearInterval(t);
    }, [screenSize]);

    return { enqueue, lastImage };
};


