// components/TechMarquee.tsx
import React from "react";
import { Code2, ServerCrash, Paintbrush, Database, Cpu, Container, Terminal, Github } from "lucide-react";

type TechItem = {
  name: string;
  icon?: React.ReactElement;
};

interface TechMarqueeProps {
  items?: TechItem[];
  speed?: number;          // seconds for a full loop
  className?: string;
}

const DEFAULT_ITEMS: TechItem[] = [
  { name: "React", icon: <Code2 /> },
  { name: "Node.js", icon: <ServerCrash /> },
  { name: "JavaScript", icon: <Paintbrush /> },
  { name: "MySQL", icon: <Database /> },
  { name: "C", icon: <Cpu /> },
  { name: "Unity", icon: <Container /> },
  { name: "C#", icon: <Cpu /> },
  { name: "Java", icon: <Cpu /> },
  { name: "Python", icon: <Terminal /> },
  { name: "MongoDB", icon: <Database /> },
  { name: "ML", icon: <Github /> },
];

export default function TechMarquee({
  items = DEFAULT_ITEMS,
  speed = 50,
  className = "",
}: TechMarqueeProps) {
  const duplicated = [...items, ...items];

  const style: React.CSSProperties = {
    ["--marquee-duration" as any]: `${speed}s`,
  };

  return (
    <div className={`w-full flex flex-col gap-3 ${className}`} aria-hidden>
      {/* Top Marquee - Left to Right */}
      <div className="marquee marquee--ltr" style={style}>
        <div className="marquee__inner">
          {duplicated.map((tech, idx) => (
            <div key={`top-${tech.name}-${idx}`} className="marquee__item" title={tech.name}>
              <span className="marquee__icon" aria-hidden>
                {tech.icon ? React.cloneElement(tech.icon, { className: "w-5 h-5" }) : "•"}
              </span>
              <span className="marquee__name">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Marquee - Right to Left */}
      <div className="marquee marquee--rtl" style={style}>
        <div className="marquee__inner">
          {duplicated.map((tech, idx) => (
            <div key={`bottom-${tech.name}-${idx}`} className="marquee__item" title={tech.name}>
              <span className="marquee__icon" aria-hidden>
                {tech.icon ? React.cloneElement(tech.icon, { className: "w-5 h-5" }) : "•"}
              </span>
              <span className="marquee__name">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .marquee {
          overflow: hidden;
          position: relative;
          width: 100%;
        }

        .marquee__inner {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          width: max-content;
          animation: marquee var(--marquee-duration, 20s) linear infinite;
          will-change: transform;
        }

        .marquee--ltr .marquee__inner {
          animation-name: marquee-ltr;
        }

        .marquee--rtl .marquee__inner {
          animation-name: marquee-rtl;
        }

        .marquee__item {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.04);
          color: #fff;
          font-weight: 600;
          font-size: 0.95rem;
          backdrop-filter: blur(6px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.35);
          transition: transform .25s ease, box-shadow .25s ease, background .25s ease;
          white-space: nowrap;
        }

        .marquee__item:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 18px 40px rgba(99,102,241,0.25);
          background: linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
        }

        .marquee__icon { display: inline-flex; align-items:center; justify-content:center; }
        .marquee__name { display:inline-block; }

        @keyframes marquee-ltr {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }

        @keyframes marquee-rtl {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        @media (max-width: 640px) {
          .marquee__item { padding: 0.35rem 0.7rem; font-size: 0.85rem; }
        }
      `}</style>
    </div>
  );
}
