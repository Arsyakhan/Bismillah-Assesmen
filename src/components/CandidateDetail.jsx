import React, { useState, useEffect } from 'react';
import { FIELD_GROUPS } from '../fieldGroups.js';
import { statusClass, formatPercent } from '../utils.js';
import { updateDataToSheet } from '../api.js';

export default function CandidateDetail({ candidate, onClose, token, refreshData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Masukkan SEMUA data kandidat ke form saat modal dibuka
  useEffect(() => {
    if (candidate) {
      setFormData({ ...candidate });
      setIsEditing(false);
    }
  }, [candidate]);

  if (!candidate) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFieldChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Menyimpan seluruh form data ke Spreadsheet
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <h2>{candidate['Nama Lengkap']}</h2>
            <p className="drawer-sub">
              {candidate['Fakultas']} · {candidate['Jurusan']} · Angkatan {candidate['Angkatan']}
            </p>
          </div>
          <button className="drawer-close" onClick={onClose}>Tutup</button>
        </div>

        <div className="drawer-field" style={{ display: 'flex', gap: 16, paddingBottom: 24, borderBottom: '1px solid var(--line)', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          {isEditing ? (
            <>
              <div>
                <div className="drawer-field-label">Status</div>
                <select name="Status Asesmen" value={formData["Status Asesmen"] || ''} onChange={handleChange} style={{ padding: '8px 10px', borderRadius: '3px', border: '1px solid var(--line)', fontSize: '13.5px', background: 'var(--paper-card)' }}>
                  <option value="Belum Mulai">Belum Mulai</option>
                  <option value="Sedang Berjalan">Sedang Berjalan</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
              <div>
                <div className="drawer-field-label">Progres (%)</div>
                <input name="Progres (%)" value={formData["Progres (%)"] || ''} onChange={handleChange} placeholder="50%" style={{ padding: '8px 10px', borderRadius: '3px', border: '1px solid var(--line)', fontSize: '13.5px', width: '80px', background: 'var(--paper-card)' }} />
              </div>
              <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
                <button onClick={handleSave} disabled={isSaving} style={{ background: 'var(--navy)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '3px', fontSize: '13.5px', fontWeight: 600 }}>
                  {isSaving ? 'Menyimpan...' : 'Simpan Semua'}
                </button>
                <button onClick={() => setIsEditing(false)} style={{ background: 'var(--line)', color: 'var(--ink)', border: 'none', padding: '8px 16px', borderRadius: '3px', fontSize: '13.5px', fontWeight: 600 }}>
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
              <div style={{ marginLeft: 'auto' }}>
                <button className="link-btn" onClick={() => setIsEditing(true)} style={{ background: 'var(--navy)', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '3px', fontSize: '13.5px', fontWeight: 600, textDecoration: 'none' }}>
                  Edit Seluruh Data
                </button>
              </div>
            </>
          )}
        </div>

        {FIELD_GROUPS.map((group) => (
          <div key={group.title}>
            <div className="drawer-group-title">{group.title}</div>
            {group.fields.map((field) => (
              <Field 
                key={field} 
                label={field} 
                value={isEditing ? formData[field] : candidate[field]} 
                isEditing={isEditing}
                onChange={(val) => handleFieldChange(field, val)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, value, isEditing, onChange }) {
  // Jika mode edit aktif, ubah teks menjadi form input textarea
  if (isEditing) {
    return (
      <div className="drawer-field">
        <div className="drawer-field-label">{label}</div>
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Isi catatan untuk ${label}...`}
          style={{
            width: '100%',
            minHeight: '80px',
            padding: '12px',
            border: '1px solid var(--line)',
            borderRadius: '3px',
            background: 'var(--paper-card)',
            fontFamily: 'inherit',
            fontSize: '13.5px',
            lineHeight: '1.5',
            resize: 'vertical'
          }}
        />
      </div>
    );
  }

  // Jika mode baca (default), tampilkan teks biasa
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
