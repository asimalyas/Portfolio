# Asim Ilyas Rathore - AI Assisted Portfolio

[![Live Portfolio](https://img.shields.io/badge/Live_Portfolio-asimmportfolio.vercel.app-7C3AED?style=for-the-badge&logo=vercel&logoColor=white)](https://asimmportfolio.vercel.app/)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=111827)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Admin_DB-3ECF8E?style=for-the-badge&logo=supabase&logoColor=0F172A)
![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

A modern, responsive portfolio for presenting my software engineering journey, projects, skills, education, achievements, certificates, experience, and contact details to recruiters, collaborators, and clients. The site includes a secure Supabase admin dashboard and Gemini-powered AI tools for recruiter Q&A and admin document autofill.

**Live Site:** [https://asimmportfolio.vercel.app/](https://asimmportfolio.vercel.app/)

## Highlights

- Professional single-page portfolio with smooth navigation and dark/light theme support.
- Secure AI Recruiter Assistant powered by Gemini through a Vercel serverless endpoint.
- Supabase-backed admin dashboard at `/admin` for editing portfolio content without code changes.
- Admin analytics dashboard with item counts, public/hidden status, and chart views.
- CRUD management for profile/about, projects, certificates, skills, experience, education, and achievements.
- AI document autofill for certificates, achievements, and experience uploads.
- Upload previews, loading states, and admin review before Create/Save.
- Public portfolio reads Supabase content and falls back to local data when Supabase is not configured.
- Supabase Auth, Row Level Security, and Storage policies for admin-only content management.
- Vercel deployment with static Vite output and serverless API routes.

## Featured Sections

| Section | Purpose |
| --- | --- |
| Hero | Introduces Asim Ilyas Rathore with role highlights and primary calls to action. |
| About | Summarizes technical strengths and engineering focus. |
| Projects | Displays practical work across React, ML, AI tools, games, DSA, and desktop apps. |
| Experience | Supports internships, jobs, freelance work, optional logos, certificates, responsibilities, and technologies. |
| Education | Shows academic background, institution details, and performance. |
| Achievements | Highlights awards, honors, workshops, and university achievements. |
| Certificates | Shows certificate images, issuers, dates, categories, and optional credential links. |
| Contact | Provides email, phone, GitHub, LinkedIn, resume, and message form. |
| AI Assistant | Answers recruiter questions using verified portfolio data only. |
| Admin | Lets the owner update portfolio content securely from the browser. |

## Admin Dashboard

The admin area is available at `/admin/login` and is restricted to:

```text
asimalyas4440@gmail.com
```

Admin features:

- Sidebar navigation for Dashboard, Profile, Projects, Certificates, Skills, Experience, Education, and Achievements.
- Dashboard charts for total content, public items, hidden items, section counts, and AI upload sections.
- Profile editor for hero text, images, links, contact details, roles, and AI suggested questions.
- Collection editor for adding, editing, deleting, sorting, and publishing portfolio items.
- Upload-first flow for certificates, achievements, and experience proof documents.
- Gemini reads uploaded files and fills only blank/untouched fields.
- Create/Save remains the final confirmation. AI never auto-saves to Supabase.
- Upload URLs are preserved when AI fills text fields, so saved public images continue to display.

## AI Document Autofill

AI autofill is implemented through `api/extract-admin-item.ts`.

Supported admin sections:

| Section | AI can extract |
| --- | --- |
| Certificates | Title, issuer, date, description, credential URL, categories |
| Achievements | Title, description, date, categories |
| Experience | Role title, company, type, location, period, description, responsibilities, technologies, company URL |

Safety rules:

- Requires the signed-in Supabase admin bearer token.
- Rejects non-admin requests.
- Uses `GEMINI_API_KEY` only on the server.
- File extraction size guard defaults to 8 MB.
- AI suggestions never overwrite upload URL fields, `sort_order`, or `active`.
- AI suggestions apply only to blank/untouched fields.
- If extraction fails, the upload still stays available for manual editing.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion |
| UI | shadcn-style components, Radix UI, Lucide React, Sonner, Recharts |
| Data/Admin | Supabase Database, Auth, Storage, Row Level Security |
| AI | Gemini REST API, secure Vercel serverless functions |
| Contact | EmailJS with encoded mail fallback |
| Deployment | Vercel, static Vite output, serverless API routes |

## Project Structure

```text
.
|-- api/
|   |-- chat.ts                  # Gemini-powered AI recruiter endpoint
|   `-- extract-admin-item.ts    # Gemini document extraction for admin uploads
|-- public/
|   `-- imagesAchivemnts/        # Local fallback profile, education, and achievement images
|-- scripts/
|   `-- vercel-dev.mjs           # Local Vercel dev helper
|-- shared/
|   |-- portfolio.js             # Local fallback portfolio data
|   `-- portfolio.d.ts           # Shared fallback data types
|-- src/
|   |-- components/              # Portfolio sections, UI, and admin layout
|   |-- components/admin/        # Admin layout shell
|   |-- hooks/usePortfolioData.ts# Supabase-backed public data hook
|   |-- lib/                     # Supabase client, admin config, data mapping helpers
|   |-- pages/admin/             # Login, dashboard, profile, and CRUD pages
|   |-- pages/Index.tsx          # Public portfolio page
|   `-- App.tsx                  # Providers and routes
|-- supabase/
|   |-- schema.sql               # Tables, RLS policies, storage bucket, profile seed
|   `-- seed.sql                 # Optional seed from current portfolio content
|-- .env.example
|-- vercel.json
|-- vite.config.ts
|-- tailwind.config.ts
`-- package.json
```

## Local Development

Install dependencies:

```bash
npm install
```

Run normal Vite development server:

```bash
npm run dev
```

Run with Vercel serverless API routes locally:

```bash
npm run dev:vercel
```

You can also run:

```bash
npx vercel dev
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

Optional AI extraction model override:

```env
GEMINI_EXTRACTION_MODEL=gemini-3.1-flash-lite
```

For Vercel deployment, add the same values in:

```text
Vercel Project Settings > Environment Variables
```

Important notes:

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are public frontend values protected by Supabase RLS.
- `GEMINI_API_KEY` is server-only and must never use a `VITE_` prefix.
- Do not add Supabase service-role keys to this frontend project.
- Do not commit `.env.local`.
- If any API key is pasted into chat, GitHub, screenshots, or public places, revoke it and create a new one.

## Supabase Setup

1. Create a Supabase project.
2. Open SQL Editor and run `supabase/schema.sql`.
3. Optionally run `supabase/seed.sql` to load current portfolio content.
4. In Authentication, create or invite the admin user: `asimalyas4440@gmail.com`.
5. Add local and production URLs in Supabase Auth URL settings.
6. Add Supabase environment variables locally and in Vercel.
7. Visit `/admin/login` and sign in with the admin email.

Only `asimalyas4440@gmail.com` can manage portfolio data because the frontend guard and Supabase RLS policies both check that email.

## Vercel Deployment

Current `vercel.json`:

```json
{
  "framework": "vite",
  "devCommand": "vite --host 127.0.0.1 --port $PORT",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/admin",
      "destination": "/index.html"
    },
    {
      "source": "/admin/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Deployment steps:

1. Push the repository to GitHub.
2. Import the repository in Vercel.
3. Use framework preset: `Vite`.
4. Build command: `npm run build`.
5. Output directory: `dist`.
6. Add all required environment variables in Vercel Project Settings.
7. Deploy.
8. After changing environment variables, redeploy the project.

Deployment verification checklist:

- Home page loads.
- `/admin/login` loads.
- Admin login works with `asimalyas4440@gmail.com`.
- Admin dashboard charts load.
- Create, edit, and delete work in admin sections.
- Certificate, Achievement, and Experience uploads show previews.
- AI autofill works when `GEMINI_API_KEY` is configured.
- Saved uploaded images appear on the public portfolio.
- `/api/chat` responds through the AI assistant.
- `/api/extract-admin-item` works only for the signed-in admin.

### Direct Admin Route Refresh Fix

The deployed app uses React Router for admin pages. Vercel must serve `index.html` for `/admin` and `/admin/*` routes so direct visits like `/admin/login` do not return `404: NOT_FOUND`. The rewrite is intentionally limited to admin routes so `/api/chat` and `/api/extract-admin-item` continue to resolve as serverless functions.

Active admin route fallback:

```json
{
  "framework": "vite",
  "devCommand": "vite --host 127.0.0.1 --port $PORT",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/admin",
      "destination": "/index.html"
    },
    {
      "source": "/admin/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Vercel supports project configuration through `vercel.json`, including build settings and rewrites. Keep API routes out of admin rewrites so serverless endpoints stay protected.

## Email Notifications - Postponed

Admin email notifications are planned but not active yet.

Future provider:

```text
Resend
```

Future environment variables:

```env
RESEND_API_KEY=your_resend_key
ADMIN_NOTIFY_TO=asimalyas4440@gmail.com
ADMIN_NOTIFY_FROM=Portfolio Admin <notifications@notifications.asimilyas.com>
ADMIN_NOTIFY_ENABLED=true
```

Current status:

- Resend domain setup can remain pending until email notifications are implemented.
- Do not commit the Resend key.
- If a Resend key was shared publicly, revoke it and create a new one.
- No Resend code is required for the current deployed portfolio.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `npx vercel dev` starts but page is blank | Keep the current minimal `vercel.json`, restart the command, and open `http://localhost:3000`. |
| AI assistant fails | Confirm `GEMINI_API_KEY` is set locally or in Vercel. |
| AI upload extraction fails | Confirm admin is signed in, file is under 8 MB, upload URL is public, and Gemini key exists. |
| Admin login fails | Confirm the Supabase user exists and the email is exactly `asimalyas4440@gmail.com`. |
| Uploaded image not visible publicly | Confirm the image URL field is saved and Supabase Storage bucket/policies are configured. |
| Vercel deployed API fails | Confirm server-only env vars are added in Vercel and redeploy. |
| Direct admin URL returns 404 after deploy | Confirm `vercel.json` includes the `/admin` and `/admin/(.*)` rewrites, then redeploy and retest API routes. |

## Security Checklist

- Keep `.env.local` out of Git.
- Never commit API keys.
- Never expose `GEMINI_API_KEY` or future `RESEND_API_KEY` with a `VITE_` prefix.
- Revoke leaked keys immediately.
- Keep Supabase service-role keys out of this app.
- Use Supabase RLS and the configured admin email for data protection.

## Author

**Asim Ilyas Rathore**

Software Engineering student focused on React, TypeScript, machine learning, AI-powered tools, clean UI, and scalable applications.

- Portfolio: [https://asimmportfolio.vercel.app/](https://asimmportfolio.vercel.app/)
- GitHub: [https://github.com/asimalyas](https://github.com/asimalyas)
- LinkedIn: [Muhammad Asim Ilyas](https://www.linkedin.com/in/muhammad-asim-ilyas-a38b263a2)
- Email: `asimalyas4440@gmail.com`
- Location: Abbottabad, Pakistan
