# Dokumentasi Backend Website Daerah Solok

## Daftar Isi

- [Pengenalan](#pengenalan)
- [Struktur Project](#struktur-project)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Database](#database)
- [API Endpoints](#api-endpoints)
- [Autentikasi & Otorisasi](#autentikasi--otorisasi)
- [Upload File](#upload-file)
- [Error Handling](#error-handling)
- [Deployment](#deployment)

## Pengenalan

Backend Website Daerah Solok adalah sistem API RESTful yang menyediakan data dan layanan untuk frontend website. Backend ini dibangun menggunakan Node.js dengan Express.js dan TypeScript, menggunakan MySQL sebagai database.

Sistem ini menyediakan fitur-fitur berikut:

- Autentikasi dan otorisasi pengguna
- Manajemen destinasi wisata
- Manajemen bisnis lokal
- Manajemen acara/event
- Forum diskusi
- Upload dan manajemen gambar

## Struktur Project

Project backend menggunakan struktur modular untuk memudahkan pengembangan dan pemeliharaan:

```
backend/
├── src/                    # Source code utama
│   ├── config/             # Konfigurasi aplikasi
│   ├── controllers/        # Controller untuk menangani request
│   ├── database/           # Inisialisasi database dan migrasi
│   │   ├── schema/         # Skema database
│   │   └── seeds/          # Data awal database
│   ├── middleware/         # Middleware Express
│   ├── models/             # Model data dan logika bisnis
│   ├── routes/             # Definisi route API
│   ├── types/              # Type definitions for TypeScript
│   ├── validators/         # Validasi input
│   └── server.ts           # Entry point aplikasi
├── uploads/                # Penyimpanan file upload
├── views/                  # Template views (untuk dashboard admin)
├── .env                    # Environment variables
├── .env.example            # Contoh konfigurasi environment
├── package.json            # Dependencies dan scripts
└── tsconfig.json           # Konfigurasi TypeScript
```

## Teknologi yang Digunakan

1. **Node.js** - Runtime JavaScript
2. **Express.js** - Framework web untuk Node.js
3. **TypeScript** - Superset JavaScript yang menambahkan fitur static typing
4. **MySQL** - Database relasional
5. **JWT (JSON Web Token)** - Untuk autentikasi dan otorisasi
6. **Bcrypt** - Untuk hashing password
7. **Multer** - Untuk menangani upload file
8. **Zod** - Untuk validasi data input
9. **CORS** - Untuk menangani Cross-Origin Resource Sharing

## Database

### Struktur Database

Database terdiri dari beberapa tabel utama:

1. **users** - Menyimpan data pengguna
2. **tourism_destinations** - Destinasi wisata
3. **tourism_images** - Gambar destinasi wisata
4. **businesses** - Data bisnis/UMKM lokal
5. **events** - Acara dan kegiatan lokal
6. **forum_categories** - Kategori forum diskusi
7. **forum_threads** - Thread diskusi di forum
8. **forum_posts** - Balasan/post dalam thread forum
9. **forum_reactions** - Reaksi (like/dislike) untuk thread dan post

### Skema Tourism Destinations

```sql
CREATE TABLE IF NOT EXISTS tourism_destinations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  category VARCHAR(100),
  image_url VARCHAR(255),
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_tourism_category ON tourism_destinations(category);
CREATE INDEX idx_tourism_featured ON tourism_destinations(featured);
```

### Skema Tourism Images

```sql
CREATE TABLE IF NOT EXISTS tourism_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tourism_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  caption TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tourism_id) REFERENCES tourism_destinations(id) ON DELETE CASCADE
);
```

### Inisialisasi Database

Database diinisialisasi melalui file `src/database/init.ts` yang akan membaca dan menjalankan file SQL dari direktori `schema`. Jika file tidak ditemukan, skema akan dibuat secara langsung di kode.

## API Endpoints

### Autentikasi

- **POST /api/auth/register** - Registrasi pengguna baru
- **POST /api/auth/login** - Login pengguna
- **POST /api/auth/refresh-token** - Memperbaharui access token
- **GET /api/auth/me** - Mendapatkan data pengguna yang sedang login
- **POST /api/auth/logout** - Logout pengguna
- **POST /api/auth/forgot-password** - Meminta reset password
- **POST /api/auth/reset-password** - Reset password

### Pengguna (Users)

- **GET /api/users** - Mendapatkan semua pengguna (admin only)
- **GET /api/users/profile** - Mendapatkan profil pengguna yang sedang login
- **GET /api/users/:id** - Mendapatkan data pengguna berdasarkan ID (admin only)
- **PUT /api/users/profile** - Update profil pengguna yang sedang login
- **PUT /api/users/:id** - Update data pengguna (admin only)
- **DELETE /api/users/:id** - Hapus pengguna (admin only)

### Destinasi Wisata (Tourism)

- **GET /api/tourism** - Mendapatkan semua destinasi wisata
- **GET /api/tourism/featured** - Mendapatkan destinasi wisata unggulan
- **GET /api/tourism/:id** - Mendapatkan destinasi wisata berdasarkan ID
- **GET /api/tourism/:id/images** - Mendapatkan destinasi wisata dengan gambar
- **POST /api/tourism** - Menambahkan destinasi wisata baru (admin only)
- **PUT /api/tourism/:id** - Update destinasi wisata (admin only)
- **DELETE /api/tourism/:id** - Hapus destinasi wisata (admin only)
- **POST /api/tourism/upload** - Upload gambar destinasi wisata (admin only)
- **POST /api/tourism/:tourismId/images** - Upload multiple gambar untuk destinasi wisata (admin only)
- **PUT /api/tourism/images/:id/primary** - Set gambar sebagai primary (admin only)
- **PUT /api/tourism/images/:id** - Update data gambar (admin only)
- **DELETE /api/tourism/images/:id** - Hapus gambar (admin only)

### Bisnis / UMKM (Business)

- **GET /api/business** - Mendapatkan semua bisnis/UMKM
- **GET /api/business/featured** - Mendapatkan bisnis unggulan
- **GET /api/business/:id** - Mendapatkan bisnis berdasarkan ID
- **POST /api/business** - Menambahkan bisnis baru (admin only)
- **PUT /api/business/:id** - Update data bisnis (admin only)
- **DELETE /api/business/:id** - Hapus bisnis (admin only)
- **POST /api/business/upload** - Upload gambar bisnis (admin only)

### Acara / Event

- **GET /api/event** - Mendapatkan semua acara
- **GET /api/event/upcoming** - Mendapatkan acara yang akan datang
- **GET /api/event/:id** - Mendapatkan acara berdasarkan ID
- **POST /api/event** - Menambahkan acara baru (admin only)
- **PUT /api/event/:id** - Update data acara (admin only)
- **DELETE /api/event/:id** - Hapus acara (admin only)
- **POST /api/event/upload** - Upload gambar acara (admin only)

### Forum

- **GET /api/forum/categories** - Mendapatkan semua kategori forum
- **GET /api/forum/categories/:categoryId** - Mendapatkan kategori berdasarkan ID
- **GET /api/forum/categories/:categoryId/threads** - Mendapatkan thread dalam kategori
- **GET /api/forum/threads/recent** - Mendapatkan thread terbaru
- **GET /api/forum/threads/:threadId** - Mendapatkan thread berdasarkan ID
- **GET /api/forum/stats** - Mendapatkan statistik forum
- **POST /api/forum/categories/:categoryId/threads** - Membuat thread baru
- **POST /api/forum/threads/:threadId/posts** - Membuat post/balasan dalam thread
- **PUT /api/forum/threads/:threadId** - Update thread
- **PUT /api/forum/posts/:postId** - Update post
- **DELETE /api/forum/threads/:threadId** - Hapus thread
- **DELETE /api/forum/posts/:postId** - Hapus post
- **POST /api/forum/admin/categories** - Admin: Buat kategori baru
- **PUT /api/forum/admin/categories/:categoryId** - Admin: Update kategori
- **DELETE /api/forum/admin/categories/:categoryId** - Admin: Hapus kategori
- **GET /api/forum/admin/reports** - Admin: Lihat konten yang dilaporkan

## Autentikasi & Otorisasi

### Sistem Autentikasi

Sistem autentikasi menggunakan JSON Web Token (JWT). Setiap request yang membutuhkan autentikasi harus menyertakan token di header Authorization dalam format Bearer.

```
Authorization: Bearer <jwt_token>
```

### Middleware Autentikasi

File `src/middleware/auth.middleware.ts` berisi middleware untuk:

- **authenticate**: Memastikan user sudah login dengan memeriksa JWT
- **optionalAuthenticate**: Memeriksa JWT jika ada, tapi tidak menolak jika tidak ada
- **requireRole**: Memeriksa apakah user memiliki role yang diperlukan
- **requireAdmin**: Shortcut untuk memeriksa role admin

### Middleware Otorisasi

File `src/middleware/authorize.middleware.ts` berisi middleware untuk:

- **authorize**: Memeriksa apakah user memiliki role yang diizinkan
- **authorizeResourceAccess**: Memeriksa apakah user adalah pemilik resource atau admin

## Upload File

### Konfigurasi Upload

File upload ditangani oleh middleware `src/middleware/upload.middleware.ts` menggunakan Multer:

- **tourismUpload**: Untuk upload gambar destinasi wisata
- **businessUpload**: Untuk upload gambar bisnis
- **eventUpload**: Untuk upload gambar acara
- **profileUpload**: Untuk upload gambar profil

### Direktori Upload

File yang diupload disimpan di direktori `uploads/` dengan subdirektori berdasarkan jenis:

- `uploads/tourism/`
- `uploads/business/`
- `uploads/events/`
- `uploads/profiles/`

## Error Handling

### Middleware Error Handling

Error handling ditangani oleh middleware di `src/middleware/error.middleware.ts` yang berisi:

- **ApiError**: Custom error class
- **notFoundHandler**: Menangani 404 Not Found
- **errorHandler**: Global error handler

### Validasi Input

Validasi input menggunakan Zod di `src/middleware/validation.middleware.ts` dengan:

- **validateBody**: Memvalidasi body request
- **validateQuery**: Memvalidasi query parameter
- **validateParams**: Memvalidasi path parameter

## Models

### Model Pattern

Backend menggunakan pattern model untuk komunikasi dengan database. Setiap model memiliki fungsi CRUD dasar:

- **findAll**: Mendapatkan semua data dengan pagination
- **findById**: Mendapatkan data berdasarkan ID
- **create**: Membuat data baru
- **update**: Update data
- **delete**: Hapus data

Contoh model utama:

- **User.ts**: Untuk manajemen pengguna
- **TourismDestination.ts**: Untuk destinasi wisata
- **TourismImage.ts**: Untuk gambar destinasi wisata
- **Business.ts**: Untuk bisnis lokal
- **Event.ts**: Untuk acara/event
- **ForumCategory.ts**: Untuk kategori forum
- **ForumThread.ts**: Untuk thread forum
- **ForumPost.ts**: Untuk post forum

## Controllers

Controller bertugas menangani request HTTP dan mengembalikan response:

- **authController.ts**: Menangani autentikasi
- **userController.ts**: Manajemen pengguna
- **tourismController.ts**: Manajemen destinasi wisata
- **tourismImageController.ts**: Manajemen gambar destinasi wisata
- **businessController.ts**: Manajemen bisnis
- **eventController.ts**: Manajemen acara
- **forumController.ts**: Manajemen forum

## Deployment

### Environment Variables

Konfigurasi aplikasi menggunakan environment variables yang didefinisikan di file `.env`:

- `NODE_ENV` - Development atau production mode
- `PORT` - Port server
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` - Konfigurasi database
- `JWT_SECRET`, `JWT_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN` - Konfigurasi JWT
- `CORS_ORIGIN` - Origin yang diizinkan untuk CORS

### Setup Database

Database dapat diinisialisasi dengan:

1. Membuat database sesuai dengan `DB_NAME`
2. Menjalankan aplikasi yang akan otomatis membuat tabel dari skema
3. Data awal dapat diimpor dari folder `src/database/seeds/`

### Running the Server

Untuk menjalankan server dalam mode development:

```bash
npm run dev
```

Untuk build dan menjalankan dalam mode production:

```bash
npm run build
npm start
```
