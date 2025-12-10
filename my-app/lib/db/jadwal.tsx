//----File ini untuk operasi database pada tabel jadwal_konseling (CRUD), mencari jadwal berdasarkan siswa/guru/tanggal, dan mengupdate status jadwal----\\
// ============================================
// JADWAL KONSELING DATABASE OPERATIONS
// Helper functions untuk CRUD operations pada tabel jadwal_konseling
// ============================================

import { query, queryOne, execute } from './mysql';
import type {
  JadwalKonseling,
  JadwalKonselingCreate,
  JadwalKonselingWithRelations,
} from '../types/database';

// Get jadwal by ID
export async function getJadwalById(id: number): Promise<JadwalKonselingWithRelations | null> {
  return queryOne<JadwalKonselingWithRelations>(
    `SELECT 
      jk.*,
      u.nama_lengkap as nama_siswa,
      u.nisn,
      gb.nama_lengkap as nama_guru,
      gb.foto_profil as foto_guru,
      lb.nama_layanan,
      lb.warna
    FROM jadwal_konseling jk
    INNER JOIN users u ON jk.siswa_id = u.id
    INNER JOIN guru_bk gb ON jk.guru_id = gb.id
    INNER JOIN layanan_bk lb ON jk.layanan_id = lb.id
    WHERE jk.id = ? AND jk.deleted_at IS NULL`,
    [id]
  );
}

// Get jadwal by siswa ID
export async function getJadwalBySiswaId(
  siswaId: number,
  status?: string
): Promise<JadwalKonselingWithRelations[]> {
  let sql = `
    SELECT 
      jk.*,
      u.nama_lengkap as nama_siswa,
      u.nisn,
      gb.nama_lengkap as nama_guru,
      gb.foto_profil as foto_guru,
      lb.nama_layanan,
      lb.warna
    FROM jadwal_konseling jk
    INNER JOIN users u ON jk.siswa_id = u.id
    INNER JOIN guru_bk gb ON jk.guru_id = gb.id
    INNER JOIN layanan_bk lb ON jk.layanan_id = lb.id
    WHERE jk.siswa_id = ? AND jk.deleted_at IS NULL
  `;
  const params: any[] = [siswaId];

  if (status) {
    sql += ` AND jk.status = ?`;
    params.push(status);
  }

  sql += ` ORDER BY jk.tanggal DESC, jk.waktu_mulai DESC`;

  return query<JadwalKonselingWithRelations>(sql, params);
}

// Get jadwal by guru ID
export async function getJadwalByGuruId(
  guruId: number,
  status?: string
): Promise<JadwalKonselingWithRelations[]> {
  let sql = `
    SELECT 
      jk.*,
      u.nama_lengkap as nama_siswa,
      u.nisn,
      gb.nama_lengkap as nama_guru,
      gb.foto_profil as foto_guru,
      lb.nama_layanan,
      lb.warna
    FROM jadwal_konseling jk
    INNER JOIN users u ON jk.siswa_id = u.id
    INNER JOIN guru_bk gb ON jk.guru_id = gb.id
    INNER JOIN layanan_bk lb ON jk.layanan_id = lb.id
    WHERE jk.guru_id = ? AND jk.deleted_at IS NULL
  `;
  const params: any[] = [guruId];

  if (status) {
    sql += ` AND jk.status = ?`;
    params.push(status);
  }

  sql += ` ORDER BY jk.tanggal DESC, jk.waktu_mulai DESC`;

  return query<JadwalKonselingWithRelations>(sql, params);
}

