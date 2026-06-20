# Asim Ilyas Rathore - AI Assisted Portfolio

[![Live Portfolio](https://img.shields.io/badge/Live_Portfolio-asimmportfolio.vercel.app-7C3AED?style=for-the-badge&logo=vercel&logoColor=white)](https://asimmportfolio.vercel.app/)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=111827)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Admin_DB-3ECF8E?style=for-the-badge&logo=supabase&logoColor=0F172A)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

A modern, responsive portfolio for presenting my software engineering journey, projects, skills, education, achievements, certificates, experience, and contact details to recruiters, collaborators, and clients.

**Live Site:** [https://asimmportfolio.vercel.app/](https://asimmportfolio.vercel.app/)

## Highlights

- Professional single-page portfolio with smooth navigation and dark/light theme support.
- Secure AI Recruiter Assistant powered by Gemini through a Vercel serverless endpoint.
- Supabase-backed admin dashboard at `/admin` for editing portfolio content without code changes.
- CRUD management for projects, certificates, skills, experience, education, achievements, and profile/about data.
- Public portfolio automatically reads Supabase content and falls back to local data when Supabase is not configured.
- Supabase Auth, Row Level Security, and Storage policies for admin-only content management.

## Featured Sections

| Section | Purpose |
| --- | --- |
| Hero | Introduces Asim Ilyas Rathore with role highlights and primary calls to action. |
| About | Summarizes technical strengths and engineering focus. |
| Projects | Displays practical work across React, ML, AI tools, games, DSA, and desktop apps. |
| Experience | Supports internships, jobs, freelance work, optional images, certificates, and technologies. |
| Education | Shows academic background, institution details, and performance. |
| Achievements | Highlights certificates, honors, workshops, and university awards. |
| Contact | Provides email, phone, GitHub, LinkedIn, resume, and message form. |
| AI Assistant | Answers recruiter questions using verified portfolio data only. |
| Admin | Lets the owner update portfolio content securely from the browser. |

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion |
| UI | shadcn-style components, Radix UI, Lucide React, Sonner |
| Data/Admin | Supabase Database, Auth, Storage, Row Level Security |
| AI | Gemini REST API, secure Vercel serverless function |
| Contact | EmailJS with encoded mail fallback |
| Deployment | Vercel, static Vite output, serverless API route |

## Project Structure

```text
.
|-- api/
|   `-- chat.ts                  # Gemini-powered AI recruiter endpoint
|-- public/
|   `-- imagesAchivemnts/        # Local fallback profile, education, and achievement images
|-- shared/
|   |-- portfolio.js             # Local fallback portfolio data
|   `-- portfolio.d.ts           # Shared fallback data types
|-- src/
|   |-- components/              # Portfolio sections, UI, and admin layout
|   |-- hooks/usePortfolioData.ts# Supabase-backed public data hook
|   |-- lib/                     # Supabase client, admin config, data mapping helpers
|   |-- pages/admin/             # Login, dashboard, CRUD pages
|   |-- pages/Index.tsx          # Public portfolio page
|   `-- App.tsx                  # Providers and routes
|-- supabase/
|   |-- schema.sql               # Tables, RLS policies, storage bucket, profile seed
|   `-- seed.sql                 # Optional seed from current portfolio content
|-- vercel.json
|-- vite.config.ts
|-- tailwind.config.ts
`-- package.json
```

## Local Development

```bash
npm install
npm run dev
```

For local testing with the Vercel API route:

```bash
npm run dev:vercel
```

Build and lint:

```bash
npm run lint
npm run build
```

## Environment Variables

Create `.env.local` from `.env.example`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_public_key
GEMINI_API_KEY=your_gemini_api_key_for_local_vercel_dev
```

Add the same values in Vercel Project Settings > Environment Variables.

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are public frontend values protected by Supabase RLS.
- `GEMINI_API_KEY` is server-only and must never use a `VITE_` prefix.
- Do not add Supabase service-role keys to this frontend project.

## Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Optionally run `supabase/seed.sql` to load the current projects, skills, education, and achievements into the admin tables.
4. In Authentication, create or invite the admin user: `asimalyas4440@gmail.com`.
5. Add the live site and local URLs in Supabase Auth URL settings.
6. Add the Supabase environment variables locally and in Vercel.
7. Visit `/admin/login` and sign in with the admin email.

Only `asimalyas4440@gmail.com` can manage portfolio data because the frontend guard and Supabase RLS policies both check that email.

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

## Author

**Asim Ilyas Rathore**

Software Engineering student focused on React, TypeScript, machine learning, AI-powered tools, clean UI, and scalable applications.

- Portfolio: [https://asimmportfolio.vercel.app/](https://asimmportfolio.vercel.app/)
- GitHub: [https://github.com/asimalyas](https://github.com/asimalyas)
- LinkedIn: [Muhammad Asim Ilyas](https://www.linkedin.com/in/muhammad-asim-ilyas-a38b263a2)
- Email: `asimalyas44440@gmail.com`
- Location: Abbottabad, Pakistan
