"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mahasiswa_controller_1 = require("../controllers/mahasiswa.controller");
const router = (0, express_1.Router)();
router.get("getMahasiswa", mahasiswa_controller_1.getMahasiswa);
router.post("addMahasiswa", mahasiswa_controller_1.addMahasiswa);
exports.default = router;
