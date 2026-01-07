"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import GlowCard from "./GlowCard";

interface Project {
  id: number;
  title: string;
  description: string;
  techStack: string[];
  url: string;
  categories: string[];
}


const allProjects: Project[] = [
  {
    id: 1,
    title: "Bangalore House Prediction (Regression Model)",
    description:
      "Built a regression model using Python and Flask to predict house prices in Bangalore. The project includes feature engineering, data preprocessing with Pandas, and a web-based interface for user input. Useful for real-estate price estimation.",
    techStack: ["Python", "Flask", "Pandas", "JavaScript", "HTML", "CSS"],
    url: "https://github.com/asimalyas/Python-Projects/tree/main/BanglorHousePrizePredictionRegressionModelProject",
    categories: ["Machine Learning", "Web Development"],
  },
  {
    id: 2,
    title: "Celebrity Recognition (Classification Model)",
    description:
      "An SVM-based machine learning model integrated with OpenCV for real-time face recognition. Deployed with Flask, it classifies celebrities from images using wavelet transformations and serves predictions through a simple web interface.",
    techStack: ["Python", "OpenCV", "Wavelet", "Flask", "HTML", "CSS"],
    url: "https://github.com/asimalyas/Python-Projects/tree/main/CelebrityFaceRecongization",
    categories: ["Machine Learning", "Web Development"],
  },
  {
    id: 3,
    title: "Archery Quest Game",
    description:
      "A Unity-based archery quest game with two levels of increasing difficulty. Implements physics-based arrow shooting mechanics, scoring, and immersive gameplay. Designed using C# scripting inside Unity.",
    techStack: ["Unity", "C#"],
    url: "https://github.com/asimalyas/Game-In-Unity-",
    categories: ["Game Development"],
  },
  {
    id: 4,
    title: "Runner Game",
    description:
      "An endless runner game built with Unity and C#. Features dynamic obstacles, collision detection, and increasing game difficulty to test player reflexes. Includes sound effects and scoring system.",
    techStack: ["Unity", "C#"],
    url: "https://github.com/asimalyas/Game-In-Unity-",
    categories: ["Game Development"],
  },
  {
    id: 5,
    title: "Attendance Management System",
    description:
      "A web-based system designed for schools and institutions to track student attendance. Includes admin and student panels, authentication, and attendance reports. Built using HTML, CSS, and JavaScript.",
    techStack: ["JavaScript", "HTML", "CSS"],
    url: "https://github.com/asimalyas/WebTasks/tree/main/attendance-management-system",
    categories: ["Web Development"],
  },
  {
    id: 6,
    title: "Amazon Home Page Clone",
    description:
      "A responsive front-end clone of Amazon’s homepage. Includes navbar, product showcase sections, and grid layouts. Built using only HTML and CSS to practice responsive design.",
    techStack: ["HTML", "CSS"],
    url: "https://github.com/asimalyas/WebTasks/tree/main/Amazon%20clone",
    categories: ["Web Development"],
  },
  {
    id: 7,
    title: "Netflix Home Page Clone",
    description:
      "Frontend clone of Netflix’s homepage with responsive layouts. Includes hero banner, movie thumbnails, and hover effects to replicate Netflix’s user experience. Built with pure HTML and CSS.",
    techStack: ["HTML", "CSS"],
    url: "https://github.com/asimalyas/WebTasks/tree/main/Netflix%20frontend",
    categories: ["Web Development"],
  },
  {
    id: 8,
    title: "CodeCrux",
    description:
      "A React-based platform designed for practicing and managing programming questions. Includes user-friendly UI for browsing, solving, and organizing coding problems. Built with React and JavaScript.",
    techStack: ["React", "JavaScript"],
    url: "https://github.com/asimalyas/React_projects/tree/main/codecrux",
    categories: ["Web Development"],
  },
  {
    id: 9,
    title: "Huffman Coding",
    description:
      "Java implementation of Huffman Coding for text compression. Demonstrates encoding and decoding algorithms used in file compression utilities. Focuses on data structures and algorithm design.",
    techStack: ["Java"],
    url: "https://github.com/asimalyas/DataStructure",
    categories: ["Data Structures"],
  },
  {
    id: 10,
    title: "Stop Watch",
    description:
      "A React-based stopwatch application with Start, Stop, and Reset functionality. Demonstrates React hooks for managing state and rendering real-time updates.",
    techStack: ["React", "JavaScript"],
    url: "#",
    categories: ["Web Development"],
  },
  {
    id: 11,
    title: "Library Management System",
    description:
      "A desktop application built with Java and OOP principles to manage library resources. Supports adding books, tracking issued books, and managing student records.",
    techStack: ["Java", "OOP"],
    url: "https://github.com/asimalyas/OOP",
    categories: ["Desktop Application"],
  },
  {
    id: 12,
    title: "E-Learning Course Platform",
    description:
      "A Java-based desktop platform for online learning. Features authentication, course progress tracking, and content delivery using MS SQL Server with JDBC for backend integration.",
    techStack: ["Java", "MS SQL Server", "JDBC"],
    url: "#",
    categories: ["Desktop Application"],
  },
  {
    id: 13,
    title: "Note Keeper",
    description:
      "A React application for managing personal notes. Users can add, delete, and organize notes with a simple and responsive interface. Built for productivity and note organization.",
    techStack: ["React", "JavaScript"],
    url: "https://github.com/asimalyas/React_projects/tree/main/noter-keeper",
    categories: ["Web Development"],
  },
  {
    id: 14,
    title: "Currency Converter",
    description:
      "A real-time currency converter built with JavaScript and API integration. Fetches live exchange rates and allows users to convert currencies instantly with a clean UI.",
    techStack: ["JavaScript", "HTML", "CSS"],
    url: "https://github.com/asimalyas/WebTasks/tree/main/currencyChanger",
    categories: ["Web Development"],
  },
  {
    id: 15,
    title: "QR Image Generator",
    description:
      "A full-stack project using React and Node.js to generate QR codes dynamically. Users can input text/links and download generated QR codes instantly.",
    techStack: ["Node.js", "React"],
    url: "https://github.com/asimalyas/React_projects/tree/main/QR%2BCode%2BProject",
    categories: ["Web Development"],
  },
  {
    id: 16,
    title: "Rock, Paper, Scissors, Fire Game",
    description:
      "An extended version of the classic Rock-Paper-Scissors game with an additional element 'Fire'. Built with JavaScript, it features interactive gameplay and fun custom rules.",
    techStack: ["JavaScript", "HTML", "CSS"],
    url: "https://github.com/asimalyas/WebTasks/tree/main/RockSesiorFire",
    categories: ["Web Development"],
  },
  {
    id: 17,
    title: "Hepta",
    description:
      "A modern frontend travel website built with React. Features elegant layouts, responsive design, and sections for destinations, travel services, and blogs.",
    techStack: ["React", "HTML", "CSS", "JavaScript"],
    url: "https://github.com/asimalyas/React_projects/tree/main/hepta",
    categories: ["Web Development"],
  },
  {
    id: 18,
    title: "Heart Disease Prediction (Classification Model)",
    description: "Random Forest classification model for predicting heart disease using tabular data. Includes data cleaning, feature engineering, and key features like Age, Sex, ChestPainType, RestingBP, Cholesterol, FastingBS, RestingECG, MaxHR, ExerciseAngina, Oldpeak, ST_Slope, and HeartDisease.",
   techStack: ["Python", "Flask", "HTML", "CSS", "JavaScript", "RandomForest"],
    url: "https://github.com/asimalyas/Python-Projects/tree/main",
    categories: ["Machine Learning", "Web Development"],
  },
  {
  id: 18,
  title: "MediConnect – Smart Home-Based Healthcare Management Platform",
  description: "MediConnect enables patients to receive healthcare services without frequent hospital visits by allowing them to book medical assistants for home checkups and test collection. Uploaded medical data is reviewed remotely by doctors who provide diagnoses and advice, while administrators manage and control doctors, assistants, and system workflows through secure, role-based dashboards.",
  techStack: [
    "TypeScript",
    "React",
    "Tailwind CSS",
    "Supabase (Auth, Database, Storage)",
    "Role-Based Access Control (RBAC)"
  ],
  url: "https://github.com/asimalyas/MediConnect",
  categories: [
    "Web Development",
  ]
}

];

