import { getConnection } from "../models/db";
import { Request, Response } from "express";

export const getJadwalPerkuliahan = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const connection = getConnection();
    const [result] = await connection.execute(
      "SELECT * FROM jadwal_perkuliahan where id_mk = ?",
      [id]
    );
    res
      .status(200)
      .send({ message: "Jadwal perkuliahan berhasil di ambil", result });
  } catch (error) {
    res
      .status(500)
      .send({ error: "error mengambil jadwal perkuliahan di database" });
  }
};
