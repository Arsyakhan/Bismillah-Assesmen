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

  // Fungsi trigger PDF
  const handlePrint = () => window.print();

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer print-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Header Title & Actions */}
        <div className="drawer-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '26px', marginBottom: '6px', color: 'var(--navy-deep)' }}>
              {candidate['Nama Lengkap']}
            </h2>
            <p className="drawer-sub" style={{ margin: 0, fontSize: '14.5px', color: 'var(--ink-soft)' }}>
              {candidate['Fakultas']} · {candidate['Jurusan']} · Angkatan {candidate['Angkatan']}
            </p>
          </div>
          <div className="no-print" style={{ display: 'flex', gap: '10px' }}>
            {!isEditing && (
              <button onClick={handlePrint} style={{ background: 'var(--paper-card)', border: '1px solid var(--line)', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--ink)', transition: '0.2s' }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                PDF (A4)
              </button>
            )}
            <button className="drawer-close" onClick={onClose} style={{ padding: '6px 14px', cursor: 'pointer', border: '1px solid var(--line)', borderRadius: '4px', background: 'transparent' }}>Tutup</button>
          </div>
        </div>

        {/* Status & Progress Box */}
        <div style={{ background: 'var(--navy-tint)', padding: '24px', borderRadius: '8px', marginBottom: '32px', border: '1px solid var(--line)' }}>
          {isEditing ? (
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <div className="drawer-field-label">Status Asesmen</div>
                <select name="Status Asesmen" value={formData["Status Asesmen"] || ''} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid var(--line)', fontSize: '14px', background: 'var(--paper-card)' }}>
                  <option value="Belum Mulai">Belum Mulai</option>
                  <option value="Sedang Berjalan">Sedang Berjalan</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>
              <div style={{ flex: 1, minWidth: '150px' }}>
                <div className="drawer-field-label">Progres (Otomatis)</div>
                <div className="drawer-field-value" style={{ padding: '10px 0', fontSize: '16px', fontWeight: 'bold' }}>
                  {formatPercent(candidate['Progres (%)'])}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
                <button onClick={handleSave} disabled={isSaving} style={{ background: 'var(--navy)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  {isSaving ? 'Menyimpan...' : 'Simpan Semua'}
                </button>
                <button onClick={() => setIsEditing(false)} style={{ background: 'transparent', color: 'var(--ink)', border: '1px solid var(--ink-soft)', padding: '10px 20px', borderRadius: '4px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  Batal
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '40px' }}>
                <div>
                  <div className="drawer-field-label">Status Asesmen</div>
                  <span className={`status-pill ${statusClass(candidate['Status Asesmen'])}`} style={{ fontSize: '14px', padding: '6px 12px' }}>
                    {candidate['Status Asesmen']}
                  </span>
                </div>
                <div>
                  <div className="drawer-field-label">Progres</div>
                  <div className="drawer-field-value" style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--navy)' }}>
                    {formatPercent(candidate['Progres (%)'])}
                  </div>
                </div>
              </div>
              <div className="no-print">
                <button onClick={() => setIsEditing(true)} style={{ background: 'var(--navy)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>
                  Edit Semua Data
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Field Groups (Grid Layout) */}
        <div className="drawer-content">
          {FIELD_GROUPS.map((group) => (
            <div key={group.title} className="print-group" style={{ marginBottom: '36px' }}>
              <div className="drawer-group-title" style={{ fontSize: '18px', color: 'var(--navy-deep)', borderBottom: '2px solid var(--line)', paddingBottom: '8px', marginBottom: '20px', marginTop: 0 }}>
                {group.title}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
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
      <div className="drawer-field" style={{ marginBottom: 0 }}>
        <div className="drawer-field-label">{label}</div>
        <textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Ketik catatan ${label}...`}
          style={{ width: '100%', minHeight: '100px', padding: '14px', border: '1px solid var(--line)', borderRadius: '6px', background: 'var(--paper-card)', fontFamily: 'inherit', fontSize: '14px', lineHeight: '1.5', resize: 'vertical', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.03)' }}
        />
      </div>
    );
  }

  const hasValue = value !== undefined && value !== null && String(value).trim() !== '';
  return (
    <div className="drawer-field print-field" style={{ background: 'var(--paper-card)', padding: '18px', borderRadius: '8px', border: '1px solid var(--line)', marginBottom: 0, breakInside: 'avoid' }}>
      <div className="drawer-field-label" style={{ color: 'var(--ink-soft)', marginBottom: '10px' }}>{label}</div>
      <div className={`drawer-field-value ${hasValue ? '' : 'empty'}`} style={{ fontSize: '14.5px', lineHeight: '1.6' }}>
        {hasValue ? String(value) : 'Belum ada catatan'}
      </div>
    </div>
  );
}
