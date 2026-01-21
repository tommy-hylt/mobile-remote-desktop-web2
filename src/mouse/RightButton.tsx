import './RightButton.css';
import { uuid } from '../socket/uuid';
import { useFetch } from '../socket/useFetch';

interface RightButtonProps {
  x: number;
  y: number;
}

export const RightButton = ({ x, y }: RightButtonProps) => {
  const fetch = useFetch();

  return (
    <div
      className="mouse-RightButton"
      style={{ left: x, top: y }}
      onPointerDown={(e) => {
        e.stopPropagation();
        fetch({
          id: uuid(),
          method: 'POST /mouse/right/down',
          params: {},
        });
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        fetch({
          id: uuid(),
          method: 'POST /mouse/right/up',
          params: {},
        });
      }}
    >
      R
    </div>
  );
};
