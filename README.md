# 📰 Blog Genzet - Frontend

Ini adalah proyek frontend dari aplikasi Blog Genzet. Aplikasi ini memungkinkan pengguna untuk melihat artikel, melakukan pencarian, filter berdasarkan kategori, dan menampilkan halaman preview untuk admin. Dibangun menggunakan **Next.js (App Router)**, **React**, **Tailwind CSS**, dan integrasi API ke backend Laravel.

## 📁 Struktur Project
```
app/
├── articles/ # Halaman publik daftar artikel
│ └── preview/[id]/ # Halaman preview artikel publik (slug-based)
├── admin/ # Halaman admin
│ ├── articles/ # List, create, edit artikel
│ ├── categories/ # Manajemen kategori
│ └── profile/ # Profil admin
components/ # Komponen UI (HeroSection, Footer, Card, dll)
hooks/ # React Query hooks (fetch artikel, kategori, dll)
services/ # API service
```

## 🚀 Teknologi yang Digunakan

- **Next.js (v14+)**
- **React**
- **Tailwind CSS**
- **TinyMCE** (untuk rich text editor)
- **React Query** (fetch data)
- **Radix UI** (Dropdown, Dialog)
- **Lucide Icons**
- **js-cookie** (auth token)
- **Dynamic Route & Server Component**

## 🔐 Autentikasi

Aplikasi menggunakan token dari cookie (`token`) yang diset saat login. Beberapa halaman admin dan preview membutuhkan token valid agar bisa mengakses konten.

## 🧩 Fitur

### Halaman Publik
- Daftar artikel dengan pagination
- Filter kategori & pencarian (debounce)
- Hero section dengan informasi pengguna
- Preview artikel (public preview by slug)

### Halaman Admin
- Login (auth token via cookie)
- Manajemen artikel:
  - Create, edit, delete
  - Upload thumbnail
  - Preview langsung
- Manajemen kategori
- Profil dan logout

### UI/UX
- Modal konfirmasi logout
- Dropdown menu di header
- Validasi form dengan feedback
- Loading state

## 🛠️ Instalasi & Development

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/blog-genzet-frontend.git
cd blog-genzet-frontend
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Jalankan Aplikasi
```bash
npm run dev
```
### 4. Akses Aplikasi
Buka browser dan akses `http://localhost:3000`.



