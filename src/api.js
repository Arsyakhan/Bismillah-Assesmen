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

async function callApiPost(params) {
  const formData = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => formData.append(key, value));
  const res = await fetch(BASE_URL, { method: 'POST', body: formData });
  if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Server error');
  return json;
}

// Login sekarang lewat POST — password tidak lagi muncul di URL.
export function login(password) {
  return callApiPost({ action: 'login', password });
}

// Baca data tetap lewat GET (read-only, tidak berisiko seperti update).
export function fetchData(token) {
  return callApiGet({ action: 'data', token });
}

// Update HANYA lewat POST. Tidak ada lagi fallback ke GET —
// backend sudah sengaja menolak action=update lewat GET.
export async function updateDataToSheet(token, sheetName, keyColumn, keyValue, updateData) {
  const editorName = sessionStorage.getItem('ltk_editor_name') || '';
  return callApiPost({
    action: 'update',
    token,
    sheetName,
    keyColumn,
    keyValue,
    updateData: JSON.stringify(updateData),
    editorName,
  });
}
