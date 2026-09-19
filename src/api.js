// src/api.js — GANTI SELURUH ISI FILE INI
const BASE_URL = import.meta.env.VITE_APPS_SCRIPT_URL;
const REQUEST_TIMEOUT_MS = 20000;
const RETRY_ATTEMPTS = 3;

if (!BASE_URL) {
  console.warn('VITE_APPS_SCRIPT_URL belum diatur.');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function withRetry(fn, attempts = RETRY_ATTEMPTS) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (i === attempts - 1 || err.retryable === false) throw err;
      await sleep(500 * 2 ** i + Math.random() * 200);
    }
  }
  throw lastError;
}

async function callApiGet(params, { retry = false } = {}) {
  const run = async () => {
    const url = new URL(BASE_URL);
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));

    let res;
    try {
      res = await fetchWithTimeout(url.toString());
    } catch (networkErr) {
      const e = new Error('Tidak bisa menghubungi server (jaringan lambat/timeout).');
      e.retryable = true;
      throw e;
    }
    if (!res.ok) {
      const e = new Error(`HTTP Error ${res.status}`);
      e.retryable = [404, 429, 500, 502, 503, 504].includes(res.status);
      throw e;
    }
    const json = await res.json();
    if (!json.success) {
      const e = new Error(json.error || 'Server error');
      e.retryable = false;
      throw e;
    }
    return json;
  };
  return retry ? withRetry(run) : run();
}

async function callApiPost(params) {
  const formData = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => formData.append(key, value));
  let res;
  try {
    res = await fetchWithTimeout(BASE_URL, { method: 'POST', body: formData });
  } catch (networkErr) {
    throw new Error('Tidak bisa menghubungi server (jaringan lambat/timeout). Coba lagi.');
  }
  if (!res.ok) throw new Error(`HTTP Error ${res.status}. Coba lagi sebentar lagi.`);
  const json = await res.json();
  if (!json.success) throw new Error(json.error || 'Server error');
  return json;
}

export function login(password) {
  return callApiPost({ action: 'login', password });
}

// Baca data: retry otomatis, aman karena read-only.
export function fetchData(token) {
  return callApiGet({ action: 'data', token }, { retry: true });
}

// Matikan token di server saat user klik "Keluar".
export function logout(token) {
  return callApiPost({ action: 'logout', token });
}

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
