# Laporan Project Sistem Absensi Mahasiswa dengan Pengenalan Wajah

## 1. Pendahuluan

### 1.1 Latar Belakang
Sistem absensi konvensional yang menggunakan tanda tangan atau panggilan nama memiliki banyak kelemahan, seperti kemungkinan titip absen (buddy punching), kesalahan pencatatan manual, dan pemborosan waktu akademik. Dengan memanfaatkan teknologi pengenalan wajah (face recognition), sistem absensi dapat menjadi lebih efisien, akurat, dan aman.

### 1.2 Tujuan Project
- Membangun sistem absensi mahasiswa otomatis menggunakan teknologi pengenalan wajah
- Mengurangi kecurangan dalam proses absensi
- Memberikan notifikasi tepat waktu kepada mahasiswa
- Menyediakan laporan kehadiran yang akurat dan komprehensif
- Menghemat waktu dosen dalam proses absensi

### 1.3 Ruang Lingkup
Sistem ini akan mencakup:
- Pendaftaran data mahasiswa beserta foto wajah
- Proses absensi otomatis dengan pengenalan wajah
- Sistem notifikasi terkait jadwal dan status absensi
- Perhitungan persentase kehadiran mahasiswa
- Laporan kehadiran per mata kuliah dan per mahasiswa

## 2. Analisis Kebutuhan

### 2.1 Kebutuhan Fungsional
1. **Manajemen Data Mahasiswa**
   - Menyimpan informasi mahasiswa (NIM, nama, email, password, foto)
   - Menyimpan data encoding wajah untuk verifikasi

2. **Manajemen Data Mata Kuliah**
   - Menyimpan informasi mata kuliah (ID MK, nama MK, dosen, jadwal, ruangan)
   - Mengelola 16 pertemuan per semester

3. **Proses Absensi**
   - Verifikasi wajah mahasiswa saat absensi
   - Klasifikasi status kehadiran (hadir, telat, izin, sakit, alpa)
   - Pembatasan waktu absensi (telat jika >15 menit setelah jadwal)

4. **Sistem Notifikasi**
   - Notifikasi 5 menit sebelum waktu absensi
   - Notifikasi saat mahasiswa telat absen
   - Notifikasi jika tidak absen
   - Notifikasi untuk mengajukan keterangan

5. **Pelaporan**
   - Perhitungan persentase kehadiran per mahasiswa
   - Laporan kehadiran per kelas dan per mahasiswa
   - Laporan status kehadiran (hadir, telat, izin, sakit, alpa)

### 2.2 Kebutuhan Non-Fungsional
1. **Keamanan**
   - Enkripsi data mahasiswa
   - Autentikasi dua faktor (wajah + lokasi)
   - Keamanan data biometrik

2. **Kinerja**
   - Respons cepat dalam pengenalan wajah (<2 detik)
   - Dapat menangani banyak mahasiswa secara bersamaan

3. **Ketersediaan**
   - Sistem dapat berfungsi dalam mode offline jika koneksi internet terputus
   - Sinkronisasi otomatis saat koneksi kembali

4. **Kegunaan**
   - Antarmuka yang mudah digunakan
   - Panduan penggunaan yang jelas

## 3. Arsitektur dan Teknologi

### 3.1 Teknologi yang Digunakan

#### 3.1.1 Frontend
- **React dengan TypeScript**: Framework JavaScript modern dengan dukungan typing
- **Tailwind CSS**: Framework CSS untuk desain responsif
- **Axios**: Library untuk HTTP requests
- **React Router**: Library untuk navigasi
- **Zustand/Redux**: State management
- **React Webcam**: Mengakses kamera untuk pengenalan wajah
- **Socket.io Client**: Komunikasi real-time untuk notifikasi

#### 3.1.2 Backend
- **Node.js**: Runtime JavaScript
- **Express**: Framework web untuk Node.js
- **TypeScript**: Superset JavaScript dengan typing
- **Prisma**: ORM untuk database
- **MySQL/PostgreSQL**: Database relasional
- **JWT**: Autentikasi berbasis token
- **Socket.io**: Komunikasi real-time
- **face-api.js**: Library pengenalan wajah berbasis TensorFlow.js
- **Multer**: Middleware untuk menangani upload file
- **Node-cron**: Penjadwalan task untuk notifikasi

### 3.2 Arsitektur Sistem
Sistem akan menggunakan arsitektur microservices dengan komponen berikut:
- **Frontend App**: Aplikasi React untuk UI
- **Auth Service**: Layanan untuk autentikasi dan otorisasi
- **Student Service**: Manajemen data mahasiswa
- **Course Service**: Manajemen data mata kuliah dan sesi
- **Attendance Service**: Proses absensi dan pengenalan wajah
- **Notification Service**: Pengelolaan dan pengiriman notifikasi
- **Reporting Service**: Generasi laporan dan statistik

## 4. Desain Database

### 4.1 Diagram Entity Relationship (ERD)

![ERD Sistem Absensi](https://example.com/erd.png)

### 4.2 Skema Database (Prisma Schema)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Mahasiswa {
  id                Int          @id @default(autoincrement())
  nim               String       @unique
  nama              String
  email             String       @unique
  password          String
  foto_profil       String?
  data_encoding_wajah String?
  created_at        DateTime     @default(now())
  updated_at        DateTime     @updatedAt
  absensi           Absensi[]
  notifikasi        Notifikasi[]
}

model Dosen {
  id                Int          @id @default(autoincrement())
  nip               String       @unique
  nama              String
  email             String       @unique
  password          String
  foto_profil       String?
  created_at        DateTime     @default(now())
  updated_at        DateTime     @updatedAt
  mata_kuliah       MataKuliah[]
}

model MataKuliah {
  id                Int          @id @default(autoincrement())
  kode_mk           String       @unique
  nama_mk           String
  dosen_id          Int
  dosen             Dosen        @relation(fields: [dosen_id], references: [id])
  semester          String
  tahun_akademik    String
  created_at        DateTime     @default(now())
  updated_at        DateTime     @updatedAt
  sesi_kelas        SesiKelas[]
}

model Ruangan {
  id                Int          @id @default(autoincrement())
  nama_ruangan      String
  gedung            String
  lantai            Int
  kapasitas         Int
  created_at        DateTime     @default(now())
  updated_at        DateTime     @updatedAt
  sesi_kelas        SesiKelas[]
}

model SesiKelas {
  id                Int          @id @default(autoincrement())
  mata_kuliah_id    Int
  mata_kuliah       MataKuliah   @relation(fields: [mata_kuliah_id], references: [id])
  ruangan_id        Int
  ruangan           Ruangan      @relation(fields: [ruangan_id], references: [id])
  nomor_pertemuan   Int          // 1-16
  tanggal_sesi      DateTime     @db.Date
  waktu_mulai       DateTime     @db.Time
  waktu_selesai     DateTime     @db.Time
  created_at        DateTime     @default(now())
  updated_at        DateTime     @updatedAt
  absensi           Absensi[]
  notifikasi        Notifikasi[]
}

model Absensi {
  id                Int          @id @default(autoincrement())
  mahasiswa_id      Int
  mahasiswa         Mahasiswa    @relation(fields: [mahasiswa_id], references: [id])
  sesi_id           Int
  sesi_kelas        SesiKelas    @relation(fields: [sesi_id], references: [id])
  status            Status
  waktu_absen       DateTime?
  skor_kecocokan_wajah Float?
  data_lokasi       String?      // JSON string containing lat/long
  keterangan        String?
  bukti_file        String?
  created_at        DateTime     @default(now())
  updated_at        DateTime     @updatedAt
}

model Notifikasi {
  id                Int          @id @default(autoincrement())
  mahasiswa_id      Int
  mahasiswa         Mahasiswa    @relation(fields: [mahasiswa_id], references: [id])
  sesi_id           Int
  sesi_kelas        SesiKelas    @relation(fields: [sesi_id], references: [id])
  tipe              TipeNotifikasi
  pesan             String
  sudah_dibaca      Boolean      @default(false)
  waktu_kirim       DateTime
  created_at        DateTime     @default(now())
  updated_at        DateTime     @updatedAt
}

enum Status {
  HADIR
  TELAT
  IZIN
  SAKIT
  ALPA
}

enum TipeNotifikasi {
  KELAS_AKAN_DIMULAI
  TELAT_ABSEN
  TIDAK_ABSEN
  AJUKAN_KETERANGAN
}
```

## 5. Langkah-langkah Implementasi Project

### 5.1 Persiapan Lingkungan Pengembangan

1. **Instalasi Tools dan Dependencies**

```bash
# Instalasi Node.js dan npm (pastikan versi Node.js ≥ 14)
# Download dan install dari https://nodejs.org/

# Instalasi yarn (opsional)
npm install -g yarn

# Instalasi TypeScript
npm install -g typescript

# Instalasi create-react-app
npm install -g create-react-app
```

2. **Membuat Project Frontend (React + TypeScript + Tailwind CSS)**

```bash
# Membuat project React dengan TypeScript
npx create-react-app absensi-frontend --template typescript

# Masuk ke direktori project
cd absensi-frontend

# Instalasi Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Instalasi dependencies lainnya
npm install axios react-router-dom react-webcam face-api.js socket.io-client @headlessui/react @heroicons/react moment zustand jwt-decode
```

3. **Konfigurasi Tailwind CSS**

Buat file konfigurasi Tailwind CSS di `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Update file `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4. **Membuat Project Backend (Node.js + Express + TypeScript)**

```bash
# Membuat direktori project
mkdir absensi-backend
cd absensi-backend

# Inisialisasi package.json
npm init -y

# Instalasi dependencies
npm install express cors dotenv jsonwebtoken bcrypt multer socket.io nodemailer
npm install prisma @prisma/client face-api.js canvas node-cron

