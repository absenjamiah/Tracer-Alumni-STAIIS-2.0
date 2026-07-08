
# PANDUAN DEPLOY KE CPANEL (Tracer Study)

Ikuti langkah-langkah ini secara berurutan. Jangan loncat langkah.

## BAGIAN 1: Persiapan Wajib (Install Node.js)

**PENTING:** Jika Anda mengetik perintah dan muncul error merah *"npm is not recognized"*, artinya Anda belum melakukan langkah ini.

1.  **Download Node.js**
    -   Kunjungi: `https://nodejs.org/`
    -   Download versi **LTS** (Recommended).
2.  **Install**
    -   Buka file yang didownload.
    -   Klik Next > Next > Install > Finish.
3.  **Cek Instalasi**
    -   Buka Terminal/CMD baru.
    -   Ketik `node -v` dan enter. Jika muncul angka (misal v20.x.x), berarti sukses.

## BAGIAN 2: Membuat File Website (Proses Build)

1.  **Buka Terminal di Folder Proyek**
    -   Masuk ke folder proyek di File Explorer.
    -   Klik Address Bar (kolom alamat folder di atas), ketik `cmd`, lalu Enter.

2.  **Jalankan Perintah (Satu per satu)**
    
    Perintah 1 (Download bahan-bahan):
    ```bash
    npm install
    ```
    *(Tunggu sampai selesai loading)*

    Perintah 2 (Masak/Build website):
    ```bash
    npm run build
    ```
    *(Tunggu sampai muncul tulisan 'dist/index.html')*

3.  **Ambil Hasilnya**
    -   Kembali ke File Explorer.
    -   Cari folder baru bernama **`dist`**.
    -   Isi folder `dist` inilah website Anda yang sudah jadi.

## BAGIAN 3: Upload ke Rumahweb (cPanel)

1.  Login ke cPanel `aboesaleek.xyz`.
2.  Buka menu **File Manager**.
3.  Masuk ke folder **`public_html`**.
    -   *Opsional:* Jika ingin website ada di sub-folder (misal `aboesaleek.xyz/tracer`), buat folder `tracer` dulu di sini.
4.  **Upload File:**
    -   Masuk ke dalam folder **`dist`** di komputer Anda.
    -   Pilih SEMUA file (Ctrl+A).
    -   Tarik (Drag & Drop) semua file tersebut ke area File Manager cPanel.
    -   Atau bisa di-ZIP dulu isinya, upload ZIP-nya, lalu Extract di cPanel.

## TROUBLESHOOTING (Masalah Umum)

### Error 1: "npm.ps1 cannot be loaded... scripts is disabled"
Ini adalah fitur keamanan Windows PowerShell. Jika muncul error merah panjang saat mengetik npm, lakukan ini:

1.  Copy perintah ini:
    `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`
2.  Paste di terminal, lalu tekan **Enter**.
3.  Jika ditanya konfirmasi, ketik **A** lalu **Enter**.
4.  Coba ketik `npm install` lagi.

### Error 2: Website Tidak Bisa Dibuka (DNS_PROBE_FINISHED_NXDOMAIN)
Jika muncul pesan error ini di browser, artinya **Domain belum aktif**. Coding Anda sudah benar, tapi "jalan" menuju websitenya belum tersambung.

**Solusi:**
1.  **Cek Nameserver:** Login ke Clientzone Rumahweb -> Domains -> Manage Nameservers. Pastikan sudah diarahkan ke Hosting (biasanya default `ns1.rumahweb.com` dst).
2.  **Tunggu Propagasi:** Domain baru butuh waktu 1 - 24 jam untuk dikenal internet. Tunggu saja.
3.  **Cek Alamat:** Pastikan Anda mengakses `https://aboesaleek.xyz/tracer` (jika Anda membuat folder tracer) atau `https://aboesaleek.xyz` (jika langsung di public_html).

## Selesai!
Website Anda sekarang siap digunakan.
