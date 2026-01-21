import './RightButton.css';

import type { RightButtonProps } from './RightButtonProps';

export const RightButton = ({ x, y }: RightButtonProps) => {
    return (
        <div
            className="mouse-RightButton"
            style={{ left: `${x}px`, top: `${y}px` }}
            onPointerDown={(e) => {
                console.log('RightButton: onPointerDown');
                e.preventDefault();
                e.stopPropagation();
                fetch('/mouse/right/down', { method: 'POST' })
                    .then(() => console.log('RightButton: down sent'))
                    .catch(err => console.error('RightButton: down failed', err));
            }}
            onPointerUp={(e) => {
                console.log('RightButton: onPointerUp');
                e.preventDefault();
                e.stopPropagation();
                fetch('/mouse/right/up', { method: 'POST' })
                    .then(() => console.log('RightButton: up sent'))
                    .catch(err => console.error('RightButton: up failed', err));
            }}
        />
    );
};
