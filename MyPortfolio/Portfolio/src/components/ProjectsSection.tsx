import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ExternalLink } from "lucide-react";
import GlowCard from "./GlowCard";
import { portfolioData, type ProjectCategory } from "../../shared/portfolio.js";

type FilterCategory = "All" | ProjectCategory;

const allProjects = portfolioData.projects;
const categories = portfolioData.projectCategories as readonly FilterCategory[];

const ProjectsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("All");
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

  const categoryCounts: Record<FilterCategory, number> = {
    All: allProjects.length,
    "Web Development": allProjects.filter((p) => p.categories.includes("Web Development")).length,
    "Machine Learning": allProjects.filter((p) => p.categories.includes("Machine Learning")).length,
    "Game Development": allProjects.filter((p) => p.categories.includes("Game Development")).length,
    "Data Structures": allProjects.filter((p) => p.categories.includes("Data Structures")).length,
    "Desktop Application": allProjects.filter((p) => p.categories.includes("Desktop Application")).length,
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
                      {project.techStack.map((tech) => (
                        <span
                          key={tech}
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

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No projects found matching your search.</p>
          </div>
        )}

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
