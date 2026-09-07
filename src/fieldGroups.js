// Pengelompokan kolom Database_Tracker agar drawer detail mudah dibaca,
// dan menjadi acuan form edit data ke Spreadsheet.
export const FIELD_GROUPS = [
  {
    title: 'Identitas & Afiliasi',
    fields: ['Angkatan', 'Fakultas', 'Jurusan', 'Ormek (Ekstra)', 'Jejak Lembaga', 'Proyeksi Amanah'],
  },
  {
    title: 'Tim Asesor (Triangulasi)',
    fields: ['Asesor Utama (Sospol)', 'Mentor', 'Asesor MPF', 'Orang Terdekat (Teman)'],
  },
  {
    title: 'Pribadi - Muslim (ADK)',
    fields: [
      'SI - Shalat',
      'SI - Quran',
      'SI - Sunnah',
      'SD - Dakwah Kampus',
      'SD - Pandangan Islam & Sosial',
      'Komitmen Syariat',
      'Positioning Gerakan',
      'Keberlanjutan Pasca Kampus',
      'Kemauan Membina',
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
      'Kapasitas',
      'Kapabilitas',
      'Kesiapan Diri',
      'Restu Orang Tua',
      'Track Record',
      'Jumlah Tanggungan',
    ],
  },
  {
    title: 'Parameter Elektoral',
    fields: [
      'PY - LTK/LTF UI',
      'PY - Lembaga Publik',
      'Basis Massa',
      'Popularitas',
      'Jaringan Simpul Massa',
      'Akses Jejaring',
      'Musuh',
      'Kombinasi Pasangan',
    ],
  },
  {
    title: 'Catatan Khusus Triangulasi',
    fields: ['Catatan Sospol', 'Catatan Mentor', 'Catatan MPF', 'Catatan (Teman)'],
  },
];
