import { Request, Response } from "express";
import { getConnection } from "../models/db";

export const getPelajaran = async (req: Request, res: Response) => {
  try {
    const connection = getConnection();

    const idMahasiswa = req.query.id_mahasiswa;
    const [result] = await connection.execute(
      `SELECT jp.id,mk.nama_mk, mk.dosen,  mk.hari, mk.jam_mulai,mk.jam_selesai, mk.ruang, IFNULL(ab.status_kehadiran, 'Belum absen') AS status_kehadiran FROM mata_kuliah mk       JOIN jadwal_perkuliahan jp ON mk.id = jp.id_mk       LEFT JOIN absensi ab ON jp.id = ab.id_jadwal AND ab.id_mahasiswa = ?       ORDER BY mk.hari, mk.jam_mulai`,
      [idMahasiswa]
    );
    console.log(result);

    res.json(result);
  } catch (error) {
    res.status(500).send({ error: "error mengambil pelajaran di database" });
    console.error("🔴 error saat mengambil data di database \n", error);
  }
};

export const addPelajaran = async (req: Request, res: Response) => {
  const { nama_mk, dosen, hari, jam_mulai, jam_selesai, ruang } = req.body;
  try {
    const connection = getConnection();
    const [result] = await connection.execute(
      "INSERT INTO mata_kuliah (nama_mk,dosen,hari,jam_mulai, jam_selesai,ruang) VALUES (?,?,?,?,?,?)",
      [nama_mk, dosen, hari, jam_mulai, jam_selesai, ruang]
    );
    res
      .status(200)
      .send({ message: "Pelajaran berhasil di tambahkan", result });
    console.log("🟢 Pelajaran berhasil di tambahkan");
  } catch (error) {
    res.status(500).send({ error: "error menambahkan pelajaran di database" });
    console.error("🔴 error saat menambahkan pelajaran di database \n", error);
  }
};
