const BASE_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

if (!BASE_URL) {
  console.warn('VITE_APPS_SCRIPT_URL belum diatur.');
}

async function callApiGet(params) {
  const url = new URL(BASE_URL);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Server error');
  return json;
}

export function login(password) {
  return callApiGet({ action: 'login', password });
}

export function fetchData(token) {
  return callApiGet({ action: 'data', token });
}

export async function updateDataToSheet(token, sheetName, keyColumn, keyValue, updateData) {
  const payload = {
    action: 'update',
    token: token,
    sheetName: sheetName,
    keyColumn: keyColumn,
    keyValue: keyValue,
    updateData: JSON.stringify(updateData) // Ubah ke string agar aman dikirim
  };

  try {
    // 1. Coba jalur POST (Standar pengiriman data)
    const formData = new URLSearchParams();
    Object.entries(payload).forEach(([key, value]) => formData.append(key, value));

    const res = await fetch(BASE_URL, { method: 'POST', body: formData });
    
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Server error');
    return json;
  } catch (err) {
    console.warn("POST diblokir Google (404). Mengalihkan otomatis ke jalur GET...", err);
    // 2. JURUS PAMUNGKAS: Jika POST gagal, tembak pakai GET (Pasti lolos)
    return callApiGet(payload);
  }
}
