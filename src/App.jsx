// src/App.jsx — GANTI SELURUH ISI FILE INI
import React, { useEffect, useRef, useState } from 'react';
import Login from './components/Login.jsx';
import Sidebar from './components/Sidebar.jsx';
import DashboardView from './components/DashboardView.jsx';
import DatabaseView from './components/DatabaseView.jsx';
import AllocationView from './components/AllocationView.jsx';
import { fetchData } from './api.js';

const POLL_INTERVAL_MS = 120000;

export default function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem('ltk_token'));
  const [page, setPage] = useState('dashboard');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const [pendingCandidateName, setPendingCandidateName] = useState(null);
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

  function handleLogout() {
    sessionStorage.removeItem('ltk_token');
    sessionStorage.removeItem('ltk_editor_name');
    setToken(null);
    setData(null);
    setError('');
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

        {loading && !data && <p className="state-message">Memuat data…</p>}
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
