"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface Achievement {
  id: number;
  title: string;
  description: string;
  image: string;
  category: ("Studies" | "Projects" | "Activities" | "Sports")[];
  link?: string;
}

const achievements: Achievement[] = [
  {
    id: 1,
    title: "Certificate of Excellence",
    description:
      "Won the Inter-Subject Project Competition in the subject of Database at COMSATS University Islamabad, Abbottabad Campus, on 10th January 2025.",
    image: "/imagesAchivemnts/DatabaseUniWinnerProject.jpg",
    category: ["Studies","Projects"]
  },
  {
    id: 2,
    title: "Campus Honor Roll Award",
    description:
      "Recognized in the Campus Honor Roll at COMSATS University Islamabad, Abbottabad Campus, for outstanding academic achievement by securing a perfect SGPA of 4.0/4.0 in the Fifth Semester (Fall 2024 Session).",
    image: "/imagesAchivemnts/5thSemResult.jpg",
    category: ["Studies"],
  },
];

export default function AchievementsSection() {
  const [filter, setFilter] = useState<"All" | "Studies" | "Projects" | "Activities" | "Sports">("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredAchievements =
    filter === "All"
      ? achievements
      : achievements.filter((ach) => ach.category.includes(filter));

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-black/90 to-gray-950 text-white relative overflow-hidden">
      {/* Neon floating glow */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,255,255,0.1),transparent_50%)]"
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 7, repeat: Infinity }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: false, amount: 0.3 }}
          className="text-4xl md:text-5xl font-bold text-center mb-14 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 text-transparent bg-clip-text"
        >
          My Achievements
        </motion.h2>

        {/* Filter buttons */}
        <div className="flex justify-center gap-4 mb-10 flex-wrap">
          {["All", "Studies", "Projects", "Activities", "Sports"].map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                filter === cat
                  ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_15px_cyan] hover:shadow-[0_0_25px_cyan]"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700/80"
              }`}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Achievement Cards */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {filteredAchievements.map((ach, index) => (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, y: 90, scale: 0.92 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: "easeOut",
              }}
              viewport={{ once: false, amount: 0.3 }}
              whileHover={{ scale: 1.06, rotate: 1 }}
              className="group"
            >
              <Card
                className="overflow-hidden shadow-2xl rounded-2xl bg-gradient-to-br from-gray-900 to-black border border-gray-700 hover:shadow-cyan-500/40 transition-all duration-500"
                onClick={() => setSelectedImage(ach.image)}
              >
                <div className="relative w-full h-56 overflow-hidden cursor-pointer">
                  <motion.img
                    src={ach.image}
                    alt={ach.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-70 group-hover:opacity-50 transition-opacity"></div>
                </div>

                <CardContent className="p-6">
                  <motion.h3
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    viewport={{ once: false, amount: 0.3 }}
                    className="text-2xl font-semibold mb-3 group-hover:text-cyan-400 transition-colors"
                  >
                    {ach.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.9, delay: 0.4 }}
                    viewport={{ once: false, amount: 0.3 }}
                    className="text-gray-400 text-sm leading-relaxed"
                  >
                    {ach.description}
                  </motion.p>

                  <p className="mt-2 text-xs text-gray-500 italic">
                    {ach.category.join(", ")}
                  </p>

                  {ach.link && (
                    <a
                      href={ach.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 px-4 py-2 text-sm font-semibold bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg shadow-md hover:scale-105 transform transition"
                      onClick={(e) => e.stopPropagation()}
                    >
                      🔗 View on GitHub
                    </a>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Image Viewer */}
      {selectedImage && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="relative w-[80%] h-[80%] bg-gradient-to-br from-gray-950 via-gray-900 to-black 
                 rounded-2xl shadow-2xl flex items-center justify-center p-6 border border-gray-700"
            initial={{ scale: 0.85, opacity: 0, y: 60 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0, y: 60 }}
            transition={{ type: "spring", stiffness: 120, damping: 15 }}
          >
            <motion.button
              className="absolute top-4 right-4 text-white bg-red-700/90 px-4 py-2 rounded-xl 
                   shadow-lg hover:bg-red-800 hover:scale-105 transition transform"
              whileHover={{ rotate: 3, scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedImage(null)}
            >
              ✕ Close
            </motion.button>

            <motion.img
              src={selectedImage}
              alt="Certificate"
              className="max-w-full max-h-full object-contain rounded-xl shadow-cyan-500/30"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              whileHover={{ scale: 1.03 }}
            />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
