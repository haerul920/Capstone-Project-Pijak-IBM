export function ProfileCard({ name, role, email, status, bio }) {
  return (
    <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#2a2a2a]">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-xl font-bold">
          {name?.charAt(0)}
        </div>

        <h2 className="mt-4 text-lg font-semibold">{name}</h2>
        <p className="text-gray-400 text-sm">{role}</p>
        <p className="text-gray-500 text-xs mt-1">{email}</p>

        <span className="mt-2 text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
          {status}
        </span>

        <p className="text-gray-400 text-sm mt-4">{bio}</p>
      </div>
    </div>
  );
}
