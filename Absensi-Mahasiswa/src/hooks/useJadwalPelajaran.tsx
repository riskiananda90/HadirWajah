import { useQuery } from "@tanstack/react-query";

interface Pelajaran {
  id: number;
  nama_mk: string;
  dosen: string;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  ruang: string;
  jumlah_peserta: number;
}

interface jadwalPelajaran {
  [hari: string]: Pelajaran[];
}
export const API_URL = import.meta.env.VITE_API_URL;
const user = JSON.parse(localStorage.getItem("user") || "{}");
const fetchJadwalPelajaran = async (): Promise<jadwalPelajaran> => {
  console.log(user?.id);

  const response = await fetch(
    `${API_URL}/jadwal/getPelajaran?id_mahasiswa=${user?.id}`
  );
  if (!response.ok) {
    throw new Error("Gagal mengambil jadwal pelajaran");
  }
  return response.json();
};

export const useJadwalPelajaran = () => {
  return useQuery<jadwalPelajaran>({
    queryKey: ["jadwal-pelajaran"],
    queryFn: fetchJadwalPelajaran,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
