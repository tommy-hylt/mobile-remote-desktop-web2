import { useCallback } from 'react';
import { useSocket } from './useSocket';

export const useFetch = () => {
  const socket = useSocket();

  return useCallback(
    (request: unknown, respond?: (msg: unknown) => boolean) => {
      socket.fetch(request, respond);
    },
    [socket],
  );
};
