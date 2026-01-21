import { useCallback } from 'react';
import type { Rect } from './Rect';
import { uuid } from '../socket/uuid';
import { useSocket } from '../socket/useSocket';
import { matchResponse } from '../socket/matchResponse';

interface CaptureParams {
  area: string;
  last_hash?: string;
}

interface CaptureData {
  next_hash?: string;
  date?: string;
}

export interface CaptureResult {
  url: string;
  hash: string | null;
  time: number;
}

export const useFetchCapture = () => {
  const socket = useSocket();

  return useCallback(
    async (
      area: Rect,
      signal: AbortSignal,
      lastHash: string | null,
    ): Promise<CaptureResult | null> => {
      const { x, y, w, h } = area;
      const id = uuid();
      const params: CaptureParams = { area: `${x},${y},${w},${h}` };
      if (lastHash) params.last_hash = lastHash;

      const request = {
        id,
        method: 'GET /capture',
        params,
      };

      return new Promise<CaptureResult | null>((resolve) => {
        let jsonReceived = false;
        let nextHash: string | null = null;
        let time = Date.now();

        const respond = (msg: unknown) => {
          if (signal.aborted) {
            resolve(null);
            return true;
          }

          if (msg instanceof Blob) {
            if (jsonReceived) {
              const url = URL.createObjectURL(msg);
              resolve({ url, hash: nextHash, time });
              return true;
            }
            return false;
          }

          if (matchResponse<CaptureData>(msg, id)) {
            if (msg.status === 204) {
              resolve(null);
              return true;
            }
            if (msg.status === 200) {
              jsonReceived = true;
              if (msg.data?.next_hash) nextHash = msg.data.next_hash;
              if (msg.data?.date) time = Date.parse(msg.data.date);
              return false;
            }
            resolve(null);
            return true;
          }

          return false;
        };

        socket.fetch(request, respond);
      });
    },
    [socket],
  );
};
