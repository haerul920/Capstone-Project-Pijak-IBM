"use client";
import { Search, Rocket, User, CreditCard, Shield, Code } from "lucide-react";
import LandingHeader from "../components/HeaderLanding";
import { useRouter } from "next/navigation";
import FooterLanding from "../components/FooterLanding";

export default function SupportPage() {
  const router = useRouter();
  

  const topics = [
    {
      title: "Getting Started",
      desc: "Articles to get you up and running quickly.",
      icon: <Rocket />,
      path: "/support/GettingStarted",
    },
    {
      title: "My Account",
      desc: "Manage your account and settings.",
      icon: <User />,
      path: "/support/MyAccount",
    },
    {
      title: "Billing & Payments",
      desc: "Information about payments and invoices.",
      icon: <CreditCard />,
      path: "/support/Billing",
    },
    {
      title: "Copyright & Legal",
      desc: "Privacy policy and legal information.",
      icon: <Shield />,
      path: "/support/Legal",
    },
  ];

  const popular = [
    "How does free trial work?",
    "How to create an account?",
    "How our pricing works?",
    "How to edit my profile?",
    "How do I see my orders?",
  ];

  return (
    <div className="bg-gray-100 min-h-screen text-black">
      {/* 🔥 HERO */}
      <LandingHeader />
      <div className="bg-blue-900 py-20 text-center text-white">
        <h1 className="text-3xl font-semibold mb-6">How can we help?</h1>

        <div className="max-w-xl mx-auto bg-white rounded-full flex items-center px-5 py-3 shadow-lg">
          <Search className="text-gray-400 mr-2" />
          <input
            placeholder="Search help..."
            className="w-full outline-none text-black"
          />
        </div>
      </div>

      {/* 🔥 CONTENT */}
      <div className="max-w-6xl mx-auto py-16 grid md:grid-cols-3 gap-10 px-6">
        {/* 🔥 LEFT: TOPICS */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-6">Help Topics</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {topics.map((t, i) => (
              <div
                key={i}
                onClick={() => router.push(t.path)}
                className="bg-white p-5 rounded-2xl shadow 
                hover:shadow-lg hover:-translate-y-1 
                transition cursor-pointer flex gap-4"
              >
                <div className="text-blue-900">{t.icon}</div>

                <div>
                  <h3 className="font-semibold">{t.title}</h3>
                  <p className="text-gray-500 text-sm">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🔥 RIGHT SIDEBAR */}
        <div className="space-y-6">
          {/* ⭐ POPULAR */}
          <div className="bg-white p-5 rounded-2xl shadow">
            <h3 className="font-semibold mb-4">Popular Articles</h3>

            <ul className="space-y-2 text-sm text-gray-600">
              {popular.map((p, i) => (
                <li
                  key={i}
                  className="hover:text-blue-500 cursor-pointer transition"
                >
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* 📞 CONTACT */}
          <div className="bg-white p-5 rounded-2xl shadow text-center">
            <h3 className="font-semibold mb-2">Need Support?</h3>

            <p className="text-gray-500 text-sm mb-4">
              Can't find your answer? Contact us!
            </p>

            <button
              onClick={() => alert("Coming soon 😄")}
              className="bg-blue-900 text-white px-4 py-2 rounded-full hover:bg-blue-500 transition"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 FOOTER */}
      <FooterLanding />
    </div>
  );
}
