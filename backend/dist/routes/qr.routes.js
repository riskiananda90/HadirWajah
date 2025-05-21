"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const qr_controller_1 = require("../controllers/qr.controller");
const router = (0, express_1.Router)();
router.post("/generate", qr_controller_1.generateQr);
router.post("/verify", qr_controller_1.verifyOtp);
exports.default = router;
