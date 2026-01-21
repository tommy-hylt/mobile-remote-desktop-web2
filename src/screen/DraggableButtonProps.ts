import { type ReactNode } from 'react';

export interface DraggableButtonProps {
    onClick: () => void;
    children: ReactNode;
    initialX: number;
    initialY: number;
    className?: string;
}
