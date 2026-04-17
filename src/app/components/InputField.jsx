"use client";
export function InputField({
  label,
  value,
  onChange,
  type = "text",
  multiline,
  rows = 1,
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">{label}</label>

      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="w-full bg-black border border-[#2a2a2a] px-4 py-3 rounded-xl"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-black border border-[#2a2a2a] px-4 py-3 rounded-xl"
        />
      )}
    </div>
  );
}