# Instalasi dev dependencies
npm install -D typescript ts-node @types/node @types/express @types/cors @types/bcrypt @types/jsonwebtoken @types/multer nodemon
```

5. **Konfigurasi TypeScript untuk Backend**

Buat file `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

6. **Konfigurasi Prisma dan Database**

```bash
# Inisialisasi Prisma
npx prisma init
```

Edit file `.env` untuk konfigurasi database:

```
DATABASE_URL="postgresql://username:password@localhost:5432/absensi_db?schema=public"
```

7. **Konfigurasi Script di package.json (Backend)**

Update file `package.json`:

```json
{
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate"
  }
}
```

### 5.2 Implementasi Backend

#### 5.2.1 Struktur Direktori Backend

```
absensi-backend/
├── src/
│   ├── config/           # Konfigurasi aplikasi
│   ├── controllers/      # Controller untuk routing
│   ├── middleware/       # Middleware (auth, upload, etc)
│   ├── models/           # Model data (jika diperlukan selain Prisma)
│   ├── routes/           # Definisi route API
│   ├── services/         # Business logic
│   ├── utils/            # Utility functions
│   └── index.ts          # Entry point aplikasi
├── prisma/
│   └── schema.prisma     # Skema database Prisma
├── .env                  # Environment variables
├── package.json
└── tsconfig.json
```

#### 5.2.2 Implementasi Entry Point (src/index.ts)

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.routes';
import mahasiswaRoutes from './routes/mahasiswa.routes';
import dosenRoutes from './routes/dosen.routes';
import matakuliahRoutes from './routes/matakuliah.routes';
import absensiRoutes from './routes/absensi.routes';
import notifikasiRoutes from './routes/notifikasi.routes';
import laporanRoutes from './routes/laporan.routes';
import { initializeScheduledJobs } from './services/scheduler.service';

// Konfigurasi dotenv
dotenv.config();

// Inisialisasi Express
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Inisialisasi Prisma
export const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mahasiswa', mahasiswaRoutes);
app.use('/api/dosen', dosenRoutes);
app.use('/api/matakuliah', matakuliahRoutes);
app.use('/api/absensi', absensiRoutes);
app.use('/api/notifikasi', notifikasiRoutes);
app.use('/api/laporan', laporanRoutes);

// Socket.io untuk notifikasi realtime
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Mulai scheduled jobs untuk notifikasi
initializeScheduledJobs(io);

// Mulai server
const PORT = process.env.PORT || 8000;
httpServer.listen(PORT, () => {
  console.log(`Server berjalan pada port ${PORT}`);
});
```

#### 5.2.3 Implementasi Middleware Autentikasi (src/middleware/auth.middleware.ts)

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

// Interface untuk data token terenkripsi
interface TokenPayload {
  id: number;
  role: 'mahasiswa' | 'dosen' | 'admin';
}

// Deklarasi interface untuk menambahkan user dan role ke Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        role: 'mahasiswa' | 'dosen' | 'admin';
      };
    }
  }
}

// Middleware untuk verifikasi token JWT
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Mendapatkan token dari header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Akses ditolak. Token tidak ditemukan.'
      });
    }

    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET || 'secret_key';

    // Verifikasi token
    try {
      const decoded = jwt.verify(token, secretKey) as TokenPayload;
      req.user = {
        id: decoded.id,
        role: decoded.role
      };
      next();
    } catch (error) {
      return res.status(401).json({
        status: 'error',
        message: 'Token tidak valid atau kadaluarsa.'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat autentikasi.'
    });
  }
};

// Middleware untuk membatasi akses berdasarkan peran
export const roleMiddleware = (allowedRoles: ('mahasiswa' | 'dosen' | 'admin')[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Akses ditolak. Token tidak ditemukan.'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Akses ditolak. Anda tidak memiliki izin yang cukup.'
      });
    }

    next();
  };
};
```

#### 5.2.4 Implementasi Controller Absensi (src/controllers/absensi.controller.ts)

```typescript
import { Request, Response } from 'express';
import { prisma } from '../index';
import { Status } from '@prisma/client';
import { processAttendance } from '../services/faceRecognition.service';
import { sendNotification } from '../services/notification.service';
import path from 'path';

// Controller untuk menangani absensi dengan pengenalan wajah
export const submitAttendance = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
    }

    const { sesiId } = req.body;
    const mahasiswaId = req.user.id;
    
    // Validasi parameter yang dibutuhkan
    if (!sesiId) {
      return res.status(400).json({
        status: 'error',
        message: 'Session ID diperlukan'
      });
    }

    // Validasi file gambar wajah
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Gambar wajah diperlukan'
      });
    }

    // Mendapatkan informasi sesi kelas
    const sesiKelas = await prisma.sesiKelas.findUnique({
      where: { id: Number(sesiId) },
      include: {
        mata_kuliah: true
      }
    });

    if (!sesiKelas) {
      return res.status(404).json({
        status: 'error',
        message: 'Sesi kelas tidak ditemukan'
      });
    }

    // Mendapatkan data mahasiswa untuk verifikasi wajah
    const mahasiswa = await prisma.mahasiswa.findUnique({
      where: { id: mahasiswaId }
    });

    if (!mahasiswa || !mahasiswa.data_encoding_wajah) {
      return res.status(404).json({
        status: 'error',
        message: 'Data wajah mahasiswa tidak ditemukan'
      });
    }

    // Jalur file gambar wajah yang diunggah
    const faceImagePath = req.file.path;

    // Verifikasi wajah dengan service pengenalan wajah
    const { isMatch, similarityScore } = await processAttendance(
      mahasiswa.data_encoding_wajah,
      faceImagePath
    );

    if (!isMatch) {
      return res.status(400).json({
        status: 'error',
        message: 'Verifikasi wajah gagal. Wajah tidak cocok.'
      });
    }

    // Menentukan status absensi berdasarkan waktu
    const now = new Date();
    const sessionStartTime = new Date(sesiKelas.tanggal_sesi);
    sessionStartTime.setHours(sesiKelas.waktu_mulai.getHours());
    sessionStartTime.setMinutes(sesiKelas.waktu_mulai.getMinutes());

    // Menghitung selisih waktu dalam menit
    const diffInMinutes = Math.floor((now.getTime() - sessionStartTime.getTime()) / (1000 * 60));

    // Menentukan status berdasarkan keterlambatan (lebih dari 15 menit = telat)
    let status: Status = Status.HADIR;
    if (diffInMinutes > 15) {
      status = Status.TELAT;
    }

    // Menyimpan data absensi ke database
    const absensi = await prisma.absensi.upsert({
      where: {
        mahasiswa_id_sesi_id: {
          mahasiswa_id: mahasiswaId,
          sesi_id: Number(sesiId)
        }
      },
      update: {
        status,
        waktu_absen: now,
        skor_kecocokan_wajah: similarityScore,
        data_lokasi: req.body.location || null,
        updated_at: now
      },
      create: {
        mahasiswa_id: mahasiswaId,
        sesi_id: Number(sesiId),
        status,
        waktu_absen: now,
        skor_kecocokan_wajah: similarityScore,
        data_lokasi: req.body.location || null
      }
    });

    // Kirim notifikasi jika telat
    if (status === Status.TELAT) {
      await sendNotification({
        mahasiswaId,
        sesiId: Number(sesiId),
        tipe: 'TELAT_ABSEN',
        pesan: `Anda telat ${diffInMinutes} menit pada mata kuliah ${sesiKelas.mata_kuliah.nama_mk}`
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Absensi berhasil dicatat',
      data: {
        id: absensi.id,
        status,
        waktu_absen: absensi.waktu_absen,
        similarity_score: similarityScore
      }
    });
  } catch (error) {
    console.error('Submit attendance error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat memproses absensi'
    });
  }
};

// Controller lainnya untuk absensi...
```

#### 5.2.5 Implementasi Service Pengenalan Wajah (src/services/faceRecognition.service.ts)

```typescript
import * as faceapi from 'face-api.js';
import { Canvas, Image } from 'canvas';
import fs from 'fs';
import path from 'path';

// Inisialisasi face-api.js dengan canvas
// Patch library agar bisa digunakan di Node.js
const { Canvas, Image, ImageData } = require('canvas');
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

// Path ke model face-api.js
const MODELS_PATH = path.join(__dirname, '../../models');

// Fungsi untuk memuat model
let modelsLoaded = false;
async function loadModels() {
  if (modelsLoaded) return;
  
  try {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODELS_PATH);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(MODELS_PATH);
    await faceapi.nets.faceRecognitionNet.loadFromDisk(MODELS_PATH);
    modelsLoaded = true;
    console.log('Face recognition models loaded successfully');
  } catch (error) {
    console.error('Error loading face recognition models:', error);
    throw new Error('Failed to load face recognition models');
  }
}

// Fungsi untuk mendapatkan encoding wajah dari gambar
export async function extractFaceEncoding(imagePath: string): Promise<Float32Array | null> {
  await loadModels();
  
  try {
    // Membaca gambar dari path
    const img = await loadImage(imagePath);
    
    // Deteksi wajah dengan face-api.js
    const detections = await faceapi.detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();
    
    if (!detections) {
      console.error('No face detected in the image');
      return null;
    }
    
    return detections.descriptor;
  } catch (error) {
    console.error('Error extracting face encoding:', error);
    return null;
  }
}

// Fungsi untuk memproses absensi dengan pengenalan wajah
export async function processAttendance(
  storedEncodingJson: string,
  currentImagePath: string,
  threshold: number = 0.6
): Promise<{ isMatch: boolean; similarityScore: number }> {
  await loadModels();
  
  try {
    // Parse stored encoding dari JSON
    const storedEncoding = new Float32Array(JSON.parse(storedEncodingJson));
    
    // Mengekstrak encoding dari gambar baru
    const currentEncoding = await extractFaceEncoding(currentImagePath);
    
    if (!currentEncoding) {
      return { isMatch: false, similarityScore: 0 };
    }
    
    // Menghitung jarak Euclidean antara dua encoding
    const distance = faceapi.euclideanDistance(storedEncoding, currentEncoding);
    
    // Konversi jarak ke skor kesamaan (1 - jarak, sehingga nilai yang lebih tinggi = lebih mirip)
    const similarityScore = 1 - distance;
    
    // Cocokkan berdasarkan threshold (threshold yang lebih rendah = lebih ketat)
    const isMatch = similarityScore >= threshold;
    
    return { isMatch, similarityScore };
  } catch (error) {
    console.error('Error processing attendance:', error);
    return { isMatch: false, similarityScore: 0 };
  }
}

// Fungsi helper untuk memuat gambar dari path
async function loadImage(imagePath: string): Promise<any> {
  const img = new Image();
  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = fs.readFileSync(imagePath);
  });
}
```

