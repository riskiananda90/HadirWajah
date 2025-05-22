"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pelajaran_controllers_1 = require("../controllers/pelajaran.controllers");
const router = (0, express_1.Router)();
router.post("/addPelajaran", pelajaran_controllers_1.addPelajaran);
router.get("/getPelajaran", pelajaran_controllers_1.getPelajaran);
exports.default = router;
