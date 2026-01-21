import { useContext } from 'react';
import { SocketContext } from './SocketContext';
import { SocketClient } from './SocketClient';

export const useSocket = (): SocketClient => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
