import React from "react";
import Sidebar from "../components/Sidebar";

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

export default function Pengaturan() {
  const [userData, setUserData] = React.useState<userData | null>(null);
  React.useEffect(() => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);
  const APP_URL = import.meta.env.VITE_APP_URL;
  const Profil =
    userData?.foto_profil && userData.foto_profil.trim() !== ""
      ? `${APP_URL}/public/profile_images/${userData.foto_profil}`
      : "img/placeholder.jpg";
  console.log(Profil);
  return (
    <>
      <div className="">
        <aside className="shadow-md z-10">
          <Sidebar />
        </aside>

        <img
          src="img/VectorOrange.png"
          alt=""
          className="fixed top-0 left-0 opacity-70 max-w-3xl"
          style={{
            animation: "float 8s ease-in-out infinite alternate-reverse",
          }}
        />
        <img
          src="img/VectorBlue.png"
          alt=""
          className="fixed right-0 bottom-0 opacity-70 max-w-3xl"
          style={{
            animation: "float 8s ease-in-out infinite alternate-reverse",
          }}
        />

        <div className="rounded-lg shadow-sm overflow-hidden ">
          <div className=" w-[1287px] ml-52  p-2 z-10  ">
            <div className="mb-2 p-6 border backdrop-blur-3xl  border-gray-400 rounded-lg">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Pengaturan
              </h1>
              <p className="text-gray-600 text-lg">
                Kelola pengaturan akun dan preferensi Anda.
              </p>
            </div>
            <div className="p-6 border border-gray-400 rounded-lg backdrop-blur-3xl ">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Profil</h2>

              <div className="flex flex-col md:flex-row items-start md:items-center">
                <div className="flex-shrink-0 mb-4 md:mb-0">
                  <div className="relative">
                    <img
                      src={Profil || "/img/placeholder.jpg"}
                      alt="Profil"
                      className="h-24 w-24 rounded-full object-cover border-4 border-violet-100"
                    />
                    <button className="absolute bottom-0 right-0 bg-violet-600 text-white rounded-full p-2 shadow-lg cursor-pointer">
                      <i className="fas fa-camera"></i>
                    </button>
                  </div>
                </div>

                <div className="md:ml-6 flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="nama"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        id="nama"
                        className="w-full px-3 py-2 border  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                        value={userData?.nama}
                        readOnly
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="nim"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        NIM
                      </label>
                      <input
                        type="text"
                        id="nim"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 bg-gray-50"
                        value={userData?.nim}
                        readOnly
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                        value={userData?.email}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border border-gray-400 rounded-lg my-5 backdrop-blur-3xl ">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Sandi</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="current-password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password Saat Ini
                  </label>
                  <input
                    type="password"
                    readOnly
                    id="current-password"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    placeholder="••••••••"
                  />
                </div>
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
    </>
  );
}