### 5.3 Implementasi Frontend

#### 5.3.1 Struktur Direktori Frontend

```
absensi-frontend/
├── public/
├── src/
│   ├── assets/          # Gambar, icons, dll
│   ├── components/      # Reusable components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom hooks
│   ├── layouts/         # Layout components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── store/           # Zustand store
│   ├── types/           # TypeScript interfaces
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main App component
│   └── index.tsx        # Entry point
├── .env                 # Environment variables
├── package.json
└── tsconfig.json
```

## 5. Implementasi Frontend (Lanjutan)

#### 5.3.2 Implementasi Service API (src/services/api.ts) (Lanjutan)

```typescript
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk menangani response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tangani error 401 (Unauthorized) - token kedaluwarsa
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Interface untuk response standar API
interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
}

// Service untuk autentikasi
export const authService = {
  login: async (nim: string, password: string) => {
    const { data } = await api.post<ApiResponse<{ token: string; user: any }>>(
      '/auth/login',
      { nim, password }
    );
    return data;
  },
  register: async (userData: any) => {
    const { data } = await api.post<ApiResponse<{ token: string; user: any }>>(
      '/auth/register',
      userData
    );
    return data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};

// Service untuk manajemen mahasiswa
export const mahasiswaService = {
  getAll: async () => {
    const { data } = await api.get<ApiResponse<any[]>>('/mahasiswa');
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get<ApiResponse<any>>(`/mahasiswa/${id}`);
    return data;
  },
  create: async (mahasiswaData: FormData) => {
    const { data } = await api.post<ApiResponse<any>>(
      '/mahasiswa',
      mahasiswaData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },
  update: async (id: number, mahasiswaData: FormData) => {
    const { data } = await api.put<ApiResponse<any>>(
      `/mahasiswa/${id}`,
      mahasiswaData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete<ApiResponse<null>>(`/mahasiswa/${id}`);
    return data;
  },
  uploadFaceImage: async (id: number, imageFile: File) => {
    const formData = new FormData();
    formData.append('faceImage', imageFile);
    
    const { data } = await api.post<ApiResponse<any>>(
      `/mahasiswa/${id}/face-encoding`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },
};

// Service untuk absensi
export const absensiService = {
  submitAttendance: async (sesiId: number, faceImage: File, location?: string) => {
    const formData = new FormData();
    formData.append('sesiId', sesiId.toString());
    formData.append('faceImage', faceImage);
    if (location) {
      formData.append('location', location);
    }
    
    const { data } = await api.post<ApiResponse<any>>(
      '/absensi/submit',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },
  getByMahasiswa: async (mahasiswaId: number) => {
    const { data } = await api.get<ApiResponse<any[]>>(
      `/absensi/mahasiswa/${mahasiswaId}`
    );
    return data;
  },
  getBySesi: async (sesiId: number) => {
    const { data } = await api.get<ApiResponse<any[]>>(`/absensi/sesi/${sesiId}`);
    return data;
  },
  getReport: async (mahasiswaId: number, mataKuliahId?: number) => {
    let url = `/absensi/report/${mahasiswaId}`;
    if (mataKuliahId) {
      url += `?mataKuliahId=${mataKuliahId}`;
    }
    const { data } = await api.get<ApiResponse<any>>(url);
    return data;
  },
  submitExcuse: async (absensiId: number, formData: FormData) => {
    const { data } = await api.post<ApiResponse<any>>(
      `/absensi/${absensiId}/excuse`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return data;
  },
};

// Service untuk notifikasi
export const notifikasiService = {
  getByMahasiswa: async (mahasiswaId: number) => {
    const { data } = await api.get<ApiResponse<any[]>>(
      `/notifikasi/mahasiswa/${mahasiswaId}`
    );
    return data;
  },
  markAsRead: async (notifikasiId: number) => {
    const { data } = await api.put<ApiResponse<any>>(
      `/notifikasi/${notifikasiId}/read`
    );
    return data;
  },
  markAllAsRead: async (mahasiswaId: number) => {
    const { data } = await api.put<ApiResponse<any>>(
      `/notifikasi/mahasiswa/${mahasiswaId}/read-all`
    );
    return data;
  },
};

// Service untuk mata kuliah
export const mataKuliahService = {
  getAll: async () => {
    const { data } = await api.get<ApiResponse<any[]>>('/matakuliah');
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get<ApiResponse<any>>(`/matakuliah/${id}`);
    return data;
  },
  create: async (mataKuliahData: any) => {
    const { data } = await api.post<ApiResponse<any>>(
      '/matakuliah',
      mataKuliahData
    );
    return data;
  },
  update: async (id: number, mataKuliahData: any) => {
    const { data } = await api.put<ApiResponse<any>>(
      `/matakuliah/${id}`,
      mataKuliahData
    );
    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete<ApiResponse<null>>(`/matakuliah/${id}`);
    return data;
  },
  getSesiByMataKuliah: async (mataKuliahId: number) => {
    const { data } = await api.get<ApiResponse<any[]>>(
      `/matakuliah/${mataKuliahId}/sesi`
    );
    return data;
  },
  createSesi: async (mataKuliahId: number, sesiData: any) => {
    const { data } = await api.post<ApiResponse<any>>(
      `/matakuliah/${mataKuliahId}/sesi`,
      sesiData
    );
    return data;
  },
};

export default api;
```

#### 5.3.3 Implementasi Store dengan Zustand (src/store/auth.store.ts)

```typescript
import create from 'zustand';
import { authService } from '../services/api';

interface User {
  id: number;
  nim: string;
  nama: string;
  email: string;
  role: 'mahasiswa' | 'dosen' | 'admin';
  foto_profil?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (nim: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (nim, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(nim, password);
      localStorage.setItem('token', response.data!.token);
      localStorage.setItem('user', JSON.stringify(response.data!.user));
      set({
        user: response.data!.user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login gagal';
      set({ error: errorMessage, isLoading: false });
    }
  },
  
  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },
  
  checkAuth: () => {
    const user = authService.getCurrentUser();
    const token = localStorage.getItem('token');
    if (user && token) {
      set({ user, isAuthenticated: true });
    } else {
      set({ user: null, isAuthenticated: false });
    }
  },
}));

export default useAuthStore;
```

#### 5.3.4 Implementasi Komponen Absensi Wajah (src/components/FaceAttendance.tsx)

```tsx
import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { absensiService } from '../services/api';
import LoadingSpinner from './LoadingSpinner';

interface FaceAttendanceProps {
  sesiId: number;
  onSuccess: () => void;
  onError: (message: string) => void;
}

const FaceAttendance: React.FC<FaceAttendanceProps> = ({
  sesiId,
  onSuccess,
  onError,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [capturing, setCapturing] = useState(false);
  const [location, setLocation] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Mendapatkan lokasi pengguna saat komponen dimuat
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation(JSON.stringify({ latitude, longitude }));
        },
        (error) => {
          console.error('Error getting location:', error);
          onError('Gagal mendapatkan lokasi. Pastikan Anda mengizinkan akses lokasi.');
        }
      );
    } else {
      onError('Geolocation tidak didukung oleh browser Anda.');
    }
  }, [onError]);

  // Fungsi untuk memulai countdown dan mengambil gambar
  const startCapture = () => {
    setCapturing(true);
    setCountdown(3);
  };

  // Efek untuk mengelola countdown
  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (countdown === 0) {
      captureImage();
    }
  }, [countdown]);

  // Fungsi untuk mengambil gambar dari webcam
  const captureImage = async () => {
    if (!webcamRef.current) return;

    try {
      // Ambil gambar dari webcam sebagai base64
      const imageSrc = webcamRef.current.getScreenshot();
      if (!imageSrc) {
        throw new Error('Gagal mengambil gambar dari webcam');
      }

      // Konversi base64 ke file
      const blob = await fetch(imageSrc).then((res) => res.blob());
      const faceImageFile = new File([blob], 'face-image.jpg', { type: 'image/jpeg' });

      // Submit absensi dengan gambar wajah
      await submitAttendance(faceImageFile);
    } catch (error) {
      console.error('Error capturing image:', error);
      setCapturing(false);
      onError('Gagal mengambil gambar. Silakan coba lagi.');
    }
  };

  // Fungsi untuk mengirim data absensi ke server
  const submitAttendance = async (faceImage: File) => {
    try {
      const response = await absensiService.submitAttendance(
        sesiId,
        faceImage,
        location || undefined
      );
      
      setCapturing(false);
      onSuccess();
    } catch (error: any) {
      console.error('Error submitting attendance:', error);
      setCapturing(false);
      const errorMessage = error.response?.data?.message || 'Gagal mencatat absensi';
      onError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative overflow-hidden rounded-lg shadow-lg mb-4">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={500}
          height={375}
          videoConstraints={{
            facingMode: 'user',
            width: 500,
            height: 375,
          }}
          className="rounded-lg"
        />
        
        {/* Overlay untuk countdown */}
        {countdown !== null && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="text-white text-7xl font-bold">
              {countdown > 0 ? countdown : 'Ambil Gambar...'}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex justify-center space-x-4">
        <button
          onClick={startCapture}
          disabled={capturing || !location}
          className={`px-6 py-2 rounded-lg font-medium ${
            capturing || !location
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {capturing ? (
            <LoadingSpinner size="sm" />
          ) : (
            'Ambil Gambar untuk Absensi'
          )}
        </button>
      </div>
      
      {!location && (
        <p className="text-red-500 mt-2">
          Sedang mendapatkan lokasi. Pastikan Anda mengizinkan akses lokasi.
        </p>
      )}
    </div>
  );
};