// Get jadwal mendatang untuk siswa
export async function getJadwalMendatangSiswa(
  siswaId: number,
  limit: number = 10
): Promise<JadwalKonselingWithRelations[]> {
  return query<JadwalKonselingWithRelations>(
    `SELECT 
      jk.*,
      u.nama_lengkap as nama_siswa,
      u.nisn,
      gb.nama_lengkap as nama_guru,
      gb.foto_profil as foto_guru,
      lb.nama_layanan,
      lb.warna
    FROM jadwal_konseling jk
    INNER JOIN users u ON jk.siswa_id = u.id
    INNER JOIN guru_bk gb ON jk.guru_id = gb.id
    INNER JOIN layanan_bk lb ON jk.layanan_id = lb.id
    WHERE jk.siswa_id = ?
      AND jk.status IN ('dijadwalkan', 'berlangsung')
      AND jk.deleted_at IS NULL
      AND (jk.tanggal > CURDATE() OR (jk.tanggal = CURDATE() AND jk.waktu_mulai >= CURTIME()))
    ORDER BY jk.tanggal ASC, jk.waktu_mulai ASC
    LIMIT ?`,
    [siswaId, limit]
  );
}

// Create jadwal konseling
export async function createJadwal(
  jadwalData: JadwalKonselingCreate
): Promise<number> {
  const result = await execute(
    `INSERT INTO jadwal_konseling 
     (siswa_id, guru_id, layanan_id, tanggal, waktu_mulai, waktu_selesai, alasan_konseling, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      jadwalData.siswa_id,
      jadwalData.guru_id,
      jadwalData.layanan_id,
      jadwalData.tanggal,
      jadwalData.waktu_mulai,
      jadwalData.waktu_selesai,
      jadwalData.alasan_konseling,
      jadwalData.status || 'menunggu',
    ]
  );

  return result.insertId;
}

// Update jadwal
export async function updateJadwal(
  id: number,
  updates: Partial<JadwalKonseling>
): Promise<boolean> {
  const fields = Object.keys(updates)
    .filter((key) => key !== 'id' && key !== 'created_at')
    .map((key) => `${key} = ?`)
    .join(', ');
  const values = Object.values(updates).filter(
    (_, index) => Object.keys(updates)[index] !== 'id' && Object.keys(updates)[index] !== 'created_at'
  );

  if (fields.length === 0) {
    return false;
  }

  const result = await execute(
    `UPDATE jadwal_konseling SET ${fields}, updated_at = NOW() WHERE id = ? AND deleted_at IS NULL`,
    [...values, id]
  );

  return result.affectedRows > 0;
}

// Update status jadwal
export async function updateJadwalStatus(
  id: number,
  status: string,
  catatanGuru?: string
): Promise<boolean> {
  let sql = `UPDATE jadwal_konseling SET status = ?, updated_at = NOW()`;
  const params: any[] = [status];

  if (catatanGuru) {
    sql += `, catatan_guru = ?`;
    params.push(catatanGuru);
  }

  sql += ` WHERE id = ? AND deleted_at IS NULL`;
  params.push(id);

  const result = await execute(sql, params);
  return result.affectedRows > 0;
}

// Delete jadwal (soft delete)
export async function deleteJadwal(id: number): Promise<boolean> {
  const result = await execute(
    `UPDATE jadwal_konseling SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL`,
    [id]
  );

  return result.affectedRows > 0;
}

// Get jadwal by tanggal
export async function getJadwalByTanggal(
  tanggal: string,
  guruId?: number
): Promise<JadwalKonselingWithRelations[]> {
  let sql = `
    SELECT 
      jk.*,
      u.nama_lengkap as nama_siswa,
      u.nisn,
      gb.nama_lengkap as nama_guru,
      gb.foto_profil as foto_guru,
      lb.nama_layanan,
      lb.warna
    FROM jadwal_konseling jk
    INNER JOIN users u ON jk.siswa_id = u.id
    INNER JOIN guru_bk gb ON jk.guru_id = gb.id
    INNER JOIN layanan_bk lb ON jk.layanan_id = lb.id
    WHERE jk.tanggal = ? AND jk.deleted_at IS NULL
  `;
  const params: any[] = [tanggal];

  if (guruId) {
    sql += ` AND jk.guru_id = ?`;
    params.push(guruId);
  }

  sql += ` ORDER BY jk.waktu_mulai ASC`;

  return query<JadwalKonselingWithRelations>(sql, params);
}

