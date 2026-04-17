"use client";

export default function CheckoutStep({ currentStep = 1 }) {
  const steps = ["Keranjang", "Checkout", "Ulasan"];

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-center gap-6 py-6 text-sm">
        {steps.map((label, index) => {
          const step = index + 1;

          return (
            <div key={step} className="flex items-center gap-2">
              
              {/* 🔵 CIRCLE */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition ${
                  step === currentStep
                    ? "bg-black text-white"
                    : step < currentStep
                    ? "bg-green-500 text-white"
                    : "border border-gray-300 text-gray-400"
                }`}
              >
                {step}
              </div>

              {/* 🔤 TEXT */}
              <span
                className={`transition ${
                  step === currentStep
                    ? "text-black font-semibold"
                    : "text-gray-400"
                }`}
              >
                {label}
              </span>

              {/* ➖ LINE */}
              {step < steps.length && (
                <div className="w-16 md:w-24 h-[1px] bg-gray-300 ml-2"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}