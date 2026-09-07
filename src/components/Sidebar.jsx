import React from 'react';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Ringkasan' },
  { key: 'tracker', label: 'Database Tracker' },
  { key: 'allocation', label: 'Alokasi Asesor' },
];

export default function Sidebar({ active, onNavigate, onLogout }) {
  return (
    <aside className="sidebar">
      <p className="sidebar-title">Tracker Asesmen</p>
      <p className="sidebar-subtitle">Calon LTK UI 2027</p>
      <nav>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={`sidebar-link ${active === item.key ? 'active' : ''}`}
            onClick={() => onNavigate(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="sidebar-logout" onClick={onLogout}>
          Keluar
        </button>
      </div>
    </aside>
  );
}
