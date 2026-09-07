import React, { useMemo, useState } from 'react';
import { statusClass, formatPercent } from '../utils.js';
import CandidateDetail from './CandidateDetail.jsx';

export default function DatabaseView({ tracker, initialSelectedName, onClearInitialSelection }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);

  React.useEffect(() => {
    if (initialSelectedName && tracker) {
      const found = tracker.find((r) => r['Nama Lengkap'] === initialSelectedName);
      if (found) setSelected(found);
      onClearInitialSelection();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSelectedName, tracker]);

  const filtered = useMemo(() => {
    if (!tracker) return [];
    const q = query.trim().toLowerCase();
    if (!q) return tracker;
    return tracker.filter((row) =>
      ['Nama Lengkap', 'Fakultas', 'Jurusan', 'Proyeksi Amanah'].some((f) =>
        String(row[f] || '').toLowerCase().includes(q)
      )
    );
  }, [tracker, query]);

  return (
    <div>
      <div className="page-header">
        <h1>Database Tracker</h1>
        <p>Seluruh data identitas, tim asesor, dan hasil triangulasi per kandidat.</p>
      </div>

      <input
        className="table-search"
        placeholder="Cari nama, fakultas, atau proyeksi amanah…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

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
          {filtered.map((row) => (
            <tr key={row['No']}>
              <td>{row['No']}</td>
              <td className="row-name">{row['Nama Lengkap']}</td>
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
        </tbody>
      </table>

      <CandidateDetail candidate={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
