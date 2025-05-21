"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jadwalPerkuliahan_controller_1 = require("../controllers/jadwalPerkuliahan.controller");
const router = (0, express_1.Router)();
router.get("/:id/jadwalPerkuliahan", jadwalPerkuliahan_controller_1.getJadwalPerkuliahan);
exports.default = router;
