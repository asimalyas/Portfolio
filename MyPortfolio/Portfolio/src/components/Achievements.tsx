import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { X } from "lucide-react";

interface Achievement {
  id: number;
  title: string;
  description: string;
  image: string;
  category: ("Studies" | "Projects" | "Activities" | "Sports" | "Skills")[];
}

const achievements: Achievement[] = [
  { id: 1, title: "Certificate of Excellence in Database", description: "Won the Inter-Subject Project Competition in Database at COMSATS University, January 2025.", image: "/imagesAchivemnts/DatabaseUniWinnerProject.jpg", category: ["Studies", "Projects"] },
  { id: 2, title: "Campus Honor Roll — 5th Semester", description: "Perfect SGPA of 4.0/4.0 in Fall 2024 at COMSATS University Islamabad.", image: "/imagesAchivemnts/5thSemResult.jpg", category: ["Studies"] },
  { id: 3, title: "Communication Event Certificate", description: "Awarded for organizing the Communication Event, December 2022.", image: "/imagesAchivemnts/CumunicationEventCertificate.jpg", category: ["Activities"] },
  { id: 4, title: "Campus Honor Roll — 3rd Semester", description: "Perfect SGPA of 4.0/4.0 in Fall 2023 Session.", image: "/imagesAchivemnts/3rdSem.png", category: ["Studies"] },
  { id: 5, title: "Excellence in Computer Network", description: "Runner up in Inter-Subject Project Competition, January 2025.", image: "/imagesAchivemnts/CNProject.jpg", category: ["Studies", "Projects"] },
  { id: 6, title: "CCNA: Introduction to Networks", description: "Completed through Cisco Networking Academy, September 2025.", image: "/imagesAchivemnts/networking.jpg", category: ["Studies", "Skills"] },
  { id: 7, title: "Convocation 2023 Appreciation", description: "Ushers team in the 22nd & 23rd Convocation.", image: "/imagesAchivemnts/convocation.jpg", category: ["Activities"] },
  { id: 8, title: "Deep Learning Workshop", description: "4-day workshop by Dept. of Electrical Engineering, November 2025.", image: "/imagesAchivemnts/DL workshop.jpg", category: ["Studies", "Skills", "Activities"] },
  { id: 9, title: "Deep Learning & NLP Workshop", description: "Robotics Club workshop on DL and NLP at COMSATS.", image: "/imagesAchivemnts/nlp workshop rebotics clu.png", category: ["Studies", "Skills", "Activities"] },
  { id: 10, title: "Campus Honor Roll — 6th Semester", description: "Perfect CGPA 4.0/4.0 in BS Software Engineering Semester 6.", image: "/imagesAchivemnts/semester 6th awarded.png", category: ["Studies"] },
];

type FilterCat = "All" | "Studies" | "Projects" | "Activities" | "Sports" | "Skills";
const categories: FilterCat[] = ["All", "Studies", "Projects", "Activities", "Sports", "Skills"];

export default function AchievementsSection() {
  const [filter, setFilter] = useState<FilterCat>("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  const getCount = (cat: FilterCat) => {
    if (cat === "All") return achievements.length;
    return achievements.filter((a) => a.category.includes(cat as any)).length;
  };

  const filtered = filter === "All" ? achievements : achievements.filter((a) => a.category.includes(filter as any));
  const visible = filtered.slice(0, visibleCount);

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.05),transparent_50%)]" />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }} className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">My Achievements</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">Certificates, honors, and milestones from my academic journey.</p>
        </motion.div>

        <div className="flex justify-center gap-3 mb-12 flex-wrap">
          {categories.map((cat) => (
            <motion.button key={cat} onClick={() => { setFilter(cat); setVisibleCount(6); }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${filter === cat ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20" : "bg-muted text-muted-foreground hover:text-foreground border border-border"}`}>
              <span>{cat}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${filter === cat ? "bg-white/20" : "bg-background text-muted-foreground"}`}>{getCount(cat)}</span>
            </motion.button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visible.map((ach, i) => (
            <motion.div key={ach.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.08 }} viewport={{ once: true }} whileHover={{ y: -4 }} className="group cursor-pointer" onClick={() => setSelectedImage(ach.image)}>
              <Card className="overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-500 h-full">
                <div className="relative w-full h-52 overflow-hidden">
                  <img src={ach.image} alt={ach.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>
                <CardContent className="p-5">
                  <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors leading-snug">{ach.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-3">{ach.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {ach.category.map((c) => (<span key={c} className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border">{c}</span>))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {visibleCount < filtered.length && (
          <div className="flex justify-center mt-12">
            <motion.button onClick={() => setVisibleCount((p) => p + 6)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-3 rounded-xl font-medium bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all">Show More</motion.button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedImage(null)}>
            <motion.div className="relative max-w-4xl w-full max-h-[85vh] bg-card rounded-2xl shadow-2xl flex items-center justify-center p-4 border border-border" initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }} onClick={(e) => e.stopPropagation()}>
              <button className="absolute top-3 right-3 w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors z-10" onClick={() => setSelectedImage(null)} aria-label="Close"><X className="w-5 h-5" /></button>
              <img src={selectedImage} alt="Achievement certificate" className="max-w-full max-h-[75vh] object-contain rounded-xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
