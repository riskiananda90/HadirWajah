import React, { useRef, useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Camera, RefreshCw, QrCode } from "lucide-react";
import * as faceapi from "face-api.js";
import { Input } from "../components/ui/input";

interface FaceRecognitionProps {
  onSuccess: (photoData: string) => void;
  jadwalId: number | undefined;
}

const FaceRecognition: React.FC<FaceRecognitionProps> = ({
  onSuccess,
  jadwalId,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [streaming, setStreaming] = useState<boolean>(false);
  const [photoData, setPhotoData] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
  const [expiresIn, setExpiresIn] = useState<number | null>(null);
  const [otp, setOtp] = useState("");
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    loadModels();
    return cleanupResources;
  }, []);

  const loadModels = async () => {
    try {
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
    } catch (error) {
      console.error("Error loading face-api models:", error);
      toast.error("Failed to load face detection models");
    }
  };

  const cleanupResources = () => {
    stopCamera();
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (detectionIntervalRef.current)
      clearInterval(detectionIntervalRef.current);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreaming(true);
        toast.info("Kamera aktif, posisikan wajah Anda dalam frame");
        startFaceDetection();
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error(
        "Tidak dapat mengakses kamera. Pastikan kamera diaktifkan dan izin diberikan."
      );
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setStreaming(false);
    }

    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const { videoWidth, videoHeight } = video;
    canvas.width = videoWidth;
    canvas.height = videoHeight;

    const context = canvas.getContext("2d");
    if (context) {
      context.drawImage(video, 0, 0, videoWidth, videoHeight);
      const dataUrl = canvas.toDataURL("image/png");
      setPhotoData(dataUrl);
    }
  };

  const startFaceDetection = async () => {
    setIsScanning(true);
    const options = new faceapi.TinyFaceDetectorOptions();
    const maxAttempts = 100;
    let attemptCount = 0;

    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }

    detectionIntervalRef.current = setInterval(async () => {
      if (attemptCount > maxAttempts) {
        if (detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current);
          detectionIntervalRef.current = null;
        }
        setIsScanning(false);
        toast.warning(
          "Tidak ada wajah yang terdeteksi dalam waktu yang ditentukan"
        );
        stopCamera();
        return;
      }

      attemptCount++;

      if (videoRef.current) {
        try {
          const result = await faceapi
            .detectSingleFace(videoRef.current, options)
            .withFaceLandmarks();

          if (result && result.detection.score > 0.9) {
            if (detectionIntervalRef.current) {
              clearInterval(detectionIntervalRef.current);
              detectionIntervalRef.current = null;
            }
            setIsScanning(false);
            toast.success("Wajah terdeteksi", { duration: 2000 });
            capturePhoto();
          }
        } catch (error) {
          console.error("Face detection error:", error);
        }
      }
    }, 100);
  };

  const generateQR = async () => {
    try {
      const user = getUserFromLocalStorage();

      if (!user?.id) {
        toast.error("User tidak ditemukan. Silakan login ulang.");
        return;
      }

      if (jadwalId === undefined) {
        toast.error("Jadwal tidak ditemukan");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/qr/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: user.id,
          classId: jadwalId,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      if (!result.qr) {
        throw new Error("Invalid response from server");
      }

      setQrCodeValue(result.qr);
      setQrToken(result.token);
      startQRCodeTimer();
    } catch (error) {
      console.error("Error generating QR code:", error);
      toast.error(
        "Gagal generate QR: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  const startQRCodeTimer = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    setExpiresIn(30);

    countdownRef.current = setInterval(() => {
      setExpiresIn((prev) => {
        if (!prev || prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          setQrCodeValue(null);
          toast.info("QR Code expired. Please generate a new one.");
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const submitOtp = async () => {
    if (isSubmitting) return;

    const user = getUserFromLocalStorage();

    if (!user?.id) {
      toast.error("User tidak ditemukan. Silakan login ulang.");
      return;
    }

    if (!otp.trim()) {
      toast.warning("Harap masukkan kode OTP terlebih dahulu");
      return;
    }

    if (!qrToken) {
      toast.error("Token tidak ditemukan");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch(`${API_BASE_URL}/qr/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          OTP: otp.trim(),
          token: qrToken,
          classId: jadwalId,
          studentId: user.id,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Absensi berhasil");
        if (photoData) {
          onSuccess(photoData);
        }
        resetState();
      } else {
        toast.error(result.message || "OTP tidak valid");
      }
    } catch (error) {
      console.error("Error submitting OTP:", error);
      toast.error("Gagal submit OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getUserFromLocalStorage = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return {};
    }
  };

  const resetState = () => {
    setQrCodeValue(null);
    setOtp("");
    setQrToken(null);
    stopCamera();

    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  const resetProcess = () => {
    resetState();
    setPhotoData(null);
  };

  return (
    <motion.div
      className="overflow-hidden bg-gray-900 rounded-lg shadow-xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <div className="aspect-w-4 aspect-h-3 bg-black rounded-lg">
          {qrCodeValue ? (
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">QR Code</h3>
                {expiresIn !== null && (
                  <span className="text-sm px-2 py-1 bg-yellow-600 rounded-full text-white">
                    Expires in {expiresIn}s
                  </span>
                )}
              </div>

              <div className="flex justify-center mb-4">
                <img
                  src={qrCodeValue}
                  alt="QR Code"
                  className="max-w-full h-auto bg-white p-2 rounded-lg"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Masukan Kode OTP
                  </label>
                  <Input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-2 rounded text-black bg-white"
                    placeholder="Contoh: 123456"
                    maxLength={6}
                  />
                </div>

                <div className="flex space-x-2">
                  <Button
                    onClick={submitOtp}
                    className="flex-1"
                    variant="default"
                    disabled={isSubmitting || !otp.trim()}
                  >
                    {isSubmitting ? "Memproses..." : "Submit OTP"}
                  </Button>

                  <Button
                    onClick={resetProcess}
                    variant="destructive"
                    className="flex-shrink-0"
                  >
                    Batal
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                className="w-full h-auto object-cover rounded-lg"
                style={{ display: streaming && !photoData ? "block" : "none" }}
              />

              {!streaming && !photoData && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-4">
                    <Camera size={48} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-400">
                      Klik tombol di bawah untuk memulai pengenalan wajah
                    </p>
                  </div>
                </div>
              )}

              {isScanning && streaming && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center z-10"
                  initial="initial"
                  animate="animate"
                >
                  <motion.div
                    className="w-full h-0.5 bg-blue-500 opacity-50"
                    animate={{
                      y: ["0%", "100%", "0%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.div>
              )}
            </>
          )}

          {photoData && !qrCodeValue && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={photoData}
                alt="Captured"
                className="w-full h-auto rounded-lg"
              />
              <motion.div
                className="absolute inset-0 border-4 border-green-500 rounded-lg pointer-events-none"
                animate={{
                  scale: [1, 1.03, 1],
                  opacity: [0.7, 1, 0.7],
                  transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
              />
            </motion.div>
          )}
        </div>
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>

      <div className="p-4 flex justify-center space-x-4">
        {!streaming && !photoData && !qrCodeValue && (
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={startCamera}>
              <Camera size={20} className="mr-2" />
              Mulai Pengenalan Wajah
            </Button>
          </motion.div>
        )}

        {streaming && !photoData && (
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={stopCamera} variant="destructive">
              <RefreshCw size={20} className="mr-2" />
              Hentikan Kamera
            </Button>
          </motion.div>
        )}

        {photoData && !qrCodeValue && (
          <div className="flex space-x-3 w-full">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <Button
                onClick={resetProcess}
                variant="destructive"
                className="w-full"
              >
                <RefreshCw size={20} className="mr-2" />
                Ambil Ulang
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1"
            >
              <Button onClick={generateQR} className="w-full">
                <QrCode size={20} className="mr-2" />
                Generate QR
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default FaceRecognition;
