import { createContext } from 'react';
import { SocketClient } from './SocketClient';

export const SocketContext = createContext<SocketClient | null>(null);
