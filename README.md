# 🔩 MILLING INTRODUCTION

**Media Pembelajaran Interaktif Praktik Frais Dasar — Politeknik ATMI Surakarta**

Media pembelajaran digital resmi untuk mendukung kegiatan **Praktik Frais Dasar Tingkat 1** pada Section Milling, Politeknik ATMI Surakarta. Website ini dibangun murni dengan HTML, CSS, dan JavaScript — tanpa backend, tanpa database, tanpa framework — sehingga **siap di-deploy ke GitHub Pages**.

> Sumber materi: PPT **MILLING INTRODUCTION** (Section Milling) dan diktat **Teknik Manufaktur Milling (Semester 1)** serta simulasi 3D proses frais.

---

## ✨ Fitur

| Fitur | Keterangan |
| --- | --- |
| 🏠 Home interaktif | Hero, statistik, ringkasan 12 topik, banner simulasi 3D |
| 📘 Materi Dasar Milling | Pengertian, prinsip kerja, unsur proses, contoh pengerjaan, face/side cutting, climbing vs conventional |
| 🏭 Mesin Milling | 8 bagian utama mesin + jenis mesin (vertical, horizontal, universal, copy, hobbing, gravier, planer, CNC) |
| 🧮 Cutting Condition + Kalkulator | Rumus Cs, n, feeding (3 type), time calculation + **kalkulator RPM, feeding, dan waktu potong** dengan contoh angka diktat |
| 🔩 Cutting Tools | 18 kartu alat potong (fungsi, karakteristik, penggunaan) + filter kategori |
| 🧰 Aksesoris | 17 kartu arbor & clamping device + tabel dimensi Arbor ISO 30–60 |
| ⚙️ Practice Milling | 5 kartu praktik dengan modal detail (proses, target, alat terkait) |
| 📝 Work Preparation | Interactive timeline 7 langkah sesuai urutan PPT |
| 📏 Alat Ukur | 10 kartu alat ukur & alat bantu ukur + tabel kategori UMUM/KHUSUS/ISO |
| 📊 Penilaian | Tautan resmi rubrik penilaian, modul, dan video pengenalan |
| ⚠️ K3L & 5R | Aturan K3 (kartu peringatan), checklist **"SAYA SUDAH MEMAHAMI K3"** (tersimpan otomatis), 5R, dan tabel kompensasi lengkap |
| 📋 Aturan Section | Briefing, pelumasan & warming up, cleaning, logbook, lembur, start/stop, HP, bahasa, WP, AMDK/tumbler |
| 🎯 Target Praktik | Dashboard target non-seamless & seamless per program studi dengan visualisasi |
| ✅ Evaluasi | Kuis interaktif **20 soal** dengan koreksi langsung, nilai, dan kunci jawaban |
| 🔍 Search global | Cari materi apa pun (`Ctrl/⌘ + K`) |
| 🔖 Bookmark | Simpan materi favorit (tersimpan di `localStorage`) |
| 📈 Progress Belajar | Tandai "✓ Sudah Dipelajari" per modul, progress otomatis dihitung |
| 🌗 Dark / Light Mode | Tema tersimpan di `localStorage` |
| 🖥️ Simulasi 3D | Animasi 3D proses frais (face, slot, step, pocket, drilling) tersemat + mode layar penuh |
| 📱 Responsive | Layout full-width tanpa sidebar — top navigation, grid CSS, hamburger di ponsel |

---

## 📂 Struktur Folder

```
milling-introduction/
│
├── index.html          ← Entry point (buka file ini)
├── style.css           ← Seluruh styling + tema light/dark
├── script.js           ← Seluruh logika interaktif
├── simulasi-3d.html    ← Simulasi 3D proses frais (Three.js)
├── README.md           ← Dokumen ini
│
└── assets/
    ├── images/
    │   ├── logo/            logo-atmi-blue.png, logo-atmi-white.png, logo-atmi-shield.png
    │   ├── instructors/     foto instruktur (SVG placeholder → ganti .jpg asli dari PPT)
    │   ├── milling/         ilustrasi dasar milling, mesin, WP, climbing/conventional, dll.
    │   ├── tools/           18 ilustrasi cutting tools
    │   ├── practice/        ilustrasi practice 1–4
    │   ├── accessories/     17 ilustrasi arbor & clamping device
    │   └── alat-ukur/       10 ilustrasi alat ukur
    └── icons/
        └── favicon.svg
```

