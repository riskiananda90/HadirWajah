import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pelarajanRoutes from "./routes/pelajaran.routes";
import mahasiswaRoutes from "./routes/mahasiswa.routes";
import { connetcDB } from "./models/db";
import authRoutes from "./routes/auth.routes";
import qr from "./routes/qr.routes";
import absensiRoutes from "./routes/absensi.routes";
import path from "path";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

app.use("/api", pelarajanRoutes);
app.use("/api", mahasiswaRoutes);
app.use("/auth", authRoutes);
app.use("/jadwal", pelarajanRoutes);
app.use("/qr", qr);
app.use("/api", absensiRoutes);
console.log("Memulai server...");
(async () => {
  try {
    await connetcDB();
    console.log("Terhubung ke database");
    app.listen(port, () => {
      console.log(`✅ Server berjalan di http://server:${port}`);
    });
  } catch (error) {
    console.error("❌ Error saat connect ke database: ", error);
  }
})();
