import { Request, Response } from "express";
import { getConnection } from "../models/db";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";

export const RegisterMahasiswa = async (req: Request, res: Response) => {
  try {
    const connection = getConnection();
    const { nim, email, nama, password, foto_profil } = req.body;

    if (!nim || !email || !nama || !password) {
      return res.status(400).json({ message: "Semua field harus diisi" });
    }

    const hashpassword = await bcrypt.hash(password, 10);

    const fileName = req.file?.filename || null;
    const [result] = await connection.execute(
      "INSERT INTO mahasiswa(nim, email, nama, password, foto_profil ) VALUES (?,?,?,?,?)",
      [nim, email, nama, hashpassword, fileName || null]
    );

    res.status(200).json({ message: "🟢 Mahasiswa berhasil mendaftar" });
    console.log("🟢 Mahasiswa berhasil mendaftar : \n", result);
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(400)
        .json({ message: "NIM atau email sudah terdaftar" });
    }
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const LoginMahasiswa = async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const connection = getConnection();
    console.log("Berhasil terhubung ke database");
    const { nim, password } = req.body;
    const [result]: any = await connection.execute(
      "SELECT * FROM mahasiswa where nim = ? ",
      [nim]
    );
    if (!result || result.length === 0) {
      console.log(result);
      return res.status(401).json({ message: "NIM atau password salah" });
    }
    const PasswordSama = await bcrypt.compare(password, result[0].password);
    if (!PasswordSama) {
      return res.status(401).json({ message: "NIM atau password salah" });
    }
    const token = jwt.sign(
      { nim: result[0].nim, email: result[0].email },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || ("1h" as any) }
    );
    delete result[0].password;
    res
      .status(200)
      .json({ message: "🟢 Mahasiswa berhasil login", token, result });
    console.log("🟢 Mahasiswa berhasil login");
  } catch (error) {
    console.log("Internal server error", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};
