import React from "react";
import { Code2, ServerCrash, Paintbrush, Database, Cpu, Container, Terminal, Github } from "lucide-react";

type TechItem = { name: string; icon?: React.ReactElement };

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
  { name: "TypeScript", icon: <Code2 /> },
  { name: "Git", icon: <Github /> },
];

interface TechMarqueeProps {
  items?: TechItem[];
  speed?: number;
  className?: string;
}

export default function TechMarquee({ items = DEFAULT_ITEMS, speed = 40, className = "" }: TechMarqueeProps) {
  const duplicated = [...items, ...items];

  return (
    <div className={`w-full flex flex-col gap-3 py-8 ${className}`} aria-hidden>
      <div className="marquee" style={{ "--marquee-duration": `${speed}s` } as React.CSSProperties}>
        <div className="marquee__inner marquee--ltr">
          {duplicated.map((tech, idx) => (
            <div key={`top-${tech.name}-${idx}`} className="marquee__item" title={tech.name}>
              <span className="marquee__icon">{tech.icon ? React.cloneElement(tech.icon, { className: "w-5 h-5" }) : "*"}</span>
              <span className="marquee__name">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="marquee" style={{ "--marquee-duration": `${speed}s` } as React.CSSProperties}>
        <div className="marquee__inner marquee--rtl">
          {duplicated.map((tech, idx) => (
            <div key={`btm-${tech.name}-${idx}`} className="marquee__item" title={tech.name}>
              <span className="marquee__icon">{tech.icon ? React.cloneElement(tech.icon, { className: "w-5 h-5" }) : "*"}</span>
              <span className="marquee__name">{tech.name}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .marquee { overflow: hidden; position: relative; width: 100%; }
        .marquee__inner { display: flex; gap: 0.75rem; align-items: center; width: max-content; will-change: transform; }
        .marquee--ltr { animation: m-ltr var(--marquee-duration, 20s) linear infinite; }
        .marquee--rtl { animation: m-rtl var(--marquee-duration, 20s) linear infinite; }
        .marquee__item {
          display: inline-flex; align-items: center; gap: 0.6rem;
          padding: 0.5rem 1rem; border-radius: 9999px;
          background: var(--marquee-item-bg); border: 1px solid var(--marquee-item-border);
          color: var(--marquee-text); font-weight: 600; font-size: 0.95rem;
          backdrop-filter: blur(6px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: transform .25s ease, box-shadow .25s ease;
          white-space: nowrap;
        }
        .marquee__item:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 12px 30px hsl(var(--primary) / 0.15);
        }
        .marquee__icon { display: inline-flex; align-items: center; justify-content: center; }
        @keyframes m-ltr { 0% { transform: translateX(-50%); } 100% { transform: translateX(0%); } }
        @keyframes m-rtl { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        @media (max-width: 640px) { .marquee__item { padding: 0.35rem 0.7rem; font-size: 0.85rem; } }
        @media (prefers-reduced-motion: reduce) { .marquee__inner { animation: none !important; } }
      `}</style>
    </div>
  );
}
