import Sidebar from "../components/Sidebar";
import NotificationPanel from "../components/notificationPanel";
import CommandMenu from "../components/commandMenu";

function Riwayat() {
  const Mk = {
    senin: [
      {
        mataPelajaran: "Matematika",
        ruang: "TI-1",
        jam: "08:00 - 09:30",
        pengajar: "Budi Santoso",
        hadir: "hadir",
      },
      {
        mataPelajaran: "Bahasa Inggris",
        ruang: "TI-2",
        jam: "09:30 - 11:00",
        pengajar: "Siti Aminah",
        hadir: "hadir",
      },
      {
        mataPelajaran: "Pendidikan Agama",
        ruang: "TI-3",
        jam: "11:00 - 12:30",
        pengajar: "Ahmad Zaki",
        hadir: "hadir",
      },
    ],
    selasa: [
      {
        mataPelajaran: "Biologi",
        ruang: "TI-4",
        jam: "08:00 - 09:30",
        pengajar: "Dewi Lestari",
        hadir: "hadir",
      },
      {
        mataPelajaran: "Kimia",
        ruang: "TI-5",
        jam: "09:30 - 11:00",
        pengajar: "Rudi Hartono",
        hadir: "sakit",
      },
      {
        mataPelajaran: "Fisika",
        ruang: "TI-6",
        jam: "11:00 - 12:30",
        pengajar: "Siti Nurhaliza",
        hadir: "hadir",
      },
    ],
    rabu: [
      {
        mataPelajaran: "Sejarah",
        ruang: "TI-7",
        jam: "08:00 - 09:30",
        pengajar: "Andi Wijaya",
        hadir: "alpa",
      },
      {
        mataPelajaran: "Geografi",
        ruang: "TI-8",
        jam: "09:30 - 11:00",
        pengajar: "Rina Susanti",
        hadir: "sakit",
      },
      {
        mataPelajaran: "Ekonomi",
        ruang: "TI-9",
        jam: "11:00 - 12:30",
        pengajar: "Budi Santoso",
        hadir: "alpa",
      },
    ],
    kamis: [
      {
        mataPelajaran: "Seni Budaya",
        ruang: "TI-10",
        jam: "08:00 - 09:30",
        pengajar: "Dewi Lestari",
        hadir: "alpa",
      },
      {
        mataPelajaran: "Olahraga",
        ruang: "TI-11",
        jam: "09:30 - 11:00",
        pengajar: "Rudi Hartono",
        hadir: "hadir",
      },
    ],
    jumat: [
      {
        mataPelajaran: "Bahasa Indonesia",
        ruang: "TI-12",
        jam: "08:00 - 09:30",
        pengajar: "Siti Nurhaliza",
        hadir: "hadir",
      },
      {
        mataPelajaran: "PKN",
        ruang: "TI-13",
        jam: "09:30 - 11:00",
        pengajar: "Andi Wijaya",
        hadir: "sakit",
      },
    ],
  };

  // Summary data
  const attendanceSummary = [
    {
      label: "Total absensi",
      count: 10,
      color: "bg-white",
      textColor: "text-gray-500",
      countColor: "text-black",
    },
    {
      label: "Hadir",
      count: 6,
      color: "bg-green-50",
      textColor: "text-green-700",
      countColor: "text-green-700",
    },
    {
      label: "Alpa",
      count: 2,
      color: "bg-red-50",
      textColor: "text-red-700",
      countColor: "text-red-700",
    },
    {
      label: "Izin/Sakit",
      count: 2,
      color: "bg-orange-50",
      textColor: "text-orange-500",
      countColor: "text-orange-500",
    },
  ];

  // Helper function to get status badge styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "hadir":
        return "bg-green-500 text-white";
      case "sakit":
      case "izin":
        return "bg-orange-400 text-white";
      case "alpa":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  // Helper to capitalize first letter
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="min-h-screen bg-amber-50">
      <Sidebar />

      {/* Background images */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <img
          src="img/VectorOrange.png"
          alt=""
          className="absolute top-0 left-0 opacity-70 max-w-3xl"
          style={{
            animation: "float 8s ease-in-out infinite alternate-reverse",
          }}
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

      {/* Main content container */}
      <div className="ml-52 p-2">
        <div className="max-w-7xl ">
          {/* Header */}
          <div className="backdrop-blur-lg border border-gray-400 rounded-xl p-6 mb-2 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Riwayat Absensi
              </h1>
              <h2 className="text-base text-gray-600">
                Lihat ringkasan kehadiran Anda selama ini
              </h2>
            </div>
            <div className="flex items-center gap-4">
              <CommandMenu />
              <NotificationPanel />
            </div>
          </div>

          {/* Main content */}
          <div className="backdrop-blur-lg border border-gray-400 rounded-xl  p-6">
            {/* Summary cards */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Ringkasan
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {attendanceSummary.map((item, index) => (
                  <div
                    key={`summary-${index}`}
                    className={`${item.color} ${item.textColor} p-5 border border-gray-400 rounded-xl `}
                  >
                    <div className="text-lg font-medium">{item.label}</div>
                    <div
                      className={`text-3xl font-bold mt-2 ${item.countColor}`}
                    >
                      {item.count}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detail section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Detail Riwayat
              </h2>

              <div className="h-96 overflow-y-auto pr-2 custom-scrollbar">
                {Object.entries(Mk).map(([hari, listMK]) => (
                  <div key={hari} className="mb-4">
                    <h3 className="text-md font-medium text-gray-700 mb-2 capitalize">
                      {capitalize(hari)}
                    </h3>
                    <div className="space-y-3">
                      {listMK.map((mk, index) => (
                        <div
                          key={`${hari}-${index}`}
                          className="p-4 border border-gray-200 rounded-lg  flex justify-between items-center hover:border-gray-300 transition-all duration-200"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">
                              {mk.mataPelajaran}
                            </h4>
                            <p className="text-gray-600 mt-1">{mk.pengajar}</p>
                            <div className="flex gap-3 mt-2">
                              <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-gray-700 text-white">
                                {mk.jam}
                              </span>
                              <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-violet-500 text-white">
                                {mk.ruang}
                              </span>
                            </div>
                          </div>

                          <div
                            className={`${getStatusStyle(
                              mk.hadir
                            )} px-4 py-1 rounded-lg text-sm font-medium capitalize`}
                          >
                            {mk.hadir}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
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
}

export default Riwayat;
