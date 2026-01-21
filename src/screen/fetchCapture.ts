import type { Rect } from './Rect';

export interface CaptureResult {
  url: string;
  hash: string | null;
  time: number;
}

export const fetchCapture = async (
  area: Rect,
  signal: AbortSignal,
  lastHash: string | null,
): Promise<CaptureResult | null> => {
  const { x, y, w, h } = area;
  const headers: Record<string, string> = {};
  if (lastHash) headers['Last-Hash'] = lastHash;

  try {
    const res = await fetch(`/capture?area=${x},${y},${w},${h}`, {
      headers,
      signal,
    });

    if (res.status === 204 || !res.ok) {
      return null;
    }

    const hash = res.headers.get('Next-Hash');
    const dateStr = res.headers.get('Date');
    const time = dateStr ? Date.parse(dateStr) : Date.now();
    const blob = await res.blob();

    return { url: URL.createObjectURL(blob), hash, time };
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw e;
    }
    return null;
  }
};
