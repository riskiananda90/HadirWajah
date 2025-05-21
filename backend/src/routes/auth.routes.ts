import { Router } from "express";
import { RequestHandler } from "express"; // Tambahkan import ini
import {
  LoginMahasiswa,
  RegisterMahasiswa,
} from "../controllers/auth.controller";
import { upload } from "../middleware/Upload";

const router = Router();

router.post(
  "/register",
  upload.single("foto_profil"),
  RegisterMahasiswa as RequestHandler
);

router.post("/login", LoginMahasiswa as RequestHandler);

export default router;
