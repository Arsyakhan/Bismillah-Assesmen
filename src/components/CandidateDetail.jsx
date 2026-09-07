import React, { useState, useEffect } from 'react';
import { FIELD_GROUPS } from '../fieldGroups.js';
import { statusClass, formatPercent } from '../utils.js';
import { updateDataToSheet } from '../api.js';

export default function CandidateDetail({ candidate, onClose, token, refreshData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (candidate) {
      setFormData({
        "Status Asesmen": candidate['Status Asesmen'] || '',
        "Progres (%)": candidate['Progres (%)'] || ''
      });
      setIsEditing(false);
    }
  }, [candidate]);

  if (!candidate) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateDataToSheet(token, 'Database_Tracker', 'No', candidate['No'], formData);
      setIsEditing(false);
      if (refreshData) refreshData();
    } catch (err) {
      alert("Gagal menyimpan: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <button className="drawer-close" onClick={onClose}>Tutup</button>
        <h2>{candidate['Nama Lengkap']}</h2>
        <p className="drawer-sub">
          {candidate['Fakultas']} · {candidate['Jurusan']} · Angkatan {candidate['Angkatan']}
        </p>

        <div className="drawer-field" style={{ display: 'flex', gap: 24, paddingBottom: 16, borderBottom: '1px solid var(--line)', alignItems: 'flex-end' }}>
          {isEditing ? (
            <>
              <div>
                <div className="drawer-field-label">Status</div>
                <select name="Status Asesmen" value={formData["Status Asesmen"]} onChange={handleChange} style={{ padding: '6px 10px', borderRadius: '3px', border: '1px solid var(--line)', fontSize: '13px' }}>
                  <option value="Belum Mulai">Belum Mulai</option>
                  <option value="Sedang Berjalan">Sedang Berjalan</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
              <div>
                <div className="drawer-field-label">Progres (%)</div>
                <input name="Progres (%)" value={formData["Progres (%)"]} onChange={handleChange} placeholder="50%" style={{ padding: '6px 10px', borderRadius: '3px', border: '1px solid var(--line)', fontSize: '13px', width: '80px' }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleSave} disabled={isSaving} style={{ background: 'var(--navy)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '3px', fontSize: '13px', fontWeight: 600 }}>
                  {isSaving ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button onClick={() => setIsEditing(false)} style={{ background: 'var(--line)', color: 'var(--ink)', border: 'none', padding: '6px 12px', borderRadius: '3px', fontSize: '13px', fontWeight: 600 }}>
                  Batal
                </button>
              </div>
            </>
          ) : (
            <>
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
              <button className="link-btn" onClick={() => setIsEditing(true)} style={{ marginBottom: 2 }}>Edit</button>
            </>
          )}
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
