const BASE_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

if (!BASE_URL) {
  console.warn('VITE_APPS_SCRIPT_URL belum diatur.');
}

async function callApi(params, method = 'GET', body = null) {
  const url = new URL(BASE_URL);
  
  if (method === 'GET') {
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
    
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Server error');
    return json;
  }

  if (method === 'POST') {
    // JURUS ANTI-CORS: Gunakan text/plain
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(body)
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

// Format pemanggilan Update yang baru
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
