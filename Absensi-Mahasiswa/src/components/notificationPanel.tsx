import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";
import {
  Bell,
  Check,
  Clock,
  XCircle,
  Info,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "../components/ui/badge";

type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "success" | "warning" | "info" | "error";
};

const NotificationPanel = () => {
  // Sample notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Absensi Berhasil",
      message:
        "Absensi Anda untuk mata kuliah Algoritma dan Pemrograman telah tercatat.",
      time: "5 menit yang lalu",
      read: false,
      type: "success",
    },
    {
      id: "2",
      title: "Pengingat Kuliah",
      message: "Kelas Kalkulus II akan dimulai dalam 30 menit.",
      time: "30 menit yang lalu",
      read: false,
      type: "info",
    },
    {
      id: "3",
      title: "Ketidakhadiran Tercatat",
      message:
        "Anda tidak hadir pada kelas Struktur Data hari Rabu. Silakan ajukan keterangan.",
      time: "2 jam yang lalu",
      read: true,
      type: "warning",
    },
    {
      id: "4",
      title: "Informasi Tugas",
      message:
        "Tugas baru telah ditambahkan oleh Dr. Rizki untuk mata kuliah Algoritma.",
      time: "1 hari yang lalu",
      read: true,
      type: "info",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle size={18} className="text-green-500" />;
      case "warning":
        return <AlertTriangle size={18} className="text-amber-500" />;
      case "error":
        return <XCircle size={18} className="text-red-500" />;
      case "info":
      default:
        return <Info size={18} className="text-blue-500" />;
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="relative flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200">
          <Bell size={18} className="text-white" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 p-0 bg-red-500 text-white text-xs font-bold shadow-sm">
              {unreadCount}
            </Badge>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg bg-white border-l-0 rounded-l-xl shadow-xl overflow-y-auto">
        <SheetHeader className="pb-4 border-b">
          <div className="flex justify-between items-center">
            <SheetTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Notifikasi
            </SheetTitle>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
              >
                <Check size={14} />
                Tandai semua dibaca
              </button>
            )}
          </div>
          <SheetDescription className="text-gray-500">
            Pemberitahuan terkait absensi dan kegiatan kuliah Anda
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`group p-4 rounded-xl border border-transparent transition-all duration-200 hover:border-indigo-100 ${
                  notification.read
                    ? "bg-gray-50/80"
                    : "bg-gradient-to-r from-white to-indigo-50/30 shadow-sm"
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1 p-2 rounded-full bg-white shadow-sm">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4
                        className={`text-sm font-semibold ${
                          notification.read ? "text-gray-700" : "text-gray-900"
                        }`}
                      >
                        {notification.title}
                        {!notification.read && (
                          <span className="ml-2 inline-block w-2 h-2 rounded-full bg-indigo-500"></span>
                        )}
                      </h4>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
                        {notification.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 px-4">
              <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-gray-100">
                <Bell size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">
                Tidak ada notifikasi saat ini
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Semua pemberitahuan akan muncul di sini
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationPanel;
