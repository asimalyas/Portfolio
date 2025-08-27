import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Cpu, Code2, Brain, Database, Rocket, Sparkles } from "lucide-react";

const roles = [
  "Web Development Wizard",
  "Machine Learning Innovator",
  "Game Development Creator",
  "Data Structures Strategist",
  "Desktop App Architect",
  "Deep Learning Explorer",
  "Problem Solver Extraordinaire",
  "Innovation Enthusiast",
  "AI & ML Visionary",
  "Code Alchemist",
  "Tech Trailblazer",
  "Creative Problem Solver"
];

const HeroSection: React.FC = () => {
  const [roleIndex, setRoleIndex] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setRoleIndex((i) => (i + 1) % roles.length), 2300);
    return () => clearInterval(id);
  }, []);

  const shimmerGradient = {
    backgroundImage: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899, #a855f7, #6366f1)",
    backgroundSize: "300% 100%",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: "shimmer 6s linear infinite",
  } as React.CSSProperties;

  const float = (delay = 0) => ({
    animate: {
      y: [0, -12, 0],
      rotate: [0, 6, 0],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut", delay },
    },
  });

  const particles = Array.from({ length: 12 }).map((_, i) => ({
    top: `${Math.random() * 90}%`,
    left: `${Math.random() * 90}%`,
    delay: i * 0.3,
  }));

  return (
    <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 py-20 overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-black">
      {/* Glowing blob */}
      <motion.div
        className="pointer-events-none absolute -z-10 w-[900px] h-[900px] rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 blur-3xl"
        initial={{ scale: 0.7, opacity: 0.3, x: "-50%", y: "-50%" }}
        animate={{ scale: 1, opacity: 0.55 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{ top: "50%", left: "50%" }}
      />

      {/* Grid background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]
        [background-image:linear-gradient(to_right,rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.15)_1px,transparent_1px)]
        [background-size:28px_28px]"
      />

      {/* Sparkle particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute text-indigo-300/70"
          style={{ top: p.top, left: p.left }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -8, 0] }}
          transition={{ delay: p.delay, duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles size={14} />
        </motion.div>
      ))}

      {/* Floating icons */}
      <motion.div className="absolute top-24 left-10 text-cyan-300/80" {...float(0.2)}>
        <Code2 size={44} />
      </motion.div>
      <motion.div className="absolute top-28 right-12 text-emerald-300/80" {...float(0.5)}>
        <Cpu size={48} />
      </motion.div>
      <motion.div className="absolute bottom-32 left-20 text-fuchsia-300/80" {...float(0.8)}>
        <Brain size={46} />
      </motion.div>
      <motion.div className="absolute bottom-28 right-24 text-amber-300/80" {...float(1.1)}>
        <Database size={46} />
      </motion.div>
      <motion.div className="absolute top-1/2 right-1/4 text-pink-300/80" {...float(1.4)}>
        <Rocket size={42} />
      </motion.div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="mt-8 md:mt-12 flex flex-col-reverse md:flex-row items-center justify-center gap-8">
          {/* Text content */}
          <div className="flex-1 text-center md:text-left">
            <motion.h1
              className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              Hi, I’m <span style={shimmerGradient}>Asim Alyas Rathore</span>
            </motion.h1>

            <div className="h-10 md:h-12 mt-3 md:mt-5 flex items-center justify-center md:justify-start">
              <AnimatePresence mode="wait">
                <motion.span
                  key={roles[roleIndex]}
                  className="text-xl md:text-2xl font-semibold text-gray-200"
                  initial={{ opacity: 0, y: 18, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -18, scale: 0.95 }}
                  transition={{ duration: 0.55 }}
                >
                  {roles[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </div>

            <motion.p
              className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto md:mx-0 mt-4 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            >
              I create modern, scalable, and intelligent digital products—blending sleek frontend
              design, powerful APIs, and advanced machine learning.
            </motion.p>

            {/* CTA button */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
            >
              <a
                href="#projects"
                className="group relative inline-flex items-center gap-2 px-7 py-3 rounded-2xl
                bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-semibold
                shadow-lg shadow-purple-500/30 hover:scale-110 active:scale-95 transition-transform duration-300"
              >
                <span>Explore My Projects</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-white/10 group-hover:ring-white/20 transition" />
              </a>
            </motion.div>
          </div>

          {/* Picture */}
         
<motion.div
  className="flex-1 flex justify-center md:justify-end cursor-pointer rounded-full overflow-hidden"
  animate={{
    y: [0, -12, 0],        // vertical float
    rotate: [0, 3, -3, 0],  // gentle rotation
    scale: [1, 1.03, 0.97, 1], // subtle breathing
    
  }}
  transition={{
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut"
  }}
  whileHover={{
    scale: 1.08, // slightly bigger on hover
    
  }}
>
  <img
    src="/imagesAchivemnts/profilePic.jpg" // your picture
    alt="Asim Alyas Rathore"
    className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover border-4 border-indigo-500"
  />
</motion.div>

        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
