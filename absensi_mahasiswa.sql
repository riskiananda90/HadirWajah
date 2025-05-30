DROP TABLE IF EXISTS `absensi`;
CREATE TABLE `absensi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_mahasiswa` int NOT NULL,
  `id_jadwal` int NOT NULL,
  `waktu_absen` datetime DEFAULT NULL,
  `status_kehadiran` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '',
  `telat` tinyint(1) DEFAULT '0',
  `fotoAbsensi` varchar(50) DEFAULT NULL,
  `lokasi_lat` double DEFAULT NULL,
  `lokasi_lng` double DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_mahasiswa` (`id_mahasiswa`),
  KEY `id_jadwal` (`id_jadwal`),
  CONSTRAINT `absensi_ibfk_1` FOREIGN KEY (`id_mahasiswa`) REFERENCES `mahasiswa` (`id`),
  CONSTRAINT `absensi_ibfk_2` FOREIGN KEY (`id_jadwal`) REFERENCES `jadwal_perkuliahan` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `absensi` WRITE;
INSERT INTO `absensi` VALUES (29,1,1,'2025-05-12 15:48:05','hadir',0,'1_1_2025-05-12_15_48_05.jpg',0,0,'2025-05-12 08:48:05');
UNLOCK TABLES;

DROP TABLE IF EXISTS `histori_absensi`;
CREATE TABLE `histori_absensi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_mahasiswa` int DEFAULT NULL,
  `nim` varchar(20) DEFAULT NULL,
  `nama_mahasiswa` varchar(100) DEFAULT NULL,
  `nama_mk` varchar(100) DEFAULT NULL,
  `nama_dosen` varchar(100) DEFAULT NULL,
  `pertemuan_ke` int DEFAULT NULL,
  `tanggal` date DEFAULT NULL,
  `jam_mulai` time DEFAULT NULL,
  `jam_selesai` time DEFAULT NULL,
  `ruangan` varchar(50) DEFAULT NULL,
  `status_kehadiran` enum('hadir','sakit','izin','alpa') DEFAULT NULL,
  `telat` tinyint(1) DEFAULT NULL,
  `waktu_absen` datetime DEFAULT NULL,
  `qr_code_data` text,
  `lokasi_lat` double DEFAULT NULL,
  `lokasi_lng` double DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_mahasiswa` (`id_mahasiswa`),
  CONSTRAINT `histori_absensi_ibfk_1` FOREIGN KEY (`id_mahasiswa`) REFERENCES `mahasiswa` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `histori_absensi` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `jadwal_perkuliahan`;
