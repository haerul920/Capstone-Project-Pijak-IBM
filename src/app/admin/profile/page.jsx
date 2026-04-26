"use client";

import { useState, useEffect } from "react";
import { Bell, Activity, LogOut, ArrowLeft, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { ProfileCard } from "../../components/ProfileCard.jsx";
import { InputField } from "../../components/InputField.jsx";
import { ToggleSwitch } from "../../components/ToggleSwitch";

export default function Profile() {
  const router = useRouter();
  const [userRole] = useState("Admin");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [isEditing, setIsEditing] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  const [totalSales, setTotalSales] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);

  const [storeName, setStoreName] = useState("TechVenture Analytics");
  const [storeCategory, setStoreCategory] = useState("Business Intelligence");
  const [storeAddress, setStoreAddress] = useState("");
  const [storeDescription, setStoreDescription] = useState("");

  const addNotification = (msg) => {
    const list = JSON.parse(localStorage.getItem("notificationsList")) || [];

    list.unshift({
      id: Date.now(),
      message: msg,
      time: new Date().toLocaleString(),
    });

    localStorage.setItem("notificationsList", JSON.stringify(list));
  };

  useEffect(() => {
    const loadUser = () => {
      const user = JSON.parse(localStorage.getItem("currentUser") || "{}");
      console.log("USER DATA:", user);

      const sales = JSON.parse(localStorage.getItem("salesData")) || [];

      const name = user.fullName || "Guest User";

      setFullName(name);
      setEmail(user.email || "-");
      setPhone(user.phone || "-");

      // 🔥 FIX USERNAME (tetap boleh)
      if (!user.username && name) {
        const generatedUsername = name.toLowerCase().replace(/\s/g, "");

        const updatedUser = {
          ...user,
          username: generatedUsername,
        };

        localStorage.setItem("currentUser", JSON.stringify(updatedUser));

        window.dispatchEvent(new Event("userUpdated"));
      }

      // 🔥 HITUNG SALES
      let revenue = 0;
      sales.forEach((s) => {
        revenue += Number(s.qty) * Number(s.price);
      });

      setTotalSales(revenue);
      setTotalOrders(sales.length);
    };

    // 🔥 LOAD AWAL
    loadUser();

    // 🔥 LISTEN UPDATE (INI YANG KAMU BELUM PUNYA)
    window.addEventListener("userUpdated", loadUser);

    return () => {
      window.removeEventListener("userUpdated", loadUser);
    };
  }, []);

  const handleSaveProfile = () => {
    const oldUser = JSON.parse(localStorage.getItem("user") || "{}");

    const updatedUser = {
      ...oldUser, // 🔥 WAJIB
      username: fullName.toLowerCase().replace(/\s/g, ""),
      fullName,
      email,
      phone,
      address,
    };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    addNotification("Profile updated");

    // 🔥 trigger update ke Header
    window.dispatchEvent(new Event("userUpdated"));

    setIsEditing(false);
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Password tidak sama!");
      return;
    }

    addNotification("Password updated");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const formatRupiah = (num) =>
    "Rp" + new Intl.NumberFormat("id-ID").format(num);

  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const handleSaveBusiness = () => {
    localStorage.setItem(
      "business",
      JSON.stringify({
        storeName,
        storeCategory,
        storeAddress,
        storeDescription,
      }),
    );

    addNotification("Business updated");
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* HEADER */}
      <header className="bg-[#111] border-b border-[#2a2a2a] px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin/dashboard")}>
            <ArrowLeft />
          </button>
          <h1 className="text-xl font-semibold">Profile</h1>
        </div>

        <div className="flex gap-4 items-center">
          <Bell />
          <div className="bg-red-500/20 px-3 py-1 rounded-lg text-red-400">
            {initials}
          </div>
        </div>
      </header>

      <main className="p-8 grid lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="space-y-6">
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-2xl text-center">
            {/* AVATAR */}
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-[#111] text-gray-400 text-xl">
              👤
            </div>

            {/* NAME */}
            <h2 className="text-lg font-semibold">{fullName}</h2>

            {/* ROLE + STATUS */}
            <div className="flex justify-center items-center gap-2 mt-1">
              <span className="text-sm text-gray-400">{userRole}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                Active
              </span>
            </div>

            {/* EMAIL */}
            <p className="text-sm text-gray-400 mt-2">{email}</p>

            {/* BIO */}
            <p className="text-xs text-gray-400 mt-4">
              Product leader focused on AI-driven analytics and business
              intelligence solutions.
            </p>

            {/* EDIT BUTTON */}
            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl font-medium"
            >
              <Pencil size={14} />
              Edit Profile
            </button>
          </div>
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Activity size={16} className="text-red-400" />
              <h3>Quick Stats</h3>
            </div>

            <div className="flex justify-between">
              <div>
                <p className="text-xl font-semibold">
                  {formatRupiah(totalSales)}
                </p>
                <p className="text-xs text-gray-400">Total Sales</p>
              </div>

              <div>
                <p className="text-xl font-semibold">
                  {totalOrders.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400">Total Orders</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-2 space-y-6">
          {/* PERSONAL */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-semibold">Personal Information</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <InputField
                label="Full Name"
                value={fullName}
                onChange={setFullName}
                disabled={!isEditing}
              />
              <InputField
                label="Email"
                value={email}
                onChange={setEmail}
                disabled={!isEditing}
              />
            </div>

            <InputField
              label="Phone Number"
              value={phone}
              onChange={setPhone}
              disabled={!isEditing}
            />
            <InputField
              label="Address"
              value={address}
              onChange={setAddress}
              disabled={!isEditing}
            />

            {isEditing && (
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveProfile}
                  className="bg-red-500 px-6 py-2 rounded-xl"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-gray-400"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* ACCOUNT */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-2xl">
            <h3 className="mb-6 font-semibold">Account Settings</h3>

            <p className="mb-2 text-sm">Change Password</p>

            <InputField
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={setCurrentPassword}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <InputField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={setNewPassword}
              />
              <InputField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
            </div>

            <button
              onClick={handleChangePassword}
              className="mt-4 bg-red-500 px-6 py-2 rounded-xl"
            >
              Update Password
            </button>

            <hr className="my-6 border-[#2a2a2a]" />

            <p className="mb-4 text-sm">Preferences</p>

            <ToggleSwitch
              label="Dark Mode"
              description="Use dark theme across the application"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />

            <ToggleSwitch
              label="Notifications"
              description="Receive email and push notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>

          {/* BUSINESS */}
          <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-2xl">
            <h3 className="mb-6 font-semibold">Business Information</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <InputField
                label="Store Name"
                value={storeName}
                onChange={setStoreName}
              />
              <InputField
                label="Store Category"
                value={storeCategory}
                onChange={setStoreCategory}
              />
            </div>

            <InputField
              label="Store Address"
              value={storeAddress}
              onChange={setStoreAddress}
            />
            <InputField
              label="Store Description"
              value={storeDescription}
              onChange={setStoreDescription}
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveBusiness}
                className="bg-red-500 px-6 py-2 rounded-xl"
              >
                Save Changes
              </button>
              <button className="text-gray-400">Cancel</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
