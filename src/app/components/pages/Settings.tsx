import { Bell, Shield, Database, User } from "lucide-react";

export function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your application preferences</p>
      </div>

      {/* Account Settings */}
      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#FF3B3B]/10 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-[#FF3B3B]" />
          </div>
          <h2 className="text-white">Account Settings</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Full Name</label>
            <input
              type="text"
              defaultValue="Admin User"
              className="w-full px-4 py-2 bg-[#0B0B0B] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#FF3B3B]"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Email</label>
            <input
              type="email"
              defaultValue="admin@salesforecast.ai"
              className="w-full px-4 py-2 bg-[#0B0B0B] border border-[#2A2A2A] rounded-lg text-white focus:outline-none focus:border-[#FF3B3B]"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#FF3B3B]/10 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-[#FF3B3B]" />
          </div>
          <h2 className="text-white">Notifications</h2>
        </div>

        <div className="space-y-4">
          {[
            { label: "Email notifications", checked: true },
            { label: "Sales alerts", checked: true },
            { label: "Forecast updates", checked: false },
            { label: "Weekly reports", checked: true },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-[#0B0B0B] rounded-lg">
              <span className="text-sm text-gray-300">{item.label}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                <div className="w-11 h-6 bg-[#2A2A2A] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF3B3B]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Data & Privacy */}
      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#FF3B3B]/10 rounded-lg flex items-center justify-center">
            <Database className="w-5 h-5 text-[#FF3B3B]" />
          </div>
          <h2 className="text-white">Data & Privacy</h2>
        </div>

        <div className="space-y-3">
          <button className="w-full flex items-center justify-between p-4 bg-[#0B0B0B] rounded-lg hover:bg-[#2A2A2A] transition-colors text-left">
            <span className="text-sm text-gray-300">Export all data</span>
            <span className="text-sm text-gray-500">CSV</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-[#0B0B0B] rounded-lg hover:bg-[#2A2A2A] transition-colors text-left">
            <span className="text-sm text-gray-300">Clear cache</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-[#0B0B0B] rounded-lg hover:bg-[#FF3B3B]/10 transition-colors text-left">
            <span className="text-sm text-[#FF3B3B]">Delete account</span>
          </button>
        </div>
      </div>

      {/* Security */}
      <div className="bg-[#1A1A1A] p-6 rounded-xl border border-[#2A2A2A]">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#FF3B3B]/10 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#FF3B3B]" />
          </div>
          <h2 className="text-white">Security</h2>
        </div>

        <div className="space-y-3">
          <button className="w-full p-4 bg-[#0B0B0B] rounded-lg hover:bg-[#2A2A2A] transition-colors text-left">
            <span className="text-sm text-gray-300">Change password</span>
          </button>
          <button className="w-full p-4 bg-[#0B0B0B] rounded-lg hover:bg-[#2A2A2A] transition-colors text-left">
            <span className="text-sm text-gray-300">Two-factor authentication</span>
          </button>
        </div>
      </div>
    </div>
  );
}
