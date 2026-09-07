const BASE_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

if (!BASE_URL) {
  // eslint-disable-next-line no-console
  console.warn(
    'VITE_APPS_SCRIPT_URL belum diatur. Tambahkan di file .env (lokal) atau Environment Variables (Vercel).'
  );
}

async function callApi(params) {
  const url = new URL(BASE_URL);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Permintaan gagal (HTTP ${res.status}).`);
  }
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.error || 'Terjadi kesalahan yang tidak diketahui.');
  }
  return json;
}

export function login(password) {
  return callApi({ action: 'login', password });
}

export function fetchData(token) {
  return callApi({ action: 'data', token });
}
