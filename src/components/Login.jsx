// src/components/Login.jsx — GANTI SELURUH ISI FILE INI
import React, { useState } from 'react';
import { login } from '../api.js';

const ASESOR_NAMES = ['Syafiq', 'Razan', 'Taqiy', 'Qonita', 'Muflih', 'Ruben', 'Lainnya (isi manual)'];

export default function Login({ onSuccess }) {
  const [selectedName, setSelectedName] = useState('');
  const [customName, setCustomName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isCustom = selectedName === 'Lainnya (isi manual)';
  const finalName = isCustom ? customName.trim() : selectedName;

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(password);
      sessionStorage.setItem('ltk_token', result.token);
      sessionStorage.setItem('ltk_editor_name', finalName);
      sessionStorage.setItem(
        'ltk_token_expires_at',
        String(Date.now() + (result.expiresInSeconds || 21600) * 1000)
      );
      onSuccess(result.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <p className="login-mark">LTK UI 2027</p>
        <h1>Masuk ke Tracker Asesmen</h1>
        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Nama kamu</label>
          <select
            id="name"
            value={selectedName}
            onChange={(e) => setSelectedName(e.target.value)}
            required
            style={{ width: '100%', marginBottom: isCustom ? '12px' : '18px', boxSizing: 'border-box' }}
          >
            <option value="" disabled>Pilih namamu…</option>
            {ASESOR_NAMES.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>

          {isCustom && (
            <input
              type="text"
              autoFocus
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Ketik namamu"
              required
              style={{ width: '100%', marginBottom: '18px', boxSizing: 'border-box' }}
            />
          )}

          <label htmlFor="password">Password tim</label>
          <div style={{ position: 'relative', display: 'block', width: '100%', marginBottom: '18px' }}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              style={{
                width: '100%',
                marginBottom: '0',
                paddingRight: '45px',
                boxSizing: 'border-box'
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              style={{
                position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                background: 'transparent', border: 'none', padding: '4px', width: 'auto', minWidth: 'auto',
                color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', zIndex: 10
              }}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              )}
            </button>
          </div>

          <button type="submit" disabled={loading || !password || !finalName}>
            {loading ? 'Memeriksa…' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}
