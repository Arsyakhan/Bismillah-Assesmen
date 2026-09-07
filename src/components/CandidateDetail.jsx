import React from 'react';
import { FIELD_GROUPS } from '../fieldGroups.js';
import { statusClass, formatPercent } from '../utils.js';

export default function CandidateDetail({ candidate, onClose }) {
  if (!candidate) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <button className="drawer-close" onClick={onClose}>
          Tutup
        </button>
        <h2>{candidate['Nama Lengkap']}</h2>
        <p className="drawer-sub">
          {candidate['Fakultas']} · {candidate['Jurusan']} · Angkatan {candidate['Angkatan']}
        </p>

        <div className="drawer-field" style={{ display: 'flex', gap: 24 }}>
          <div>
            <div className="drawer-field-label">Status</div>
            <span className={`status-pill ${statusClass(candidate['Status Asesmen'])}`}>
              {candidate['Status Asesmen']}
            </span>
          </div>
          <div>
            <div className="drawer-field-label">Progres</div>
            <div className="drawer-field-value">{formatPercent(candidate['Progres (%)'])}</div>
          </div>
        </div>

        {FIELD_GROUPS.map((group) => (
          <div key={group.title}>
            <div className="drawer-group-title">{group.title}</div>
            {group.fields.map((field) => (
              <Field key={field} label={field} value={candidate[field]} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value }) {
  const hasValue = value !== undefined && value !== null && String(value).trim() !== '';
  return (
    <div className="drawer-field">
      <div className="drawer-field-label">{label}</div>
      <div className={`drawer-field-value ${hasValue ? '' : 'empty'}`}>
        {hasValue ? String(value) : 'Belum ada catatan'}
      </div>
    </div>
  );
}
