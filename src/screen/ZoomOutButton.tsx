import { MdZoomOutMap } from 'react-icons/md';
import { DraggableButton } from './DraggableButton';
import './ZoomOutButton.css';

import type { ZoomOutButtonProps } from './ZoomOutButtonProps';

export const ZoomOutButton = ({ screenSize, setViewport }: ZoomOutButtonProps) => {
    const handleZoomOut = () => {
        const scaleW = window.innerWidth / screenSize.width;
        const scaleH = window.innerHeight / screenSize.height;
        const scale = Math.min(scaleW, scaleH);

        setViewport({
            u: (window.innerWidth - screenSize.width * scale) / 2,
            v: 0,
            scale,
        });
    };

    return (
        <DraggableButton className="screen-ZoomOutButton" onClick={handleZoomOut} initialX={16} initialY={16}>
            <MdZoomOutMap className="icon" />
        </DraggableButton>
    );
};
