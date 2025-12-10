# HALO PROJECT
## Sistem Bimbingan Konseling SMK Taruna Bhakti

Sistem bimbingan konseling berbasis web dan mobile untuk mengelola jadwal konseling siswa di SMK Taruna Bhakti. Project ini terdiri dari aplikasi web (Next.js) dan aplikasi mobile (React Native/Expo) yang terintegrasi dengan database MySQL.

---

## 📋 Daftar Isi

- [Deskripsi Project](#deskripsi-project)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Tech Stack](#tech-stack)
- [Struktur Project](#struktur-project)
- [Database & Teknologi Database](#database--teknologi-database)
- [Setup & Instalasi](#setup--instalasi)
- [Konfigurasi Database](#konfigurasi-database)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [API & Endpoints](#api--endpoints)
- [Fitur per Role](#fitur-per-role)
- [Development Guide](#development-guide)

---

## 📖 Deskripsi Project

HALO PROJECT adalah sistem bimbingan konseling yang memungkinkan:
- **Siswa** untuk membuat jadwal konseling, memilih guru BK, dan melihat history konseling
- **Guru BK** untuk mengelola jadwal konseling, mengupdate status, dan menambahkan catatan
- **Admin** untuk mengelola data siswa, guru, dan laporan konseling
- **Super Admin** untuk akses penuh ke semua pengaturan sistem

Project ini terdiri dari 2 aplikasi:
1. **Web Application** (`my-app/`) - Next.js dengan App Router
2. **Mobile Application** (`mobile-app/`) - React Native dengan Expo

---

## 🏗 Arsitektur Sistem

```
┌─────────────────┐         ┌─────────────────┐
│  Mobile App     │────────▶│   Web App       │
│  (React Native) │  HTTP   │   (Next.js)     │
└─────────────────┘         └────────┬────────┘
                                     │
                                     │ MySQL2
                                     │ Connection Pool
                                     ▼
                              ┌──────────────┐
                              │   MySQL      │
                              │   Database   │
                              └──────────────┘
```

### Komponen Utama:
- **Frontend Web**: Next.js 16 dengan App Router, TypeScript, Tailwind CSS
- **Frontend Mobile**: React Native dengan Expo Router
- **Backend**: Next.js API Routes (Server Actions)
- **Database**: MySQL dengan connection pooling
- **Authentication**: bcryptjs untuk password hashing

---

## 🛠 Tech Stack

### Web Application (`my-app/`)

#### Core Technologies
- **Framework**: Next.js 16.0.3 (App Router)
- **Language**: TypeScript 5
- **Runtime**: Node.js 18+
- **Package Manager**: npm

#### Database & Backend
- **Database**: MySQL 8.0+
- **Database Driver**: mysql2 ^3.15.3 (Promise-based)
- **Connection**: Connection Pool dengan konfigurasi:
  - `connectionLimit: 10`
  - `waitForConnections: true`
  - `enableKeepAlive: true`
- **Password Hashing**: bcryptjs ^3.0.3

#### Frontend
- **Styling**: Tailwind CSS 4
- **Theme**: next-themes ^0.4.6 (dark/light mode)
- **State Management**: React Hooks & Context API
- **UI Components**: Custom components dengan Tailwind

#### Development Tools
- **Linting**: ESLint ^9
- **Type Checking**: TypeScript ^5
- **Build Tool**: Next.js built-in

### Mobile Application (`mobile-app/`)

#### Core Technologies
- **Framework**: React Native 0.81.5
- **Expo SDK**: ~54.0.27
- **Language**: TypeScript 5.9.2
- **Navigation**: Expo Router ~6.0.17 (file-based routing)

#### UI & Styling
- **Styling**: StyleSheet API (React Native)
- **Icons**: @expo/vector-icons ^15.0.3
- **Images**: expo-image ~3.0.11
- **Status Bar**: expo-status-bar ~3.0.9

#### Navigation & Animations
- **Router**: expo-router ~6.0.17
- **Stack Navigation**: @react-navigation/native ^7.1.8
- **Animations**: react-native-reanimated ~4.1.1
- **Gestures**: react-native-gesture-handler ~2.28.0
- **Haptics**: expo-haptics ~15.0.8

#### Development Tools
- **Linting**: ESLint ^9.25.0
- **Expo CLI**: Untuk development dan build

---

## 📁 Struktur Project

```
PROJECT_BK/
├── my-app/                    # Web Application (Next.js)
│   ├── app/                   # Next.js App Router
│   │   ├── admin/             # Halaman admin
│   │   │   ├── guru/          # Kelola guru BK
│   │   │   ├── jadwal/        # Kelola jadwal
│   │   │   ├── laporan/       # Kelola laporan
│   │   │   ├── siswa/         # Kelola siswa
│   │   │   └── page.tsx       # Dashboard admin
│   │   ├── guru/              # Halaman guru BK
│   │   │   ├── dashboard/     # Dashboard guru
│   │   │   └── jadwal/        # Jadwal guru
│   │   ├── home/              # Halaman siswa
│   │   │   ├── dasboard/      # Dashboard siswa
│   │   │   └── page.tsx       # Home siswa
│   │   ├── login/             # Halaman login
│   │   ├── profile/           # Profile user
│   │   ├── history/           # History konseling
│   │   ├── pilih-guru/        # Pilih guru BK
│   │   ├── components/        # React components
│   │   ├── contexts/          # React contexts
│   │   └── layout.tsx         # Root layout
│   ├── lib/                   # Library & utilities
│   │   ├── db/                # Database operations
│   │   │   ├── mysql.tsx      # MySQL connection pool
│   │   │   ├── users.tsx      # User CRUD operations
│   │   │   ├── jadwal.tsx     # Jadwal CRUD operations
│   │   │   └── index.tsx      # Export semua operations
│   │   └── types/             # TypeScript types
│   │       ├── database.tsx   # Database types
│   │       └── index.tsx      # Type exports
│   ├── scripts/               # Utility scripts
│   │   ├── insert-default-users.js
│   │   ├── insert-siswa-xi-rpl1.js
│   │   ├── fix-passwords.js
│   │   └── test-connection.js
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── .env                   # Environment variables
│
└── mobile-app/                # Mobile Application (React Native/Expo)
    ├── app/                   # Expo Router (file-based routing)
    │   ├── _layout.tsx       # Root layout
    │   ├── index.tsx         # Landing page
    │   ├── login.tsx         # Login universal
    │   ├── home.tsx          # Home siswa
    │   ├── home/
    │   │   └── dashboard.tsx # Dashboard siswa
    │   ├── pilih-guru.tsx    # Form booking jadwal
    │   ├── history.tsx       # History konseling
    │   ├── profile.tsx       # Profile user
    │   ├── guru/             # Halaman guru
    │   │   ├── dashboard.tsx
    │   │   └── jadwal.tsx
    │   └── admin-dashboard.tsx
    ├── lib/                  # Utilities
    │   ├── api.ts            # API configuration
    │   └── storage.ts        # Storage utilities
    ├── components/           # Reusable components
    ├── assets/               # Static assets
    ├── package.json
    ├── app.json              # Expo configuration
    └── tsconfig.json
```

---

## 🗄 Database & Teknologi Database

### Database System
- **Database**: MySQL 8.0 atau lebih tinggi
- **Database Name**: `halo_project` (default)
- **Port**: 3306 (default)

### Connection Pool Configuration

Aplikasi menggunakan **MySQL Connection Pool** untuk efisiensi koneksi database. Konfigurasi ada di `my-app/lib/db/mysql.tsx`:

```typescript
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'halo_project',
  waitForConnections: true,        // Tunggu jika pool penuh
  connectionLimit: 10,             // Maksimal 10 koneksi simultan
  queueLimit: 0,                   // Unlimited queue
  enableKeepAlive: true,           // Keep connection alive
  keepAliveInitialDelay: 0,         // No delay untuk keep alive
};
```

### Keuntungan Connection Pool:
1. **Efisiensi**: Reuse koneksi yang sudah ada, tidak perlu create connection baru setiap query
2. **Performance**: Mengurangi overhead dari create/close connection
3. **Scalability**: Mengatur jumlah maksimal koneksi simultan
4. **Reliability**: Auto-reconnect jika connection terputus

### Database Operations

#### Core Functions (`lib/db/mysql.tsx`)

```typescript
// Get connection pool
export function getPool(): mysql.Pool

// Test connection
export async function testConnection(): Promise<boolean>

// Query helper (SELECT)
export async function query<T>(sql: string, params?: any[]): Promise<T[]>

// Query one helper (SELECT satu row)
export async function queryOne<T>(sql: string, params?: any[]): Promise<T | null>

// Execute helper (INSERT, UPDATE, DELETE)
export async function execute(sql: string, params?: any[]): Promise<any>
```

#### User Operations (`lib/db/users.tsx`)

Fungsi-fungsi untuk operasi CRUD pada tabel `users`:
- `getUserById(id)` - Get user by ID
- `getUserByIdentifier(identifier, role?)` - Get user by username/email/nisn
- `getAllUsers(role?, isActive?)` - Get all users dengan filter
- `getAllSiswa(kelas?, jurusan?)` - Get all siswa dengan filter
- `createUser(userData)` - Create new user
- `updateUser(id, userData)` - Update user
- `deleteUser(id)` - Soft delete user
- `hardDeleteUser(id)` - Hard delete user
- `updateLastLogin(id)` - Update last login timestamp
- `usernameExists(username)` - Check username exists
- `emailExists(email)` - Check email exists
- `nisnExists(nisn)` - Check NISN exists
- `getUserCountByRole(role)` - Get user count by role
- `searchUsers(searchTerm, role?)` - Search users

#### Jadwal Operations (`lib/db/jadwal.tsx`)

Fungsi-fungsi untuk operasi CRUD pada tabel `jadwal_konseling`:
- `getJadwalById(id)` - Get jadwal dengan relations (siswa, guru, layanan)
- `getJadwalBySiswaId(siswaId, status?)` - Get jadwal by siswa ID
- `getJadwalByGuruId(guruId, status?)` - Get jadwal by guru ID
- `getJadwalMendatangSiswa(siswaId, limit?)` - Get jadwal mendatang untuk siswa
- `createJadwal(jadwalData)` - Create new jadwal
- `updateJadwal(id, updates)` - Update jadwal
- `updateJadwalStatus(id, status, catatanGuru?)` - Update status jadwal
- `deleteJadwal(id)` - Soft delete jadwal
- `getJadwalByTanggal(tanggal, guruId?)` - Get jadwal by tanggal

### Database Schema

#### Tabel Utama

**users**
- Primary key: `id` (INT, AUTO_INCREMENT)
- Fields: `username`, `email`, `password_hash`, `role`, `nisn`, `nama_lengkap`, `jenis_kelamin`, `tanggal_lahir`, `alamat`, `no_telepon`, `foto_profil`, `kelas`, `jurusan`, `tahun_masuk`, `is_active`, `last_login`, `created_at`, `updated_at`, `deleted_at`
- Index: `username`, `email`, `nisn`, `role`
- Soft delete: `deleted_at` (TIMESTAMP NULL)

**guru_bk**
- Primary key: `id` (INT, AUTO_INCREMENT)
- Foreign key: `user_id` → `users.id`
- Fields: `nip`, `nama_lengkap`, `jenis_kelamin`, `email`, `no_telepon`, `foto_profil`, `spesialisasi`, `pendidikan_terakhir`, `tahun_mulai_mengajar`, `bio`, `is_active`, `created_at`, `updated_at`, `deleted_at`

**layanan_bk**
- Primary key: `id` (INT, AUTO_INCREMENT)
- Fields: `kode_layanan`, `nama_layanan`, `deskripsi`, `icon`, `warna`, `is_active`, `created_at`, `updated_at`

**guru_layanan**
- Primary key: `id` (INT, AUTO_INCREMENT)
- Foreign keys: `guru_id` → `guru_bk.id`, `layanan_id` → `layanan_bk.id`
- Relasi many-to-many antara guru dan layanan

**jadwal_konseling**
- Primary key: `id` (INT, AUTO_INCREMENT)
- Foreign keys: `siswa_id` → `users.id`, `guru_id` → `guru_bk.id`, `layanan_id` → `layanan_bk.id`
- Fields: `tanggal` (DATE), `waktu_mulai` (TIME), `waktu_selesai` (TIME), `alasan_konseling`, `status`, `catatan_guru`, `rating`, `feedback`, `created_at`, `updated_at`, `deleted_at`
- Status values: `'menunggu'`, `'dijadwalkan'`, `'berlangsung'`, `'selesai'`, `'dibatalkan'`, `'tidak_hadir'`

**history_konseling**
- Primary key: `id` (INT, AUTO_INCREMENT)
- Foreign keys: `jadwal_id` → `jadwal_konseling.id`, `siswa_id` → `users.id`, `guru_id` → `guru_bk.id`, `layanan_id` → `layanan_bk.id`
- Fields: `tanggal_konseling`, `waktu_mulai`, `waktu_selesai`, `alasan_konseling`, `status`, `catatan_guru`, `hasil_konseling`, `tindak_lanjut`, `rating`, `feedback`, `created_at`

**notifikasi**
- Primary key: `id` (INT, AUTO_INCREMENT)
- Foreign key: `user_id` → `users.id`
- Fields: `judul`, `pesan`, `tipe`, `is_read`, `link`, `created_at`, `read_at`

**pengaturan_user**
- Primary key: `id` (INT, AUTO_INCREMENT)
- Foreign key: `user_id` → `users.id`
- Fields: `notifikasi_aktif`, `notifikasi_email`, `tema_preferensi`, `bahasa`, `created_at`, `updated_at`

**pengaturan_sistem**
- Primary key: `id` (INT, AUTO_INCREMENT)
- Fields: `key_setting`, `value_setting`, `tipe_data`, `deskripsi`, `kategori`, `is_public`, `updated_by`, `created_at`, `updated_at`

**log_aktivitas**
- Primary key: `id` (INT, AUTO_INCREMENT)
- Foreign key: `user_id` → `users.id` (nullable)
- Fields: `aksi`, `deskripsi`, `ip_address`, `user_agent`, `created_at`

**laporan_konseling**
- Primary key: `id` (INT, AUTO_INCREMENT)
- Foreign keys: `siswa_id` → `users.id`, `guru_id` → `guru_bk.id`, `jadwal_id` → `jadwal_konseling.id`
- Fields: `tanggal_laporan`, `ringkasan`, `masalah`, `solusi`, `rekomendasi`, `file_laporan`, `created_by`, `created_at`, `updated_at`

**backup_log**
- Primary key: `id` (INT, AUTO_INCREMENT)
- Fields: `nama_file`, `ukuran_file`, `lokasi_file`, `tipe_backup`, `status`, `pesan_error`, `created_by`, `created_at`

### TypeScript Types

Semua database types didefinisikan di `my-app/lib/types/database.tsx`:

```typescript
// User types
export interface User { ... }
export interface UserCreate { ... }
export interface UserUpdate { ... }

// Jadwal types
export interface JadwalKonseling { ... }
export interface JadwalKonselingCreate { ... }
export interface JadwalKonselingWithRelations extends JadwalKonseling {
  nama_siswa?: string;
  nisn?: string;
  nama_guru?: string;
  foto_guru?: string;
  nama_layanan?: string;
  warna?: string;
}

// Enum types
export type UserRole = 'siswa' | 'admin' | 'super_admin' | 'guru';
export type JadwalStatus = 'menunggu' | 'dijadwalkan' | 'berlangsung' | 'selesai' | 'dibatalkan' | 'tidak_hadir';
```

### Query Pattern

Semua query menggunakan **prepared statements** untuk keamanan:

```typescript
// ✅ Safe - menggunakan parameterized query
const user = await queryOne<User>(
  'SELECT * FROM users WHERE id = ? AND deleted_at IS NULL',
  [userId]
);

// ❌ Unsafe - SQL injection risk
const user = await queryOne<User>(
  `SELECT * FROM users WHERE id = ${userId}`
);
```

### Transaction Support

Untuk operasi yang memerlukan transaction, gunakan connection dari pool:

```typescript
const connection = await getPool().getConnection();
try {
  await connection.beginTransaction();
  
  // Multiple queries
  await connection.execute('INSERT INTO ...', [...]);
  await connection.execute('UPDATE ...', [...]);
  
  await connection.commit();
} catch (error) {
  await connection.rollback();
  throw error;
} finally {
  connection.release();
}
```

---

## 🚀 Setup & Instalasi

### Prerequisites

- **Node.js**: v18 atau lebih tinggi
- **MySQL**: v8.0 atau lebih tinggi
- **npm** atau **yarn**
- **Git** (optional)

### 1. Clone Repository

```bash
git clone <repository-url>
cd PROJECT_BK
```

### 2. Setup Web Application

```bash
cd my-app
npm install
```

### 3. Setup Mobile Application

```bash
cd mobile-app
npm install
```

### 4. Setup Environment Variables

#### Web Application (`my-app/.env`)

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=halo_project

# Next.js Configuration
NODE_ENV=development
```

#### Mobile Application

Update `mobile-app/lib/api.ts` dengan base URL API:

```typescript
export const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000'        // Development
  : 'https://your-production-url.com'; // Production
```

**Note**: Untuk Android emulator, gunakan `http://10.0.2.2:3000`. Untuk physical device, gunakan IP address komputer Anda.

### 5. Setup Database

1. Buat database MySQL:
```sql
CREATE DATABASE halo_project;
```

2. Import schema database (jika ada file SQL)

3. Jalankan script untuk insert default users:
```bash
cd my-app
npm run insert-users
```

### 6. Test Database Connection

```bash
cd my-app
npm run test-db
```

---

## ▶️ Menjalankan Aplikasi

### Web Application

#### Development Mode
```bash
cd my-app
npm run dev
```
Aplikasi akan berjalan di `http://localhost:3000`

#### Production Build
```bash
cd my-app
npm run build
npm start
```

### Mobile Application

#### Development Mode
```bash
cd mobile-app
npm start
```

Setelah `npm start`, Anda bisa:
- Tekan **`a`** - Open Android emulator
- Tekan **`i`** - Open iOS simulator (macOS only)
- Tekan **`w`** - Open web browser
- Scan QR code dengan **Expo Go** app (physical device)

#### Build untuk Production
```bash
cd mobile-app
npx expo build:android  # Android
npx expo build:ios     # iOS (macOS only)
```

---

## 🔌 API & Endpoints

### API Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://your-production-url.com`

### Authentication Endpoints

#### POST `/api/auth/login`
Login user dengan username/NISN/email dan password.

**Request Body:**
```json
{
  "identifier": "username_or_nisn_or_email",
  "password": "password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login berhasil",
  "user": {
    "id": 1,
    "username": "user123",
    "role": "siswa",
    "nama_lengkap": "John Doe",
    ...
  }
}
```

### Jadwal Endpoints

#### GET `/api/jadwal`
Get semua jadwal dengan filter opsional.

**Query Parameters:**
- `siswa_id` - Filter by siswa ID
- `guru_id` - Filter by guru ID
- `status` - Filter by status
- `tanggal` - Filter by tanggal (YYYY-MM-DD)

#### POST `/api/jadwal`
Buat jadwal konseling baru.

**Request Body:**
```json
{
  "siswa_id": 1,
  "guru_id": 1,
  "layanan_id": 1,
  "tanggal": "2024-01-15",
  "waktu_mulai": "09:00:00",
  "waktu_selesai": "10:00:00",
  "alasan_konseling": "Konsultasi akademik"
}
```

#### PATCH `/api/jadwal/[id]`
Update status jadwal.

**Request Body:**
```json
{
  "status": "dijadwalkan",
  "catatan_guru": "Jadwal disetujui"
}
```

### User Endpoints

#### GET `/api/users/data`
Get data user berdasarkan ID atau identifier.

#### PATCH `/api/users/password`
Update password user.

**Request Body:**
```json
{
  "old_password": "old_password",
  "new_password": "new_password"
}
```

### Dashboard Endpoints

#### GET `/api/dashboard`
Get dashboard data berdasarkan role user.

**Response untuk Siswa:**
```json
{
  "success": true,
  "data": {
    "total_konseling": 10,
    "konseling_selesai": 5,
    "jadwal_mendatang": 3,
    "konseling_berlangsung": 2
  }
}
```

---

## ✨ Fitur per Role

### 👨‍🎓 Untuk Siswa

- ✅ Login dengan NISN dan password
- ✅ Dashboard dengan statistik konseling
- ✅ Membuat jadwal konseling
- ✅ Memilih guru BK dan layanan konseling
- ✅ Melihat jadwal konseling pribadi
- ✅ Melihat history konseling
- ✅ Edit profile
- ✅ Ganti password
- ✅ Pengaturan notifikasi

### 👨‍🏫 Untuk Guru BK

- ✅ Login dengan email dan password
- ✅ Dashboard dengan statistik jadwal
- ✅ Melihat semua jadwal konseling
- ✅ Filter jadwal berdasarkan status
- ✅ Update status jadwal (menunggu → dijadwalkan → berlangsung → selesai)
- ✅ Menambahkan catatan konseling
- ✅ Melihat detail siswa
- ✅ Edit profile

### 👨‍💼 Untuk Admin

- ✅ Login dengan username/email dan password
- ✅ Dashboard dengan statistik keseluruhan
- ✅ Mengelola data siswa (CRUD)
- ✅ Mengelola data guru BK (CRUD)
- ✅ Melihat semua jadwal konseling
- ✅ Mengelola laporan konseling
- ✅ Pengaturan sistem

### 🔐 Untuk Super Admin

- ✅ Semua fitur Admin
- ✅ Akses penuh ke semua pengaturan sistem
- ✅ Manajemen user lengkap
- ✅ Backup dan restore database
- ✅ Log aktivitas

---

## 💻 Development Guide

### Code Structure

#### File Comments Pattern
Semua file memiliki komentar penjelasan dengan format:
```typescript
//----File ini untuk [deskripsi]----\\
```

#### Database Operations Pattern
```typescript
// Import dari lib/db
import { query, queryOne, execute } from '@/lib/db';

// Query dengan prepared statements
const users = await query<User>(
  'SELECT * FROM users WHERE role = ? AND deleted_at IS NULL',
  ['siswa']
);

// Query one row
const user = await queryOne<User>(
  'SELECT * FROM users WHERE id = ?',
  [userId]
);

// Execute (INSERT, UPDATE, DELETE)
const result = await execute(
  'INSERT INTO users (username, password_hash) VALUES (?, ?)',
  [username, passwordHash]
);
```

#### Error Handling
```typescript
try {
  const result = await query(...);
  return { success: true, data: result };
} catch (error) {
  console.error('Error:', error);
  return { success: false, error: error.message };
}
```

### Adding New Features

#### 1. Menambah Database Table
1. Buat migration SQL atau update schema
2. Tambah TypeScript types di `lib/types/database.tsx`
3. Buat operations file di `lib/db/` (contoh: `lib/db/new_table.tsx`)
4. Export dari `lib/db/index.tsx`

#### 2. Menambah API Endpoint
1. Buat file di `app/api/` (contoh: `app/api/new-endpoint/route.ts`)
2. Implement GET/POST/PATCH/DELETE sesuai kebutuhan
3. Gunakan database operations dari `lib/db`
4. Return response dengan format: `{ success: boolean, data?: T, error?: string }`

#### 3. Menambah Halaman Baru (Web)
1. Buat file di `app/` (contoh: `app/new-page/page.tsx`)
2. Gunakan Server Components atau Client Components sesuai kebutuhan
3. Fetch data dari API atau langsung dari database

#### 4. Menambah Halaman Baru (Mobile)
1. Buat file di `mobile-app/app/` (contoh: `mobile-app/app/new-page.tsx`)
2. Tambah route di `app/_layout.tsx` jika perlu
3. Gunakan `useRouter()` dari `expo-router` untuk navigation
4. Fetch data dari API menggunakan `lib/api.ts`

### Scripts

#### Web Application Scripts

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint

# Database scripts
npm run test-db              # Test database connection
npm run insert-users          # Insert default users
npm run insert-siswa         # Insert siswa kelas XI RPL 1
npm run fix-passwords         # Update semua password menjadi "Smktb25!"
npm run fix-siswa-passwords   # Update password siswa menjadi "Smktb25!"
npm run check-siswa           # Check data siswa
npm run test-login-siswa      # Test login siswa
```

#### Mobile Application Scripts

```bash
# Development
npm start

# Android
npm run android

# iOS (macOS only)
npm run ios

# Web
npm run web

# Linting
npm run lint
```

### Best Practices

1. **Database**: Selalu gunakan prepared statements untuk keamanan
2. **Error Handling**: Handle semua error dengan try-catch
3. **Type Safety**: Gunakan TypeScript types untuk semua data
4. **Code Organization**: Pisahkan logic ke file terpisah (db operations, types, utils)
5. **Comments**: Tambahkan komentar untuk fungsi kompleks
6. **Environment Variables**: Jangan commit `.env` file
7. **Password**: Selalu hash password dengan bcryptjs sebelum simpan ke database

---

## 📝 Notes

### Database Connection
- Connection pool dibuat secara lazy (saat pertama kali dipanggil)
- Pool akan reuse koneksi yang sudah ada
- Setiap query mengambil connection dari pool dan release setelah selesai
- Pool akan auto-reconnect jika connection terputus

### Security
- Password di-hash menggunakan bcryptjs dengan salt rounds default
- Semua query menggunakan prepared statements untuk prevent SQL injection
- Soft delete digunakan untuk preserve data (tidak hard delete)

### Performance
- Connection pool mengurangi overhead dari create/close connection
- Index pada kolom yang sering di-query (username, email, nisn, role)
- Query dengan JOIN untuk get related data dalam satu query

---

## 📞 Support

Untuk pertanyaan atau masalah, silakan hubungi tim development atau buat issue di repository.

---

## 📄 License

[License information jika ada]

---

**Dibuat dengan ❤️ untuk SMK Taruna Bhakti**

