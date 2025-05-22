import { Router } from "express";

import {
  getPelajaran,
  addPelajaran,
} from "../controllers/pelajaran.controllers";

const router = Router();

router.post("/addPelajaran", addPelajaran);
router.get("/getPelajaran", getPelajaran);

export default router;
