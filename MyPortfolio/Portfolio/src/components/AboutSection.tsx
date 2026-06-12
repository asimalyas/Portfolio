import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Database, Brain, Rocket, Gamepad, Monitor } from "lucide-react";
import { portfolioData, type SkillIcon } from "@/data/portfolio";

const skills = portfolioData.skills;
const skillIcons: Record<SkillIcon, JSX.Element> = {
  monitor: <Monitor className="w-9 h-9" />,
  gamepad: <Gamepad className="w-9 h-9" />,
  brain: <Brain className="w-9 h-9" />,
  database: <Database className="w-9 h-9" />,
  code: <Code className="w-9 h-9" />,
  rocket: <Rocket className="w-9 h-9" />,
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function AboutSection() {
  return (
    <section className="w-full py-24 bg-background relative overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,hsl(var(--primary)/0.06),transparent_60%)]" />

      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            About <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">Me</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            {portfolioData.profile.about}
          </p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {skills.map((skill, index) => (
            <motion.div key={index} variants={cardVariants}>
              <Card className="group relative bg-card border border-border rounded-2xl shadow-sm overflow-hidden hover:shadow-lg hover:shadow-primary/5 transition-all duration-500 h-full">
                {/* Glow border on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-xl" />

                <CardContent className="relative p-6 flex flex-col items-center text-center z-10">
                  <div className={`mb-4 ${skill.color} transform group-hover:scale-110 transition-transform duration-300`}>
                    {skillIcons[skill.icon]}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{skill.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{skill.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