export default FaceAttendance;
```

#### 5.3.5 Implementasi Halaman Login (src/pages/Login.tsx)

```tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/auth.store';
import LoadingSpinner from '../components/LoadingSpinner';

const Login: React.FC = () => {
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(nim, password);
    if (!error) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Sistem Absensi Mahasiswa</h1>
          <p className="text-gray-600">Login untuk melanjutkan</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-700">
              {error}
            </div>
          )}
          
          <div className="mb-4">
            <label
              htmlFor="nim"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              NIM
            </label>
            <input
              id="nim"
              type="text"
              value={nim}
              onChange={(e) => setNim(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isLoading ? <LoadingSpinner size="sm" /> : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
```

#### 5.3.6 Implementasi Halaman Dashboard Mahasiswa (src/pages/StudentDashboard.tsx)

```tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/auth.store';
import { mataKuliahService, absensiService, notifikasiService } from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import AttendanceCard from '../components/AttendanceCard';
import NotificationList from '../components/NotificationList';
import LoadingSpinner from '../components/LoadingSpinner';

interface MataKuliah {
  id: number;
  kode_mk: string;
  nama_mk: string;
  dosen: {
    nama: string;
  };
}

interface SesiKelas {
  id: number;
  nomor_pertemuan: number;
  tanggal_sesi: string;
  waktu_mulai: string;
  waktu_selesai: string;
  ruangan: {
    nama_ruangan: string;
  };
}

interface TodayCourse {
  mataKuliah: MataKuliah;
  sesi: SesiKelas;
  hadir: boolean;
  status: string;
}

interface Notifikasi {
  id: number;
  tipe: string;
  pesan: string;
  waktu_kirim: string;
  sudah_dibaca: boolean;
}

const StudentDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [todayCourses, setTodayCourses] = useState<TodayCourse[]>([]);
  const [notifications, setNotifications] = useState<Notifikasi[]>([]);
  const [attendanceStats, setAttendanceStats] = useState({
    totalCourses: 0,
    totalSessions: 0,
    attendancePercentage: 0,
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchDashboardData();
  }, [user, navigate]);
  
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Ambil mata kuliah untuk hari ini
      const todayCoursesResponse = await mataKuliahService.getTodayCourses();
      setTodayCourses(todayCoursesResponse.data || []);
      
      // Ambil notifikasi belum dibaca
      const notificationsResponse = await notifikasiService.getByMahasiswa(user!.id);
      setNotifications(
        (notificationsResponse.data || []).filter(
          (notif: Notifikasi) => !notif.sudah_dibaca
        )
      );
      
      // Ambil statistik kehadiran
      const attendanceResponse = await absensiService.getAttendanceStats(user!.id);
      setAttendanceStats(attendanceResponse.data || {
        totalCourses: 0,
        totalSessions: 0,
        attendancePercentage: 0,
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };
  
  const markNotificationAsRead = async (notificationId: number) => {
    try {
      await notifikasiService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === notificationId ? { ...notif, sudah_dibaca: true } : notif
        ).filter((notif) => !notif.sudah_dibaca)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  const handleAttendanceClick = (courseId: number, sesiId: number) => {
    navigate(`/attendance/${sesiId}`);
  };
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Selamat Datang, {user?.nama}</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Mata Kuliah</h3>
            <p className="text-3xl font-bold">{attendanceStats.totalCourses}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Pertemuan</h3>
            <p className="text-3xl font-bold">{attendanceStats.totalSessions}</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Persentase Kehadiran</h3>
            <p className="text-3xl font-bold">{attendanceStats.attendancePercentage}%</p>
          </div>
        </div>
        
        {/* Today's Courses */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Kelas Hari Ini</h2>
          
          {todayCourses.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">Tidak ada kelas hari ini.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {todayCourses.map((course) => (
                <AttendanceCard
                  key={course.sesi.id}
                  course={course.mataKuliah}
                  session={course.sesi}
                  isAttended={course.hadir}
                  status={course.status}
                  onClick={() => handleAttendanceClick(course.mataKuliah.id, course.sesi.id)}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Notifications */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Notifikasi</h2>
          
          {notifications.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">Tidak ada notifikasi baru.</p>
            </div>
          ) : (
            <NotificationList
              notifications={notifications}
              onMarkAsRead={markNotificationAsRead}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
```

## 6. Langkah-langkah Implementasi Fitur Pengenalan Wajah

### 6.1 Persiapan Library Face-API.js

1. **Download Model Face-API.js**

```bash
# Buat direktori models di backend
mkdir -p backend/models

# Download model dari repository face-api.js
curl -L https://github.com/justadudewhohacks/face-api.js-models/raw/master/ssd_mobilenetv1_model-weights_manifest.json > backend/models/ssd_mobilenetv1_model-weights_manifest.json
curl -L https://github.com/justadudewhohacks/face-api.js-models/raw/master/ssd_mobilenetv1_model-shard1 > backend/models/ssd_mobilenetv1_model-shard1
curl -L https://github.com/justadudewhohacks/face-api.js-models/raw/master/face_landmark_68_model-weights_manifest.json > backend/models/face_landmark_68_model-weights_manifest.json
curl -L https://github.com/justadudewhohacks/face-api.js-models/raw/master/face_landmark_68_model-shard1 > backend/models/face_landmark_68_model-shard1
curl -L https://github.com/justadudewhohacks/face-api.js-models/raw/master/face_recognition_model-weights_manifest.json > backend/models/face_recognition_model-weights_manifest.json
curl -L https://github.com/justadudewhohacks/face-api.js-models/raw/master/face_recognition_model-shard1 > backend/models/face_recognition_model-shard1
curl -L https://github.com/justadudewhohacks/face-api.js-models/raw/master/face_recognition_model-shard2 > backend/models/face_recognition_model-shard2
```

2. **Setup Canvas di Node.js untuk Face Recognition**

Install canvas yang mendukung face-api.js di Node.js:

```bash
npm install canvas
```
I'll help you continue the implementation of your Student Attendance System with Face Recognition. Based on the document you shared, I'll pick up where it left off.

## 6. Langkah-langkah Implementasi Fitur Pengenalan Wajah (Lanjutan)

### 6.2 Implementasi Endpoint Pendaftaran Wajah Mahasiswa (Lanjutan)

1. **Implementasi Upload Middleware (src/middleware/upload.middleware.ts) (Lanjutan)**

```typescript
  } else if (file.fieldname === 'evidenceFile') {
    // Menerima file gambar, PDF, dan dokumen
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Format file tidak didukung'));
    }
  } else {
    cb(null, true);
  }
};

// Konfigurasi multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export default upload;
```

2. **Implementasi Controller Registrasi Wajah (src/controllers/mahasiswa.controller.ts)**

```typescript
import { Request, Response } from 'express';
import { prisma } from '../index';
import { extractFaceEncoding } from '../services/faceRecognition.service';
import fs from 'fs';
import path from 'path';

// Controller untuk registrasi wajah mahasiswa
export const registerFace = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
    }

    const mahasiswaId = Number(req.params.id);
    
    // Validasi apakah ID user yang login sama dengan ID yang diminta
    if (req.user.role === 'mahasiswa' && req.user.id !== mahasiswaId) {
      return res.status(403).json({
        status: 'error',
        message: 'Anda tidak memiliki izin untuk melakukan operasi ini'
      });
    }

    // Validasi file gambar wajah
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Gambar wajah diperlukan'
      });
    }

    // Mendapatkan path file gambar wajah
    const faceImagePath = req.file.path;

    // Ekstrak encoding wajah dari gambar
    const faceEncoding = await extractFaceEncoding(faceImagePath);
    
    if (!faceEncoding) {
      // Hapus file jika tidak ada wajah terdeteksi
      fs.unlinkSync(faceImagePath);
      
      return res.status(400).json({
        status: 'error',
        message: 'Tidak ada wajah terdeteksi dalam gambar'
      });
    }

    // Simpan encoding wajah ke database
    const mahasiswa = await prisma.mahasiswa.update({
      where: { id: mahasiswaId },
      data: {
        data_encoding_wajah: JSON.stringify(Array.from(faceEncoding)),
        updated_at: new Date()
      }
    });

    return res.status(200).json({
      status: 'success',
      message: 'Data wajah berhasil disimpan',
      data: {
        id: mahasiswa.id,
        nim: mahasiswa.nim,
        nama: mahasiswa.nama
      }
    });
  } catch (error) {
    console.error('Register face error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat menyimpan data wajah'
    });
  }
};
```

3. **Implementasi Route Registrasi Wajah (src/routes/mahasiswa.routes.ts)**

```typescript
import { Router } from 'express';
import { 
  getAllMahasiswa, 
  getMahasiswaById, 
  createMahasiswa, 
  updateMahasiswa, 
  deleteMahasiswa,
  registerFace
} from '../controllers/mahasiswa.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware';

const router = Router();

// Route untuk CRUD Mahasiswa
router.get('/', authMiddleware, roleMiddleware(['dosen', 'admin']), getAllMahasiswa);
router.get('/:id', authMiddleware, getMahasiswaById);
router.post('/', authMiddleware, roleMiddleware(['admin']), upload.single('profileImage'), createMahasiswa);
router.put('/:id', authMiddleware, upload.single('profileImage'), updateMahasiswa);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), deleteMahasiswa);

