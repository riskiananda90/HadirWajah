import { Router } from "express";

import { getMahasiswa, addMahasiswa } from "../controllers/mahasiswa.controller";

const router = Router();

router.get("getMahasiswa", getMahasiswa);
router.post("addMahasiswa", addMahasiswa);

export default router;