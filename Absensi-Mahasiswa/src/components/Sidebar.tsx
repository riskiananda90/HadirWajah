import React, { useState } from "react";
import {
  Home,
  Camera,
  BookOpen,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

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

const Sidebar = () => {
  const [activePage, setActivePage] = useState("dashboard");
  const APP_URL = import.meta.env.VITE_APP_URL;
  console.log(APP_URL);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/" },
    { id: "absensi", label: "Absensi", icon: Camera, href: "/absensi" },
    {
      id: "pelajaran",
      label: "Mata Kuliah",
      icon: BookOpen,
      href: "/pelajaran",
    },
    {
      id: "pengaturan",
      label: "Pengaturan",
      icon: Settings,
      href: "/pengaturan",
    },
  ];
  const [userData, setUserData] = React.useState<userData | null>(null);
  React.useEffect(() => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    const path = window.location.pathname;
    if (path === "/") setActivePage("dashboard");
    else setActivePage(path.substring(1));
  }, []);

  let Profil;
  if (userData?.foto_profil) {
    const APP_URL = import.meta.env.VITE_APP_URL;
    Profil = APP_URL + "public/profile_images/" + userData?.foto_profil;
  } else {
    Profil = "img/placeholder.jpg";
  }
  return (
    <div className="fixed left-0 top-0 h-[720px] m-2  z-10">
      <div className=" backdrop-blur-xl w-48 h-full border border-gray-400 rounded-lg  flex flex-col p-6 ">
        <div className="mb-3">
          <h1 className="text-lg font-bold text-center text-gray-800 flex flex-col items-center justify-center mt-3">
            <div className="h-8 w-8  rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 mr-2 flex items-center justify-center text-white">
              <Logo />
            </div>
            <span className=" mt-5">Hadir Wajah</span>
          </h1>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-2"></div>

        <div className="flex items-center p-2 mb-8 bg-gray-50 rounded-lg">
          <div className="relative">
            <img
              src={`${Profil}`}
              className="w-10 h-10 rounded-full border-2 border-violet-100 object-cover"
              alt="Profile"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>

          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-bold text-gray-800 truncate">
              {userData?.nama}
            </p>
            <p className="text-xs text-gray-500 truncate">{userData?.nim}</p>
          </div>
        </div>

        {/* Navigation menu */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id} className=" text-sm">
                <Link
                  to={item.href}
                  onClick={() => setActivePage(item.id)}
                  className={`flex items-center px-2 py-3 rounded-lg transition-all duration-200 group ${
                    activePage === item.id
                      ? "bg-violet-500  text-white "
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <item.icon
                    size={18}
                    className={`mr-3 ${
                      activePage !== item.id &&
                      "text-gray-500 group-hover:text-violet-600"
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                  {activePage === item.id && (
                    <ChevronRight size={16} className="ml-auto" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-6 pt-6 border-t border-gray-400">
          <span
            onClick={() => {
              localStorage.removeItem("auth_token");
              window.location.href = "/login";
            }}
            className="flex items-center px-4 py-3 rounded-lg cursor-pointer text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
          >
            <LogOut
              size={18}
              className="mr-3 text-gray-500 group-hover:text-red-500"
            />
            <span className="font-medium">Logout</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
