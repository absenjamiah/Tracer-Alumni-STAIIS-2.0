# MANUAL MUTU SISTEM INFORMASI TRACER STUDY
## STAI IMAM SYAFI’I CIANJUR
**Versi Dokumen: 1.0 (2024)**

---

### DAFTAR ISI
1. [Pendahuluan](#1-pendahuluan)
2. [Tujuan dan Ruang Lingkup](#2-tujuan-dan-ruang-lingkup)
3. [Istilah dan Definisi](#3-istilah-dan-definisi)
4. [Standar Fungsionalitas Sistem](#4-standar-fungsionalitas-sistem)
5. [Prosedur Operasional Standar (SOP)](#5-prosedur-operasional-standar-sop)
6. [Keamanan Data dan Privasi](#6-keamanan-data-dan-privasi)
7. [Pemeliharaan dan Pemulihan Bencana](#7-pemeliharaan-dan-pemulihan-bencana)

---

### 1. PENDAHULUAN
Sistem Informasi Tracer Study STAI Imam Syafi’i Cianjur adalah platform digital yang dirancang untuk melacak rekam jejak alumni setelah menyelesaikan masa pendidikan. Data yang dihasilkan melalui sistem ini merupakan instrumen krusial dalam evaluasi kurikulum, pemenuhan kriteria akreditasi (BAN-PT), dan pengembangan hubungan kelembagaan.

### 2. TUJUAN DAN RUANG LINGKUP
#### 2.1 Tujuan
*   Menjamin ketersediaan data alumni yang akurat dan *up-to-date*.
*   Menyediakan alat analisis otomatis bagi manajemen institusi untuk pengambilan keputusan berbasis data.
*   Mempermudah alumni dalam memberikan feedback terhadap kualitas layanan pendidikan.

#### 2.2 Ruang Lingkup
Manual ini mencakup seluruh aspek teknis dan manajerial penggunaan aplikasi, mulai dari pengelolaan database alumni, manajemen kuesioner dinamis, hingga interpretasi dashboard eksekutif.

### 3. ISTILAH DAN DEFINISI
*   **Administrator:** Personel yang ditunjuk oleh institusi untuk mengelola data dan sistem.
*   **Alumni:** Lulusan STAI Imam Syafi’i yang data identitasnya telah terdaftar dalam sistem.
*   **Dashboard:** Tampilan visualisasi data real-time dalam bentuk grafik dan tabel analisis.
*   **Google Sheets API:** Infrastruktur penyimpanan data berbasis cloud yang digunakan untuk menjaga transparansi dan aksesibilitas data.

### 4. STANDAR FUNGSIONALITAS SISTEM
Aplikasi harus memenuhi standar kualitas fungsional sebagai berikut:
1.  **Aksesibilitas:** Sistem harus dapat diakses melalui perangkat desktop maupun mobile (Responsive Design).
2.  **Validasi Login:** Pengisian kuesioner hanya dapat dilakukan oleh alumni yang terdaftar melalui validasi NIM (Nomor Induk Mahasiswa).
3.  **Integrasi Data:** Setiap jawaban kuesioner harus terekam secara otomatis ke dalam database tanpa jeda waktu (Real-time Sync).
4.  **Analisis Otomatis:** Dashboard harus mampu menyajikan persentase keterserapan kerja, relevansi kurikulum, dan masa tunggu lulusan secara otomatis.

### 5. PROSEDUR OPERASIONAL STANDAR (SOP)
#### 5.1 Pengelolaan Data Alumni (Pre-Survey)
1.  Administrator menyiapkan data lulusan dalam format CSV (NIM, Nama, Angkatan).
2.  Administrator melakukan impor data melalui menu "Import Alumni" pada dashboard admin.
3.  Sistem melakukan verifikasi otomatis untuk mencegah duplikasi data NIM.

#### 5.2 Proses Pengisian Kuesioner (Survey Flow)
1.  Alumni mengakses portal `https://aboesaleek.xyz/tracer`.
2.  Alumni memilih angkatan dan mencari nama pada kolom dropdown yang tersedia.
3.  Alumni mengisi 7 bagian kuesioner (A-G) secara berurutan.
4.  Setelah selesai, sistem akan menampilkan ringkasan jawaban sebagai bukti partisipasi.

#### 5.3 Pelaporan dan Ekspor Data
1.  Ketua Program Studi atau bagian Penjaminan Mutu dapat meninjau dashboard secara berkala.
2.  Data mentah dapat diekspor ke format CSV/Excel untuk keperluan pelaporan borang akreditasi.

### 6. KEAMANAN DATA DAN PRIVASI
STAI Imam Syafi’i berkomitmen menjaga kerahasiaan data alumni:
*   **Enkripsi Akses:** Seluruh pertukaran data dilindungi oleh enkripsi SSL/TLS.
*   **Kontrol Akses:** Hak akses dashboard administratif dibatasi hanya untuk personel yang memiliki kredensial valid (Email & Password).
*   **Anonimitas Analisis:** Meskipun identitas terekam, laporan publikasi hasil tracer study disajikan dalam bentuk agregat (persentase) tanpa mengekspos data pribadi secara detail.

### 7. PEMELIHARAAN DAN PEMULIHAN BENCANA
#### 7.1 Pemeliharaan (Maintenance)
*   Pemeriksaan integritas koneksi Google Sheets API dilakukan setiap 6 bulan.
*   Pembaruan pustaka (Library) frontend dilakukan secara berkala untuk menjaga kompatibilitas browser.

#### 7.2 Cadangan Data (Backup)
Data tersimpan secara redundan di infrastruktur Google Cloud. Administrator disarankan melakukan unduhan database manual (Export CSV) secara berkala (minimal setiap akhir periode wisuda) sebagai cadangan luring (offline backup).

---
**Ditetapkan di:** Cianjur
**Unit Penjaminan Mutu (UPM)**
**STAI Imam Syafi’i Cianjur**