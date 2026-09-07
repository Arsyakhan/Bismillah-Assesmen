import React, { useEffect, useState } from 'react';
import Login from './components/Login.jsx';
import Sidebar from './components/Sidebar.jsx';
import DashboardView from './components/DashboardView.jsx';
import DatabaseView from './components/DatabaseView.jsx';
import AllocationView from './components/AllocationView.jsx';
import { fetchData } from './api.js';

export default function App() {
  const [token, setToken] = useState(() => sessionStorage.getItem('ltk_token'));
  const [page, setPage] = useState('dashboard');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingCandidateName, setPendingCandidateName] = useState(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError('');
    fetchData(token)
      .then((res) => setData(res.data))
      .catch((err) => {
        setError(err.message);
        if (err.message.toLowerCase().includes('sesi')) {
          handleLogout();
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  function handleLogout() {
    sessionStorage.removeItem('ltk_token');
    setToken(null);
    setData(null);
  }

  if (!token) {
    return <Login onSuccess={setToken} />;
  }

  return (
    <div className="app-shell">
      <Sidebar
        active={page}
        onNavigate={setPage}
        onLogout={handleLogout}
      />
      <main className="main">
        {loading && <p className="state-message">Memuat data…</p>}
        {error && <p className="state-message">{error}</p>}
        {data && !loading && (
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
              />
            )}
            {page === 'allocation' && <AllocationView allocation={data.allocation} />}
          </>
        )}
      </main>
    </div>
  );
}
