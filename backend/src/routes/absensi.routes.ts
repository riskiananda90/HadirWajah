import { Router } from "express";

import { addAbsensi, getAbsensi } from "../controllers/absensi.routes";

const router = Router();

router.get("/absensi/jadwal", getAbsensi as any);
router.post("/absensi", addAbsensi as any);
export default router;
