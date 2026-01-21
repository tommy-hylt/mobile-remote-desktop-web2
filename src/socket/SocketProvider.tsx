import { useEffect, useState, type ReactNode } from 'react';
import { SocketClient } from './SocketClient';
import { SocketContext } from './SocketContext';

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket] = useState(() => new SocketClient());

  useEffect(() => {
    socket.connect();
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