const categories = ["All", "Web Development", "Machine Learning", "Game Development", "Data Structures", "Desktop Application"];

const ProjectsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6); // 👈 show 6 initially

  // Filtered projects
  const filteredProjects = allProjects.filter((project) => {
    const matchesCategory =
      activeCategory === "All" || project.categories.includes(activeCategory);
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Count projects per category
  const categoryCounts: Record<string, number> = {
    All: allProjects.length,
    ...categories.reduce((acc, cat) => {
      if (cat !== "All") {
        acc[cat] = allProjects.filter((p) => p.categories.includes(cat)).length;
      }
      return acc;
    }, {} as Record<string, number>),
  };

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

        {/* 🔍 Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-8"
        >
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 pl-12 rounded-full bg-white/10 text-white/80 placeholder-white/40 backdrop-blur-md border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
          </div>
        </motion.div>

        {/* Category Filters with counts */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setVisibleCount(6); // reset on filter change
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                activeCategory === cat
                  ? "bg-indigo-500 text-white"
                  : "bg-white/10 text-gray-300 hover:bg-indigo-400 hover:text-white"
              }`}
            >
              <span>{cat}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-indigo-200">
                {categoryCounts[cat] || 0}
              </span>
            </button>
          ))}
        </div>

        {/* Project Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.slice(0, visibleCount).map((project, i) => (
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

        {/* Load More Button */}
        {visibleCount < filteredProjects.length && (
          <div className="flex justify-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium shadow-lg hover:shadow-indigo-500/30 transition-all"
            >
              Load More
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
