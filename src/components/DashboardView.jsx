import React from 'react';
import { statusClass, formatPercent } from '../utils.js';

export default function DashboardView({ dashboard, onSelectCandidate }) {
  if (!dashboard) return null;
  const { stats, candidates } = dashboard;

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

      {stats && (
        <div className="chart-row">
          <div className="chart-card">
            <h3>Distribusi Status</h3>
            <StatusDonut stats={stats} />
          </div>
          <div className="chart-card">
            <h3>Kandidat per Fakultas</h3>
            <FacultyBars candidates={candidates} />
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

function StatusDonut({ stats }) {
  const total = stats.totalKandidat || 1;
  const segments = [
    { label: 'Selesai', value: stats.selesai, color: 'var(--status-selesai)' },
    { label: 'Sedang Berjalan', value: stats.sedangBerjalan, color: 'var(--status-berjalan)' },
    { label: 'Belum Mulai', value: stats.belumMulai, color: 'var(--status-belum)' },
  ];
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  let offsetAcc = 0;

  return (
    <div className="donut-chart-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--line)" strokeWidth="16" />
        {segments.map((seg) => {
          const fraction = total ? seg.value / total : 0;
          const dash = fraction * circumference;
          const el = (
            <circle
              key={seg.label}
              cx="70"
              cy="70"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="16"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offsetAcc}
              transform="rotate(-90 70 70)"
            />
          );
          offsetAcc += dash;
          return el;
        })}
        <text x="70" y="66" textAnchor="middle" className="donut-center-value">{total}</text>
        <text x="70" y="84" textAnchor="middle" className="donut-center-label">KANDIDAT</text>
      </svg>
      <div className="donut-legend">
        {segments.map((seg) => (
          <div key={seg.label} className="donut-legend-item">
            <span className="donut-legend-dot" style={{ background: seg.color }} />
            <span>{seg.label}</span>
            <span className="donut-legend-count">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FacultyBars({ candidates }) {
  const grouped = {};
  (candidates || []).forEach((c) => {
    const key = c.fakultas || 'Lainnya';
    grouped[key] = (grouped[key] || 0) + 1;
  });
  const entries = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
  const max = Math.max(...entries.map(([, v]) => v), 1);

  if (entries.length === 0) return <p className="section-sub">Belum ada data.</p>;

  return (
    <div className="faculty-bars">
      {entries.map(([fakultas, count]) => (
        <div key={fakultas} className="faculty-bar-row">
          <span className="faculty-bar-label" title={fakultas}>{fakultas}</span>
          <div className="faculty-bar-track">
            <div className="faculty-bar-fill" style={{ width: `${(count / max) * 100}%` }} />
          </div>
          <span className="faculty-bar-count">{count}</span>
        </div>
      ))}
    </div>
  );
}
