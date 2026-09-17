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
      setFormData({ ...candidate });
      setIsEditing(false);
    }
  }, [candidate]);

  if (!candidate) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFieldChange = (field, value) => setFormData({ ...formData, [field]: value });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const dataToSave = { ...formData };
      delete dataToSave['Progres (%)']; // Jaga rumus otomatis
      await updateDataToSheet(token, 'Database_Tracker', 'No', candidate['No'], dataToSave);
      setIsEditing(false);
      if (refreshData) refreshData();
    } catch (err) {
      alert("Gagal menyimpan: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer print-container" onClick={(e) => e.stopPropagation()}>

        {/* Header Title & Actions */}
        <div className="drawer-header">
          <div>
            <h2>{candidate['Nama Lengkap']}</h2>
            <p className="drawer-sub">
              {candidate['Fakultas']} · {candidate['Jurusan']} · Angkatan {candidate['Angkatan']}
            </p>
          </div>
          <div className="no-print drawer-header-actions">
            {!isEditing && (
              <button className="btn btn-sm btn-ghost" onClick={handlePrint}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                PDF (A4)
              </button>
            )}
            <button className="btn btn-sm drawer-close" onClick={onClose}>Tutup</button>
          </div>
        </div>

        {/* Status & Progress Box */}
        <div className="drawer-status-box">
          {isEditing ? (
            <div className="drawer-status-edit-row">
              <div className="drawer-status-field">
                <div className="drawer-field-label">Status Asesmen</div>
                <select
                  name="Status Asesmen"
                  value={formData["Status Asesmen"] || ''}
                  onChange={handleChange}
                  className="drawer-select"
                >
                  <option value="Belum Mulai">Belum Mulai</option>
                  <option value="Sedang Berjalan">Sedang Berjalan</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
              <div className="drawer-status-field">
                <div className="drawer-field-label">Progres (Otomatis)</div>
                <div className="drawer-status-value-md">
                  {formatPercent(candidate['Progres (%)'])}
                </div>
              </div>
              <div className="drawer-status-actions">
                <button className="btn btn-primary" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Menyimpan...' : 'Simpan Semua'}
                </button>
                <button className="btn btn-outline" onClick={() => setIsEditing(false)}>
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <div className="drawer-status-row">
              <div className="drawer-status-group">
                <div>
                  <div className="drawer-field-label">Status Asesmen</div>
                  <span className={`status-pill drawer-status-pill-lg ${statusClass(candidate['Status Asesmen'])}`}>
                    {candidate['Status Asesmen']}
                  </span>
                </div>
                <div>
                  <div className="drawer-field-label">Progres</div>
                  <div className="drawer-status-value-lg">
                    {formatPercent(candidate['Progres (%)'])}
                  </div>
                </div>
              </div>
              <div className="no-print">
                <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                  Edit Semua Data
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Field Groups */}
        <div className="drawer-content">
          {FIELD_GROUPS.map((group) => (
            <div key={group.title} className="print-group">
              <div className="drawer-group-title">{group.title}</div>
              <div className="field-grid">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, isEditing, onChange }) {
  if (isEditing) {
    return (
      <div className="drawer-field">
        <div className="drawer-field-label">{label}</div>
        <textarea
          className="field-textarea"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Ketik catatan ${label}...`}
        />
      </div>
    );
  }

  const hasValue = value !== undefined && value !== null && String(value).trim() !== '';
  return (
    <div className="drawer-field print-field field-card">
      <div className="drawer-field-label">{label}</div>
      <div className={`drawer-field-value ${hasValue ? '' : 'empty'}`}>
        {hasValue ? String(value) : 'Belum ada catatan'}
      </div>
    </div>
  );
}
