"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const absensi_routes_1 = require("../controllers/absensi.routes");
const router = (0, express_1.Router)();
router.get("/absensi/jadwal", absensi_routes_1.getAbsensi);
router.post("/absensi", absensi_routes_1.addAbsensi);
exports.default = router;
