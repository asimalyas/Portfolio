import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import TechMarquee from '@/components/TechMarquee';
import ProjectsSection from '@/components/ProjectsSection';
import EducationTimeline from '@/components/EducationTimeline';
import ContactSection from '@/components/ContactSection';
import AboutSection from '@/components/AboutSection';
import Achievements from '@/components/Achievements';
import ThemeToggle from '@/components/ThemeToggle';
import ScrollToTop from '@/components/ScrollToTop';
import ParticleBackground from '@/components/ParticleBackground';
import { portfolioData } from '@/data/portfolio';
import RecruiterAssistant from '@/components/RecruiterAssistant';

const navLinks = [
  { name: 'About', href: '#aboutus' },
  { name: 'Projects', href: '#projects' },
  { name: 'Education', href: '#education' },
  { name: 'Achievements', href: '#achievements' },
  { name: 'Contact', href: '#contact' },
];

const Index: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-background min-h-screen relative scroll-smooth"
      >
        {/* Particle network background */}
        <ParticleBackground />

        {/* ═══════════ HEADER ═══════════ */}
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            {/* Logo */}
            <motion.a
              href="#hero"
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex items-center gap-3 text-lg font-bold cursor-pointer group"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <motion.img
                src={portfolioData.profile.logoAvatar}
                alt={portfolioData.profile.name}
                className="w-9 h-9 rounded-full border-2 border-indigo-500 shadow-md object-cover"
                whileHover={{ scale: 1.1 }}
              />
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                {portfolioData.profile.brandName}
              </span>
            </motion.a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className="relative px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-purple-500 group-hover:w-3/4 transition-all duration-300 rounded-full" />
                </motion.a>
              ))}
              <motion.a
                href={portfolioData.links.resume}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="ml-2 px-4 py-1.5 text-sm font-medium rounded-lg border border-indigo-500/50 text-indigo-500 dark:text-indigo-400 hover:bg-indigo-500/10 transition-all duration-300"
              >
                Resume
              </motion.a>
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="ml-2"
              >
                <ThemeToggle />
              </motion.div>
            </nav>

            {/* Mobile: theme toggle + hamburger */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <motion.button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.nav
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-t border-border/50"
              >
                <div className="px-4 py-4 space-y-1">
                  {navLinks.map((link, i) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      onClick={closeMobile}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="block px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors font-medium"
                    >
                      {link.name}
                    </motion.a>
                  ))}
                  <a
                    href={portfolioData.links.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={closeMobile}
                    className="block px-4 py-3 mt-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-center font-medium"
                  >
                    📄 Resume
                  </a>
                </div>
              </motion.nav>
            )}
          </AnimatePresence>
        </motion.header>

        {/* ═══════════ MAIN CONTENT ═══════════ */}
        <main className="pt-16 relative z-10">
          <section id="hero">
            <HeroSection />
          </section>

          <section id="techmarquee">
            <TechMarquee />
          </section>

          <section id="aboutus" className="scroll-mt-24">
            <AboutSection />
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

        {/* ═══════════ FOOTER ═══════════ */}
        <footer className="py-10 px-4 border-t border-border/50 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3">
                <img
                  src={portfolioData.profile.logoAvatar}
                  alt={portfolioData.profile.name}
                  className="w-8 h-8 rounded-full border-2 border-indigo-500 object-cover"
                />
                <span className="font-semibold text-sm bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
                  {portfolioData.profile.brandName}
                </span>
              </div>

              <nav className="flex flex-wrap justify-center gap-4">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>

              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} {portfolioData.profile.name}
              </p>
            </div>
          </div>
        </footer>

        {/* Scroll to top */}
        <ScrollToTop />
        <RecruiterAssistant />
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;
