"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = exports.connetcDB = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
let connection;
const connetcDB = async () => {
    connection = await promise_1.default.createConnection({
        host: process.env.DB_HOST || "db",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || "absensi_mahasiswa",
        port: parseInt(process.env.DB_PORT || "3306"),
    });
    console.log("Koneksi Ke database berhasil");
};
exports.connetcDB = connetcDB;
const getConnection = () => connection;
exports.getConnection = getConnection;
