import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Database, Brain, Rocket, Gamepad, Monitor } from "lucide-react";

const skills = [
  {
    icon: <Monitor className="w-9 h-9" />,
    color: "text-blue-500",
    title: "Web Development",
    desc: "Building responsive and modern websites using React, TypeScript, and integrating backend APIs efficiently.",
  },
  {
    icon: <Gamepad className="w-9 h-9" />,
    color: "text-amber-500",
    title: "Game Development",
    desc: "Creating immersive 2D/3D games using Unity & C#, with interactive mechanics and smooth gameplay.",
  },
  {
    icon: <Brain className="w-9 h-9" />,
    color: "text-purple-500",
    title: "Machine Learning",
    desc: "Implementing intelligent systems and predictive models using Python, TensorFlow, and scikit-learn.",
  },
  {
    icon: <Database className="w-9 h-9" />,
    color: "text-emerald-500",
    title: "Database Expertise",
    desc: "Hands-on experience in SQL & MS SQL Server for secure, scalable, and efficient data management.",
  },
  {
    icon: <Code className="w-9 h-9" />,
    color: "text-orange-500",
    title: "Data Structures & Algorithms",
    desc: "Strong understanding of core DSA concepts for optimized, clean, and efficient solutions.",
  },
  {
    icon: <Rocket className="w-9 h-9" />,
    color: "text-rose-500",
    title: "Problem Solving",
    desc: "Passionate about tackling challenges with logical thinking and optimized solutions.",
  },
];

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
            I'm a passionate Software Engineering student at COMSATS University with expertise
            in full-stack development, machine learning, and building scalable applications.
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
                    {skill.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">{skill.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{skill.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
