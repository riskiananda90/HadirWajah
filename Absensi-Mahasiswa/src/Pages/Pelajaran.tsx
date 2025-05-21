import Sidebar from "../components/Sidebar";
import arrow_left from "../assets/arrow-left.svg";
import { Progress } from "../components/ui/progress";
import { useJadwalPelajaran } from "../hooks/useJadwalPelajaran";
import { useEffect, useState } from "react";

interface Pelajaran {
  id: number;
  nama_mk: string;
  dosen: string;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  ruang: string;
  jumlah_pertemuan: number;
  pertemuan_ke: number;
}

const Pelajaran = () => {
  const { data: pelajaranData, isLoading, error } = useJadwalPelajaran();
  const [absenStatus, setAbsenStatus] = useState<Record<number, string>>({});

  useEffect(() => {
    if (pelajaranData && Array.isArray(pelajaranData)) {
      pelajaranData.forEach((pelajaran: Pelajaran) => {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user.id) {
          fetchAbsensi(
            pelajaran.id,
            pelajaran.jam_mulai,
            pelajaran.jam_selesai,
            user.id
          );
        }
      });
    }
  }, [pelajaranData]);

  const jadwalByHari = (pelajaranData as Pelajaran[] | undefined)?.reduce(
    (acc: Record<string, Pelajaran[]>, pelajaran: Pelajaran) => {
      if (!acc[pelajaran.hari]) {
        acc[pelajaran.hari] = [];
      }
      acc[pelajaran.hari].push(pelajaran);
      return acc;
    },
    {}
  );
  const persentase = (a: number, b: number) => {
    return (a / b) * 100;
  };
  const API_URL = "https://3f7d-112-215-229-64.ngrok-free.app";
  // const API_URL = "http://localhost:5000";
  const fetchAbsensi = async (
    id: number,
    jamMulai: string,
    jamSelesai: string,
    userId: number
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/api/absensi/jadwal?id=${id}&mahasiswa_id=${userId}`
      );
      const sekarang = new Date();
      const mulai = new Date();
      const selesai = new Date();

      const [startJam, startMenit] = jamMulai.split(":");
      const [endJam, endMenit] = jamSelesai.split(":");

      mulai.setHours(Number(startJam), Number(startMenit));
      selesai.setHours(Number(endJam), Number(endMenit));
      const data = await response.json();
      if (!data || !data.data) {
        if (sekarang > mulai && sekarang < selesai) {
          setAbsenStatus((prevStatus) => ({
            ...prevStatus,
            [id]: "Absen sekarang",
          }));
        } else {
          setAbsenStatus((prevStatus) => ({
            ...prevStatus,
            [id]: "Tidak ada absen",
          }));
        }
      }
      if (data.data.status_kehadiran) {
        setAbsenStatus((prevStatus) => ({
          ...prevStatus,
          [id]: "Sudah absen",
        }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const renderCourseCard = (
    pelajaran: Pelajaran,
    hari: string,
    index: number
  ) => (
    <ul
      key={`${pelajaran.id}-${index}`}
      className="border border-gray-400 rounded-lg shadow w-full p-7 space-y-2 backdrop-blur-3xl"
    >
      <li className="font-semibold">TI-{pelajaran.id}</li>
      <li className="font-bold text-xl">{pelajaran.nama_mk}</li>
      <li>{pelajaran.dosen}</li>

      <div className="flex gap-2">
        <li className="text-white text-[12px] text-center py-1 rounded-md w-32 pb-1.5 font-semibold bg-gray-600">
          <span className="capitalize">{hari}</span>,{" "}
          {pelajaran.jam_mulai.slice(0, 5)} -{" "}
          {pelajaran.jam_selesai.slice(0, 5)}
        </li>
        <div>
          <span className="text-sm flex bg-violet-600 rounded-md p-1 text-white gap-1">
            <img src={arrow_left} alt=">" className="w-5" />
            {pelajaran.ruang}
          </span>
        </div>
      </div>

      <hr />

      <div className="flex justify-between">
        <li>Kehadiran</li>
        <li>
          {pelajaran.pertemuan_ke} / {pelajaran.jumlah_pertemuan}{" "}
          <span className="text-gray-500 text-[12px] font-bold">
            ({persentase(pelajaran.pertemuan_ke, pelajaran.jumlah_pertemuan)}%)
          </span>
        </li>
      </div>

      <Progress
        className="h-2 bg-gray-100 dark:bg-gray-800"
        value={Number(
          persentase(pelajaran.pertemuan_ke, pelajaran.jumlah_pertemuan)
        )}
      />

      <li
        className={`w-full text-center text-white rounded-md p-2 ${
          absenStatus[pelajaran.id] === "Sudah absen"
            ? "bg-green-600"
            : absenStatus[pelajaran.id] === "Absen sekarang"
            ? "bg-red-600 opacity-75"
            : absenStatus[pelajaran.id] === "Tidak ada absen"
            ? "bg-amber-600 opacity-75"
            : "bg-gray-600"
        }`}
      >
        {absenStatus[pelajaran.id]}
      </li>
    </ul>
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="flex min-h-screen relative">
      <aside className="shadow-md z-10">
        <Sidebar />
      </aside>
      <img
        src="img/VectorOrange.png"
        alt=""
        className="fixed top-0 left-0 z-0 opacity-70 max-w-3xl"
        style={{
          animation: "float 8s ease-in-out infinite alternate-reverse",
        }}
      />
      <img
        src="img/VectorBlue.png"
        alt=""
        className="fixed right-0 bottom-0 z-0 opacity-70 max-w-3xl"
        style={{
          animation: "float 8s ease-in-out infinite alternate-reverse",
        }}
      />

      <main className="flex-1 p-2 relative">
        <div className="w-[1290px] ml-52 mx-auto space-y-2">
          {/* Header */}
          <div className="border border-gray-400 rounded-lg shadow backdrop-blur-3xl p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Mata Kuliah
            </h1>
            <p className="text-lg text-gray-600">
              Daftar mata kuliah semester ini
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-[600px] hide-scrollbar">
            {jadwalByHari &&
              Object.entries(jadwalByHari).map(([hari, pelajaranList]) =>
                pelajaranList.map((pelajaran, index) =>
                  renderCourseCard(pelajaran, hari, index)
                )
              )}
          </div>
        </div>
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

export default Pelajaran;
