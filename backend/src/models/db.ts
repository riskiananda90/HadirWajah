import { Connection } from "./../../node_modules/mysql2/promise.d";
import mysql from "mysql2/promise";

let connection: mysql.Connection;

export const connetcDB = async () => {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST || "db",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || "absensi_mahasiswa",
    port: parseInt(process.env.DB_PORT || "3306"),
  });
  console.log("Koneksi Ke database berhasil");
};

export const getConnection = () => connection;
