"use client";
import React from "react";
import { motion } from "framer-motion";

interface Education {
  id: number;
  years: string;
  degree: string;
  institution: string;
  grade: string;
}

const EducationTimeline: React.FC = () => {
  const educationData: Education[] = [
    {
      id: 1,
      years: "2022 – Present",
      degree: "BS Software Engineering (8th Semester)",
      institution: "COMSATS University Islamabad, Abbottabad Campus",
      grade: "CGPA: 3.90/4.00",
    },
    {
      id: 2,
      years: "2018 – 2020",
      degree: "FSc (Pre-Medical)",
      institution: "Gov't Model Science College, Muzaffarabad, AJK",
      grade: "Percentage: 91%",
    },
    {
      id: 3,
      years: "2016–2018",
      degree: "Matric (Science)",
      institution: "Haveli Model Science College, Kahuta, AJK",
      grade: "Percentage: 90%",
    },
  ];

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/10 rounded-full blur-2xl opacity-40" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Heading */}
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold mb-16 text-center bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.4 }}
        >
          🎓 My Education Journey
        </motion.h2>

        <div className="relative pl-10">
          {/* Timeline line */}
          <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-400 via-purple-400 to-pink-400 rounded-full" />

          {educationData.map((item, index) => (
            <motion.div
              key={item.id}
              className="mb-12 relative group"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              {/* Timeline dot */}
              <motion.div
                className="absolute -left-[26px] w-5 h-5 rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 border-4 border-white/10 shadow-md"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />

              {/* Education Card */}
              <div className="relative p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-lg group-hover:shadow-indigo-500/30 transition-all duration-300">
                <span className="text-sm text-indigo-300 font-medium block mb-2">
                  {item.years}
                </span>
                <h3 className="text-xl font-bold mb-1 text-white group-hover:text-indigo-200 transition-colors">
                  {item.degree}
                </h3>
                <p className="text-white/80 mb-1">{item.institution}</p>
                <p className="text-white/60">{item.grade}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationTimeline;
