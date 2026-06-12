# Asim Alyas Rathore Portfolio

A modern personal portfolio for Asim Alyas Rathore, built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, and shadcn-style UI components.

## What It Includes

- Responsive single-page portfolio layout
- Hero, skills, project showcase, education, achievements, and contact sections
- Dark and light theme support
- Animated project cards, achievement gallery, tech marquee, and particle background
- EmailJS-powered contact form with mail app fallback
- React Router fallback page for unknown routes

## Tech Stack

- React 18
- Vite
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide React
- Sonner
- EmailJS

## Project Structure

- `src/pages/Index.tsx` - Main portfolio page and section layout
- `src/components/` - Portfolio sections and shared UI behavior
- `src/components/ui/` - shadcn-style reusable UI components
- `src/index.css` - Tailwind setup, theme tokens, and global styles
- `public/imagesAchivemnts/` - Portfolio images, certificates, and profile assets

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Notes

The production portfolio is a static Vite build. Contact form delivery depends on the configured EmailJS service and template.
