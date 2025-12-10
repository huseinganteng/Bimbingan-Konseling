//----File ini untuk definisi TypeScript types/interfaces untuk semua tabel database (User, GuruBK, JadwalKonseling, dll) dan API response types----\\
// ============================================
// DATABASE TYPES
// TypeScript types untuk semua tabel database
// ============================================

export type UserRole = 'siswa' | 'admin' | 'super_admin' | 'guru';
export type JenisKelamin = 'L' | 'P';
export type JadwalStatus = 'menunggu' | 'dijadwalkan' | 'berlangsung' | 'selesai' | 'dibatalkan' | 'tidak_hadir';
export type HistoryStatus = 'selesai' | 'dibatalkan' | 'tidak_hadir';
export type NotifikasiTipe = 'info' | 'success' | 'warning' | 'error' | 'jadwal';
export type TemaPreferensi = 'light' | 'dark' | 'auto';
export type TipeData = 'string' | 'integer' | 'boolean' | 'json';
export type BackupTipe = 'manual' | 'otomatis';
export type BackupStatus = 'berhasil' | 'gagal';

// ============================================
// TABLE: users
// ============================================
export interface User {
  id: number;
  username: string;
  email: string | null;
  password_hash: string;
  role: UserRole;
  nisn: string | null;
  nama_lengkap: string;
  jenis_kelamin: JenisKelamin | null;
  tanggal_lahir: string | null; // DATE format: YYYY-MM-DD
  alamat: string | null;
  no_telepon: string | null;
  foto_profil: string | null;
  kelas: string | null;
  jurusan: string | null;
  tahun_masuk: number | null; // YEAR
  is_active: boolean;
  last_login: string | null; // DATETIME
  created_at: string; // TIMESTAMP
  updated_at: string; // TIMESTAMP
  deleted_at: string | null; // TIMESTAMP
}

export interface UserCreate {
  username: string;
  email?: string | null;
  password_hash: string;
  role?: UserRole;
  nisn?: string | null;
  nama_lengkap: string;
  jenis_kelamin?: JenisKelamin | null;
  tanggal_lahir?: string | null;
  alamat?: string | null;
  no_telepon?: string | null;
  foto_profil?: string | null;
  kelas?: string | null;
  jurusan?: string | null;
  tahun_masuk?: number | null;
  is_active?: boolean;
}

export interface UserUpdate {
  username?: string;
  email?: string | null;
  password_hash?: string;
  role?: UserRole;
  nisn?: string | null;
  nama_lengkap?: string;
  jenis_kelamin?: JenisKelamin | null;
  tanggal_lahir?: string | null;
  alamat?: string | null;
  no_telepon?: string | null;
  foto_profil?: string | null;
  kelas?: string | null;
  jurusan?: string | null;
  tahun_masuk?: number | null;
  is_active?: boolean;
}

