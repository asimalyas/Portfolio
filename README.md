# Asim Ilyas Rathore - AI Assisted Developer Portfolio

[![Live Portfolio](https://img.shields.io/badge/Live_Portfolio-asimmportfolio.vercel.app-7C3AED?style=for-the-badge&logo=vercel&logoColor=white)](https://asimmportfolio.vercel.app/)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=111827)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

A modern, responsive, AI-assisted personal portfolio for presenting my software engineering journey, projects, skills, education, achievements, and contact details to recruiters, collaborators, and clients.

**Live Site:** [https://asimmportfolio.vercel.app/](https://asimmportfolio.vercel.app/)

---

## What Makes It Stand Out

- Professional single-page portfolio with smooth navigation and polished animations.
- AI Recruiter Assistant powered by Gemini through a secure Vercel serverless endpoint.
- Centralized portfolio data shared between the frontend and the AI assistant.
- Project search and category filters for web, machine learning, games, DSA, and desktop apps.
- Education timeline, achievement gallery, contact form, resume link, and social links.
- Dark/light theme support with a consistent visual system.
- Vite production build configured for Vercel deployment.

---

## Featured Sections

| Section | Purpose |
| --- | --- |
| Hero | Introduces Asim Ilyas Rathore with role highlights and primary calls to action. |
| About | Summarizes technical strengths and engineering focus. |
| Projects | Displays practical work across React, ML, AI tools, games, Java, and DSA. |
| Experience | Prepared for future internships/jobs with optional logo and certificate support. |
| Education | Shows academic background, institution details, and performance. |
| Achievements | Highlights certificates, honors, workshops, and university awards. |
| Contact | Provides email, phone, GitHub, LinkedIn, resume, and message form. |
| AI Assistant | Answers recruiter questions using only verified portfolio data. |

---

## Key Projects

- **Entry Test Quiz** - AI-powered MCQ practice platform with PDF/image extraction, timer modes, result review, and AI tutor support.
- **MediConnect** - Smart healthcare platform with role-based dashboards for patients, assistants, and doctors.
- **Bangalore House Prediction** - Regression model with Flask interface and Python data preprocessing.
- **Celebrity Recognition** - Face classification project using OpenCV, SVM, wavelet transforms, and Flask.
- **Heart Disease Prediction** - Random Forest classification model for tabular health data.
- **Personal Portfolio with AI Integration** - This portfolio, including the Gemini-powered recruiter assistant.

---

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion |
| UI | shadcn-style components, Radix UI, Lucide React, Sonner |
| AI | Gemini REST API, secure Vercel serverless function |
| Contact | EmailJS with mail fallback |
| Deployment | Vercel, static Vite output, serverless API route |

---

## Project Structure

The real app lives inside:

```text
MyPortfolio/Portfolio
```

Important folders:

```text
MyPortfolio/Portfolio
|-- api/
|   `-- chat.ts              # Gemini-powered AI recruiter endpoint
|-- public/
|   `-- imagesAchivemnts/    # Profile, education, and achievement images
|-- shared/
|   |-- portfolio.js         # Single source of truth for portfolio content
|   `-- portfolio.d.ts       # Shared portfolio data types
|-- src/
|   |-- components/          # Portfolio sections and UI components
|   |-- pages/               # Main page and fallback route
|   |-- App.tsx              # Providers and router
|   `-- main.tsx             # React entry point
|-- vercel.json
|-- vite.config.ts
|-- tailwind.config.ts
`-- package.json
```

---

## Local Development

```bash
cd MyPortfolio/Portfolio
npm install
npm run dev
```

For local testing with the Vercel API route:

```bash
npm run dev:vercel
```

Build for production:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

---

## Environment Variables

Create `MyPortfolio/Portfolio/.env.local` for local development:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

For production, add the same variable in the Vercel dashboard:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

The API key is used only by the serverless function. It must not use a `VITE_` prefix and must never be exposed in frontend code.

---

## Deployment

The portfolio is deployed on Vercel:

[https://asimmportfolio.vercel.app/](https://asimmportfolio.vercel.app/)

Vercel configuration:

```json
{
  "framework": "vite",
  "devCommand": "vite --host 127.0.0.1 --port $PORT",
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

---

## Author

**Asim Ilyas Rathore**

Software Engineering student focused on React, TypeScript, machine learning, AI-powered tools, clean UI, and scalable applications.

- Portfolio: [https://asimmportfolio.vercel.app/](https://asimmportfolio.vercel.app/)
- GitHub: [https://github.com/asimalyas](https://github.com/asimalyas)
- LinkedIn: [Muhammad Asim Ilyas](https://www.linkedin.com/in/muhammad-asim-ilyas-a38b263a2)
- Email: `asimalyas44440@gmail.com`
- Location: Abbottabad, Pakistan

---

## Status

- TypeScript check: passing
- Lint: passing with existing Fast Refresh warnings
- Production build: verified locally
- Deployment: live on Vercel
