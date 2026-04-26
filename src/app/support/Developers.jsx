"use client";
import { Github } from "lucide-react";
import LandingHeader from "../../components/HeaderLanding";
import { useRouter } from "next/navigation";

export default function Developers() {
  const router = useRouter();
  const team = [
    {
      name: "Dio Zidane",
      role: "Frontend Developer",
      img: "https://www.pngmart.com/files/23/Profile-PNG-Photo.png",
      github: "https://github.com/",
    },
    {
      name: "Rizky Pratama",
      role: "Backend Developer",
      img: "https://www.pngmart.com/files/23/Profile-PNG-Photo.png",
      github: "https://github.com/",
    },
    {
      name: "Andi Saputra",
      role: "AI Engineer",
      img: "https://www.pngmart.com/files/23/Profile-PNG-Photo.png",
      github: "https://github.com/",
    },
    {
      name: "Fajar Nugroho",
      role: "UI/UX Designer",
      img: "https://www.pngmart.com/files/23/Profile-PNG-Photo.png",
      github: "https://github.com/",
    },
    {
      name: "Bima Putra",
      role: "Fullstack Developer",
      img: "https://www.pngmart.com/files/23/Profile-PNG-Photo.png",
      github: "https://github.com/",
    },
    {
      name: "Naufal Akbar",
      role: "Data Analyst",
      img: "https://www.pngmart.com/files/23/Profile-PNG-Photo.png",
      github: "https://github.com/",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#020617] text-white">
      <LandingHeader />

      <div className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">
          Meet Our Developers 🚀
        </h1>
        <p className="text-center text-gray-400 mb-12">
          The people behind this system
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {team.map((dev, i) => (
            <div
              key={i}
              className="group relative rounded-3xl p-[1px] bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400 hover:scale-[1.03] transition duration-500"
            >
              {/* INNER CARD */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-5 h-full shadow-xl border border-white/10 group-hover:shadow-cyan-500/20">
                {/* IMAGE */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 blur-2xl opacity-20 group-hover:opacity-40 transition"></div>

                  <img
                    src={dev.img}
                    className="relative w-full h-[220px] object-cover rounded-2xl group-hover:scale-105 transition duration-500"
                  />
                </div>

                {/* NAME */}
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {dev.name}
                  <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                    ✔
                  </span>
                </h3>

                {/* ROLE */}
                <p className="text-gray-400 text-sm mb-4">{dev.role}</p>

                {/* STATS */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 text-gray-400 text-sm">
                    <span>👨‍💻 300+</span>
                    <span>⭐ 40+</span>
                  </div>

                  {/* BUTTON */}
                  <a
                    href={dev.github}
                    target="_blank"
                    className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full hover:bg-white/20 transition text-sm"
                  >
                    <Github size={16} />
                    Github
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
