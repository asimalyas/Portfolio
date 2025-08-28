import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import TechMarquee from '@/components/TechMarquee';
import ProjectsSection from '@/components/ProjectsSection';
import EducationTimeline from '@/components/EducationTimeline';
import CompetitiveStats from '@/components/CompetitiveStats';
import BlogSection from '@/components/BlogSection';
import ContactSection from '@/components/ContactSection';
import AboutUS from '@/components/aboutUS';
import Achievements from '@/components/Achievements';

const Index: React.FC = () => {
  const navLinks = [
    { name: 'Projects', href: '#projects' },
    { name: 'My Achievements', href: '#achievements' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-dark min-h-screen relative scroll-smooth"
      >
        {/* Background light effects */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'mirror' }}
            className="absolute -top-[30vh] -left-[30vh] w-[80vh] h-[80vh] rounded-full bg-radial-glow-premium"
          />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'mirror', delay: 1 }}
            className="absolute top-[70vh] -right-[20vh] w-[50vh] h-[50vh] rounded-full bg-radial-glow-premium"
          />
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute w-[100px] h-[100px] rounded-full bg-white/5 blur-xl"
            style={{ top: '20vh', left: '30vw' }}
          />
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
            className="absolute w-[80px] h-[80px] rounded-full bg-white/5 blur-xl"
            style={{ top: '60vh', right: '25vw' }}
          />
        </div>

        {/* Header */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="fixed w-full top-0 z-50 bg-dark/80 backdrop-blur-md border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
         <motion.h1
  initial={{ x: -50, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.8 }}
  className="flex items-center text-xl font-bold relative cursor-pointer hover:text-indigo-400 transition-colors"
  onClick={() => {
    const hero = document.getElementById("hero");
    hero?.scrollIntoView({ behavior: "smooth" });
  }}
>
  {/* Profile picture to the left of the text */}
  <motion.img
    src="/imagesAchivemnts/profilePic.jpg"
    alt="Asim Alyas Rathore"
    className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-indigo-500 shadow-lg mr-3"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    whileHover={{ scale: 1.1, boxShadow: "0 0 10px rgba(165,180,252,0.8)" }}
  />
  Mr. Rathore
</motion.h1>



            <nav className="hidden md:block">
              <ul className="flex space-x-8 over:text-indigo-400 transition-colors">
                {navLinks.map((link, i) => (
                  <motion.li
                    key={i}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 * i }}
                  >
                    <a
                      href={link.href}
                      className="hover:text-white transition-colors relative group hover:text-indigo-400 transition-colors"
                    >
                      {link.name}
                      <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-white/50 group-hover:w-full transition-all duration-300"></span>
                    </a>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <a
                    href="https://1drv.ms/b/c/cacb8574e4143f96/ETP8JBAou7JLuLKfiEY20yoBQsxFmq4TGrtnV7Qr3ghakw?e=aawGx3"
                    className="cta-button-premium text-sm px-4 py-1"
                  >
                    Resume
                  </a>
                </motion.li>
              </ul>
            </nav>
          </div>
        </motion.header>

        {/* Main content */}
        <main className="pt-16 relative z-10">
          <section id="hero">
            <HeroSection />
          </section>

          <section id="techmarquee">
            <TechMarquee />
          </section>

          <section id="aboutus" className="scroll-mt-24">
            <AboutUS />
          </section>

          <section id="projects" className="scroll-mt-24">
            <ProjectsSection />
          </section>

          <section id="education" className="scroll-mt-24">
            <EducationTimeline />
          </section>

          <section id="achievements" className="scroll-mt-24">
            <Achievements />
          </section>

          <section id="contact" className="scroll-mt-24">
            <ContactSection />
          </section>
        </main>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-white/10 relative z-10 hover:text-indigo-400 transition-colors">
          <div className="max-w-7xl mx-auto text-center hover:text-indigo-400 transition-colors">
            <p className="text-white/60 hover:text-indigo-400 transition-colors">
              © {new Date().getFullYear()} Mr. Rathore. All rights reserved.
            </p>
          </div>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;
