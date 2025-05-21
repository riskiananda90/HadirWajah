import { json, Request, Response } from "express";
import { getConnection } from "../models/db";
import jwt from "jsonwebtoken";
import { calculateDistance } from "../utils/geoTils";
import fs from "fs";
import path from "path";
import { error } from "console";

const CLASS_LOCATION = { latitude: -6.9932, longitude: 110.4203 };
export const getAbsensi = async (req: Request, res: Response) => {
  try {
    console.log("Received query parameters:", req.query);

    const { id, mahasiswa_id } = req.query;
    const id_jadwal = parseInt(id as string, 10);
    const id_mahasiswa = mahasiswa_id
      ? parseInt(mahasiswa_id as string, 10)
      : null;

    if (!id_jadwal) {
      return res.status(400).json({
        success: false,
        message: "ID jadwal tidak diberikan",
      });
    }

    const connecting = getConnection();
    let query = "SELECT * FROM absensi WHERE id_jadwal = ?";
    let params = [id_jadwal];

    if (id_mahasiswa) {
      query = "SELECT * FROM absensi WHERE id_jadwal = ? AND id_mahasiswa = ?";
      params = [id_jadwal, id_mahasiswa];
    }

    const [result] = await connecting.execute(query, params);
    const rows = result as any[];

    res.status(200).json({
      success: true,
      message: "Absensi berhasil diambil",
      data: rows[0],
      
    });
    console.log("🟢 Absensi berhasil diambil");
  } catch (error) {
    console.error("🔴 Error saat connect ke database:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
    });
  }
};
export const addAbsensi = async (req: Request, res: Response) => {
  try {
    const {
      id_mahasiswa,
      id_jadwal,
      waktu_absen,
      status_kehadiran,
      telat,
      fotoAbsensi,
      lokasi_lat,
      lokasi_lng,
    } = req.body;
    console.log("Mengecek data absensi:", req.body);

    if (!fotoAbsensi || !fotoAbsensi.startsWith("data:image/png;base64")) {
      console.log("🔴 Foto profil tidak valid");

      return res.status(400).json({
        error: "Foto tidak valid",
      });
    }
    console.log("🟢 Foto profil valid");

    const base64Data = fotoAbsensi.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const filename = `${id_mahasiswa}_${id_jadwal}_${waktu_absen.replace(
      /[: ]/g,
      "_"
    )}.jpg`;
    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "Absensi-Mahasiswa",
      "public",
      "AbsensiImage",
      filename
    );
    fs.writeFileSync(filePath, buffer);
    const connecting = getConnection();

    const [result] = await connecting.execute(
      "INSERT INTO absensi (id_mahasiswa, id_jadwal, waktu_absen, status_kehadiran, telat, fotoAbsensi, lokasi_lat, lokasi_lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id_mahasiswa,
        id_jadwal,
        waktu_absen,
        status_kehadiran,
        telat,
        filename,
        lokasi_lat,
        lokasi_lng,
      ]
    );

    res.status(200).send({
      message: "Absensi berhasil ditambahkan",
      result,
      success: true,
    });
    console.log("🟢 Absensi berhasil ditambahkan", result);
  } catch (error) {
    res.status(500).send({
      error: "Error menambahkan absensi di database",
    });
    console.error("🔴 Error saat menambahkan absensi di database \n", error);
  }
};

interface QRTokenPayload {
  expires: number;
}
export const submitQr = async (req: Request, res: Response) => {
  const { qrToken, photo, location, studentId } = req.body;

  try {
    const decoded = jwt.verify(qrToken, "QR_KEY") as QRTokenPayload;
    if (decoded.expires < Date.now()) {
      return res.status(400).json({ error: "QR expired" });
    }

    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      CLASS_LOCATION.latitude,
      CLASS_LOCATION.longitude
    );
    if (distance > 100) {
      return res.status(400).json({ error: "Lokasi Tidak Sesuai" });
    }
    const connecting = getConnection();
    const [result] = await connecting.execute(
      "INSERT INTO absensi (id_mahasiswa,is_jadwal,waktu_absen,status_kehadiran,telat,face_verified) VALUES (?,?,?,?,?,?)",
      [studentId, true, Date.now(), "Hadir", 0, photo]
    );
    res.status(200).send({ message: "Absensi berhasil di tambahkan", result });
    console.log("🟢 Absensi berhasil di tambahkan");
  } catch (error) {
    console.error("🔴 error saat menambahkan absensi di database \n", error);
  }
};
