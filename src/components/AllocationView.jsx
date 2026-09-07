import React from 'react';

export default function AllocationView({ allocation }) {
  return (
    <div>
      <div className="page-header">
        <h1>Alokasi Asesor Utama</h1>
        <p>Pembagian kandidat yang diases oleh masing-masing asesor sospol.</p>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Asesor Utama</th>
            <th>Kandidat yang Diases</th>
            <th>Jumlah</th>
          </tr>
        </thead>
        <tbody>
          {allocation.map((row) => (
            <tr key={row['No']}>
              <td>{row['No']}</td>
              <td className="row-name">{row['Asesor Utama']}</td>
              <td>{row['Kandidat yang Diases']}</td>
              <td>{row['Jumlah']}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
