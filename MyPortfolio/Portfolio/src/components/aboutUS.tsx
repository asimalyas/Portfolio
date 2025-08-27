"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Code, Database, Brain, Rocket, Gamepad, Monitor } from "lucide-react";

export default function aboutUS() {
  const skills = [
    {
      icon: <Monitor className="w-10 h-10 text-blue-500" />,
      title: "Web Development",
      desc: "Building responsive and modern websites using React, JavaScript, HTML, CSS, and integrating backend APIs efficiently.",
    },
    {
      icon: <Gamepad className="w-10 h-10 text-yellow-400" />,
      title: "Game Development",
      desc: "Creating immersive 2D/3D games using Unity & C#, with interactive mechanics and smooth gameplay experiences.",
    },
    {
      icon: <Brain className="w-10 h-10 text-purple-500" />,
      title: "Machine Learning",
      desc: "Exploring Python & ML to implement intelligent systems and predictive models for real-world applications.",
    },
    {
      icon: <Database className="w-10 h-10 text-green-500" />,
      title: "Database Expertise",
      desc: "Hands-on experience in SQL & MS SQL Server for secure, scalable, and efficient data management.",
    },
    {
      icon: <Code className="w-10 h-10 text-orange-500" />,
      title: "Data Structures & Algorithms",
      desc: "Strong understanding of core data structures and algorithms for optimized, clean, and efficient solutions.",
    },
    {
      icon: <Rocket className="w-10 h-10 text-red-500" />,
      title: "Problem Solving",
      desc: "Passionate about tackling challenges with logical thinking and optimized solutions.",
    },
  ];

  return (
    <section className="w-full py-20 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white relative overflow-hidden">
      {/* Subtle glow background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_60%)]"></div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          About <span className="text-blue-500">Me</span>
        </motion.h2>

        {/* Skills Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
            >
              <Card className="group relative bg-gray-800/80 border border-gray-700 rounded-2xl shadow-lg overflow-hidden hover:shadow-blue-500/20 transition-all duration-300">
                {/* Glow Border Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-pink-500/40 blur-xl"></div>

                <CardContent className="relative p-6 flex flex-col items-center text-center z-10">
                  <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {skill.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{skill.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{skill.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
