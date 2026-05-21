import React from "react";
import { motion } from "framer-motion";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  delayIndex?: number;
  intensity?: "low" | "medium" | "high";
}

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className = "",
  hoverScale = 1.02,
  delayIndex = 0,
  intensity = "medium",
}) => {
  return (
    <motion.div
      className={`glow-card ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delayIndex * 0.1, ease: "easeOut" }}
      whileHover={{
        scale: hoverScale,
        borderColor: "hsl(var(--primary) / 0.4)",
      }}
    >
      <div className="relative z-10 h-full">{children}</div>
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </motion.div>
  );
};

export default GlowCard;
