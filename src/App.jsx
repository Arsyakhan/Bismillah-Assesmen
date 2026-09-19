// src/App.jsx — GANTI SELURUH ISI FILE INI
import React, { useEffect, useRef, useState } from 'react';
import Login from './components/Login.jsx';
import Sidebar from './components/Sidebar.jsx';
import DashboardView from './components/DashboardView.jsx';
import DatabaseView from './components/DatabaseView.jsx';
import AllocationView from './components/AllocationView.jsx';
import { fetchData, logout } from './api.js';

const POLL_INTERVAL_MS = 120000;
const SESSION_CHECK_INTERVAL_MS = 30000;
const SESSION_WARNING_THRESHOLD_MS = 5 * 60 * 1000; // 5 menit

export default function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem('ltk_token'));
  const [page, setPage] = useState('dashboard');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const [pendingCandidateName, setPendingCandidateName] = useState(null);
  const [sessionWarningMinutes, setSessionWarningMinutes] = useState(null);
  const isFetchingRef = useRef(false);

  const loadData = async ({ initial = false } = {}) => {
    if (!token || isFetchingRef.current) return;
    isFetchingRef.current = true;
    if (initial) setLoading(true);
    setSyncing(true);
    try {
      const res = await fetchData(token);
      setData(res.data);
      setLastSynced(new Date());
      setError('');
    } catch (err) {
      if (err.message.toLowerCase().includes('sesi')) {
        handleLogout();
      } else if (initial) {
        setError(err.message);
      } else {
        console.warn('Sync gagal, tetap pakai data terakhir:', err.message);
        setError(err.message);
      }
    } finally {
      isFetchingRef.current = false;
      setSyncing(false);
      if (initial) setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    loadData({ initial: true });
    const intervalId = setInterval(() => loadData(), POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Cek waktu kedaluwarsa sesi tiap 30 detik, tampilkan peringatan 5 menit sebelum habis.
  useEffect(() => {
    if (!token) return;
    const checkExpiry = () => {
      const expiresAtRaw = sessionStorage.getItem('ltk_token_expires_at');
      if (!expiresAtRaw) {
        setSessionWarningMinutes(null);
        return;
      }
      const remaining = Number(expiresAtRaw) - Date.now();
      if (remaining <= 0) {
        handleLogout();
      } else if (remaining <= SESSION_WARNING_THRESHOLD_MS) {
        setSessionWarningMinutes(Math.max(1, Math.ceil(remaining / 60000)));
      } else {
        setSessionWarningMinutes(null);
      }
    };
    checkExpiry();
    const intervalId = setInterval(checkExpiry, SESSION_CHECK_INTERVAL_MS);
    return () => clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function handleLogout() {
    const currentToken = token;
    sessionStorage.removeItem('ltk_token');
    sessionStorage.removeItem('ltk_editor_name');
    sessionStorage.removeItem('ltk_token_expires_at');
    setToken(null);
    setData(null);
    setError('');
    setSessionWarningMinutes(null);
    if (currentToken) logout(currentToken).catch(() => {});
  }

  if (!token) return <Login onSuccess={setToken} />;

  return (
    <div className="app-shell">
      <Sidebar active={page} onNavigate={setPage} onLogout={handleLogout} />
      <main className="main">
        <div className="sync-bar">
          <span className="sync-status">
            {syncing
              ? 'Menyinkronkan…'
              : lastSynced
              ? `Tersinkron ${lastSynced.toLocaleTimeString('id-ID')}`
              : ''}
          </span>
          <button className="btn btn-sm btn-ghost" onClick={() => loadData()} disabled={syncing}>
            Refresh sekarang
          </button>
        </div>

        {sessionWarningMinutes !== null && (
          <p className="state-message state-message-warning">
            Sesi kamu akan berakhir dalam ~{sessionWarningMinutes} menit. Segera simpan perubahan yang sedang dikerjakan, lalu login ulang.
          </p>
        )}

        {loading && !data && <DashboardSkeleton />}
        {error && !data && <p className="state-message">{error}</p>}
        {error && data && (
          <p className="state-message state-message-warning">
            Sinkronisasi terakhir gagal ({error}). Menampilkan data terakhir yang berhasil dimuat.
          </p>
        )}

        {data && (
          <>
            {page === 'dashboard' && (
              <DashboardView
                dashboard={data.dashboard}
                onSelectCandidate={(name) => {
                  setPendingCandidateName(name);
                  setPage('tracker');
                }}
              />
            )}
            {page === 'tracker' && (
              <DatabaseView
                tracker={data.tracker}
                initialSelectedName={pendingCandidateName}
                onClearInitialSelection={() => setPendingCandidateName(null)}
                token={token}
                refreshData={loadData}
              />
            )}
            {page === 'allocation' && <AllocationView allocation={data.allocation} />}
          </>
        )}
      </main>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="skeleton-wrap">
      <div className="skeleton-stat-row">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton-block skeleton-stat-card" />
        ))}
      </div>
      <div className="skeleton-block skeleton-table" />
      <div className="skeleton-block skeleton-table" />
      <div className="skeleton-block skeleton-table" />
    </div>
  );
}
