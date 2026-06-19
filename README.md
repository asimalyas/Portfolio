# Muhammad Asim Ilyas Rathore - Developer Portfolio

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=111827)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animations-0055FF?style=for-the-badge&logo=framer&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Ready-000000?style=for-the-badge&logo=vercel&logoColor=white)

A modern, animated, AI-assisted personal portfolio built to present my software engineering journey, technical skills, featured projects, education, achievements, and contact information in a professional way.

The portfolio is designed for recruiters, clients, teachers, and collaborators who want to quickly understand what I build: web applications, machine learning systems, AI-powered tools, desktop apps, games, and problem-solving projects.

---

## Highlights

- Responsive single-page portfolio with smooth section navigation.
- Animated hero section, project cards, technology marquee, and achievement gallery.
- Dark and light theme support with persistent user preference.
- AI recruiter assistant powered by Gemini through a private serverless API route.
- Searchable and filterable featured projects by category.
- Project categories for Web Development, Machine Learning, Game Development, Data Structures, and Desktop Applications.
- Dedicated education timeline and achievement showcase.
- Contact section with EmailJS integration and mail fallback.
- Production-ready Vite build configured for Vercel deployment.

---

## Featured Sections

| Section | Purpose |
| --- | --- |
| Hero | Introduces Muhammad Asim Ilyas Rathore with roles, resume link, and primary calls to action. |
| Tech Marquee | Displays key technologies in a polished moving showcase. |
| About | Summarizes background, interests, and engineering focus. |
| Projects | Shows practical work across web, machine learning, AI, games, DSA, and desktop applications. |
| Education | Presents academic background and performance. |
| Achievements | Highlights certificates, awards, workshops, and university accomplishments. |
| Contact | Provides ways to connect through email, phone, resume, GitHub, and LinkedIn. |
| AI Assistant | Lets visitors ask about skills, projects, education, achievements, and contact details. |

---

## Featured Project: Entry Test Quiz

This portfolio includes **Entry Test Quiz** as a featured project under both **Web Development** and **Machine Learning**.

**Live App:** https://quiz-test-app-five.vercel.app/

Entry Test Quiz is an AI-powered practice platform for university entry tests. It supports manual MCQ paste, automatic MCQ formatting, PDF/image paper extraction, lecture slide to MCQ generation, timer modes, skipped questions, result review, retry flow, and an AI tutor chatbot.

**Tech used:** React, TypeScript, Vite, CSS, Gemini AI, PDF.js, Vercel, LocalStorage.

---

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- shadcn-style reusable UI components
- Radix UI primitives
- Lucide React icons
- React Router DOM
- Sonner toast notifications

### AI and Backend

- Gemini API for the recruiter assistant
- Vercel serverless API route at `api/chat.ts`
- Server-side environment variable for private API key access

### Communication and Deployment

- EmailJS for contact form handling
- Vercel for deployment
- Static production output through Vite

---

## Project Structure

```text
.
|-- api/
|   `-- chat.ts                  # Gemini-powered recruiter assistant endpoint
|-- public/
|   |-- imagesAchivemnts/        # Profile, education, and achievement images
|   |-- favicon.ico
|   `-- robots.txt
|-- shared/
|   |-- portfolio.js             # Main portfolio content and project data
|   `-- portfolio.d.ts           # Shared portfolio data types
|-- src/
|   |-- components/              # Portfolio sections and reusable components
|   |-- components/ui/           # shadcn-style UI primitives
|   |-- pages/                   # Main page and fallback route
|   |-- App.tsx                  # Router, providers, and app shell
|   |-- main.tsx                 # React entry point
|   `-- index.css                # Tailwind, design tokens, and global styles
|-- vercel.json                  # Vercel build configuration
|-- vite.config.ts
|-- tailwind.config.ts
|-- tsconfig.json
`-- package.json
```

---

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/asimalyas/Portfolio.git
cd Portfolio
```

If you are working from the current local folder, open:

```bash
F:\BS\portfolio\Portfolio\MyPortfolio\Portfolio
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local environment file:

```bash
.env.local
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

The normal portfolio UI works without this key, but the AI recruiter assistant needs it.

### 4. Start the development server

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
```

### 6. Preview the production build

```bash
npm run preview
```

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the local Vite development server. |
| `npm run dev:vercel` | Starts the custom Vercel development helper script. |
| `npm run build` | Creates an optimized production build in `dist/`. |
| `npm run build:dev` | Builds the app in development mode. |
| `npm run lint` | Runs ESLint checks across the project. |
| `npm run preview` | Serves the production build locally for testing. |

---

## Environment Variables

| Variable | Required | Used For |
| --- | --- | --- |
| `GEMINI_API_KEY` | Yes, for AI assistant | Allows the serverless API route to call Gemini securely. |

Important: never expose the API key in frontend code. Keep it in `.env.local` locally and in Vercel Environment Variables for deployment.

---

## Deployment on Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Set the framework preset to **Vite**.
4. Add this environment variable in Vercel:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

5. Deploy the project.

Vercel uses this configuration:

```json
{
  "framework": "vite",
  "devCommand": "vite --host 127.0.0.1 --port $PORT",
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

---

## Design Goals

- Fast first impression for recruiters and visitors.
- Clear project discovery through categories and search.
- Smooth animations without making the UI feel heavy.
- Professional visual hierarchy with consistent spacing, colors, and cards.
- Accessible interactions with readable contrast, focus states, and responsive layouts.
- Maintainable content model through shared portfolio data.

---

## Key Projects Displayed

- Entry Test Quiz - AI-powered test practice platform.
- MediConnect - Smart healthcare platform with role-based dashboards.
- Bangalore House Prediction - Regression model with Flask interface.
- Celebrity Recognition - Classification model using OpenCV and SVM.
- Heart Disease Prediction - Random Forest classification project.
- Personal Developer Portfolio with AI Integration.
- Attendance Management System.
- CodeCrux programming practice platform.
- Unity games including Archery Quest and Runner Game.
- Data structure and desktop application projects.

---

## Author

**Muhammad Asim Ilyas Rathore**

Software Engineering student focused on web development, machine learning, AI-powered tools, clean user interfaces, and scalable applications.

- GitHub: https://github.com/asimalyas
- LinkedIn: https://www.linkedin.com/in/muhammad-asim-ilyas-a38b263a2
- Email: asimalyas44440@gmail.com
- Location: Abbottabad, Pakistan

---

## License

This project includes a `LICENSE` file in the repository. Review it before reusing or distributing the code.

---

## Status

Production build verified with:

```bash
npm run build
```
