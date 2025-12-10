# HALO PROJECT - Web Application

Aplikasi web berbasis Next.js untuk sistem bimbingan konseling SMK Taruna Bhakti.

> 📖 **Untuk dokumentasi lengkap project, lihat [README.md](../README.md) di root project**

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment Variables
Buat file `.env` di root project:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=halo_project
NODE_ENV=development
```

### 3. Setup Database
```bash
# Test connection
npm run test-db

# Insert default users
npm run insert-users
```

### 4. Run Development Server
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

---

## Tech Stack

- **Framework**: Next.js 16.0.3 (App Router)
- **Language**: TypeScript 5
- **Database**: MySQL dengan mysql2 (Connection Pool)
- **Styling**: Tailwind CSS 4
- **Authentication**: bcryptjs

---

## Scripts

```bash
npm run dev              # Development server
npm run build            # Production build
npm run start            # Production server
npm run lint             # Linting
npm run test-db          # Test database connection
npm run insert-users     # Insert default users
npm run insert-siswa     # Insert siswa kelas XI RPL 1
npm run fix-passwords    # Update semua password
```

---

## Struktur Project

```
my-app/
├── app/                 # Next.js App Router
│   ├── admin/          # Halaman admin
│   ├── guru/           # Halaman guru BK
│   ├── home/           # Halaman siswa
│   ├── login/          # Halaman login
│   └── ...
├── lib/                # Library & utilities
│   ├── db/             # Database operations
│   │   ├── mysql.tsx   # MySQL connection pool
│   │   ├── users.tsx   # User operations
│   │   └── jadwal.tsx  # Jadwal operations
│   └── types/          # TypeScript types
└── scripts/            # Utility scripts
```

---

## Database

### Connection Pool
Aplikasi menggunakan MySQL Connection Pool dengan konfigurasi:
- `connectionLimit: 10`
- `waitForConnections: true`
- `enableKeepAlive: true`

### Database Operations
Semua database operations ada di `lib/db/`:
- `mysql.tsx` - Core functions (query, queryOne, execute)
- `users.tsx` - User CRUD operations
- `jadwal.tsx` - Jadwal CRUD operations

Lihat [README.md](../README.md) untuk detail lengkap tentang database schema dan operations.

---

## API Endpoints

- `POST /api/auth/login` - Login user
- `GET /api/jadwal` - Get jadwal
- `POST /api/jadwal` - Create jadwal
- `PATCH /api/jadwal/[id]` - Update jadwal
- `GET /api/users/data` - Get user data
- `GET /api/dashboard` - Get dashboard data

Lihat [README.md](../README.md) untuk daftar lengkap API endpoints.

---

## Login Credentials

### Default Users (setelah `npm run insert-users`)
- **Siswa**: NISN / `Smktb25!`
- **Admin**: `admin01` / `password123`
- **Super Admin**: `superadmin` / `password123`
- **Guru**: Email guru / `password123`

---

## Development

### Menambah Halaman Baru
1. Buat file di `app/` (contoh: `app/new-page/page.tsx`)
2. Gunakan Server Components atau Client Components
3. Fetch data dari API atau database

### Menambah API Endpoint
1. Buat file di `app/api/` (contoh: `app/api/new-endpoint/route.ts`)
2. Implement GET/POST/PATCH/DELETE
3. Gunakan database operations dari `lib/db`

### Menambah Database Operations
1. Buat file di `lib/db/` (contoh: `lib/db/new_table.tsx`)
2. Export functions (query, queryOne, execute)
3. Export dari `lib/db/index.tsx`

---

## Troubleshooting

### Database Connection Error
1. Pastikan MySQL server berjalan
2. Cek environment variables di `.env`
3. Test connection: `npm run test-db`

### Build Error
1. Clear cache: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check TypeScript errors: `npm run lint`

---

Untuk dokumentasi lengkap, lihat [README.md](../README.md) di root project.
