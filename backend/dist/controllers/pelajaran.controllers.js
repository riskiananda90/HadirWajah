"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPelajaran = exports.getPelajaran = void 0;
const db_1 = require("../models/db");
const getPelajaran = async (req, res) => {
    try {
        const connection = (0, db_1.getConnection)();
        const [result] = await connection.execute("SELECT * FROM mata_kuliah mk JOIN jadwal_perkuliahan jp ON mk.id = jp.id_mk");
        res.json(result);
    }
    catch (error) {
        res.status(500).send({ error: "error mengambil pelajaran di database" });
        console.error("🔴 error saat mengambil data di database \n", error);
    }
};
exports.getPelajaran = getPelajaran;
const addPelajaran = async (req, res) => {
    const { nama_mk, dosen, hari, jam_mulai, jam_selesai, ruang } = req.body;
    try {
        const connection = (0, db_1.getConnection)();
        const [result] = await connection.execute("INSERT INTO mata_kuliah (nama_mk,dosen,hari,jam_mulai, jam_selesai,ruang) VALUES (?,?,?,?,?,?)", [nama_mk, dosen, hari, jam_mulai, jam_selesai, ruang]);
        res
            .status(200)
            .send({ message: "Pelajaran berhasil di tambahkan", result });
        console.log("🟢 Pelajaran berhasil di tambahkan");
    }
    catch (error) {
        res.status(500).send({ error: "error menambahkan pelajaran di database" });
        console.error("🔴 error saat menambahkan pelajaran di database \n", error);
    }
};
exports.addPelajaran = addPelajaran;
