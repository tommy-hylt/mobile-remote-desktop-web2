export const useKeySender = () => {
  const parseKeys = (keyString: string): string[] => {
    return keyString
      .split(/[ +]+/)
      .map((k) => k.trim().toLowerCase())
      .filter((k) => k.length > 0);
  };

  const send = async (keyString: string, action: 'down' | 'up') => {
    const keys = parseKeys(keyString);
    if (action === 'up') keys.reverse();

    try {
      for (const key of keys) {
        await fetch(`/key/${encodeURIComponent(key)}/${action}`, {
          method: 'POST',
        });
      }
    } catch (e) {
      console.error(`Failed to send key ${action}`, e);
    }
  };

  return { send };
};
