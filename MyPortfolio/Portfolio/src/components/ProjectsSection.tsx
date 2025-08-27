"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import GlowCard from "./GlowCard";

interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  url: string;
  category: string;
}

const allProjects: Project[] = [
  {
    id: 1,
    title: "Bangalore House Prediction (Regression Model)",
    description: "Regression model for house price prediction using Flask.",
    techStack: ["Python", "Flask", "Pandas", "JavaScript", "HTML", "CSS"],
    url: "https://github.com/asimalyas/Python-Projects/tree/main/BanglorHousePrizePredictionRegressionModelProject",
    category: "Machine Learning",
  },
  {
    id: 2,
    title: "Celebrity Recognition (Classification Model)",
    description: "SVM-based celebrity recognition with OpenCV and Flask.",
    techStack: ["Python", "OpenCV", "Wavelet", "Flask", "HTML", "CSS"],
    url: "https://github.com/asimalyas/Python-Projects/tree/main/CelebrityFaceRecongization",
    category: "Machine Learning",
  },
  {
    id: 3,
    title: "Archery Quest Game",
    description: "Two-level Unity archery quest game.",
    techStack: ["Unity", "C#"],
    url: "https://github.com/asimalyas/Game-In-Unity-",
    category: "Game Development",
  },
  {
    id: 4,
    title: "Runner Game",
    description: "Endless runner game with dynamic obstacles.",
    techStack: ["Unity", "C#"],
    url: "https://github.com/asimalyas/Game-In-Unity-",
    category: "Game Development",
  },
  {
    id: 5,
    title: "Attendance Management System",
    description: "Web-based system with admin and student panels.",
    techStack: ["JavaScript", "HTML", "CSS"],
    url: "https://github.com/asimalyas/WebTasks/tree/main/attendance-management-system",
    category: "Web Development",
  },
  {
    id: 6,
    title: "Amazon Home Page Clone",
    description: "Responsive front-end clone of Amazon homepage.",
    techStack: ["HTML", "CSS"],
    url: "https://github.com/asimalyas/WebTasks/tree/main/Amazon%20clone",
    category: "Web Development",
  },
  {
    id: 7,
    title: "Netflix Home Page Clone",
    description: "Responsive front-end clone of Netflix homepage.",
    techStack: ["HTML", "CSS"],
    url: "https://github.com/asimalyas/WebTasks/tree/main/Netflix%20frontend",
    category: "Web Development",
  },
  {
    id: 8,
    title: "CodeCrux",
    description: "React-based platform for practicing and managing programming questions.",
    techStack: ["React", "JavaScript"],
    url: "https://github.com/asimalyas/React_projects/tree/main/codecrux",
    category: "Web Development",
  },
  {
    id: 9,
    title: "Huffman Coding",
    description: "Java implementation of Huffman Coding algorithm.",
    techStack: ["Java"],
    url: "https://github.com/asimalyas/DataStructure",
    category: "Data Structures",
  },
  {
    id: 10,
    title: "Stop Watch",
    description: "React stopwatch application with start, stop, and reset.",
    techStack: ["React", "JavaScript"],
    url: "#",
    category: "Web Development",
  },
  {
    id: 11,
    title: "Library Management System",
    description: "Java OOP-based library management system.",
    techStack: ["Java", "OOP"],
    url: "https://github.com/asimalyas/OOP",
    category: "Desktop Application",
  },
  {
    id: 12,
    title: "E-Learning Course Platform",
    description: "Java-based online learning platform with authentication and progress tracking.",
    techStack: ["Java", "MS SQL Server", "JDBC"],
    url: "#",
    category: "Desktop Application",
  },
  {
    id: 13,
    title: "Note Keeper",
    description: "React app for managing and organizing notes efficiently.",
    techStack: ["React", "JavaScript"],
    url: "https://github.com/asimalyas/React_projects/tree/main/noter-keeper",
    category: "Web Development",
  },
  {
    id: 14,
    title: "Currency Converter",
    description: "Real-time currency converter using JavaScript and API.",
    techStack: ["JavaScript", "HTML", "CSS"],
    url: "https://github.com/asimalyas/WebTasks/tree/main/currencyChanger",
    category: "Web Development",
  },
  {
    id: 15,
    title: "QR Image Generator",
    description: "QR code generator with React and Node.js.",
    techStack: ["Node.js", "React"],
    url: "https://github.com/asimalyas/React_projects/tree/main/QR%2BCode%2BProject",
    category: "Web Development",
  },
  {
    id: 16,
    title: "Rock, Paper, Scissors, Fire Game",
    description: "Interactive game with custom rules using JavaScript.",
    techStack: ["JavaScript", "HTML", "CSS"],
    url: "https://github.com/asimalyas/WebTasks/tree/main/RockSesiorFire",
    category: "Web Development",
  },
  {
    id: 17,
    title: "Hepta",
    description: "Modern frontend travel website built with React.",
    techStack: ["React", "HTML", "CSS", "JavaScript"],
    url: "https://github.com/asimalyas/React_projects/tree/main/hepta",
    category: "Web Development",
  },
  {
  id: 18,
  title: "Heart Disease Prediction (Classification Model)",
  description: "Random Forest classification model for predicting heart disease using tabular data. Includes data cleaning, feature engineering, and key features like Age, Sex, ChestPainType, RestingBP, Cholesterol, FastingBS, RestingECG, MaxHR, ExerciseAngina, Oldpeak, ST_Slope, and HeartDisease.",
  techStack: ["Python", "Flask", "HTML", "CSS", "JavaScript", "RandomForest"],
  url: "https://github.com/asimalyas/Python-Projects/tree/main",
  category: "Machine Learning",
},
];

const categories = ["All", "Web Development", "Machine Learning", "Game Development", "Data Structures", "Desktop Application"];

const ProjectsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects =
    activeCategory === "All"
      ? allProjects
      : allProjects.filter((project) => project.category === activeCategory);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
  };

  return (
    <section id="projects" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent rounded-full blur-2xl"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h2
          className="text-4xl md:text-5xl font-extrabold mb-8 text-center bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.35 }}
        >
          ✨ Featured Projects
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-indigo-500 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-indigo-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project, i) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 160, damping: 16 }}
              className="relative group"
            >
              <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-md group-hover:opacity-60 transition-opacity"></div>

              <GlowCard
                intensity={i % 3 === 0 ? "high" : i % 2 === 0 ? "medium" : "low"}
                hoverScale={1.02}
                className="relative h-full rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl shadow-lg"
              >
                <div className="p-5 flex flex-col h-full relative z-10">
                  <h3 className="text-xl md:text-2xl font-semibold mb-2 group-hover:text-indigo-200 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-white/70 mb-4 leading-relaxed group-hover:text-white/90 transition-colors">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                    {project.techStack.map((tech, idx) => (
                      <motion.span
                        key={idx}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-xs px-3 py-1 rounded-full border border-white/10 bg-white/10 backdrop-blur-sm text-white/70 group-hover:text-white/90 group-hover:border-indigo-300/40 transition-colors shadow-sm"
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                  <motion.a
                    href={project.url}
                    whileHover={{ x: 3 }}
                    className="inline-flex items-center gap-2 text-sm font-medium text-indigo-300 hover:text-indigo-100 transition-colors relative"
                  >
                    <span>View Project</span>
                    <ArrowRight className="w-4 h-4" />
                    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-indigo-300 group-hover:w-full transition-all duration-300"></span>
                  </motion.a>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsSection;