// Route untuk registrasi wajah
router.post(
  '/:id/face-encoding', 
  authMiddleware, 
  upload.single('faceImage'),
  registerFace
);

export default router;
```

### 6.3 Implementasi Endpoint Absensi dengan Pengenalan Wajah

1. **Implementasi Route Absensi (src/routes/absensi.routes.ts)**

```typescript
import { Router } from 'express';
import { 
  submitAttendance, 
  getAbsensiByMahasiswa, 
  getAbsensiBySesi,
  getAttendanceReport,
  submitExcuse
} from '../controllers/absensi.controller';
import { authMiddleware, roleMiddleware } from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware';

const router = Router();

// Route untuk submit absensi dengan pengenalan wajah
router.post(
  '/submit', 
  authMiddleware, 
  roleMiddleware(['mahasiswa']),
  upload.single('faceImage'),
  submitAttendance
);

// Route untuk mendapatkan data absensi
router.get(
  '/mahasiswa/:mahasiswaId', 
  authMiddleware, 
  getAbsensiByMahasiswa
);
router.get(
  '/sesi/:sesiId', 
  authMiddleware, 
  roleMiddleware(['dosen', 'admin']),
  getAbsensiBySesi
);

// Route untuk laporan kehadiran
router.get(
  '/report/:mahasiswaId', 
  authMiddleware,
  getAttendanceReport
);

// Route untuk mengajukan izin/sakit
router.post(
  '/:id/excuse', 
  authMiddleware, 
  roleMiddleware(['mahasiswa']),
  upload.single('evidenceFile'),
  submitExcuse
);

export default router;
```

2. **Implementasi Controller untuk Mengajukan Izin/Sakit (src/controllers/absensi.controller.ts)**

```typescript
// Controller untuk mengajukan izin/sakit
export const submitExcuse = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      });
    }

    const absensiId = Number(req.params.id);
    const { status, keterangan } = req.body;
    
    // Validasi parameter
    if (!status || !keterangan) {
      return res.status(400).json({
        status: 'error',
        message: 'Status dan keterangan diperlukan'
      });
    }

    // Validasi status
    if (status !== 'IZIN' && status !== 'SAKIT') {
      return res.status(400).json({
        status: 'error',
        message: 'Status hanya boleh IZIN atau SAKIT'
      });
    }

    // Validasi file bukti
    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'File bukti diperlukan'
      });
    }

    // Cek apakah data absensi ada dan milik mahasiswa yang login
    const absensi = await prisma.absensi.findUnique({
      where: { id: absensiId },
      include: {
        mahasiswa: true,
        sesi_kelas: {
          include: {
            mata_kuliah: true
          }
        }
      }
    });

    if (!absensi) {
      return res.status(404).json({
        status: 'error',
        message: 'Data absensi tidak ditemukan'
      });
    }

    if (absensi.mahasiswa_id !== req.user.id) {
      return res.status(403).json({
        status: 'error',
        message: 'Anda tidak memiliki izin untuk mengubah data ini'
      });
    }

    // Update data absensi dengan status dan keterangan
    const updatedAbsensi = await prisma.absensi.update({
      where: { id: absensiId },
      data: {
        status: status as Status,
        keterangan,
        bukti_file: req.file.path,
        updated_at: new Date()
      }
    });

    return res.status(200).json({
      status: 'success',
      message: `Pengajuan ${status.toLowerCase()} berhasil disimpan`,
      data: {
        id: updatedAbsensi.id,
        status: updatedAbsensi.status,
        keterangan: updatedAbsensi.keterangan,
        bukti_file: updatedAbsensi.bukti_file
      }
    });
  } catch (error) {
    console.error('Submit excuse error:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat menyimpan pengajuan'
    });
  }
};
```

### 6.4 Implementasi Notifikasi Realtime

1. **Implementasi Service Notifikasi (src/services/notification.service.ts)**

```typescript
import { prisma } from '../index';
import { TipeNotifikasi } from '@prisma/client';
import { Server } from 'socket.io';

interface NotificationData {
  mahasiswaId: number;
  sesiId: number;
  tipe: string;
  pesan: string;
}

// Referensi ke instance Socket.io
let ioInstance: Server | null = null;

// Setter untuk instance Socket.io
export const setIoInstance = (io: Server) => {
  ioInstance = io;
};

// Fungsi untuk mengirim notifikasi
export const sendNotification = async (data: NotificationData) => {
  try {
    const { mahasiswaId, sesiId, tipe, pesan } = data;
    
    // Validasi tipe notifikasi
    if (!Object.values(TipeNotifikasi).includes(tipe as TipeNotifikasi)) {
      throw new Error(`Tipe notifikasi tidak valid: ${tipe}`);
    }

    // Simpan notifikasi ke database
    const notification = await prisma.notifikasi.create({
      data: {
        mahasiswa_id: mahasiswaId,
        sesi_id: sesiId,
        tipe: tipe as TipeNotifikasi,
        pesan,
        waktu_kirim: new Date(),
        sudah_dibaca: false
      }
    });

    // Kirim notifikasi melalui Socket.io jika tersedia
    if (ioInstance) {
      ioInstance.to(mahasiswaId.toString()).emit('notification', {
        id: notification.id,
        tipe: notification.tipe,
        pesan: notification.pesan,
        waktu_kirim: notification.waktu_kirim
      });
    }

    return notification;
  } catch (error) {
    console.error('Send notification error:', error);
    throw error;
  }
};

// Fungsi untuk menandai notifikasi sebagai sudah dibaca
export const markNotificationAsRead = async (notificationId: number) => {
  try {
    return await prisma.notifikasi.update({
      where: { id: notificationId },
      data: {
        sudah_dibaca: true,
        updated_at: new Date()
      }
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    throw error;
  }
};

// Fungsi untuk menandai semua notifikasi mahasiswa sebagai sudah dibaca
export const markAllNotificationsAsRead = async (mahasiswaId: number) => {
  try {
    return await prisma.notifikasi.updateMany({
      where: {
        mahasiswa_id: mahasiswaId,
        sudah_dibaca: false
      },
      data: {
        sudah_dibaca: true,
        updated_at: new Date()
      }
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    throw error;
  }
};
```

2. **Implementasi Service Scheduler untuk Notifikasi Otomatis (src/services/scheduler.service.ts)**

```typescript
import cron from 'node-cron';
import { Server } from 'socket.io';
import { prisma } from '../index';
import { sendNotification } from './notification.service';
import { TipeNotifikasi } from '@prisma/client';

// Fungsi untuk menginisialisasi scheduled jobs
export const initializeScheduledJobs = (io: Server) => {
  // Jadwalkan job untuk mengirim notifikasi sebelum kelas dimulai (5 menit sebelumnya)
  // Berjalan setiap menit
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60 * 1000);
      
      // Mencari sesi kelas yang akan dimulai dalam 5 menit
      const upcomingSessions = await prisma.sesiKelas.findMany({
        where: {
          tanggal_sesi: {
            equals: new Date(now.toISOString().split('T')[0])
          },
          waktu_mulai: {
            gte: now,
            lt: fiveMinutesFromNow
          }
        },
        include: {
          mata_kuliah: true,
          ruangan: true
        }
      });
      
      // Untuk setiap sesi, kirim notifikasi ke mahasiswa terkait
      for (const sesi of upcomingSessions) {
        // Dapatkan daftar mahasiswa yang terdaftar di mata kuliah ini
        const mahasiswas = await prisma.mahasiswa.findMany({
          where: {
            absensi: {
              some: {
                sesi_id: sesi.id
              }
            }
          }
        });
        
        // Kirim notifikasi ke setiap mahasiswa
        for (const mahasiswa of mahasiswas) {
          const pesan = `Kelas ${sesi.mata_kuliah.nama_mk} akan dimulai dalam 5 menit di ruangan ${sesi.ruangan.nama_ruangan}`;
          
          await sendNotification({
            mahasiswaId: mahasiswa.id,
            sesiId: sesi.id,
            tipe: TipeNotifikasi.KELAS_AKAN_DIMULAI,
            pesan
          });
        }
      }
    } catch (error) {
      console.error('Error in class reminder scheduler:', error);
    }
  });
  
  // Jadwalkan job untuk mengirim notifikasi pengingat absensi
  // Berjalan setiap jam pada menit ke-30
  cron.schedule('30 * * * *', async () => {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      
      // Mencari sesi kelas yang sudah dimulai 1 jam yang lalu
      const ongoingSessions = await prisma.sesiKelas.findMany({
        where: {
          tanggal_sesi: {
            equals: new Date(now.toISOString().split('T')[0])
          },
          waktu_mulai: {
            gte: oneHourAgo,
            lt: now
          }
        },
        include: {
          mata_kuliah: true
        }
      });
      
      for (const sesi of ongoingSessions) {
        // Dapatkan mahasiswa yang belum absen
        const absentStudents = await prisma.mahasiswa.findMany({
          where: {
            absensi: {
              none: {
                sesi_id: sesi.id,
                waktu_absen: {
                  not: null
                }
              }
            }
          }
        });
        
        // Kirim notifikasi ke mahasiswa yang belum absen
        for (const mahasiswa of absentStudents) {
          const pesan = `Anda belum melakukan absensi pada mata kuliah ${sesi.mata_kuliah.nama_mk}. Silakan absen segera.`;
          
          await sendNotification({
            mahasiswaId: mahasiswa.id,
            sesiId: sesi.id,
            tipe: TipeNotifikasi.TIDAK_ABSEN,
            pesan
          });
        }
      }
    } catch (error) {
      console.error('Error in absence reminder scheduler:', error);
    }
  });
  
  // Jadwalkan job untuk notifikasi setelah kelas selesai
  // untuk mahasiswa yang tidak hadir (ALPA)
  // Berjalan setiap jam pada menit ke-5
  cron.schedule('5 * * * *', async () => {
    try {
      const now = new Date();
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      
      // Mencari sesi kelas yang sudah selesai
      const finishedSessions = await prisma.sesiKelas.findMany({
        where: {
          tanggal_sesi: {
            equals: new Date(now.toISOString().split('T')[0])
          },
          waktu_selesai: {
            gte: oneHourAgo,
            lt: now
          }
        },
        include: {
          mata_kuliah: true
        }
      });
      
      for (const sesi of finishedSessions) {
        // Update status mahasiswa yang belum absen menjadi ALPA
        await prisma.absensi.updateMany({
          where: {
            sesi_id: sesi.id,
            waktu_absen: null,
            status: null
          },
          data: {
            status: 'ALPA',
            updated_at: now
          }
        });
        
        // Dapatkan mahasiswa yang status absensinya ALPA
        const absentStudents = await prisma.mahasiswa.findMany({
          where: {
            absensi: {
              some: {
                sesi_id: sesi.id,
                status: 'ALPA'
              }
            }
          }
        });
        
        // Kirim notifikasi untuk mengajukan keterangan
        for (const mahasiswa of absentStudents) {
          const pesan = `Anda tercatat tidak hadir (ALPA) pada mata kuliah ${sesi.mata_kuliah.nama_mk}. Silakan ajukan keterangan jika berhalangan.`;
          
          await sendNotification({
            mahasiswaId: mahasiswa.id,
            sesiId: sesi.id,
            tipe: TipeNotifikasi.AJUKAN_KETERANGAN,
            pesan
          });
        }
      }
    } catch (error) {
      console.error('Error in absence status update scheduler:', error);
    }
  });
};
```

### 6.5 Implementasi Komponen Frontend untuk Absensi dengan Pengenalan Wajah

1. **Implementasi Halaman Absensi (src/pages/AttendancePage.tsx)**

```tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/auth.store';
import { mataKuliahService, absensiService } from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';
import FaceAttendance from '../components/FaceAttendance';
import AttendanceSuccess from '../components/AttendanceSuccess';
import AttendanceError from '../components/AttendanceError';
import LoadingSpinner from '../components/LoadingSpinner';

