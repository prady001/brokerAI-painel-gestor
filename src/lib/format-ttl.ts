export function formatTtl(ttlSeconds: number): string {
  if (ttlSeconds >= 86400) {
    const days = Math.floor(ttlSeconds / 86400);
    return `${days} ${days === 1 ? 'dia' : 'dias'}`;
  }
  if (ttlSeconds >= 3600) {
    const hours = Math.floor(ttlSeconds / 3600);
    return `${hours} h`;
  }
  if (ttlSeconds >= 60) {
    const minutes = Math.floor(ttlSeconds / 60);
    return `${minutes} min`;
  }
  return ttlSeconds > 0 ? '< 1 min' : '—';
}
