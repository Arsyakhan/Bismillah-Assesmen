const BASE_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

if (!BASE_URL) {
  console.warn('VITE_APPS_SCRIPT_URL belum diatur. Tambahkan di file .env (lokal) atau Environment Variables (Vercel).');
}

async function callApi(params, method = 'GET', body = null) {
  const url = new URL(BASE_URL);
  
  if (method === 'GET') {
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  }

  const options = { method };

  if (method === 'POST') {
    options.headers = { 'Content-Type': 'text/plain;charset=utf-8' };
    options.body = JSON.stringify(body);
  }

  const res = await fetch(method === 'GET' ? url.toString() : BASE_URL, options);
  if (!res.ok) throw new Error(`Permintaan gagal (HTTP ${res.status}).`);
  
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Terjadi kesalahan yang tidak diketahui.');
  
  return json;
}

export function login(password) {
  return callApi({ action: 'login', password });
}

export function fetchData(token) {
  return callApi({ action: 'data', token });
}

export function updateDataToSheet(token, sheetName, keyColumn, keyValue, updateData) {
  return callApi({}, 'POST', { action: 'update', token, sheetName, keyColumn, keyValue, updateData });
}
