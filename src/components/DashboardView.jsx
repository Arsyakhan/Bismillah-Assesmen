import React from 'react';
import { statusClass, formatPercent } from '../utils.js';

export default function DashboardView({ dashboard, onSelectCandidate }) {
  if (!dashboard) return null;
  const { stats, candidates } = dashboard;

  // Fungsi untuk mengubah status otomatis berdasarkan angka progres
  const getDynamicStatus = (progres) => {
    const val = Number(progres) || 0;
    if (val >= 1) return "Selesai";
    if (val > 0) return "Sedang Berjalan";
    return "Belum Mulai";
  };

  return (
    <div>
      <div className="page-header">
        <h1>Ringkasan Progres</h1>
        <p>Gambaran umum status asesmen seluruh calon kandidat.</p>
      </div>

      {stats && (
        <div className="stat-row">
          <div className="stat-card">
            <div className="stat-value">{stats.totalKandidat}</div>
            <div className="stat-label">Total kandidat</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.selesai}</div>
            <div className="stat-label">Selesai</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.sedangBerjalan}</div>
            <div className="stat-label">Sedang berjalan</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.belumMulai}</div>
            <div className="stat-label">Belum mulai</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{formatPercent(stats.rataRataProgres)}</div>
            <div className="stat-label">Rata-rata progres</div>
          </div>
        </div>
      )}

      <div className="section-block">
        <h2>Progres per kandidat</h2>
        <p className="section-sub">Klik nama untuk melihat detail lengkap asesmen.</p>
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Fakultas</th>
              <th>Proyeksi Amanah</th>
              <th>Status</th>
              <th>Progres</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => {
              // Menentukan status dinamis berdasarkan persentase
              const dynamicStatus = getDynamicStatus(c.progres);
              
              return (
                <tr key={c.no}>
                  <td>{c.no}</td>
                  <td>
                    <button className="link-btn" onClick={() => onSelectCandidate(c.nama)}>
                      {c.nama}
                    </button>
                  </td>
                  <td>{c.fakultas}</td>
                  <td>{c.proyeksiAmanah}</td>
                  <td>
                    <span className={`status-pill ${statusClass(dynamicStatus)}`}>
                      {dynamicStatus}
                    </span>
                  </td>
                  {/* Kolom progres dimodifikasi agar menampilkan teks % di samping bar */}
                  <td style={{ minWidth: 180 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="progress-track" style={{ flex: 1 }}>
                        <div className="progress-fill" style={{ width: formatPercent(c.progres) }} />
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: '600', minWidth: '40px', color: 'var(--navy)' }}>
                        {formatPercent(c.progres)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
