"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginMahasiswa = exports.RegisterMahasiswa = void 0;
const db_1 = require("../models/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const RegisterMahasiswa = async (req, res) => {
    try {
        const connection = (0, db_1.getConnection)();
        const { nim, email, nama, password, foto_profil } = req.body;
        if (!nim || !email || !nama || !password) {
            return res.status(400).json({ message: "Semua field harus diisi" });
        }
        const hashpassword = await bcryptjs_1.default.hash(password, 10);
        const fileName = req.file?.filename || null;
        const [result] = await connection.execute("INSERT INTO mahasiswa(nim, email, nama, password, foto_profil ) VALUES (?,?,?,?,?)", [nim, email, nama, hashpassword, fileName || null]);
        res.status(200).json({ message: "🟢 Mahasiswa berhasil mendaftar" });
        console.log("🟢 Mahasiswa berhasil mendaftar : \n", result);
    }
    catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res
                .status(400)
                .json({ message: "NIM atau email sudah terdaftar" });
        }
        console.log(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};
exports.RegisterMahasiswa = RegisterMahasiswa;
const LoginMahasiswa = async (req, res) => {
    try {
        console.log(req.body);
        const connection = (0, db_1.getConnection)();
        console.log("Berhasil terhubung ke database");
        const { nim, password } = req.body;
        const [result] = await connection.execute("SELECT * FROM mahasiswa where nim = ? ", [nim]);
        if (!result || result.length === 0) {
            console.log(result);
            return res.status(401).json({ message: "NIM atau password salah" });
        }
        const PasswordSama = await bcryptjs_1.default.compare(password, result[0].password);
        if (!PasswordSama) {
            return res.status(401).json({ message: "NIM atau password salah" });
        }
        const token = jsonwebtoken_1.default.sign({ nim: result[0].nim, email: result[0].email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1h" });
        delete result[0].password;
        res
            .status(200)
            .json({ message: "🟢 Mahasiswa berhasil login", token, result });
        console.log("🟢 Mahasiswa berhasil login");
    }
    catch (error) {
        console.log("Internal server error", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};
exports.LoginMahasiswa = LoginMahasiswa;
