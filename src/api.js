const BASE_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

if (!BASE_URL) {
  console.warn('VITE_APPS_SCRIPT_URL belum diatur.');
}

async function callApi(params, method = 'GET', postData = null) {
  if (method === 'GET') {
    const url = new URL(BASE_URL);
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
    
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Server error');
    return json;
  }

  if (method === 'POST') {
    // JURUS ANTI-CORS: Menggunakan URLSearchParams (Format asli Form)
    const formData = new URLSearchParams();
    Object.entries(postData).forEach(([key, value]) => {
      formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value);
    });

    const res = await fetch(BASE_URL, {
      method: 'POST',
      body: formData // Otomatis diset ke application/x-www-form-urlencoded (Aman dari blokir)
    });
    
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Server error');
    return json;
  }
}

export function login(password) {
  return callApi({ action: 'login', password });
}

export function fetchData(token) {
  return callApi({ action: 'data', token });
}

export function updateDataToSheet(token, sheetName, keyColumn, keyValue, updateData) {
  return callApi({}, 'POST', { 
    action: 'update', 
    token: token, 
    sheetName: sheetName, 
    keyColumn: keyColumn, 
    keyValue: keyValue, 
    updateData: updateData 
  });
}
