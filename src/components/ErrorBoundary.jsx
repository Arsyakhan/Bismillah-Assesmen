// src/components/ErrorBoundary.jsx — FILE BARU
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(err) {
    return { hasError: true, message: err?.message || 'Terjadi kesalahan tak terduga.' };
  }

  componentDidCatch(err, info) {
    console.error('ErrorBoundary menangkap error:', err, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-screen">
          <div className="error-boundary-card">
            <h2>Terjadi kesalahan</h2>
            <p>{this.state.message}</p>
            <p className="error-boundary-hint">
              Coba muat ulang halaman. Kalau masih terjadi, kemungkinan ada data di
              spreadsheet dengan format yang tidak terduga.
            </p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              Muat Ulang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
