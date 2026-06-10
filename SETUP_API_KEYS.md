# Panduan Setup API Key untuk MCP Server

File sementara ini dibuat untuk memandu Anda mendapatkan API Key yang dibutuhkan agar MCP Server dapat terhubung. File ini akan dihapus setelah proses setup dan validasi selesai.

## 🔑 Daftar API Key yang Dibutuhkan

Untuk mengaktifkan server `neon` dan `github`, kita membutuhkan dua kunci otentikasi berikut:

1. **`NEON_API_KEY`** (Untuk server Neon Postgres)
2. **`GITHUB_PERSONAL_ACCESS_TOKEN`** (Untuk server GitHub)

---

## 📖 Cara Mendapatkan API Key

### 1. Cara Mendapatkan `NEON_API_KEY`
1. Buka dan login ke dashboard Neon di [console.neon.tech](https://console.neon.tech/).
2. Klik ikon profil/pengaturan di pojok kanan atas atau bawah, lalu pilih **Developer Settings** atau **Account Settings**.
3. Cari menu **API Keys**.
4. Klik tombol **Create new API Key**.
5. Beri nama (misalnya: `ECC_MCP_Key`) dan klik Create.
6. Salin kunci yang muncul (biasanya berawalan dengan kombinasi karakter acak yang panjang). Kunci ini hanya akan ditampilkan satu kali.

### 2. Cara Mendapatkan `GITHUB_PERSONAL_ACCESS_TOKEN`
1. Buka dan login ke GitHub di [github.com](https://github.com/).
2. Klik foto profil Anda di pojok kanan atas, lalu pilih **Settings**.
3. Scroll ke bawah di menu sebelah kiri, lalu klik **Developer settings** (berada paling bawah).
4. Pilih **Personal access tokens** -> **Tokens (classic)**.
5. Klik tombol **Generate new token** -> **Generate new token (classic)**.
6. Beri nama di kolom *Note* (misalnya: `ECC_Gemini_CLI`).
7. Atur *Expiration* sesuai kebutuhan Anda (misalnya 30 atau 90 hari).
8. Pada bagian *Select scopes*, centang kotak **`repo`** (ini memberikan akses penuh ke repositori privat dan publik).
9. Scroll ke bawah dan klik **Generate token**.
10. Salin token yang diawali dengan `ghp_`.

---

## 🛠️ Status MCP Lainnya (Tidak Membutuhkan API Key Biasa)
*   **`magic`**: Hanya butuh diunduh (di-*cache*). Saya akan menjalankannya di latar belakang agar terhubung otomatis.
*   **`vercel`**: Harus login via terminal (`vercel login`) jika menggunakan CLI, atau Vercel MCP mungkin butuh dikonfigurasi di luar sesi ini.
*   **`devfleet`**: Anda harus menjalankan *engine* DevFleet secara terpisah di komputer Anda pada port `18801`.

---
*Silakan kirimkan kunci Anda di terminal dengan format:*
`NEON_API_KEY="napi_YOUR_NEON_API_KEY"`
`GITHUB_PERSONAL_ACCESS_TOKEN="ghp_YOUR_GITHUB_PERSONAL_ACCESS_TOKEN"`

