import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(
      null,
      path.join(
        __dirname,
        "..",
        "..",
        "..",
        "Absensi-Mahasiswa",
        "public",
        "profile_images"
      )
    );
  },
  filename: function (req, file, cb) {
    const exe = ".png";
    const nim = req.body.nim;
    const nama = req.body.nama;
    const safeNama = nama.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "");
    const filename = `${nim}_${safeNama}${exe}`;
    cb(null, filename);
  },
});

export const upload = multer({ storage: storage });
