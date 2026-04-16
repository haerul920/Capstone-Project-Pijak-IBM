"use client";
import { useState, useEffect } from "react";
import LandingHeader from "../../components/HeaderLanding";

export default function MyAccount() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);

  const [isEditing, setIsEditing] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 🔥 LOAD USER + ORDERS
  useEffect(() => {
    const loadData = () => {
      const user = JSON.parse(localStorage.getItem("user")) || {};
      const orders = JSON.parse(localStorage.getItem("orders")) || [];

      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setUsername(user.username || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");

      // 🔥 FILTER ORDER USER
      const userOrders = orders.filter(
        (o) => o.customer?.username === user.username,
      );

      setTotalOrders(userOrders.length);

      // 🔥 HITUNG TOTAL SPENT (INI YANG KAMU MAU)
      const total = userOrders.reduce((sum, order) => {
  const orderTotal = (order.items || []).reduce(
    (s, item) => s + item.qty * item.selling,
    0
  );
  return sum + orderTotal;
}, 0);

      setTotalSpent(total);
    };

    loadData();

    window.addEventListener("ordersUpdated", loadData);

    return () => {
      window.removeEventListener("ordersUpdated", loadData);
    };
  }, []);
  // 🔥 SAVE PROFILE
  const handleSave = () => {
    const oldUser = JSON.parse(localStorage.getItem("user")) || {};

    const updatedUser = {
      ...oldUser,
      fullName,
      email,
      username,
      phone,
      address,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert("Profile updated!");
    setIsEditing(false);
  };

  // 🔥 CHANGE PASSWORD
  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      alert("Password tidak sama!");
      return;
    }

    alert("Password berhasil diubah!");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const initials = fullName
    ? fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  const loadData = () => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const orders = JSON.parse(localStorage.getItem("orders")) || [];

    setFullName(user.fullName || "");
    setEmail(user.email || "");
    setUsername(user.username || "");
    setPhone(user.phone || "");
    setAddress(user.address || "");

    const userOrders = orders.filter(
      (o) => o.customer?.username === user.username,
    );

    setTotalOrders(userOrders.length);

    // 🔥 HITUNG TOTAL PENGELUARAN
    const total = userOrders.reduce((sum, order) => {
      const orderTotal = order.items.reduce(
        (s, item) => s + item.qty * item.selling,
        0,
      );
      return sum + orderTotal;
    }, 0);

    setTotalSpent(total);
  };
  return (
    <div className="min-h-screen bg-gray-100 text-black">
      <LandingHeader />

      <div className="max-w-5xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-semibold mb-8">My Account</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* 🔥 LEFT PROFILE */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow text-center">
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-200 text-xl">
                {initials}
              </div>

              <h2 className="font-semibold">{fullName}</h2>
              <p className="text-sm text-gray-400">{email}</p>

              <button
                onClick={() => setIsEditing(true)}
                className="mt-6 bg-black text-white px-4 py-2 rounded-xl w-full"
              >
                Edit Profile
              </button>
            </div>

            {/* 🔥 TOTAL ORDERS CARD */}

            <div className="bg-white p-4 rounded-xl shadow text-center">
              <p className="text-gray-400 text-xs">Orders</p>
              <h2 className="text-xl font-bold">{totalOrders}</h2>
            </div>

            <div className="bg-white p-4 rounded-xl shadow text-center">
              <p className="text-gray-400 text-xs">Spent</p>
              <h2 className="text-xl font-bold text-green-600">
                Rp{totalSpent.toLocaleString()}
              </h2>
            </div>
          </div>

          {/* 🔥 RIGHT */}
          <div className="md:col-span-2 space-y-6">
            {/* PERSONAL */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="font-semibold mb-4">Personal Information</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={!isEditing}
                  placeholder="Full Name"
                  className="border p-3 rounded-xl"
                />

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!isEditing}
                  placeholder="Email"
                  className="border p-3 rounded-xl"
                />
              </div>

              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={!isEditing}
                placeholder="Username"
                className="border p-3 rounded-xl w-full mt-4"
              />

              {isEditing && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleSave}
                    className="bg-black text-white px-6 py-2 rounded-xl"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* 🔥 PASSWORD */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="font-semibold mb-4">Change Password</h3>

              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="border p-3 rounded-xl w-full mb-4"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="border p-3 rounded-xl"
                />

                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border p-3 rounded-xl"
                />
              </div>

              <button
                onClick={handleChangePassword}
                className="mt-4 bg-black text-white px-6 py-2 rounded-xl"
              >
                Update Password
              </button>
            </div>

            {/* 🔥 ADDRESS + PHONE */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <h3 className="font-semibold mb-4">Contact Information</h3>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={!isEditing}
                  placeholder="Phone Number"
                  className="border p-3 rounded-xl"
                />

                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  disabled={!isEditing}
                  placeholder="Address"
                  className="border p-3 rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
