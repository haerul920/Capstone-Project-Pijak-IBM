"use client";

export function ToggleSwitch({ label, description, checked, onCheckedChange }) {
  return (
    <div className="flex justify-between items-center bg-black p-4 rounded-xl">
      <div>
        <p>{label}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>

      <button
        onClick={() => onCheckedChange(!checked)}
        className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
          checked ? "bg-red-500" : "bg-gray-600"
        }`}
      >
        <div
          className={`bg-white w-4 h-4 rounded-full transition ${
            checked ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  );
}
