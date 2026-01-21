import './LeftButton.css';
import { uuid } from '../socket/uuid';

import { useFetch } from '../socket/useFetch';

interface LeftButtonProps {
  x: number;
  y: number;
}

export const LeftButton = ({ x, y }: LeftButtonProps) => {
  const fetch = useFetch();

  return (
    <div
      className="mouse-LeftButton"
      style={{ left: x, top: y }}
      onPointerDown={(e) => {
        e.stopPropagation();
        fetch({
          id: uuid(),
          method: 'POST /mouse/left/down',
          params: {},
        });
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        fetch({
          id: uuid(),
          method: 'POST /mouse/left/up',
          params: {},
        });
      }}
    >
      L
    </div>
  );
};
