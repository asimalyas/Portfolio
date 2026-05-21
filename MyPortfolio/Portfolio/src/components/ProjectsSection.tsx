import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, ExternalLink } from "lucide-react";
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
      "Built a regression model using Python and Flask to predict house prices in Bangalore. Includes feature engineering, data preprocessing with Pandas, and a web-based interface.",
    techStack: ["Python", "Flask", "Pandas", "JavaScript", "HTML", "CSS"],
    url: "https://github.com/asimalyas/Python-Projects/tree/main/BanglorHousePrizePredictionRegressionModelProject",
    categories: ["Machine Learning", "Web Development"],
  },
  {
    id: 2,
    title: "Celebrity Recognition (Classification Model)",
    description:
      "SVM-based ML model with OpenCV for real-time face recognition. Deployed with Flask, classifies celebrities using wavelet transformations.",
    techStack: ["Python", "OpenCV", "Wavelet", "Flask", "HTML", "CSS"],
    url: "https://github.com/asimalyas/Python-Projects/tree/main/CelebrityFaceRecongization",
    categories: ["Machine Learning", "Web Development"],
  },
  {
    id: 3,
    title: "Archery Quest Game",
    description:
      "A Unity-based archery quest game with two levels of increasing difficulty. Implements physics-based arrow shooting, scoring, and immersive gameplay.",
    techStack: ["Unity", "C#"],
    url: "https://github.com/asimalyas/Game-In-Unity-",
    categories: ["Game Development"],
  },
  {
    id: 4,
    title: "Runner Game",
    description:
      "An endless runner game built with Unity and C#. Features dynamic obstacles, collision detection, and increasing difficulty.",
    techStack: ["Unity", "C#"],
    url: "https://github.com/asimalyas/Game-In-Unity-",
    categories: ["Game Development"],
  },
  {
    id: 5,
    title: "Attendance Management System",
    description:
      "Web-based system for tracking student attendance. Includes admin and student panels, authentication, and attendance reports.",
    techStack: ["JavaScript", "HTML", "CSS"],
    url: "https://github.com/asimalyas/WebTasks/tree/main/attendance-management-system",
    categories: ["Web Development"],
  },
  {
    id: 6,
    title: "Amazon Home Page Clone",
    description:
      "Responsive front-end clone of Amazon's homepage with navbar, product showcases, and grid layouts using pure HTML/CSS.",
    techStack: ["HTML", "CSS"],
    url: "https://github.com/asimalyas/WebTasks/tree/main/Amazon%20clone",
    categories: ["Web Development"],
  },
  {
    id: 7,
    title: "Netflix Home Page Clone",
    description:
      "Frontend clone of Netflix's homepage with responsive layouts, hero banner, movie thumbnails, and hover effects.",
    techStack: ["HTML", "CSS"],
    url: "https://github.com/asimalyas/WebTasks/tree/main/Netflix%20frontend",
    categories: ["Web Development"],
  },
  {
    id: 8,
    title: "CodeCrux",
    description:
      "A React-based platform for practicing and managing programming questions with user-friendly UI for browsing and solving problems.",
    techStack: ["React", "JavaScript"],
    url: "https://github.com/asimalyas/React_projects/tree/main/codecrux",
    categories: ["Web Development"],
  },
  {
    id: 9,
    title: "Huffman Coding",
    description:
      "Java implementation of Huffman Coding for text compression. Demonstrates encoding and decoding algorithms for file compression.",
    techStack: ["Java"],
    url: "https://github.com/asimalyas/DataStructure",
    categories: ["Data Structures"],
  },
  {
    id: 10,
    title: "Stop Watch",
    description:
      "React-based stopwatch with Start, Stop, and Reset functionality. Demonstrates React hooks for state and real-time updates.",
    techStack: ["React", "JavaScript"],
    url: "#",
    categories: ["Web Development"],
  },
  {
    id: 11,
    title: "Library Management System",
    description:
      "Desktop application built with Java and OOP principles. Supports adding books, tracking issued books, and managing student records.",
    techStack: ["Java", "OOP"],
    url: "https://github.com/asimalyas/OOP",
    categories: ["Desktop Application"],
  },
  {
    id: 12,
    title: "E-Learning Course Platform",
    description:
      "Java-based desktop platform for online learning with authentication, course progress tracking, and MS SQL Server backend.",
    techStack: ["Java", "MS SQL Server", "JDBC"],
    url: "#",
    categories: ["Desktop Application"],
  },
  {
    id: 13,
    title: "Note Keeper",
    description:
      "React application for managing personal notes. Users can add, delete, and organize notes with a responsive interface.",
    techStack: ["React", "JavaScript"],
    url: "https://github.com/asimalyas/React_projects/tree/main/noter-keeper",
    categories: ["Web Development"],
  },
  {
    id: 14,
    title: "Currency Converter",
    description:
      "Real-time currency converter with API integration. Fetches live exchange rates with a clean, responsive UI.",
    techStack: ["JavaScript", "HTML", "CSS"],
    url: "https://github.com/asimalyas/WebTasks/tree/main/currencyChanger",
    categories: ["Web Development"],
  },
  {
    id: 15,
    title: "QR Image Generator",
    description:
      "Full-stack project using React and Node.js to generate QR codes dynamically. Users can input text/links and download QR codes.",
    techStack: ["Node.js", "React"],
    url: "https://github.com/asimalyas/React_projects/tree/main/QR%2BCode%2BProject",
    categories: ["Web Development"],
  },
  {
    id: 16,
    title: "Rock, Paper, Scissors, Fire Game",
    description:
      "Extended Rock-Paper-Scissors with an additional 'Fire' element. Features interactive gameplay and custom rules.",
    techStack: ["JavaScript", "HTML", "CSS"],
    url: "https://github.com/asimalyas/WebTasks/tree/main/RockSesiorFire",
    categories: ["Web Development"],
  },
  {
    id: 17,
    title: "Hepta",
    description:
      "Modern frontend travel website with elegant layouts, responsive design, and sections for destinations and services.",
    techStack: ["React", "HTML", "CSS", "JavaScript"],
    url: "https://github.com/asimalyas/React_projects/tree/main/hepta",
    categories: ["Web Development"],
  },
  {
    id: 18,
    title: "Heart Disease Prediction (Classification)",
    description:
      "Random Forest classification model for predicting heart disease using tabular data with data cleaning and feature engineering.",
    techStack: ["Python", "Flask", "HTML", "CSS", "JavaScript", "RandomForest"],
    url: "https://github.com/asimalyas/Python-Projects/tree/main",
    categories: ["Machine Learning", "Web Development"],
  },
  {
    id: 19,
    title: "MediConnect – Smart Healthcare Platform",
    description:
      "Enables patients to book medical assistants for home checkups. Doctors review data remotely with role-based dashboards.",
    techStack: ["TypeScript", "React", "Tailwind CSS", "Supabase", "RBAC"],
    url: "https://github.com/asimalyas/MediConnect",
    categories: ["Web Development"],
  },
];

