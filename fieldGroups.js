// Pengelompokan kolom Database_Tracker agar drawer detail mudah dibaca,
// mengikuti struktur asli sheet (Identitas, Tim Asesor, Pribadi - Muslim, dst).
export const FIELD_GROUPS = [
  {
    title: 'Identitas & Afiliasi',
    fields: ['Angkatan', 'Fakultas', 'Jurusan', 'Ormek (Ekstra)', 'Jejak Lembaga', 'Proyeksi Amanah'],
  },
  {
    title: 'Tim Asesor (Triangulasi)',
    fields: ['Asesor Utama (Sospol)', 'Mentor', 'Asesor MPF', 'Orang Terdekat (Teman)', 'El Komunikator (Ormek)'],
  },
  {
    title: 'Pribadi - Muslim (ADK)',
    fields: [
      'SI - Shalat',
      'SI - Quran',
      'SI - Sunnah',
      'SD - Dakwah Kampus',
      'SD - Pandangan Islam & Sosial',
      'Komitmen Syariat [NEW]',
      'Positioning Gerakan [NEW]',
      'Keberlanjutan Pasca Kampus [NEW]',
      'Kemauan Membina [NEW]',
    ],
  },
  {
    title: 'Pribadi - Pejabat',
    fields: [
      'PR - Manajemen Diri',
      'PR - Mimpi Jangka Panjang',
      'PR - Finansial',
      'PR - Kesehatan',
      'PR - Akademis',
      'PR - Keluarga',
      'Kapasitas [NEW]',
      'Kapabilitas [NEW]',
      'Kesiapan Diri [NEW]',
      'Restu Orang Tua [NEW]',
      'Track Record [NEW]',
      'Jumlah Tanggungan [NEW]',
    ],
  },
  {
    title: 'Parameter Elektoral',
    fields: [
      'PY - LTK/LTF UI',
      'PY - Lembaga Publik',
      'Basis Massa [NEW]',
      'Popularitas [NEW]',
      'Jaringan Simpul Massa [NEW]',
      'Akses Jejaring [NEW]',
      'Musuh [NEW]',
      'Kombinasi [NEW]',
    ],
  },
  {
    title: 'Catatan Khusus Triangulasi',
    fields: ['Catatan Sospol', 'Catatan Mentor', 'Catatan MPF', 'Catatan (Teman)'],
  },
];