// ============================================
// TABLE: guru_bk
// ============================================
export interface GuruBK {
  id: number;
  user_id: number | null;
  nip: string | null;
  nama_lengkap: string;
  jenis_kelamin: JenisKelamin;
  email: string | null;
  no_telepon: string | null;
  foto_profil: string | null;
  spesialisasi: string | null;
  pendidikan_terakhir: string | null;
  tahun_mulai_mengajar: number | null; // YEAR
  bio: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface GuruBKCreate {
  user_id?: number | null;
  nip?: string | null;
  nama_lengkap: string;
  jenis_kelamin: JenisKelamin;
  email?: string | null;
  no_telepon?: string | null;
  foto_profil?: string | null;
  spesialisasi?: string | null;
  pendidikan_terakhir?: string | null;
  tahun_mulai_mengajar?: number | null;
  bio?: string | null;
  is_active?: boolean;
}

// ============================================
// TABLE: layanan_bk
// ============================================
export interface LayananBK {
  id: number;
  kode_layanan: string;
  nama_layanan: string;
  deskripsi: string | null;
  icon: string | null;
  warna: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// TABLE: guru_layanan
// ============================================
export interface GuruLayanan {
  id: number;
  guru_id: number;
  layanan_id: number;
  created_at: string;
}

// ============================================
// TABLE: periode_pemilihan
// ============================================
export interface PeriodePemilihan {
  id: number;
  nama_periode: string;
  tanggal_mulai: string; // DATE
  tanggal_selesai: string; // DATE
  waktu_mulai: string; // TIME
  waktu_selesai: string; // TIME
  is_active: boolean;
  keterangan: string | null;
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// TABLE: jadwal_konseling
// ============================================
export interface JadwalKonseling {
  id: number;
  siswa_id: number;
  guru_id: number;
  layanan_id: number;
  tanggal: string; // DATE
  waktu_mulai: string; // TIME
  waktu_selesai: string; // TIME
  alasan_konseling: string;
  status: JadwalStatus;
  catatan_guru: string | null;
  rating: number | null; // 1-5
  feedback: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface JadwalKonselingCreate {
  siswa_id: number;
  guru_id: number;
  layanan_id: number;
  tanggal: string;
  waktu_mulai: string;
  waktu_selesai: string;
  alasan_konseling: string;
  status?: JadwalStatus;
}

export interface JadwalKonselingWithRelations extends JadwalKonseling {
  nama_siswa?: string;
  nisn?: string;
  nama_guru?: string;
  foto_guru?: string;
  nama_layanan?: string;
  warna?: string;
}

// ============================================
// TABLE: history_konseling
// ============================================
export interface HistoryKonseling {
  id: number;
  jadwal_id: number;
  siswa_id: number;
  guru_id: number;
  layanan_id: number;
  tanggal_konseling: string; // DATE
  waktu_mulai: string; // TIME
  waktu_selesai: string; // TIME
  alasan_konseling: string | null;
  status: HistoryStatus;
  catatan_guru: string | null;
  hasil_konseling: string | null;
  tindak_lanjut: string | null;
  rating: number | null; // 1-5
  feedback: string | null;
  created_at: string;
}

export interface HistoryKonselingWithRelations extends HistoryKonseling {
  nama_siswa?: string;
  nisn?: string;
  nama_guru?: string;
  foto_guru?: string;
  nama_layanan?: string;
  warna?: string;
}

// ============================================
// TABLE: pengaturan_sistem
// ============================================
export interface PengaturanSistem {
  id: number;
  key_setting: string;
  value_setting: string | null;
  tipe_data: TipeData;
  deskripsi: string | null;
  kategori: string | null;
  is_public: boolean;
  updated_by: number | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// TABLE: notifikasi
// ============================================
export interface Notifikasi {
  id: number;
  user_id: number;
  judul: string;
  pesan: string;
  tipe: NotifikasiTipe;
  is_read: boolean;
  link: string | null;
  created_at: string;
  read_at: string | null;
}

export interface NotifikasiCreate {
  user_id: number;
  judul: string;
  pesan: string;
  tipe?: NotifikasiTipe;
  link?: string | null;
}

// ============================================
// TABLE: pengaturan_user
// ============================================
export interface PengaturanUser {
  id: number;
  user_id: number;
  notifikasi_aktif: boolean;
  notifikasi_email: boolean;
  tema_preferensi: TemaPreferensi;
  bahasa: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// TABLE: log_aktivitas
// ============================================
export interface LogAktivitas {
  id: number;
  user_id: number | null;
  aksi: string;
  deskripsi: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// ============================================
// TABLE: laporan_konseling
// ============================================
export interface LaporanKonseling {
  id: number;
  siswa_id: number;
  guru_id: number;
  jadwal_id: number;
  tanggal_laporan: string; // DATE
  ringkasan: string | null;
  masalah: string | null;
  solusi: string | null;
  rekomendasi: string | null;
  file_laporan: string | null;
  created_by: number | null;
  created_at: string;
  updated_at: string;
}

// ============================================
// TABLE: backup_log
// ============================================
export interface BackupLog {
  id: number;
  nama_file: string;
  ukuran_file: number | null;
  lokasi_file: string | null;
  tipe_backup: BackupTipe;
  status: BackupStatus;
  pesan_error: string | null;
  created_by: number | null;
  created_at: string;
}

// ============================================
// VIEW: vw_dashboard_siswa
// ============================================
export interface DashboardSiswa {
  siswa_id: number;
  nama_siswa: string;
  total_konseling: number;
  konseling_selesai: number;
  jadwal_mendatang: number;
  konseling_berlangsung: number;
}

// ============================================
// VIEW: vw_dashboard_admin
// ============================================
export interface DashboardAdmin {
  total_siswa: number;
  total_guru_aktif: number;
  jadwal_mendatang: number;
  konseling_berlangsung: number;
  konseling_hari_ini: number;
  konseling_bulan_ini: number;
}

// ============================================
// API Response Types
// ============================================
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: Omit<User, 'password_hash'>;
}

