import { Request, Response } from "express";
import { getConnection } from "../models/db";

export const getMahasiswa = async (req: Request, res: Response) => {
  try {
    const connection = getConnection();
    const [result] = await connection.execute("SELECT * FROM Mahasiswa");
    res.status(200).send({ message: "Mahasiswa berhasil di ambil", result });
    console.log("🟢 Mahasiswa berhasil di ambil");
  } catch (error) {
    res.status(500).send({ error: "error mengambil mahasiswa di database" });
    console.error("🔴 error saat mengambil data di database \n", error);
  }
};


export const addMahasiswa = async (req: Request, res: Response) => {
  try {
    const connection = getConnection();
    const { nim, email, nama, password, foto_profil } = req.body;
    const [result] = await connection.execute(
      "INSERT INTO Mahasiswa(nim,email, nama, password,foto_profil) VALUES (?,?,?,?,?)",
      [nim, email, nama, password, foto_profil]
    );
    res
      .status(200)
      .send({ message: "Mahasiswa berhasil di tambahkan", result });
    console.log("🟢 Mahasiswa berhasil di tambahkan");
  } catch (error) {
    res.status(500).send({ error: "error menambahkan mahasiswa di database" });
    console.error("🔴 error saat menambahkan data di database \n", error);
  }
};
