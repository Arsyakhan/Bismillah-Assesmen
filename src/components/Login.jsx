import React, { useState } from 'react';
import { login } from '../api.js';

export default function Login({ onSuccess }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(password);
      sessionStorage.setItem('ltk_token', result.token);
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
          <label htmlFor="password">Password tim</label>
          <input
            id="password"
            type="password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Masukkan password"
          />
          <button type="submit" disabled={loading || !password}>
            {loading ? 'Memeriksa…' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}