interface SesiDetail {
  id: number;
  nomor_pertemuan: number;
  tanggal_sesi: string;
  waktu_mulai: string;
  waktu_selesai: string;
  mata_kuliah: {
    id: number;
    kode_mk: string;
    nama_mk: string;
    dosen: {
      nama: string;
    };
  };
  ruangan: {
    nama_ruangan: string;
    gedung: string;
  };
}

const AttendancePage: React.FC = () => {
  const { sesiId } = useParams<{ sesiId: string }>();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [sesi, setSesi] = useState<SesiDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [attendanceStatus, setAttendanceStatus] = useState
    'idle' | 'success' | 'error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchSesiDetail();
    
    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, [sesiId, user, navigate]);
  
  const fetchSesiDetail = async () => {
    try {
      setLoading(true);
      
      if (!sesiId) {
        throw new Error('ID Sesi tidak valid');
      }
      
      const response = await mataKuliahService.getSesiDetail(Number(sesiId));
      setSesi(response.data);
      
      // Cek apakah sudah absen
      const absensiResponse = await absensiService.getBySesi(Number(sesiId));
      const mahasiswaAbsensi = absensiResponse.data.find(
        (a: any) => a.mahasiswa_id === user!.id
      );
      
      if (mahasiswaAbsensi && mahasiswaAbsensi.waktu_absen) {
        setAttendanceStatus('success');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching sesi detail:', error);
      setLoading(false);
      setErrorMessage('Gagal memuat detail sesi kelas');
      setAttendanceStatus('error');
    }
  };
  
  const handleAttendanceSuccess = () => {
    setAttendanceStatus('success');
  };
  
  const handleAttendanceError = (message: string) => {
    setErrorMessage(message);
    setAttendanceStatus('error');
  };
  
  const resetAttendanceStatus = () => {
    setAttendanceStatus('idle');
    setErrorMessage('');
  };
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </DashboardLayout>
    );
  }
  
  if (!sesi) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h2 className="text-red-700 text-lg font-medium">Error</h2>
            <p className="text-red-600">Sesi kelas tidak ditemukan</p>
          </div>
          <div className="mt-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Kembali ke Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  // Format tanggal dan waktu
  const formattedDate = new Date(sesi.tanggal_sesi).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    return `${hours}:${minutes}`;
  };
  
  // Cek apakah absensi masih bisa dilakukan (waktu sesi masih berlangsung)
  const sesiDate = new Date(sesi.tanggal_sesi);
  const sesiStartTime = new Date(sesi.waktu_mulai);
  const sesiEndTime = new Date(sesi.waktu_selesai);
  
  sesiDate.setHours(sesiStartTime.getHours(), sesiStartTime.getMinutes());
  const sesiDateEnd = new Date(sesi.tanggal_sesi);
  sesiDateEnd.setHours(sesiEndTime.getHours(), sesiEndTime.getMinutes());
  
  const isAttendanceAllowed = currentTime >= sesiDate && currentTime <= sesiDateEnd;
  
  // Cek apakah telat (lebih dari 15 menit setelah mulai)
  const lateThreshold = new Date(sesiDate.getTime() + 15 * 60 * 1000);
  const isLate = currentTime > lateThreshold && currentTime <= sesiDateEnd;
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Absensi Kelas</h1>
        
        {/* Informasi Sesi */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">{sesi.mata_kuliah.nama_mk}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Pertemuan ke-{sesi.nomor_pertemuan}</p>
              <p className="text-gray-600">Kode: {sesi.mata_kuliah.kode_mk}</p>
              <p className="text-gray-600">Dosen: {sesi.mata_kuliah.dosen.nama}</p>
            </div>
            <div>
              <p className="text-gray-600">Tanggal: {formattedDate}</p>
              <p className="text-gray-600">
                Waktu: {formatTime(sesi.waktu_mulai)} - {formatTime(sesi.waktu_selesai)}
              </p>
              <p className="text-gray-600">
                Lokasi: {sesi.ruangan.nama_ruangan}, {sesi.ruangan.gedung}
              </p>
            </div>
          </div>
        </div>
        
        {/* Status Absensi */}
        {attendanceStatus === 'success' ? (
          <AttendanceSuccess
            sesi={sesi}
            onBackToDashboard={() => navigate('/dashboard')}
          />
        ) : attendanceStatus === 'error' ? (
          <AttendanceError
            message={errorMessage}
            onRetry={resetAttendanceStatus}
            onBackToDashboard={() => navigate('/dashboard')}
          />
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Absensi dengan Pengenalan Wajah</h2>
            
            {!isAttendanceAllowed ? (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                <h3 className="text-yellow-700 font-medium">Perhatian</h3>
                <p className="text-yellow-600">
                  {currentTime < sesiDate
                    ? 'Kelas belum dimulai. Anda dapat absen saat kelas sudah dimulai.'
                    : 'Kelas sudah selesai. Anda tidak dapat melakukan absensi.'}
                </p>
              </div>
            ) : isLate ? (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
                <h3 className="text-yellow-700 font-medium">Perhatian</h3>
                <p className="text-yellow-600">
                  Anda terlambat lebih dari 15 menit. Absensi akan tercatat sebagai TELAT.
                </p>
              </div>
            ) : null}
            
            {isAttendanceAllowed && (
              <FaceAttendance
                sesiId={Number(sesiId)}
                onSuccess={handleAttendanceSuccess}
                onError={handleAttendanceError}
              />
            )}
            
            <div className="mt-6">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AttendancePage;
```

2. **Implementasi Komponen Success dan Error (src/components/AttendanceSuccess.tsx)**

```tsx
import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface SesiDetail {
  id: number;
  nomor_pertemuan: number;
  tanggal_sesi: string;
  waktu_mulai: string;
  mata_kuliah: {
    nama_mk: string;
  };
}

I'll help you continue with the implementation of your Student Attendance System with Face Recognition based on the document you provided. Let me continue from where the document left off, focusing on completing the frontend components for the attendance system.

## Completing the Attendance Success Component (src/components/AttendanceSuccess.tsx)

```tsx
import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface SesiDetail {
  id: number;
  nomor_pertemuan: number;
  tanggal_sesi: string;
  waktu_mulai: string;
  mata_kuliah: {
    nama_mk: string;
  };
}

interface AttendanceSuccessProps {
  sesi: SesiDetail;
  onBackToDashboard: () => void;
}

const AttendanceSuccess: React.FC<AttendanceSuccessProps> = ({
  sesi,
  onBackToDashboard,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col items-center mb-6">
        <CheckCircleIcon className="h-16 w-16 text-green-500 mb-2" />
        <h2 className="text-xl font-semibold text-green-700">Absensi Berhasil!</h2>
        <p className="text-gray-600 text-center mt-2">
          Anda telah berhasil melakukan absensi untuk mata kuliah {sesi.mata_kuliah.nama_mk}, 
          pertemuan ke-{sesi.nomor_pertemuan}.
        </p>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={onBackToDashboard}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
};

export default AttendanceSuccess;
```

## Implementing Attendance Error Component (src/components/AttendanceError.tsx)

```tsx
import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

interface AttendanceErrorProps {
  message: string;
  onRetry: () => void;
  onBackToDashboard: () => void;
}

const AttendanceError: React.FC<AttendanceErrorProps> = ({
  message,
  onRetry,
  onBackToDashboard,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col items-center mb-6">
        <ExclamationCircleIcon className="h-16 w-16 text-red-500 mb-2" />
        <h2 className="text-xl font-semibold text-red-700">Absensi Gagal</h2>
        <p className="text-gray-600 text-center mt-2">{message}</p>
      </div>
      
      <div className="flex justify-center space-x-4">
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Coba Lagi
        </button>
        <button
          onClick={onBackToDashboard}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
};

export default AttendanceError;
```

## Implementing Loading Spinner Component (src/components/LoadingSpinner.tsx)

```tsx
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-t-2 border-b-2 border-blue-600`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
```

## Implementing Notification List Component (src/components/NotificationList.tsx)

```tsx
import React from 'react';
import { BellIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Notification {
  id: number;
  tipe: string;
  pesan: string;
  waktu_kirim: string;
  sudah_dibaca: boolean;
}

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: number) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onMarkAsRead,
}) => {
  // Function to format date and time
  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Function to get notification type icon and color
  const getNotificationTypeStyle = (type: string) => {
    switch (type) {
      case 'KELAS_AKAN_DIMULAI':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
        };
      case 'TELAT_ABSEN':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-200',
        };
      case 'TIDAK_ABSEN':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
        };
      case 'AJUKAN_KETERANGAN':
        return {
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-700',
          borderColor: 'border-purple-200',
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-700',
          borderColor: 'border-gray-200',
        };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow divide-y">
      {notifications.map((notification) => {
        const style = getNotificationTypeStyle(notification.tipe);
        
        return (
          <div
            key={notification.id}
            className={`p-4 ${style.bgColor} border-l-4 ${style.borderColor} flex items-start`}
          >
            <div className="flex-shrink-0 mr-3">
              <BellIcon className={`h-6 w-6 ${style.textColor}`} />
            </div>
            <div className="flex-1">
              <p className={`${style.textColor}`}>{notification.pesan}</p>
              <p className="text-sm text-gray-500 mt-1">
                {formatDateTime(notification.waktu_kirim)}
              </p>
            </div>
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="ml-4 bg-white p-1 rounded-full shadow hover:bg-gray-50"
              title="Tandai sudah dibaca"
            >
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default NotificationList;
```

## Implementing Attendance Card Component (src/components/AttendanceCard.tsx)

```tsx
import React from 'react';
import { ClockIcon, BookOpenIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface Course {
  id: number;
  kode_mk: string;
  nama_mk: string;
  dosen: {
    nama: string;
  };
}

interface Session {
  id: number;
  nomor_pertemuan: number;
  tanggal_sesi: string;
  waktu_mulai: string;
  waktu_selesai: string;
  ruangan: {
    nama_ruangan: string;
  };
}

interface AttendanceCardProps {
  course: Course;
  session: Session;
  isAttended: boolean;
  status: string;
  onClick: () => void;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({
  course,
  session,
  isAttended,
  status,
  onClick,
}) => {
  // Format time
  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    return `${hours}:${minutes}`;
  };

  // Get status color and text
  const getStatusStyle = () => {
    switch (status) {
      case 'HADIR':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-700',
          icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />,
        };
      case 'TELAT':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-700',
          icon: <ClockIcon className="h-5 w-5 text-yellow-500" />,
        };
      case 'IZIN':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-700',
          icon: <BookOpenIcon className="h-5 w-5 text-blue-500" />,
        };
      case 'SAKIT':
        return {
          bgColor: 'bg-purple-100',
          textColor: 'text-purple-700',
          icon: <BookOpenIcon className="h-5 w-5 text-purple-500" />,
        };
      case 'ALPA':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-700',
          icon: <XCircleIcon className="h-5 w-5 text-red-500" />,
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-700',
          icon: null,
        };
    }
  };

  const statusStyle = getStatusStyle();

  return (
    <div
      className={`bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow ${
        isAttended ? statusStyle.bgColor : ''
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{course.nama_mk}</h3>
          <p className="text-sm text-gray-600">
            {course.kode_mk} - Pertemuan {session.nomor_pertemuan}
          </p>
          <p className="text-sm text-gray-600">Dosen: {course.dosen.nama}</p>
        </div>
        {isAttended && <div>{statusStyle.icon}</div>}
      </div>
      
      <div className="mt-4 flex items-center text-sm">
        <ClockIcon className="h-4 w-4 mr-1 text-gray-500" />
        <span>{formatTime(session.waktu_mulai)} - {formatTime(session.waktu_selesai)}</span>
      </div>
      
      <div className="mt-1 text-sm text-gray-600">
        Ruangan: {session.ruangan.nama_ruangan}
      </div>
      
      {isAttended ? (
        <div
          className={`mt-3 px-3 py-1 rounded text-sm font-medium inline-block ${statusStyle.textColor}`}
        >
          {status}
        </div>
      ) : (
        <button
          className="mt-3 px-3 py-1 bg-blue-600 text-white rounded text-sm font-medium"
        >
          Absen Sekarang
        </button>
      )}
    </div>
  );
};

export default AttendanceCard;
```

## Implementing Dashboard Layout (src/layouts/DashboardLayout.tsx)

```tsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  BellIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import useAuthStore from '../store/auth.store';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <HomeIcon className="h-5 w-5" />,
    },
    {
      name: 'Jadwal',
      path: '/schedule',
      icon: <CalendarIcon className="h-5 w-5" />,
    },
    {
      name: 'Kehadiran',
      path: '/attendance-report',
      icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
    },
    {
      name: 'Notifikasi',
      path: '/notifications',
      icon: <BellIcon className="h-5 w-5" />,
    },
    {
      name: 'Profil',
      path: '/profile',
      icon: <UserCircleIcon className="h-5 w-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                className="md:hidden mr-2"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
              <h1 className="text-xl font-bold">Sistem Absensi Mahasiswa</h1>
            </div>
            
            <div className="flex items-center">
              <span className="mr-4 hidden md:block">{user?.nama}</span>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm bg-blue-700 px-3 py-1 rounded hover:bg-blue-800"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <aside className="w-64 bg-white shadow hidden md:block">
          <div className="p-4">
            <div className="py-4 px-2 mb-2">
              <div className="text-center">
                <div className="h-20 w-20 rounded-full bg-gray-200 mx-auto mb-2 overflow-hidden">
                  {user?.foto_profil ? (
                    <img
                      src={`${process.env.REACT_APP_API_URL}/${user.foto_profil}`}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <UserCircleIcon className="h-full w-full text-gray-400" />
                  )}
                </div>
                <h2 className="font-medium">{user?.nama}</h2>
                <p className="text-sm text-gray-500">{user?.nim}</p>
              </div>
            </div>
            
            <nav>
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center px-4 py-2 rounded-lg ${
                        location.pathname === item.path
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
            <div className="fixed top-0 left-0 bottom-0 w-3/4 max-w-xs bg-white z-50">
              <div className="p-4">
                <div className="py-4 px-2 mb-2 border-b">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                      {user?.foto_profil ? (
                        <img
                          src={`${process.env.REACT_APP_API_URL}/${user.foto_profil}`}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <UserCircleIcon className="h-full w-full text-gray-400" />
                      )}
                    </div>
                    <div className="ml-3">
                      <h2 className="font-medium">{user?.nama}</h2>
                      <p className="text-sm text-gray-500">{user?.nim}</p>
                    </div>
                  </div>
                </div>
                
                <nav>
                  <ul className="space-y-1">
                    {navItems.map((item) => (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          className={`flex items-center px-4 py-2 rounded-lg ${
                            location.pathname === item.path
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.icon}
                          <span className="ml-3">{item.name}</span>
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        <span className="ml-3">Logout</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
```

## Implementing App Routing (src/App.tsx)

```tsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/auth.store';

// Pages
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AttendancePage from './pages/AttendancePage';
import AttendanceReportPage from './pages/AttendanceReportPage';
import SchedulePage from './pages/SchedulePage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, checkAuth } = useAuthStore();
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/attendance/:sesiId"
          element={
            <ProtectedRoute>
              <AttendancePage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/attendance-report"
          element={
            <ProtectedRoute>
              <AttendanceReportPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/schedule"
          element={
            <ProtectedRoute>
              <SchedulePage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
```

## 7. Testing and Deployment

### 7.1 Testing Strategy

#### 7.1.1 Unit Testing

For unit testing, you can implement tests using Jest and React Testing Library for the frontend, and Jest with Supertest for the backend. Here's an example of a test for the FaceAttendance component:

```tsx
// src/__tests__/components/FaceAttendance.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FaceAttendance from '../../components/FaceAttendance';
import { absensiService } from '../../services/api';

// Mock the services and hooks
jest.mock('../../services/api', () => ({
  absensiService: {
    submitAttendance: jest.fn(),
  },
}));

// Mock navigator.geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn().mockImplementation((success) =>
    success({
      coords: {
        latitude: 1.2345,
        longitude: 6.7890,
      },
    })
  ),
};
global.navigator.geolocation = mockGeolocation;

// Mock Webcam component
jest.mock('react-webcam', () => {
  const React = require('react');
  const MockWebcam = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => ({
      getScreenshot: () => 'data:image/jpeg;base64,mockImageData',
    }));
    return <video />;
  });
  return MockWebcam;
});

describe('FaceAttendance Component', () => {
  const mockProps = {
    sesiId: 1,
    onSuccess: jest.fn(),
    onError: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    render(<FaceAttendance {...mockProps} />);
    expect(screen.getByText(/Ambil Gambar untuk Absensi/i)).toBeInTheDocument();
  });

  test('starts capture with countdown on button click', async () => {
    render(<FaceAttendance {...mockProps} />);
    fireEvent.click(screen.getByText(/Ambil Gambar untuk Absensi/i));
    
    // Wait for countdown to appear
    expect(await screen.findByText('3')).toBeInTheDocument();
    
    // Wait for countdown to complete
    await waitFor(() => {
      expect(screen.queryByText('3')).not.toBeInTheDocument();
      expect(screen.queryByText('2')).not.toBeInTheDocument();
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    }, { timeout: 4000 });
  });

  test('submits attendance on successful capture', async () => {
    (absensiService.submitAttendance as jest.Mock).mockResolvedValue({
      status: 'success',
      data: { id: 1, status: 'HADIR' },
    });

    render(<FaceAttendance {...mockProps} />);
    fireEvent.click(screen.getByText(/Ambil Gambar untuk Absensi/i));
    
    // Wait for submission to complete
    await waitFor(() => {
      expect(absensiService.submitAttendance).toHaveBeenCalledWith(
        1,
        expect.any(File),
        expect.any(String)
      );
      expect(mockProps.onSuccess).toHaveBeenCalled();
    }, { timeout: 4000 });
  });

  test('handles error on failed submission', async () => {
    (absensiService.submitAttendance as jest.Mock).mockRejectedValue({
      response: { data: { message: 'Verifikasi wajah gagal' } },
    });

    render(<FaceAttendance {...mockProps} />);
    fireEvent.click(screen.getByText(/Ambil Gambar untuk Absensi/i));
    
    // Wait for error handling
    await waitFor(() => {
      expect(absensiService.submitAttendance).toHaveBeenCalled();
      expect(mockProps.onError).toHaveBeenCalledWith('Verifikasi wajah gagal');
    }, { timeout: 4000 });
  });
});
```

#### 7.1.2 Integration Testing

For integration testing, focus on testing API endpoints and database interactions:

```typescript
// src/__tests__/integration/absensi.test.ts
import request from 'supertest';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import absensiRoutes from '../../routes/absensi.routes';
import { authMiddleware, roleMiddleware } from '../../middleware/auth.middleware';
import * as faceRecognitionService from '../../services/faceRecognition.service';

// Mock dependencies
jest.mock('../../middleware/auth.middleware', () => ({
  authMiddleware: jest.fn((req, res, next) => {
    req.user = { id: 1, role: 'mahasiswa' };
    next();
  }),
  roleMiddleware: jest.fn(() => (req, res, next) => next()),
}));

jest.mock('../../services/faceRecognition.service', () => ({
  processAttendance: jest.fn(),
}));

// Create a test Express app
const app = express();
app.use(express.json());
app.use('/api/absensi', absensiRoutes);

// Mock Prisma
const prisma = new PrismaClient();
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      sesiKelas: {
        findUnique: jest.fn(),
      },
      mahasiswa: {
        findUnique: jest.fn(),
      },
      absensi: {
        upsert: jest.fn(),
        findMany: jest.fn(),
      },
    })),
  };
});

