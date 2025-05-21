"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addMahasiswa = exports.getMahasiswa = void 0;
const db_1 = require("../models/db");
const getMahasiswa = async (req, res) => {
    try {
        const connection = (0, db_1.getConnection)();
        const [result] = await connection.execute("SELECT * FROM Mahasiswa");
        res.status(200).send({ message: "Mahasiswa berhasil di ambil", result });
        console.log("🟢 Mahasiswa berhasil di ambil");
    }
    catch (error) {
        res.status(500).send({ error: "error mengambil mahasiswa di database" });
        console.error("🔴 error saat mengambil data di database \n", error);
    }
};
exports.getMahasiswa = getMahasiswa;
const addMahasiswa = async (req, res) => {
    try {
        const connection = (0, db_1.getConnection)();
        const { nim, email, nama, password, foto_profil } = req.body;
        const [result] = await connection.execute("INSERT INTO Mahasiswa(nim,email, nama, password,foto_profil) VALUES (?,?,?.?,?)", [nim, email, nama, password, foto_profil]);
        res
            .status(200)
            .send({ message: "Mahasiswa berhasil di tambahkan", result });
        console.log("🟢 Mahasiswa berhasil di tambahkan");
    }
    catch (error) {
        res.status(500).send({ error: "error menambahkan mahasiswa di database" });
        console.error("🔴 error saat menambahkan data di database \n", error);
    }
};
exports.addMahasiswa = addMahasiswa;