const categories = [
  "All",
  "Web Development",
  "Machine Learning",
  "Game Development",
  "Data Structures",
  "Desktop Application",
];

const ProjectsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredProjects = allProjects.filter((project) => {
    const matchesCategory =
      activeCategory === "All" || project.categories.includes(activeCategory);
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
    show: { transition: { staggerChildren: 0.08 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section id="projects" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/8 via-purple-500/5 to-transparent rounded-full blur-[100px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            A showcase of my best work across different domains and technologies.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-8"
        >
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 pl-12 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground backdrop-blur-md border border-border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
        </motion.div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setVisibleCount(6);
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20"
                  : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 border border-border"
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  activeCategory === cat
                    ? "bg-white/20 text-white"
                    : "bg-background text-muted-foreground"
                }`}
              >
                {categoryCounts[cat] || 0}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Project Cards */}
        <motion.div
          key={`${activeCategory}-${searchQuery}`}
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.slice(0, visibleCount).map((project) => (
              <motion.div
                key={project.id}
                variants={cardVariants}
                layout
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative group"
              >
                <GlowCard
                  intensity="medium"
                  hoverScale={1.02}
                  className="relative h-full rounded-2xl overflow-hidden border border-border bg-card"
                >
                  <div className="p-6 flex flex-col h-full relative z-10">
                    <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-grow">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2.5 py-1 rounded-lg border border-border bg-muted/50 text-muted-foreground group-hover:border-indigo-500/30 group-hover:text-foreground transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <motion.a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 3 }}
                      className="inline-flex items-center gap-2 text-sm font-medium text-indigo-500 dark:text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors"
                    >
                      <span>View Project</span>
                      <ExternalLink className="w-4 h-4" />
                    </motion.a>
                  </div>
                </GlowCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No results */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No projects found matching your search.</p>
          </div>
        )}

        {/* Load More */}
        {visibleCount < filteredProjects.length && (
          <div className="flex justify-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition-all"
            >
              Load More Projects
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
