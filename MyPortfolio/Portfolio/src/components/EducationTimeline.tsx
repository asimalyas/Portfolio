import React from "react";
import { motion } from "framer-motion";
import { GraduationCap, Calendar, Award } from "lucide-react";
import { usePortfolioData } from "@/hooks/usePortfolioData";

const EducationTimeline: React.FC = () => {
  const { data: portfolioData } = usePortfolioData();
  const educationData = portfolioData.education;

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-background">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/8 via-purple-500/5 to-transparent rounded-full blur-[100px]" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Education Journey
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            My academic path and achievements along the way.
          </p>
        </motion.div>

        <div className="space-y-8">
          {educationData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
            >
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/30 transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-72 h-48 md:h-auto overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.institution}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                        <GraduationCap className="h-12 w-12" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-card/80 hidden md:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent md:hidden" />
                    <div className="absolute top-3 left-3 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.years}
                    </div>
                  </div>

                  <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-indigo-500" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                        {item.degree}
                      </h3>
                    </div>

                    <p className="text-muted-foreground mb-3 text-base">{item.institution}</p>

                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 w-fit">
                      <Award className="w-4 h-4 text-indigo-500" />
                      <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        {item.grade}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationTimeline;