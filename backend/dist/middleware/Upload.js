"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(__dirname, "..", "..", "..", "Absensi-Mahasiswa", "public", "profile_images"));
    },
    filename: function (req, file, cb) {
        const exe = ".png";
        const nim = req.body.nim;
        const nama = req.body.nama;
        const safeNama = nama.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
        const filename = `${nim}_${safeNama}${exe}`;
        cb(null, filename);
    },
});
exports.upload = (0, multer_1.default)({ storage: storage });
