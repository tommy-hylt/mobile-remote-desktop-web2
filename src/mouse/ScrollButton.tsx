import { useRef } from 'react';
import { uuid } from '../socket/uuid';
import './ScrollButton.css';
import { useFetch } from '../socket/useFetch';

interface ScrollButtonProps {
  x: number;
  y: number;
}

export const ScrollButton = ({ x, y }: ScrollButtonProps) => {
  const scrollStartRef = useRef<number | null>(null);
  const fetch = useFetch();

  return (
    <div
      className="mouse-ScrollButton"
      style={{ left: `${x}px`, top: `${y}px` }}
      onTouchStart={(e) => {
        e.stopPropagation();
        const t = e.touches[0];
        scrollStartRef.current = t.clientY;
      }}
      onTouchMove={(e) => {
        e.stopPropagation();
        if (scrollStartRef.current === null) return;
        const t = e.touches[0];
        const dy = t.clientY - scrollStartRef.current;

        if (Math.abs(dy) > 10) {
          fetch({
            id: uuid(),
            method: 'POST /mouse/scroll',
            params: { x: 0, y: Math.round(dy * -2) },
          });
          scrollStartRef.current = t.clientY;
        }
      }}
      onTouchEnd={(e) => {
        e.stopPropagation();
        scrollStartRef.current = null;
      }}
    />
  );
};
