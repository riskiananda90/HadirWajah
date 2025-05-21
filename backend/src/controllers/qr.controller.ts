import QRCode from "qrcode";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { emitOtpReceived } from "../socket";

// Secret key for JWT - should be in environment variables in production
const JWT_SECRET = "QR_KEY";

export const generateQr = async (req: Request, res: Response) => {
  try {
    // Generate 6-digit OTP
    const OTP = Math.floor(100000 + Math.random() * 900000).toString();

    const payload = {
      classId: req.body.classId,
      studentId: req.body.studentId,
      otp: OTP,
      expires: Date.now() + 60000,
    };

    const token = jwt.sign(payload, JWT_SECRET);

    QRCode.toDataURL(OTP, (err, url) => {
      if (err) {
        console.log("🔴 Error generating QR image:", err);
        return res
          .status(500)
          .json({ message: "Gagal generate QR code image" });
      }

      res.json({
        qr: url,
        token: token,
      });

      console.log("🟢 QR Code berhasil di generate, OTP:", OTP);
    });
  } catch (error) {
    console.log("🔴 Error generate QR:", error);
    res.status(500).json({ message: "Gagal generate QR code" });
  }
};

export const handleOtpFromMobile = (req: Request, res: Response) => {
  try {
    const { studentId, otp } = req.body;

    if (!studentId || !otp) {
      return res.status(400).json({
        success: false,
        message: "StudentId dan OTP diperlukan",
      });
    }

    emitOtpReceived(studentId, otp);

    res.json({
      success: true,
      message: "OTP berhasil dikirim ke client",
    });
  } catch (error) {
    console.log("🔴 Error handling OTP from mobile:", error);
    res.status(500).json({
      success: false,
      message: "Gagal memproses OTP",
    });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { OTP, classId, studentId, token } = req.body;

    if (!OTP || !classId || !studentId || !token) {
      return res.status(400).json({
        success: false,
        message: "Semua field diperlukan",
      });
    }

    let decode;
    try {
      decode = jwt.verify(token, JWT_SECRET) as {
        otp: string;
        classId: string | number;
        studentId: string | number;
        expires: number;
      };
    } catch (jwtError) {
      console.log("🔴 JWT verification error:", jwtError);
      return res.status(401).json({
        success: false,
        message: "Token tidak valid",
      });
    }

    if (Date.now() > decode.expires) {
      return res.status(400).json({
        success: false,
        message: "OTP sudah kadaluarsa",
      });
    }

    const tokenOtp = String(decode.otp);
    const tokenClassId = String(decode.classId);
    const tokenStudentId = String(decode.studentId);
    const requestOtp = String(OTP);
    const requestClassId = String(classId);
    const requestStudentId = String(studentId);

    if (
      tokenOtp === requestOtp &&
      tokenClassId === requestClassId &&
      tokenStudentId === requestStudentId
    ) {
      return res.status(200).json({
        success: true,
        message: "OTP valid dan absensi berhasil",
      });
    } else {
      console.log("🔴 OTP verification failed. Mismatch:", {
        tokenOtp,
        requestOtp,
        tokenClassId,
        requestClassId,
        tokenStudentId,
        requestStudentId,
      });

      return res.status(400).json({
        success: false,
        message: "OTP salah atau data tidak cocok",
      });
    }
  } catch (error) {
    console.log("🔴 OTP verification error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server",
    });
  }
};