---

## 🖥️ Cara Menjalankan Lokal

**Cara termudah (tanpa server):**
1. Unduh / clone folder `milling-introduction`.
2. Klik dua kali **`index.html`** — website langsung berjalan di browser.

**Dengan server lokal (disarankan agar iframe & font optimal):**
```bash
# Python 3
cd milling-introduction
python -m http.server 8000
# buka http://localhost:8000
```

> Tidak membutuhkan PHP, database, Node.js, atau server khusus.

---

## ⬆️ Cara Upload ke GitHub

1. Buat akun di [github.com](https://github.com) lalu login.
2. Klik **+** (pojok kanan atas) → **New repository**.
3. Isi nama repo, contoh: `milling-introduction`, pilih **Public**, klik **Create repository**.
4. Upload seluruh **isi** folder `milling-introduction/` (bukan foldernya saja):
   - **Cara drag & drop:** di halaman repo kosong, tarik seluruh file & folder ke area upload → **Commit changes**.
   - **Cara Git (terminal):**
     ```bash
     cd milling-introduction
     git init
     git add .
     git commit -m "Milling Introduction - media pembelajaran interaktif"
     git branch -M main
     git remote add origin https://github.com/USERNAME/milling-introduction.git
     git push -u origin main
     ```
   - **Cara GitHub Desktop:** File → Add local repository → pilih folder → Publish repository.
5. Pastikan `index.html` berada di **root** repository (bukan di dalam subfolder).

---

## 🚀 Cara Mengaktifkan GitHub Pages

1. Buka repository di GitHub → tab **Settings**.
2. Di menu samping pilih **Pages**.
3. Pada bagian *Build and deployment*:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` dan folder `/ (root)`
4. Klik **Save**.
5. Tunggu 1–3 menit, refresh halaman. Akan muncul alamat:
   ```
   https://USERNAME.github.io/milling-introduction/
   ```
6. Bagikan alamat tersebut ke mahasiswa. Selesai — website pembelajaran sudah online! 🎉

> File `.nojekyll` sudah disertakan agar GitHub Pages melayani semua file langsung tanpa pemrosesan Jekyll.

---

## 👨‍🏫 Mengganti Foto Instruktur (penting)

Foto asli instruktur berada di slide **"Instructor"** pada PPT *MILLING INTRODUCTION*. Saat rilis ini, folder `assets/images/instructors/` berisi placeholder yang otomatis tergantikan:

1. Ekstrak foto dari PPT (klik kanan gambar di PowerPoint → *Save as Picture*).
2. Simpan dengan nama:
   - `assets/images/instructors/dedi-kristanto.jpg`
   - `assets/images/instructors/aditya-wahyu-handoko.jpg`
3. Commit & push — foto asli **otomatis muncul** menggantikan placeholder (tanpa mengubah kode).

Cara yang sama berlaku untuk mengganti ilustrasi dengan foto asli dari PPT (mis. foto penyimpangan 5R): simpan dengan nama file SVG yang sama (ganti ekstensi) lalu perbarui path di `script.js` / `index.html`.

---

## 🧩 Catatan Teknis

- Seluruh path aset **relatif** (`assets/...`) — aman untuk GitHub Pages di subpath repo.
- Data kartu (tools, aksesoris, alat ukur, praktik, kuis) terpusat di `script.js` sehingga mudah diperbarui instruktur.
- Preferensi pengguna (tema, bookmark, progress, checklist K3, skor kuis) tersimpan di `localStorage` browser masing-masing mahasiswa.
- Simulasi 3D memuat Three.js & Tailwind dari CDN — membutuhkan koneksi internet saat pertama dibuka.

---

## 📄 Kredit

- **Materi:** Diktat Teknik Manufaktur Milling (ATMI, 9 Januari 2008) & PPT MILLING INTRODUCTION — Section Milling Politeknik ATMI Surakarta.
- **Instruktur:** Dedi Kristanto & Aditya Wahyu Handoko.

© 2026 Politeknik ATMI Surakarta
