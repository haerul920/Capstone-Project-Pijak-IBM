"use client";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { User, Bell, Database, Shield } from "lucide-react";
import { useState, useEffect } from "react";

export default function Settings() {
  // 🔥 ACCOUNT STATE
  const [account, setAccount] = useState({
    name: "",
    email: "",
  });

  // 🔥 NOTIFICATION STATE
  const [notifications, setNotifications] = useState({
    email: true,
    sales: true,
    forecast: false,
    weekly: true,
  });

  // 🔥 LOAD DATA
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));

    if (storedUser) {
      setAccount({
        name: storedUser.fullName || "",
        email: storedUser.email || "",
      });
    }

    const storedNotif =
      JSON.parse(localStorage.getItem("notifications")) || notifications;

    setNotifications(storedNotif);
  }, []);

  // 🔥 SAVE ACCOUNT
  const handleSaveAccount = () => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};

    const updatedUser = {
      ...storedUser,
      fullName: account.name,
      email: account.email,
    };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    // 🔥 trigger update ke header dll
    window.dispatchEvent(new Event("userUpdated"));

    alert("Account updated!");
  };

  // 🔥 TOGGLE NOTIFICATION
  const toggle = (key) => {
    const updated = {
      ...notifications,
      [key]: !notifications[key],
    };

    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  // 🔥 EXPORT DATA (CSV)
  const handleExport = () => {
    const data = JSON.parse(localStorage.getItem("productsMaster")) || [];

    if (data.length === 0) {
      alert("No data to export!");
      return;
    }

    const csv = [
      ["Name", "Category", "Price", "Stock"],
      ...data.map((item) => [
        item.name,
        item.category,
        item.selling,
        item.stock,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "data.csv";
    a.click();
  };

  // 🔥 CLEAR CACHE
  const handleClearCache = () => {
    localStorage.removeItem("productsMaster");
    alert("Cache cleared!");
  };

  // 🔥 DELETE ACCOUNT
  const handleDeleteAccount = () => {
    if (!confirm("Are you sure?")) return;

    localStorage.clear();
    alert("Account deleted!");
    window.location.reload();
  };

  // 🔥 CHANGE PASSWORD
  const handleChangePassword = () => {
    const newPass = prompt("Enter new password:");
    if (!newPass) return;
    alert("Password updated (dummy system)");
  };

  // 🔥 2FA
  const handle2FA = () => {
    alert("2FA Enabled (simulation)");
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <Header />

      <div className="ml-64 flex-1 px-6 pt-24 pb-6">
        {/* ACCOUNT */}
        <Card icon={<User />} title="Account Settings">
          <Input
            label="Full Name"
            value={account.name}
            onChange={(e) => setAccount({ ...account, name: e.target.value })}
          />
          <Input
            label="Email"
            value={account.email}
            onChange={(e) => setAccount({ ...account, email: e.target.value })}
          />

          <button
            onClick={handleSaveAccount}
            className="mt-4 bg-red-500 px-4 py-2 rounded-xl"
          >
            Save Changes
          </button>
        </Card>

        {/* NOTIFICATION */}
        <Card icon={<Bell />} title="Notifications">
          <ToggleItem
            label="Email notifications"
            active={notifications.email}
            onClick={() => toggle("email")}
          />
          <ToggleItem
            label="Sales alerts"
            active={notifications.sales}
            onClick={() => toggle("sales")}
          />
          <ToggleItem
            label="Forecast updates"
            active={notifications.forecast}
            onClick={() => toggle("forecast")}
          />
          <ToggleItem
            label="Weekly reports"
            active={notifications.weekly}
            onClick={() => toggle("weekly")}
          />
        </Card>

        {/* DATA */}
        <Card icon={<Database />} title="Data & Privacy">
          <ActionItem label="Export all data" onClick={handleExport} />
          <ActionItem label="Clear cache" onClick={handleClearCache} />
          <ActionItem
            label="Delete account"
            onClick={handleDeleteAccount}
            danger
          />
        </Card>

        {/* SECURITY */}
        <Card icon={<Shield />} title="Security">
          <ActionItem label="Change password" onClick={handleChangePassword} />
          <ActionItem label="Two-factor authentication" onClick={handle2FA} />
        </Card>
      </div>
    </div>
  );
}

/* 🔥 CARD WRAPPER */
function Card({ icon, title, children }) {
  return (
    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 mb-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-red-500/20 p-3 rounded-xl text-red-400">{icon}</div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <div className="space-y-4">{children}</div>
    </div>
  );
}

/* INPUT */
function Input({ label, ...props }) {
  return (
    <div>
      <label className="block mb-2 text-sm text-gray-400">{label}</label>
      <input
        {...props}
        className="w-full bg-black border border-[#2a2a2a] px-4 py-3 rounded-xl"
      />
    </div>
  );
}

/* TOGGLE */
function ToggleItem({ label, active, onClick }) {
  return (
    <div className="flex justify-between items-center bg-black px-4 py-4 rounded-xl">
      <span>{label}</span>

      <button
        onClick={onClick}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
          active ? "bg-red-500" : "bg-gray-600"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full transform transition ${
            active ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  );
}

/* ACTION */
function ActionItem({ label, onClick, danger }) {
  return (
    <div
      onClick={onClick}
      className="flex justify-between items-center bg-black px-4 py-4 rounded-xl cursor-pointer hover:bg-[#111]"
    >
      <span className={danger ? "text-red-500" : ""}>{label}</span>
    </div>
  );
}
