"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = exports.handleOtpFromMobile = exports.generateQr = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const socket_1 = require("../socket");
// Secret key for JWT - should be in environment variables in production
const JWT_SECRET = "QR_KEY";
const generateQr = async (req, res) => {
    try {
        // Generate 6-digit OTP
        const OTP = Math.floor(100000 + Math.random() * 900000).toString();
        const payload = {
            classId: req.body.classId,
            studentId: req.body.studentId,
            otp: OTP,
            expires: Date.now() + 60000,
        };
        const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET);
        qrcode_1.default.toDataURL(OTP, (err, url) => {
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
    }
    catch (error) {
        console.log("🔴 Error generate QR:", error);
        res.status(500).json({ message: "Gagal generate QR code" });
    }
};
exports.generateQr = generateQr;
const handleOtpFromMobile = (req, res) => {
    try {
        const { studentId, otp } = req.body;
        if (!studentId || !otp) {
            return res.status(400).json({
                success: false,
                message: "StudentId dan OTP diperlukan",
            });
        }
        (0, socket_1.emitOtpReceived)(studentId, otp);
        res.json({
            success: true,
            message: "OTP berhasil dikirim ke client",
        });
    }
    catch (error) {
        console.log("🔴 Error handling OTP from mobile:", error);
        res.status(500).json({
            success: false,
            message: "Gagal memproses OTP",
        });
    }
};
exports.handleOtpFromMobile = handleOtpFromMobile;
const verifyOtp = async (req, res) => {
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
            decode = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        }
        catch (jwtError) {
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
        if (tokenOtp === requestOtp &&
            tokenClassId === requestClassId &&
            tokenStudentId === requestStudentId) {
            return res.status(200).json({
                success: true,
                message: "OTP valid dan absensi berhasil",
            });
        }
        else {
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
    }
    catch (error) {
        console.log("🔴 OTP verification error:", error);
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan server",
        });
    }
};
exports.verifyOtp = verifyOtp;