describe('Absensi API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/absensi/submit', () => {
    test('should submit attendance successfully', async () => {
      // Mock service returns
      prisma.sesiKelas.findUnique.mockResolvedValue({
        id: 1,
        tanggal_sesi: new Date(),
        waktu_mulai: new Date('2023-01-01T08:00:00'),
        mata_kuliah: { nama_mk: 'Test Course' },
      });
      
      prisma.mahasiswa.findUnique.mockResolvedValue({
        id: 1,
        data_encoding_wajah: JSON.stringify([0.1, 0.2, 0.3]),
      });
      
      faceRecognitionService.processAttendance.mockResolvedValue({
        isMatch: true,
        similarityScore: 0.85,
      });
      
      prisma.absensi.upsert.mockResolvedValue({
        id: 1,
        status: 'HADIR',
        waktu_absen: new Date(),
      });

      const res = await request(app)
        .post('/api/absensi/submit')
        .field('sesiId', '1')
        .attach('faceImage', Buffer.from('mockImage'), {
          filename: 'test.jpg',
          contentType: 'image/jpeg',
        });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.status).toBe('HADIR');
    });

    test('should return error if face verification fails', async () => {
      // Mock service returns
      prisma.sesiKelas.findUnique.mockResolvedValue({
        id: 1,
        tanggal_sesi: new Date(),
        waktu_mulai: new Date(),
        mata_kuliah: { nama_mk: 'Test Course' },
      });
      
      prisma.mahasiswa.findUnique.mockResolvedValue({
        id: 1,
        data_encoding_wajah: JSON.stringify([0.1, 0.2, 0.3]),
      });
      
    I'll continue developing the integration testing for the Student Attendance System with Face Recognition:

```typescript
      faceRecognitionService.processAttendance.mockResolvedValue({
        isMatch: false,
        similarityScore: 0.45,
      });

      const res = await request(app)
        .post('/api/absensi/submit')
        .field('sesiId', '1')
        .attach('faceImage', Buffer.from('mockImage'), {
          filename: 'test.jpg',
          contentType: 'image/jpeg',
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
      expect(res.body.message).toContain('Verifikasi wajah gagal');
    });
  });

  describe('GET /api/absensi/mahasiswa/:mahasiswaId', () => {
    test('should get all attendance records for a student', async () => {
      // Mock service return
      prisma.absensi.findMany.mockResolvedValue([
        {
          id: 1,
          status: 'HADIR',
          waktu_absen: new Date(),
          sesi_kelas: {
            nomor_pertemuan: 1,
            tanggal_sesi: new Date(),
            mata_kuliah: { nama_mk: 'Test Course' },
          },
        },
      ]);

      const res = await request(app).get('/api/absensi/mahasiswa/1');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveLength(1);
    });
  });
});
```

### 7.2 Deployment Setup

#### 7.2.1 Docker Configuration

Create Docker files for both frontend and backend:

**Backend Dockerfile (backend/Dockerfile)**:

```dockerfile
FROM node:16-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/models ./models

EXPOSE 8000

CMD ["npm", "start"]
```

**Frontend Dockerfile (frontend/Dockerfile)**:

```dockerfile
FROM node:16-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

**Docker Compose (docker-compose.yml)**:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    container_name: absensi-postgres
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    restart: unless-stopped
    networks:
      - absensi-network

  backend:
    build:
      context: ./absensi-backend
      dockerfile: Dockerfile
    container_name: absensi-backend
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}?schema=public
      PORT: 8000
      JWT_SECRET: ${JWT_SECRET}
      FRONTEND_URL: ${FRONTEND_URL}
    ports:
      - "8000:8000"
    depends_on:
      - postgres
    restart: unless-stopped
    networks:
      - absensi-network

  frontend:
    build:
      context: ./absensi-frontend
      dockerfile: Dockerfile
    container_name: absensi-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped
    networks:
      - absensi-network

networks:
  absensi-network:
    driver: bridge

volumes:
  postgres-data:
```

#### 7.2.2 Environment Configuration (.env file)

```
# Database Configuration
DB_USER=absensi_user
DB_PASSWORD=secure_password
DB_NAME=absensi_db

# Backend Configuration
JWT_SECRET=your_jwt_secret_key
PORT=8000

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
REACT_APP_API_URL=http://localhost:8000
```

#### 7.2.3 CI/CD Pipeline (GitHub Actions)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          cache: 'npm'

      - name: Install dependencies (Backend)
        run: |
          cd absensi-backend
          npm install

      - name: Run backend tests
        run: |
          cd absensi-backend
          npm test

      - name: Install dependencies (Frontend)
        run: |
          cd absensi-frontend
          npm install

      - name: Run frontend tests
        run: |
          cd absensi-frontend
          npm test

  deploy:
    name: Deploy
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v2

      - name: Login to Docker Hub
        uses: docker/login-action@v1
        with:
          username: ${{ secrets.DOCKER_HUB_USERNAME }}
          password: ${{ secrets.DOCKER_HUB_ACCESS_TOKEN }}

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v1

      - name: Build and push Backend
        uses: docker/build-push-action@v2
        with:
          context: ./absensi-backend
          file: ./absensi-backend/Dockerfile
          push: true
          tags: ${{ secrets.DOCKER_HUB_USERNAME }}/absensi-backend:latest

      - name: Build and push Frontend
        uses: docker/build-push-action@v2
        with:
          context: ./absensi-frontend
          file: ./absensi-frontend/Dockerfile
          push: true
          tags: ${{ secrets.DOCKER_HUB_USERNAME }}/absensi-frontend:latest

      - name: Deploy to Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SSH_HOST }}
          username: ${{ secrets.SSH_USERNAME }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /path/to/application
            docker-compose pull
            docker-compose up -d
```

## 8. Conclusion and Future Enhancements

### 8.1 Summary of Implementation

The Student Attendance System with Face Recognition includes the following key features:

1. **Secure Authentication**: JWT-based authentication system for students and lecturers
2. **Face Registration**: Students can register their face data for future verification
3. **Automated Attendance**: Students can mark attendance with face recognition
4. **Real-time Notifications**: System sends notifications about class schedules and attendance status
5. **Attendance Reports**: Comprehensive reports on attendance statistics
6. **Mobile Responsiveness**: Designed to work on various devices

### 8.2 Future Enhancements

1. **Multi-factor Authentication**: Add additional security layers like OTP
2. **Offline Mode**: Implement a robust offline mode that syncs when internet connection is restored
3. **Liveness Detection**: Enhance face recognition with liveness detection to prevent spoofing
4. **Integration with LMS**: Connect with Learning Management Systems like Moodle
5. **Batch Processing**: Allow administrators to manage multiple classes and students at once
6. **Mobile App**: Develop native mobile applications for Android and iOS
7. **AI Insights**: Implement machine learning to predict attendance patterns and student performance
8. **Facial Expression Analysis**: Detect student engagement through facial expressions
9. **Automated Follow-up**: Send personalized follow-up messages to students with low attendance

### 8.3 Performance Optimization Strategies

1. **Server-side Optimizations**:
   - Implement caching with Redis for frequently accessed data
   - Use database indexes for faster queries
   - Implement pagination for large data sets

2. **Face Recognition Optimizations**:
   - Pre-process images to reduce size and improve detection speed
   - Optimize model loading and inference time
   - Implement batched processing for multiple faces

3. **Frontend Optimizations**:
   - Implement code splitting to reduce initial load time
   - Use lazy loading for routes and components
   - Optimize images and assets

4. **Deployment Optimizations**:
   - Set up a CDN for static assets
   - Implement horizontal scaling for backend services
   - Use containerization for consistent deployments

By implementing these features and optimizations, the Student Attendance System with Face Recognition will provide a robust, secure, and efficient solution for educational institutions to track student attendance while minimizing administrative overhead and reducing opportunities for fraudulent attendance practices.