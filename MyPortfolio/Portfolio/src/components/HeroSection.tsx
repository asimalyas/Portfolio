import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Cpu, Code2, Brain, Database, Rocket, Sparkles } from "lucide-react";
import { usePortfolioData } from "@/hooks/usePortfolioData";


const HeroSection: React.FC = () => {
  const { data: portfolioData } = usePortfolioData();
  const roles = portfolioData.profile.roles;
  const [roleIndex, setRoleIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % Math.max(roles.length, 1)), 2500);
    return () => clearInterval(id);
  }, [roles.length]);

  const float = (delay = 0) => ({
    animate: {
      y: [0, -12, 0],
      rotate: [0, 6, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
    },
  });

  const particles = Array.from({ length: 10 }).map((_, i) => ({
    top: `${Math.random() * 90}%`,
    left: `${Math.random() * 90}%`,
    delay: i * 0.35,
  }));

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 py-20 overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Glowing blob */}
      <motion.div
        className="pointer-events-none absolute -z-10 w-[700px] h-[700px] md:w-[900px] md:h-[900px] rounded-full bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/30 dark:from-indigo-600/20 dark:via-purple-600/20 dark:to-pink-600/20 blur-[120px]"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      />

      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] dark:opacity-[0.07]
        [background-image:linear-gradient(to_right,hsl(var(--foreground)/.15)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--foreground)/.15)_1px,transparent_1px)]
        [background-size:28px_28px]"
      />

      {/* Sparkle particles — dark mode only */}
      <div className="hidden dark:block">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="absolute text-indigo-400/50"
            style={{ top: p.top, left: p.left }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: [0.2, 0.8, 0.2], y: [0, -8, 0] }}
            transition={{ delay: p.delay, duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkles size={14} />
          </motion.div>
        ))}
      </div>

      {/* Floating icons */}
      <motion.div className="absolute top-24 left-10 text-indigo-400/40 dark:text-cyan-300/50 hidden md:block" {...float(0.2)}>
        <Code2 size={40} />
      </motion.div>
      <motion.div className="absolute top-28 right-12 text-emerald-400/40 dark:text-emerald-300/50 hidden md:block" {...float(0.5)}>
        <Cpu size={44} />
      </motion.div>
      <motion.div className="absolute bottom-32 left-20 text-purple-400/40 dark:text-fuchsia-300/50 hidden md:block" {...float(0.8)}>
        <Brain size={42} />
      </motion.div>
      <motion.div className="absolute bottom-28 right-24 text-amber-400/40 dark:text-amber-300/50 hidden md:block" {...float(1.1)}>
        <Database size={42} />
      </motion.div>
      <motion.div className="absolute top-1/2 right-1/4 text-pink-400/40 dark:text-pink-300/50 hidden md:block" {...float(1.4)}>
        <Rocket size={38} />
      </motion.div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mt-8 md:mt-12 flex flex-col-reverse md:flex-row items-center justify-center gap-10">
          {/* Text content */}
          <div className="flex-1 text-center md:text-left">
            <motion.p
              className="text-sm md:text-base font-medium text-indigo-500 dark:text-indigo-400 mb-3 tracking-widest uppercase"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Welcome to my portfolio
            </motion.p>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
            >
              Hi, I'm{" "}
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {portfolioData.profile.shortName}
              </span>
            </motion.h1>

            <div className="h-10 md:h-12 mt-3 md:mt-5 flex items-center justify-center md:justify-start">
              <AnimatePresence mode="wait">
                <motion.span
                  key={roles[roleIndex] || portfolioData.profile.headline}
                  className="text-lg md:text-2xl font-semibold text-muted-foreground"
                  initial={{ opacity: 0, y: 18, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -18, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                >
                  {roles[roleIndex] || portfolioData.profile.headline}
                </motion.span>
              </AnimatePresence>
            </div>

            <motion.p
              className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto md:mx-0 mt-4 mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            >
              {portfolioData.profile.summary}
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7, ease: "easeOut" }}
            >
              <a
                href="#projects"
                className="group relative inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl
                bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold
                shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span>Explore My Projects</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl
                border border-border hover:border-indigo-500/50
                text-foreground font-semibold
                hover:bg-muted/50 transition-all duration-300"
              >
                Get In Touch
              </a>
            </motion.div>
          </div>

          {/* Profile Picture */}
          <motion.div
            className="flex-shrink-0 flex justify-center md:justify-end"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              {/* Glow ring behind image */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-xl opacity-30 scale-110" />
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 overflow-hidden rounded-full border-4 border-indigo-500/50 shadow-2xl">
                <img
                  src={portfolioData.profile.avatar}
                  alt={`${portfolioData.profile.name} - Software Engineer`}
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2"
        >
          <motion.div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
