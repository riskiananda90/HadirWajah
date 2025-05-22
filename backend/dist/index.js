"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const pelajaran_routes_1 = __importDefault(require("./routes/pelajaran.routes"));
const mahasiswa_routes_1 = __importDefault(require("./routes/mahasiswa.routes"));
const db_1 = require("./models/db");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const qr_routes_1 = __importDefault(require("./routes/qr.routes"));
const absensi_routes_1 = __importDefault(require("./routes/absensi.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
app.use((0, cors_1.default)({
    origin: "https://hadirwajah.my.id",
    credentials: true,
}));
app.options("*", (0, cors_1.default)());
app.use(express_1.default.json({ limit: "5mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "5mb" }));
app.use("/api", pelajaran_routes_1.default);
app.use("/api", mahasiswa_routes_1.default);
app.use("/auth", auth_routes_1.default);
app.use("/jadwal", pelajaran_routes_1.default);
app.use("/qr", qr_routes_1.default);
app.use("/api", absensi_routes_1.default);
console.log("Memulai server...");
(async () => {
    try {
        await (0, db_1.connetcDB)();
        console.log("Terhubung ke database");
        app.listen(port, () => {
            console.log(`✅ Server berjalan di http://server:${port}`);
        });
    }
    catch (error) {
        console.error("❌ Error saat connect ke database: ", error);
    }
})();
