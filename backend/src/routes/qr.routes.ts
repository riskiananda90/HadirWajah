import QRCode from "qrcode";
import { Jwt } from "jsonwebtoken";
import { Router, Request, Response, RequestHandler } from "express";
import {
  generateQr,
  verifyOtp,
  handleOtpFromMobile,
} from "../controllers/qr.controller";

const router = Router();

router.post("/generate", generateQr);
router.post("/verify", verifyOtp as RequestHandler);

export default router;
