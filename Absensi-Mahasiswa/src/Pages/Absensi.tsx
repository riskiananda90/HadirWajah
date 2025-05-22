import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import FaceRecognition from "../components/faceRecognation";
import { useJadwalPelajaran } from "../hooks/useJadwalPelajaran";
import { getWaktuSekarang } from "../lib/getWaktuSekarang";
interface Pelajaran {
  id: number;
  jam_mulai: string;
  jam_selesai: string;
  hari: string;
  nama_mk: string;
  dosen: string;
  ruang: string;
  jumlah_peserta: number;
}
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import {
  Camera,
  CheckCircle,
  Clock,
  Calendar,
  MapPin,
  Book,
  User,
} from "lucide-react";

const Absensi = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [photoData, setPhotoData] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendance, setAttendance] = useState<{
    status: "pending" | "late" | "success";
    time: Date | null;
  }>({
    status: "pending",
    time: null,
  });
  const [statusAbsensi, setStatusAbsensi] = useState("tidak ada absensi");
  const API_URL = import.meta.env.VITE_API_URL;
  // const API_URL = "http://localhost:5000";
  const { data: cachedJadwal } = useJadwalPelajaran();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const hariIni = new Date().toLocaleDateString("id-ID", { weekday: "long" });
  const jadwalHariIniList =
    Object.values(cachedJadwal || {})
      .flat()
      .filter((pelajaran): pelajaran is Pelajaran => {
        return (
          pelajaran &&
          typeof pelajaran === "object" &&
          "hari" in pelajaran &&
          pelajaran.hari === hariIni
        );
      }) || [];

  const pelajaranAktif = getCurrentPelajaran(jadwalHariIniList);

  useEffect(() => {
    if (pelajaranAktif?.id && statusAbsensi === "tidak ada absensi") {
      checkAbsensiStatus(pelajaranAktif.id);
    }
  }, [pelajaranAktif, statusAbsensi]);

  const checkAbsensiStatus = async (jadwalId: number) => {
    if (!jadwalId) return;

    try {
      const user = getUserFromLocalStorage();

      const response = await fetch(
        `${API_URL}/api/absensi/jadwal?id=${jadwalId}&mahasiswa_id=${user.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setPhotoData(data.data.fotoAbsensi);
        if (data) {
          setStatusAbsensi("sudah absen");
          setAttendance({
            status: "success",
            time: new Date(data.data.waktu_absen),
          });
          setIsScanning(true);
        } else {
          setStatusAbsensi("belum absen");
        }
      } else {
        console.error(
          "Error fetching attendance status:",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Error checking attendance status:", error);
    }
  };

  const formattedTime = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(currentTime);

  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(currentTime);

  const handleFaceSuccess = (imageData: string) => {
    setPhotoData(imageData);
    setDialogOpen(false);

    toast.success("Verifikasi wajah berhasil!", {
      icon: <CheckCircle className="text-green-500" size={18} />,
    });
  };

  const getUserFromLocalStorage = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      toast.error("Error mengakses data pengguna");
      return {};
    }
  };

  function getCurrentPelajaran(jadwalHariIni: Pelajaran[]): Pelajaran | null {
    const now = new Date();
    const nowTime = now.getHours() * 60 + now.getMinutes();

    for (const pelajaran of jadwalHariIni) {
      const [startHour, startMin] = pelajaran.jam_mulai.split(":").map(Number);
      const [endHour, endMin] = pelajaran.jam_selesai.split(":").map(Number);

      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;

      if (nowTime >= startMinutes && nowTime <= endMinutes) {
        return pelajaran;
      }
    }
    return null;
  }

  const submitAbsensi = async () => {
    if (!pelajaranAktif?.id) {
      toast.error("Tidak ada jadwal aktif saat ini.");
      return;
    }

    toast.loading("Memproses kehadiran Anda...", {
      duration: 2000,
    });

    const user = getUserFromLocalStorage();
    if (!user?.id) {
      toast.error("User tidak ditemukan. Silakan login ulang.");
      return;
    }

    const { mysql: waktuAbsenMySQL, date: waktuLocalWIB } = getWaktuSekarang();

    const currentHour = waktuLocalWIB.getHours();
    const currentMinute = waktuLocalWIB.getMinutes();
    const [startHour, startMin] = pelajaranAktif.jam_mulai
      .split(":")
      .map(Number);
    const currentTotalMinutes = currentHour * 60 + currentMinute;
    const startTotalMinutes = startHour * 60 + startMin + 25;

    const isLate = currentTotalMinutes > startTotalMinutes;

    try {
      const response = await fetch(`${API_URL}/api/absensi`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_mahasiswa: user.id,
          id_jadwal: pelajaranAktif.id,
          waktu_absen: waktuAbsenMySQL,
          status_kehadiran: isLate ? "late" : "hadir",
          telat: isLate ? true : false,
          fotoAbsensi: photoData,
          lokasi_lat: 0.0,
          lokasi_lng: 0.0,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      toast.dismiss();
      if (result.success) {
        setIsScanning(true);
        setStatusAbsensi(isLate ? "late" : "hadir");

        if (isLate) {
          toast.warning("Absensi berhasil dicatat, tetapi Anda terlambat!", {
            duration: 4000,
            icon: <Clock className="text-amber-500" size={18} />,
          });

          setAttendance({
            status: "late",
            time: new Date(),
          });
        } else {
          toast.success(
            "Absensi berhasil dicatat! Terima kasih atas kehadiran Anda.",
            {
              duration: 4000,
              icon: <CheckCircle className="text-green-500" size={18} />,
            }
          );

          setAttendance({
            status: "success",
            time: new Date(),
          });
        }
      } else {
        toast.error("Gagal mencatat absensi.");
      }
    } catch (err) {
      console.error("Error submitting absensi:", err);
      toast.error("Gagal mengirim data absensi.");
    }
  };

  const StatusBadge = ({
    type,
  }: {
    type: "active" | "pending" | "late" | "success";
  }) => {
    const statusStyles = {
      active: "bg-green-600 border-green-700",
      pending: "bg-amber-500 border-amber-600",
      late: "bg-orange-500 border-orange-600",
      success: "bg-blue-600 border-blue-700",
    };

    const statusText = {
      active: "Sedang Berlangsung",
      pending: "Menunggu Absensi",
      late: "terlambat",
      success: "hadir",
    };

    return (
      <div
        className={`text-white text-xs px-4 py-1.5 rounded-full font-medium border ${statusStyles[type]} shadow-sm flex items-center gap-1.5 w-fit`}
      >
        {type === "active" && (
          <div className="w-2 h-2 bg-white rounded-full animate-pulse " />
        )}
        {statusText[type]}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen">
      <Toaster position="top-center" />

      <aside className="shadow-xl z-20">
        <Sidebar />
      </aside>
      <img
        src="img/VectorOrange.png"
        alt=""
        className="fixed top-0 left-0 opacity-70 max-w-3xl"
        style={{ animation: "float 8s ease-in-out infinite alternate" }}
      />
      <img
        src="img/VectorBlue.png"
        alt=""
        className="fixed right-0 bottom-0 opacity-70 max-w-3xl"
        style={{
          animation: "float 8s ease-in-out infinite alternate-reverse",
        }}
      />
      <main className="flex p-2 relative z-10">
        <div className="ml-52 space-y-4 w-[1300px] ">
          <div className="rounded-lg backdrop-blur-md w-full p-8 border border-gray-400">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="bg-violet-600 text-white p-1.5 rounded-lg shadow-lg">
                    <Book size={24} />
                  </span>
                  Absensi Kehadiran
                </h1>
                <h2 className="text-lg text-gray-600 flex items-center gap-2">
                  <span className="text-violet-600">
                    <Book size={16} />
                  </span>
                  {pelajaranAktif
                    ? pelajaranAktif.nama_mk
                    : "Tidak ada jadwal aktif"}
                </h2>
              </div>

              <div className="flex flex-col items-end">
                <div className="text-right">
                  <div className="text-sm text-gray-600">{formattedDate}</div>
                  <div className="text-2xl font-semibold text-gray-800">
                    {formattedTime}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="rounded-lg backdrop-blur-md p-8 space-y-6 flex-1 border border-gray-400 h-[567px]">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-violet-600">
                  <Book size={20} />
                </span>
                <div className=" flex justify-between  w-full">
                  <span> Informasi Perkuliahan</span>
                  <span>
                    {isScanning ? (
                      <StatusBadge type="active" />
                    ) : (
                      <StatusBadge type="pending" />
                    )}
                  </span>
                </div>
              </h2>

              {pelajaranAktif ? (
                <div className="grid grid-cols-1 gap-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-violet-100 p-2 rounded-lg">
                      <Book className="text-violet-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Mata Kuliah
                      </h3>
                      <p className="font-bold text-gray-800">
                        {pelajaranAktif.nama_mk}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <User className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Dosen
                      </h3>
                      <p className="font-bold text-gray-800">
                        {pelajaranAktif.dosen}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-amber-100 p-2 rounded-lg">
                        <Calendar className="text-amber-600" size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Tanggal
                        </h3>
                        <p className="font-bold text-gray-800">
                          {formattedDate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <Clock className="text-green-600" size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Waktu
                        </h3>
                        <p className="font-bold text-gray-800">
                          {pelajaranAktif.jam_mulai.slice(0, 5)} -{" "}
                          {pelajaranAktif.jam_selesai.slice(0, 5)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="bg-pink-100 p-2 rounded-lg">
                        <MapPin className="text-pink-600" size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Ruang
                        </h3>
                        <p className="font-bold text-gray-800">
                          {pelajaranAktif.ruang}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">
                      Status
                    </h3>
                    {attendance.status === "success" ? (
                      <StatusBadge type="success" />
                    ) : attendance.status === "late" ? (
                      <StatusBadge type="late" />
                    ) : (
                      "Belum Absen"
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 flex-col">
                  <div className="bg-yellow-100 p-4 rounded-full mb-4">
                    <Clock className="text-yellow-600" size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">
                    Tidak ada kelas yang sedang berlangsung
                  </h3>
                  <p className="text-gray-500 text-center mt-2">
                    Silakan periksa jadwal Anda untuk informasi lebih lanjut
                  </p>
                </div>
              )}
            </div>

            {/* Verifikasi wajah */}
            <div className="rounded-lg backdrop-blur-md p-8 space-y-6 flex-1 border border-gray-400">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-violet-600">
                  <Camera size={20} />
                </span>
                Verifikasi Kehadiran
              </h2>

              {!pelajaranAktif ? (
                <div className="flex flex-col items-center justify-center p-6 space-y-4 h-64 text-center">
                  <div className="bg-gray-100 p-4 rounded-full">
                    <Calendar className="text-gray-500" size={32} />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-700">
                    Tidak ada kelas yang perlu diabsen saat ini
                  </h3>
                  <p className="text-gray-500">
                    Silakan kembali pada jadwal yang telah ditentukan
                  </p>
                </div>
              ) : isScanning ? (
                <div className="flex flex-col items-center justify-center p-4 rounded-lg">
                  <div className="relative mb-4">
                    <img
                      src={"AbsensiImage/" + photoData}
                      alt="wajah"
                      className="w-64 h-64 object-cover rounded-lg shadow-lg border-2 border-green-500"
                    />
                    <div className="absolute -top-3 -right-3 bg-green-600 text-white p-2 rounded-full shadow-lg">
                      <CheckCircle size={24} />
                    </div>
                  </div>

                  <div className="text-center mt-4">
                    <h3 className="font-semibold text-lg text-gray-800">
                      Kehadiran Tercatat
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {attendance.status === "late"
                        ? "Anda terlambat, silakan segera masuk kelas"
                        : "Terima kasih atas kehadiran Anda"}
                    </p>
                    <p className="text-violet-600 font-medium mt-3">
                      {attendance.time &&
                        new Intl.DateTimeFormat("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        }).format(attendance.time)}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {photoData ? (
                    <div className="flex flex-col items-center justify-center p-4 space-y-6">
                      <div className="relative">
                        <img
                          src={"AbsensiImage/" + photoData}
                          alt="Foto Anda"
                          className="w-64 h-64 object-cover rounded-lg shadow-lg border-2 border-violet-300"
                        />
                      </div>

                      <div className="text-center mt-2">
                        <h3 className="font-semibold text-lg text-gray-800">
                          Verifikasi Berhasil
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          Silakan kirim absensi untuk mencatat kehadiran Anda
                        </p>
                      </div>

                      <button
                        className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-full flex items-center gap-2 shadow-lg shadow-violet-200 hover:shadow-violet-300 transition-all duration-300 transform hover:-translate-y-1"
                        onClick={submitAbsensi}
                      >
                        <CheckCircle size={18} />
                        <span>Kirim Absensi</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 space-y-6">
                      <div className="w-64 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                        <div className="text-center p-6">
                          <div className="bg-violet-100 p-4 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                            <Camera className="text-violet-600" size={28} />
                          </div>
                          <h3 className="font-semibold text-lg text-gray-800">
                            Verifikasi Wajah
                          </h3>
                          <p className="text-gray-600 text-sm mt-2">
                            Posisikan wajah Anda di dalam frame kamera untuk
                            verifikasi
                          </p>
                        </div>
                      </div>

                      <button
                        className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium py-3 px-6 rounded-full flex items-center gap-2 shadow-lg shadow-violet-200 hover:shadow-violet-300 transition-all duration-300 transform hover:-translate-y-1"
                        onClick={() => setDialogOpen(true)}
                      >
                        <Camera size={18} />
                        <span>Mulai Verifikasi</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl bg-gray-900/95 text-white border-gray-800">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center mb-4 text-white flex items-center justify-center gap-2">
                <Camera className="text-violet-400" size={24} />
                <span>Verifikasi Wajah</span>
              </DialogTitle>
              <FaceRecognition
                onSuccess={handleFaceSuccess}
                jadwalId={pelajaranAktif?.id}
              />
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </main>

      <style>{`
        @keyframes float {
          0% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-15px) rotate(1deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Absensi;
