"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const Upload_1 = require("../middleware/Upload");
const router = (0, express_1.Router)();
router.post("/register", Upload_1.upload.single("foto_profil"), auth_controller_1.RegisterMahasiswa);
router.post("/login", auth_controller_1.LoginMahasiswa);
exports.default = router;
