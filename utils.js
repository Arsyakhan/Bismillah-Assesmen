export function statusClass(status) {
  const s = String(status || '').toLowerCase();
  if (s.includes('selesai')) return 'selesai';
  if (s.includes('sedang')) return 'sedang-berjalan';
  return 'belum-mulai';
}

export function formatPercent(value) {
  const n = Number(value) || 0;
  return `${Math.round(n * 100)}%`;
}
