"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJadwalPerkuliahan = void 0;
const db_1 = require("../models/db");
const getJadwalPerkuliahan = async (req, res) => {
    try {
        const id = req.params.id;
        const connection = (0, db_1.getConnection)();
        const [result] = await connection.execute("SELECT * FROM jadwal_perkuliahan where id_mk = ?", [id]);
        res
            .status(200)
            .send({ message: "Jadwal perkuliahan berhasil di ambil", result });
    }
    catch (error) {
        res
            .status(500)
            .send({ error: "error mengambil jadwal perkuliahan di database" });
    }
};
exports.getJadwalPerkuliahan = getJadwalPerkuliahan;
