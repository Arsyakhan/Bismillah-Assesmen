# Tracker Asesmen LTK UI 2027 — Website Internal

Website dashboard internal untuk tim asesor, dengan alur:

```
Google Sheet (data) → Google Apps Script (API + password gate) → React (Vercel)
```

Data **selalu dibaca langsung dari Google Sheet** — tidak pernah disalin ke dalam
kode. Repo GitHub dan kode di Vercel hanya berisi tampilan, bukan data kandidat.
Website dikunci di belakang password tim sebelum data apa pun bisa dimuat.

Struktur folder:
```
ltk-tracker/
├── apps-script/        # backend: tempel ke Google Apps Script
│   ├── Code.gs
│   └── appsscript.json
└── frontend/            # React (Vite), di-deploy ke Vercel
```

---

## Bagian 1 — Siapkan Google Sheet + Apps Script

1. Buka **Tracker-Asesment_LTK_UI.xlsx** kamu, lalu upload/convert ke **Google Sheets**
   (File > Save as Google Sheets, atau upload langsung ke Google Drive lalu buka
   dengan Google Sheets). Pastikan nama tab-nya tetap: `Dashboard`,
   `Database_Tracker`, `Alokasi Asesor`.
2. Di Google Sheet tsb, buka **Extensions > Apps Script**.
3. Hapus isi `Code.gs` bawaan, lalu tempel seluruh isi file `apps-script/Code.gs`
   dari paket ini.
4. Klik ikon **+** di sebelah "Files", buat file baru bernama `appsscript.json`
   kalau belum ada (biasanya sudah otomatis dibuat), lalu isi dengan konten dari
   `apps-script/appsscript.json` di paket ini.
5. Ganti password tim:
   - Di baris `const PASSWORD_TO_SET = 'GANTI_PASSWORD_INI';` pada fungsi
     `setPassword`, ganti dengan password asli yang akan dipakai tim.
   - Pilih fungsi `setPassword` dari dropdown di toolbar Apps Script, klik **Run**.
   - Google akan minta izin akses (karena skrip ini membaca Sheet) — klik
     **Advanced > Go to project (unsafe) > Allow**. Ini aman karena ini skrip
     milikmu sendiri.
   - Setelah berhasil run sekali, **hapus/ganti lagi nilai password di kode**
     supaya tidak tertinggal di riwayat kalau nanti kamu commit ke git (walau
     folder `apps-script/` tidak wajib ikut di-commit — lihat catatan keamanan
     di bawah).
6. **Deploy > New deployment**:
   - Klik ikon gear ⚙️ di samping "Select type" → pilih **Web app**.
   - Execute as: **Me**.
   - Who has access: **Anyone**.
   - Klik **Deploy**, lalu **Authorize access** kalau diminta.
7. Salin **Web app URL** yang muncul (formatnya
   `https://script.google.com/macros/s/XXXXXXXXXXX/exec`). Ini yang dipakai
   frontend nanti.

> **Kenapa "Anyone"?** Supaya frontend di Vercel bisa memanggilnya tanpa login
> akun Google. Keamanannya tetap terjaga karena endpoint `?action=data` hanya
> mau menjawab kalau `token` yang dikirim valid — dan token itu hanya bisa
> didapat lewat `?action=login` dengan password yang benar (disimpan di Script
> Properties, tidak terlihat siapa pun tanpa akses ke Apps Script project-mu).

### Catatan keamanan
- Folder `apps-script/` **sebaiknya tidak ikut di-push ke GitHub public**, atau
  kalau ingin tetap disertakan untuk dokumentasi, pastikan tidak ada password
  asli tertinggal di dalam kode (fungsi `setPassword` sudah didesain agar
  password hanya nilai sementara saat run, bukan disimpan permanen di kode).
- Kalau tim berganti-ganti, cukup jalankan ulang `setPassword` dengan password
  baru — token lama otomatis kedaluwarsa dalam 6 jam.

---

## Bagian 2 — Push kode ke GitHub

Dari komputer kamu (bukan dari sini), jalankan di folder `ltk-tracker/`:

```bash
git init
git add frontend README.md
# apps-script/ opsional, lihat catatan keamanan di atas
git add apps-script
git commit -m "Initial commit: LTK UI tracker dashboard"
```

Buat repo baru (kosong, tanpa README) di https://github.com/new, misalnya
`ltk-ui-tracker`, lalu **set ke Private** (Settings saat membuat repo → pilih
Private) supaya tidak terlihat publik di GitHub. Setelah itu:

```bash
git remote add origin https://github.com/USERNAME/ltk-ui-tracker.git
git branch -M main
git push -u origin main
```

`.env` tidak akan ikut ter-push karena sudah ada di `.gitignore` — URL Apps
Script hanya akan disimpan sebagai secret di Vercel (bagian 3).

---

## Bagian 3 — Deploy ke Vercel

1. Buka https://vercel.com/new, login (bisa pakai akun GitHub kamu).
2. Pilih **Import** pada repo `ltk-ui-tracker` yang baru dibuat.
3. Saat konfigurasi project muncul:
   - **Root Directory**: klik "Edit", pilih folder **`frontend`** (penting —
     bukan root repo, karena kode React ada di subfolder ini).
   - **Framework Preset**: Vercel akan otomatis mendeteksi **Vite**.
4. Buka bagian **Environment Variables**, tambahkan:
   - Key: `VITE_APPS_SCRIPT_URL`
   - Value: URL Apps Script dari Bagian 1 langkah 7 (yang diakhiri `/exec`)
5. Klik **Deploy**. Tunggu 1–2 menit, Vercel akan memberi kamu URL seperti
   `https://ltk-ui-tracker.vercel.app`.

### Tambahan lapisan keamanan (opsional tapi disarankan)
Karena ini data internal sensitif, tambahkan proteksi di level Vercel juga:
- Kalau punya **Vercel Pro**: Project Settings > Deployment Protection >
  aktifkan **Password Protection** atau **Vercel Authentication** — ini
  mengunci seluruh situs sebelum halaman login aplikasi pun tampil.
- Kalau pakai plan gratis (Hobby): setidaknya jangan sebar URL-nya secara
  terbuka, dan pastikan password tim di Apps Script kuat & hanya dibagikan ke
  tim asesor lewat kanal yang aman (bukan grup publik).

---

## Menjalankan secara lokal (opsional, untuk development)

```bash
cd frontend
cp .env.example .env
# edit .env, isi VITE_APPS_SCRIPT_URL dengan URL Apps Script kamu
npm install
npm run dev
```

Buka `http://localhost:5173`, login dengan password tim yang sudah diatur di
Bagian 1.

---

## Update tampilan setelah deploy

Setiap kali kamu ubah kode di `frontend/`, cukup:
```bash
git add .
git commit -m "Update tampilan"
git push
```
Vercel otomatis re-deploy setiap ada push ke branch `main`.

Kalau kamu ubah **struktur kolom** di Google Sheet (nama kolom baru/berubah),
sesuaikan juga pemetaan grup kolom di
`frontend/src/fieldGroups.js` supaya kolom baru ikut tampil di detail kandidat.
