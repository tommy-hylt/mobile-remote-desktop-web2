import { useRef, useEffect, useCallback } from 'react';
import { uuid } from '../socket/uuid';

import './Cursor.css';
import type { ViewportState } from '../screen/ViewportState';
import { useFetch } from '../socket/useFetch';

interface CursorProps {
  x: number;
  y: number;
  cursorPos: { x: number; y: number };
  viewport: ViewportState;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  setCursorPos: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
}

export const Cursor = ({
  x,
  y,
  cursorPos,
  viewport,
  setIsActive,
  setCursorPos,
}: CursorProps) => {
  const fetch = useFetch();
  const lastFetchTimeRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestPosRef = useRef(cursorPos);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    latestPosRef.current = cursorPos;
  }, [cursorPos]);

  const sendMove = useCallback(
    (pos: { x: number; y: number }) => {
      fetch({
        id: uuid(),
        method: 'POST /mouse/move',
        params: { x: Math.round(pos.x), y: Math.round(pos.y) },
      });
      lastFetchTimeRef.current = Date.now();
    },
    [fetch],
  );

  useEffect(() => {
    const now = Date.now();
    const timeSinceLast = now - lastFetchTimeRef.current;

    // Reduced throttling from 1000ms to 50ms for smoother movement
    if (timeSinceLast >= 50) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      sendMove(cursorPos);
    } else if (!timeoutRef.current) {
      const delay = 50 - timeSinceLast;
      timeoutRef.current = setTimeout(() => {
        sendMove(latestPosRef.current);
        timeoutRef.current = null;
      }, delay);
    }
  }, [cursorPos, sendMove]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      className="mouse-Cursor"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        setIsActive((prev: boolean) => !prev);
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        // Capture pointer to ensure we get move events even if cursor goes off element
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
        lastPosRef.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerMove={(e) => {
        e.stopPropagation();
        if (!lastPosRef.current) return;

        const dx = e.clientX - lastPosRef.current.x;
        const dy = e.clientY - lastPosRef.current.y;
        const remoteDx = dx / viewport.scale;
        const remoteDy = dy / viewport.scale;

        setCursorPos((prev: { x: number; y: number }) => {
          const nextX = Math.max(0, prev.x + remoteDx);
          const nextY = Math.max(0, prev.y + remoteDy);
          return { x: nextX, y: nextY };
        });

        lastPosRef.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
          sendMove(latestPosRef.current);
        }
        lastPosRef.current = null;
      }}
      onPointerCancel={(e) => {
        e.stopPropagation();
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        lastPosRef.current = null;
      }}
    />
  );
};
