// src/components/DatabaseView.jsx — GANTI SELURUH ISI FILE INI
import React, { useEffect, useMemo, useState } from 'react';
import { statusClass, formatPercent } from '../utils.js';
import CandidateDetail from './CandidateDetail.jsx';

const PAGE_SIZE = 10;
const STATUS_OPTIONS = ['Belum Mulai', 'Sedang Berjalan', 'Selesai'];

function exportToCsv(rows) {
  if (!rows || rows.length === 0) return;
  const headers = Object.keys(rows[0]);
  const escape = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
  const csv = [headers.join(','), ...rows.map((r) => headers.map((h) => escape(r[h])).join(','))].join('\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `database-tracker-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DatabaseView({ tracker, initialSelectedName, onClearInitialSelection, token, refreshData }) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [facultyFilter, setFacultyFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (initialSelectedName && tracker) {
      const found = tracker.find((r) => r['Nama Lengkap'] === initialSelectedName);
      if (found) setSelected(found);
      onClearInitialSelection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSelectedName, tracker]);

  const facultyOptions = useMemo(() => {
    if (!tracker) return [];
    const set = new Set(tracker.map((r) => r['Fakultas']).filter(Boolean));
    return Array.from(set).sort();
  }, [tracker]);

  const filtered = useMemo(() => {
    if (!tracker) return [];
    const q = query.trim().toLowerCase();
    return tracker.filter((row) => {
      const matchQuery =
        !q ||
        ['Nama Lengkap', 'Fakultas', 'Jurusan', 'Proyeksi Amanah'].some((f) =>
          String(row[f] || '').toLowerCase().includes(q)
        );
      const matchStatus = !statusFilter || row['Status Asesmen'] === statusFilter;
      const matchFaculty = !facultyFilter || row['Fakultas'] === facultyFilter;
      return matchQuery && matchStatus && matchFaculty;
    });
  }, [tracker, query, statusFilter, facultyFilter]);

  // Reset ke halaman 1 setiap kali filter berubah, biar tidak nyangkut di halaman kosong.
  useEffect(() => {
    setPage(1);
  }, [query, statusFilter, facultyFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const hasActiveFilter = query || statusFilter || facultyFilter;

  return (
    <div>
      <div className="page-header">
        <h1>Database Tracker</h1>
        <p>Seluruh data identitas, tim asesor, dan hasil triangulasi per kandidat.</p>
      </div>

      <div className="filter-bar">
        <input
          className="table-search"
          placeholder="Cari nama, fakultas, atau proyeksi amanah…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Semua Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          className="filter-select"
          value={facultyFilter}
          onChange={(e) => setFacultyFilter(e.target.value)}
        >
          <option value="">Semua Fakultas</option>
          {facultyOptions.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
        <button className="btn btn-sm btn-outline" onClick={() => exportToCsv(filtered)}>
          Export CSV
        </button>
      </div>

      {hasActiveFilter && (
        <p className="filter-result-count">
          Menampilkan {filtered.length} dari {tracker.length} kandidat.
        </p>
      )}

      <table className="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Lengkap</th>
            <th>Fakultas</th>
            <th>Proyeksi Amanah</th>
            <th>Asesor Utama</th>
            <th>Status</th>
            <th>Progres</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((row, i) => (
            <tr key={row['No']} className="row-enter" style={{ animationDelay: `${Math.min(i * 20, 300)}ms` }}>
              <td>{row['No']}</td>
              <td>
                <button
                  className="link-btn row-name"
                  onClick={() => setSelected(row)}
                  style={{ textAlign: 'left' }}
                >
                  {row['Nama Lengkap']}
                </button>
              </td>
              <td>{row['Fakultas']}</td>
              <td>{row['Proyeksi Amanah']}</td>
              <td>{row['Asesor Utama (Sospol)']}</td>
              <td>
                <span className={`status-pill ${statusClass(row['Status Asesmen'])}`}>
                  {row['Status Asesmen']}
                </span>
              </td>
              <td>{formatPercent(row['Progres (%)'])}</td>
              <td>
                <button className="link-btn" onClick={() => setSelected(row)}>
                  Lihat detail
                </button>
              </td>
            </tr>
          ))}
          {paginated.length === 0 && (
            <tr>
              <td colSpan={8} className="table-empty-row">Tidak ada kandidat yang cocok dengan filter.</td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className="pagination-bar">
          <button
            className="btn btn-sm btn-outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ← Sebelumnya
          </button>
          <span className="pagination-label">Halaman {currentPage} dari {totalPages}</span>
          <button
            className="btn btn-sm btn-outline"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Selanjutnya →
          </button>
        </div>
      )}

      <CandidateDetail
        candidate={selected}
        onClose={() => setSelected(null)}
        token={token}
        refreshData={refreshData}
      />
    </div>
  );
}
