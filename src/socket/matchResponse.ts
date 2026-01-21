export interface SocketResponse<T = unknown> {
  id: string;
  status: number;
  data?: T;
}

export function matchResponse<T = unknown>(
  msg: unknown,
  id: string,
): msg is SocketResponse<T> {
  if (typeof msg !== 'object' || msg === null) return false;
  const m = msg as Record<string, unknown>;
  return (
    m.id === id &&
    typeof m.status === 'number' &&
    (m.data === undefined || typeof m.data === 'object')
  );
}
