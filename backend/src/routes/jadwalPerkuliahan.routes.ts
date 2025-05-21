import { Router } from "express";
import { getJadwalPerkuliahan } from "../controllers/jadwalPerkuliahan.controller";

const router = Router();
router.get("/:id/jadwalPerkuliahan", getJadwalPerkuliahan);

export default router;
