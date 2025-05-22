"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const absensi_controller_1 = require("../controllers/absensi.controller");
const router = (0, express_1.Router)();
router.get("/absensi/jadwal", absensi_controller_1.getAbsensi);
router.post("/absensi", absensi_controller_1.addAbsensi);
exports.default = router;
