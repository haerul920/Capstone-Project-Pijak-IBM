"use client";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function Header() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");

  const notificationSound = useRef(null);

useEffect(() => {
  notificationSound.current = new Audio("/notifikasi.mp3");
}, []);

  const lastNotifIdRef = useRef(null);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const latest =
        JSON.parse(localStorage.getItem("notificationsList")) || [];

      const lastNotif = latest[0];

      if (!hasLoadedRef.current) {
        // pertama kali load → jangan bunyi
        hasLoadedRef.current = true;
        lastNotifIdRef.current = lastNotif?.id;
      } else if (lastNotif && lastNotif.id !== lastNotifIdRef.current) {
        notificationSound.current.play().catch(() => {});
        lastNotifIdRef.current = lastNotif.id;
      }

      setNotifications(latest);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const unlockAudio = () => {
      notificationSound.current
        .play()
        .then(() => {
          notificationSound.current.pause();
          notificationSound.current.currentTime = 0;
        })
        .catch(() => {});
    };

    window.addEventListener("click", unlockAudio, { once: true });

    return () => window.removeEventListener("click", unlockAudio);
  }, []);

  useEffect(() => {
    const loadData = () => {
      const storedNotif =
        JSON.parse(localStorage.getItem("notificationsList")) || [];

      const user = JSON.parse(localStorage.getItem("currentUser") || "{}");

      setNotifications(storedNotif);
      setFullName(user.fullName || "Guest User");
      setUsername(user.username || "user");
    };

    loadData();

    window.addEventListener("userUpdated", loadData);

    return () => window.removeEventListener("userUpdated", loadData);
  }, []);

 const router = useRouter();

  const unread = notifications.filter((n) => !n.read).length;

  const markAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem("notificationsList", JSON.stringify(updated));
  };

  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="fixed top-0 left-64 right-0 z-50 bg-[#0f0f0f] border-b border-[#2a2a2a] px-6 py-4">
      <div className="flex justify-between items-center">
        {/* 🔥 LEFT (judul / kosong juga boleh) */}
        <div>
          <h1 className="text-white font-semibold">Admin</h1>
        </div>

        {/* 🔥 RIGHT (notif + user pindah ke kanan) */}
        <div className="flex items-center gap-4 ml-auto">
          {/* 🔔 NOTIFICATION */}
          <div className="relative">
            <div
              onClick={() => {
                setOpen(!open);
                markAsRead();
              }}
              className="w-8 h-8 bg-[#1a1a1a] rounded-full flex items-center justify-center cursor-pointer"
            >
              <Bell size={16} />

              {unread > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </div>

            {/* DROPDOWN */}
            {open && (
              <div className="absolute right-0 mt-2 w-80 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-3 max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-gray-400 text-sm">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="p-2 border-b border-[#2a2a2a] text-sm"
                    >
                      <p>{n.message}</p>
                      <span className="text-gray-500 text-xs">{n.time}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* USER */}
          <div
            onClick={() => router.push("/admin/profile")}
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
          >
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              {initials}
            </div>
            <span className="text-sm text-gray-300">@{username}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
