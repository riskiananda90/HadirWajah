import React from "react";
import Sidebar from "../components/Sidebar";
import CommandMenu from "../components/commandMenu";
import NotificationPanel from "../components/notificationPanel";
import { Calendar, Clock, User, MapPin } from "lucide-react";
import { useJadwalPelajaran } from "../hooks/useJadwalPelajaran";

interface userData {
  nim: string;
  email: string;
  nama: string;
  foto_profil: string | null;
  jumlah_hadir: number | 0;
  jumlah_sakit: number | 0;
  jumlah_izin: number | 0;
  jumlah_alpa: number | 0;
}

interface Pelajaran {
  id: number;
  nama_mk: string;

  
  dosen: string;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  ruang: string;
  jumlah_pertemuan: number;
  status_kehadiran: string;
}

function AttendanceDashboard() {
  // Day of the week handling
  const hariIni = new Date().getDay();
  const hariDalamSeminggu = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ];
  const hari = hariDalamSeminggu[hariIni];

  const [userData, setUserData] = React.useState<userData | null>(null);
  React.useEffect(() => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);
  const { data: pelajaranData, isLoading, error } = useJadwalPelajaran();

  const jadwalByHari = (pelajaranData as Pelajaran[] | undefined)?.reduce(
    (acc: Record<string, Pelajaran[]>, pelajaran: Pelajaran) => {
      if (!acc[pelajaran.hari]) {
        acc[pelajaran.hari] = [];
        console.log(acc);
      }
      acc[pelajaran.hari].push(pelajaran);
      return acc;
    },
    {}
  );
  const hariValid = jadwalByHari && hari in jadwalByHari;

  const attendanceSummary = [
    {
      status: "Hadir",
      count: userData?.jumlah_hadir,
      color: "bg-green-500",
      gradient: "from-green-400 to-green-600",
      icon: "✓",
      description: "Kehadiran tercatat",
    },
    {
      status: "Tanpa Keterangan",
      count: userData?.jumlah_alpa,
      color: "bg-red-500",
      gradient: "from-red-400 to-red-600",
      icon: "✗",
      description: "Tidak ada keterangan",
    },
    {
      status: "Izin",
      count: userData?.jumlah_izin,
      color: "bg-blue-500",
      gradient: "from-blue-400 to-blue-600",
      icon: "!",
      description: "Izin resmi",
    },
    {
      status: "Sakit",
      count: userData?.jumlah_sakit,
      color: "bg-amber-500",
      gradient: "from-amber-400 to-amber-600",
      icon: "+",
      description: "Sakit dengan keterangan",
    },
  ];

  // Helper function to determine attendance status styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "hadir":
        return "bg-gradient-to-r from-green-400 to-green-600 text-white";
      case "late":
        return "bg-gradient-to-r from-green-400 to-green-600 text-white";
      case "sakit":
        return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
      case "izin":
        return "bg-gradient-to-r from-blue-400 to-blue-600 text-white";
      case "alpa":
        return "bg-gradient-to-r from-red-400 to-red-600 text-white";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-600 text-white";
    }
  };

  const getStatusName = (status: string) => {
    switch (status) {
      case "hadir":
        return "Hadir";
      case "late":
        return "Hadir";
      case "sakit":
        return "Sakit";
      case "izin":
        return "Izin";
      case "alpa":
        return "Alpa";
      default:
        return status;
    }
  };

  if (isLoading) {
    return <div className="ml-52 p-6">Loading data...</div>;
  }
  if (error) {
    return (
      <div className="ml-52 p-6 text-red-500">Gagal memuat data jadwal.</div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src="img/VectorOrange.png"
          alt=""
          className="absolute top-0 left-0 opacity-70 max-w-3xl"
          style={{ animation: "float 8s ease-in-out infinite alternate" }}
        />
        <img
          src="img/VectorBlue.png"
          alt=""
          className="absolute right-0 bottom-0 opacity-70 max-w-3xl"
          style={{
            animation: "float 8s ease-in-out infinite alternate-reverse",
          }}
        />
      </div>

      {/* Main content */}
      <div className="ml-52 p-2">
        <div className="max-w-7xl ">
          {/* Header */}
          <div className="backdrop-blur-xl border border-gray-400 rounded-lg p-6 mb-2 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Absensi Kehadiran
              </h1>
              <h2 className="text-lg text-gray-600 font-medium">
                Algoritma dan Pemrograman
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <CommandMenu />
              <NotificationPanel />
            </div>
          </div>

          {/* Main Content Container */}
          <div className=" backdrop-blur-xl border border-gray-400 rounded-lg p-6">
            {/* Attendance Summary Cards */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 px-1">
                Ringkasan Kehadiran
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {attendanceSummary.map((item, index) => (
                  <div
                    key={`summary-${index}`}
                    className={`bg-gradient-to-br ${item.gradient} text-white rounded-xl overflow-hidden  relative group transition-all duration-300 hover:shadow-xl`}
                  >
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-xl">
                      {item.icon}
                    </div>
                    <div className="p-5">
                      <p className="text-sm font-medium text-white text-opacity-90">
                        {item.status}
                      </p>
                      <p className="text-3xl font-bold mt-1">{item.count}</p>
                      <p className="text-sm mt-2 text-white text-opacity-75">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 px-1">
                Kalender Mingguan
              </h2>
              <div className=" rounded-lg border border-gray-400 p-4 ">
                <div className="flex justify-between px-2">
                  {hariDalamSeminggu.map((day, index) => (
                    <div key={day} className="flex flex-col items-center">
                      <div className="text-xs font-bold text-gray-700 mb-2">
                        {day}
                      </div>
                      <div
                        className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 ${
                          index === hariIni
                            ? "bg-gradient-to-br animate-pulse-fast from-violet-500 to-indigo-600 text-white font-bold shadow-md"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {index + 11}
                      </div>
                      {index === hariIni && (
                        <div className="h-1 w-4 bg-violet-500 rounded-full mt-1"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily Attendance Records */}
            <div>
              <div className="flex justify-between items-center mb-4 px-1">
                <h2 className="text-lg font-semibold text-gray-800">
                  Riwayat Kehadiran Hari {hari}
                </h2>
                <div className="text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                  {new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
              <div className=" rounded-xl border border-gray-400 p-4 ">
                {hariValid ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar p-1">
                    {jadwalByHari?.[hari]?.map(
                      (mapel: Pelajaran, index: number) => (
                        <div
                          key={`${hari}-${index}`}
                          className="p-4 rounded-xl border border-gray-400 hover:border-gray-300 bg-white shadow-sm hover:shadow transition-all duration-200"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="font-semibold text-gray-800">
                              {mapel.nama_mk}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                                mapel.status_kehadiran
                              )}`}
                            >
                              {getStatusName(mapel.status_kehadiran)}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center text-gray-600 text-sm">
                              <Clock className="h-4 w-4 mr-2 text-gray-500" />
                              <span>
                                {mapel.jam_mulai.slice(0, 5)} -{" "}
                                {mapel.jam_selesai.slice(0, 5)}
                              </span>
                            </div>

                            <div className="flex items-center text-gray-600 text-sm">
                              <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                              <span>Ruang {mapel.ruang}</span>
                            </div>

                            <div className="flex items-center text-gray-600 text-sm">
                              <User className="h-4 w-4 mr-2 text-gray-500" />
                              <span>{mapel.dosen}</span>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Calendar className="h-16 w-16 text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">
                      Tidak ada jadwal perkuliahan pada hari ini
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      Silakan cek kembali di hari lain
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animation styles */}
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
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.5);
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}

export default AttendanceDashboard;