CREATE TABLE `jadwal_perkuliahan` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_mk` int DEFAULT NULL,
  `pertemuan_ke` int DEFAULT NULL,
  `tanggal` date NOT NULL,
  `status_aktif` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `id_mk` (`id_mk`),
  CONSTRAINT `jadwal_perkuliahan_ibfk_1` FOREIGN KEY (`id_mk`) REFERENCES `mata_kuliah` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `jadwal_perkuliahan` WRITE;
INSERT INTO `jadwal_perkuliahan` VALUES (1,101,8,'2025-05-06',1),(2,102,8,'2025-05-06',1),(3,103,8,'2025-05-06',1),(4,201,8,'2025-05-07',1),(5,202,8,'2025-05-07',1),(6,203,8,'2025-05-07',1),(7,301,8,'2025-05-08',1),(8,302,8,'2025-05-08',1),(9,401,8,'2025-05-09',1),(10,402,8,'2025-05-09',1);
UNLOCK TABLES;

DROP TABLE IF EXISTS `mahasiswa`;
CREATE TABLE `mahasiswa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nim` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `password` text NOT NULL,
  `foto_profil` text,
  `jumlah_hadir` int DEFAULT '0',
  `jumlah_sakit` int DEFAULT '0',
  `jumlah_izin` int DEFAULT '0',
  `jumlah_alpa` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nim` (`nim`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `mahasiswa` WRITE;
INSERT INTO `mahasiswa` VALUES (1,'2022573010115','Risskiananda90@gmail.com','Rizki Ananda','$2b$10$QFQoteHmg1QtYSD0eN9A2enR.ZR6t6hnuDFyZ7tn2pT5ZvOQhZz8.',NULL,2,0,0,0,'2025-05-08 02:34:57');
UNLOCK TABLES;

DROP TABLE IF EXISTS `mata_kuliah`;
CREATE TABLE `mata_kuliah` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nama_mk` varchar(100) NOT NULL,
  `dosen` varchar(100) NOT NULL,
  `hari` varchar(20) NOT NULL,
  `jam_mulai` time NOT NULL,
  `jam_selesai` time NOT NULL,
  `ruang` varchar(50) DEFAULT NULL,
  `jumlah_pertemuan` int DEFAULT '16',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=403 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `mata_kuliah` WRITE;
INSERT INTO `mata_kuliah` VALUES (101,'Praktikum Komputer Vision','Dr. Rahmad Hidayat, S.Kom., M.Cs','Selasa','07:30:00','11:10:00','101',16),(102,'Metodologi Penelitian','Mahdi M.Cs.','Selasa','11:10:00','12:50:00','210',16),(103,'Kewirausahaan','Huzaeni, SST., M.IT.','Selasa','13:39:00','15:10:00','316',16),(201,'Komputer Vision','Dr. Rahmad Hidayat S.Kom., M.Cs.','Rabu','07:30:00','09:10:00','301',16),(202,'Interpersonal Skill','Dr.Hilmi ,MM, CMA, CTAM','Rabu','11:10:00','12:50:00','314',16),(203,'Machinr Learning','Dr. Rahmad Hidayat S.Kom., M.Cs.','Rabu','14:20:00','16:00:00','303',16),(301,'Komputasi Cloud','Muhammad Rizka, SST., M.Kom.','Kamis','07:30:00','09:10:00','314',16),(302,'Praktikum Machine Learning','Dr. Rahmad Hidayat S.Kom., M.Cs.','Kamis','13:20:00','16:00:00','101',16),(401,'Praktikum Komputasi Cloud','Indrawati SST.MT','Jumat','07:30:00','13:50:00','110',16),(402,'WorkShop Data Science & Big Data','MustaΓÇÖinul Abdi, S.S.T., M.Kom','Sabtu','13:30:00','16:00:00','101',16);
UNLOCK TABLES;

DROP TABLE IF EXISTS `notifikasi`;
CREATE TABLE `notifikasi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_mahasiswa` int DEFAULT NULL,
  `tipe_notifikasi` varchar(50) DEFAULT NULL,
  `pesan` text,
  `waktu_dibuat` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status_dibaca` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `id_mahasiswa` (`id_mahasiswa`),
  CONSTRAINT `notifikasi_ibfk_1` FOREIGN KEY (`id_mahasiswa`) REFERENCES `mahasiswa` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `notifikasi` WRITE;
UNLOCK TABLES;

DROP TABLE IF EXISTS `qr_code_mahasiswa`;
CREATE TABLE `qr_code_mahasiswa` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_mahasiswa` int NOT NULL,
  `id_jadwal` int NOT NULL,
  `kode_qr` text NOT NULL,
  `lokasi_lat` double DEFAULT NULL,
  `lokasi_lng` double DEFAULT NULL,
  `radius_validasi` double DEFAULT '50',
  `waktu_berlaku_mulai` datetime DEFAULT NULL,
  `waktu_berlaku_akhir` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_mahasiswa` (`id_mahasiswa`,`id_jadwal`),
  KEY `id_jadwal` (`id_jadwal`),
  CONSTRAINT `qr_code_mahasiswa_ibfk_1` FOREIGN KEY (`id_mahasiswa`) REFERENCES `mahasiswa` (`id`),
  CONSTRAINT `qr_code_mahasiswa_ibfk_2` FOREIGN KEY (`id_jadwal`) REFERENCES `jadwal_perkuliahan` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `qr_code_mahasiswa` WRITE;
UNLOCK TABLES;