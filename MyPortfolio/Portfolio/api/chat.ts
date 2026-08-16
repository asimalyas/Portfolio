import { portfolioData } from "../shared/portfolio.js";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

type PortfolioData = typeof portfolioData;

type VercelRequest = {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
  socket?: {
    remoteAddress?: string;
  };
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
  error?: {
    message?: string;
    status?: string;
  };
};

const MODEL = "gemini-3.1-flash-lite";
const MAX_QUESTION_CHARS = 300;
const MAX_ANSWER_WORDS = 90;
const MAX_BODY_BYTES = 2_048;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const SUPABASE_TABLES = [
  "skills",
  "projects",
  "education",
  "experiences",
  "achievements",
  "certificates",
] as const;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function getLocalEnvValue(key: string) {
  if (process.env.NODE_ENV === "production") return "";

  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return "";

  const line = readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .find((entry) => entry.trim().startsWith(`${key}=`));

  if (!line) return "";

  const value = line.slice(line.indexOf("=") + 1).trim();
  return value.replace(/^["']|["']$/g, "");
}

function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY || getLocalEnvValue("GEMINI_API_KEY");
}

function getSupabaseConfig() {
  const url =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    getLocalEnvValue("VITE_SUPABASE_URL");
  const anonKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    getLocalEnvValue("VITE_SUPABASE_ANON_KEY");

  return { url, anonKey };
}

function getHeader(req: VercelRequest, name: string) {
  const value = req.headers?.[name] || req.headers?.[name.toLowerCase()];
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

function getClientId(req: VercelRequest) {
  const forwardedFor = getHeader(req, "x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  const realIp = getHeader(req, "x-real-ip");
  if (realIp) return realIp;

  return req.socket?.remoteAddress || "unknown-client";
}

function getBodySize(body: unknown) {
  if (typeof body === "string") return Buffer.byteLength(body, "utf8");
  if (body && typeof body === "object") return Buffer.byteLength(JSON.stringify(body), "utf8");
  return 0;
}

function checkRateLimit(clientId: string) {
  const now = Date.now();
  const current = rateLimitStore.get(clientId);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(clientId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { limited: false, retryAfter: 0 };
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      limited: true,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { limited: false, retryAfter: 0 };
}

function getBody(body: unknown): { question?: unknown } {
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as { question?: unknown };
    } catch {
      return {};
    }
  }

  if (body && typeof body === "object") {
    return body as { question?: unknown };
  }

  return {};
}

function trimWords(text: string, maxWords: number) {
  const plainText = text
    .replace(/<[^>]*>/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  const words = plainText.split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return plainText;
  return `${words.slice(0, maxWords).join(" ")}...`;
}

function getFallbackAssistantData(): PortfolioData {
  return {
    ...portfolioData,
    projects: portfolioData.projects.map((project) => ({
      ...project,
      url: project.url || "Unavailable in current portfolio data",
    })),
  };
}

async function fetchSupabaseRows<T>(url: string, anonKey: string, table: string, query = "select=*") {
  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${table}?${query}`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
  });

  if (!response.ok) throw new Error(`Supabase ${table} request failed`);
  return (await response.json()) as T[];
}

async function getAssistantData(): Promise<PortfolioData> {
  const { url, anonKey } = getSupabaseConfig();
  const fallbackData = getFallbackAssistantData();

  if (!url || !anonKey) return fallbackData;

  try {
    const [profileRows, ...collectionRows] = await Promise.all([
      fetchSupabaseRows<Record<string, unknown>>(url, anonKey, "profile", "id=eq.main&select=*"),
      ...SUPABASE_TABLES.map((table) =>
        fetchSupabaseRows<Record<string, unknown>>(url, anonKey, table, "active=eq.true&select=*&order=sort_order.asc")
      ),
    ]);

    const profile = profileRows[0];
    const [skills, projects, education, experiences, achievements, certificates] = collectionRows;

    return {
      ...fallbackData,
      profile: profile
        ? {
            name: String(profile.name || fallbackData.profile.name),
            shortName: String(profile.short_name || fallbackData.profile.shortName),
            brandName: String(profile.brand_name || fallbackData.profile.brandName),
            headline: String(profile.headline || fallbackData.profile.headline),
            summary: String(profile.summary || fallbackData.profile.summary),
            about: String(profile.about || fallbackData.profile.about),
            location: String(profile.location || fallbackData.profile.location),
            avatar: String(profile.avatar_url || fallbackData.profile.avatar),
            logoAvatar: String(profile.logo_avatar_url || fallbackData.profile.logoAvatar),
            roles: Array.isArray(profile.roles) ? (profile.roles as string[]) : fallbackData.profile.roles,
          }
        : fallbackData.profile,
      links: profile
        ? {
            github: String(profile.github_url || fallbackData.links.github),
            linkedin: String(profile.linkedin_url || fallbackData.links.linkedin),
            resume: String(profile.resume_url || fallbackData.links.resume),
          }
        : fallbackData.links,
      contact: profile
        ? {
            email: String(profile.contact_email || fallbackData.contact.email),
            phones: Array.isArray(profile.phones) ? (profile.phones as string[]) : fallbackData.contact.phones,
            location: String(profile.location || fallbackData.contact.location),
          }
        : fallbackData.contact,
      suggestedQuestions:
        profile && Array.isArray(profile.suggested_questions)
          ? (profile.suggested_questions as string[])
          : fallbackData.suggestedQuestions,
      skills: skills.length
        ? skills.map((skill) => ({
            icon: String(skill.icon || "code") as PortfolioData["skills"][number]["icon"],
            color: String(skill.color || "from-indigo-500 to-purple-500"),
            title: String(skill.title || ""),
            description: String(skill.description || ""),
          }))
        : fallbackData.skills,
      projects: projects.length
        ? projects.map((project) => ({
            id: String(project.id || project.title || "project"),
            title: String(project.title || ""),
            description: String(project.description || ""),
            techStack: Array.isArray(project.tech_stack) ? (project.tech_stack as string[]) : [],
            url: project.url ? String(project.url) : "Unavailable in current portfolio data",
            categories: Array.isArray(project.categories)
              ? (project.categories as PortfolioData["projects"][number]["categories"])
              : [],
          }))
        : fallbackData.projects,
      education: education.length
        ? education.map((item) => ({
            id: String(item.id || item.degree || "education"),
            years: String(item.years || ""),
            degree: String(item.degree || ""),
            institution: String(item.institution || ""),
            grade: String(item.grade || ""),
            image: String(item.image_url || ""),
          }))
        : fallbackData.education,
      achievements: achievements.length
        ? achievements.map((achievement) => ({
            id: String(achievement.id || achievement.title || "achievement"),
            title: String(achievement.title || ""),
            description: String(achievement.description || ""),
            image: String(achievement.image_url || ""),
            credentialUrl: achievement.credential_url ? String(achievement.credential_url) : null,
            category: Array.isArray(achievement.categories)
              ? (achievement.categories as PortfolioData["achievements"][number]["category"])
              : [],
          }))
        : fallbackData.achievements,
      certificates: certificates.length
        ? certificates.map((certificate) => ({
            id: String(certificate.id || certificate.title || "certificate"),
            title: String(certificate.title || ""),
            issuer: String(certificate.issuer || ""),
            dateLabel: String(certificate.date_label || ""),
            description: String(certificate.description || ""),
            image: String(certificate.image_url || ""),
            credentialUrl: certificate.credential_url ? String(certificate.credential_url) : null,
            categories: Array.isArray(certificate.categories)
              ? (certificate.categories as NonNullable<PortfolioData["certificates"]>[number]["categories"])
              : certificate.category
                ? [String(certificate.category) as NonNullable<PortfolioData["certificates"]>[number]["categories"][number]]
                : ["Skills"],
          }))
        : fallbackData.certificates,
      experience: {
        ...fallbackData.experience,
        roles: experiences.length
          ? experiences.map((role) => ({
              title: String(role.title || ""),
              company: String(role.company || ""),
              type: String(role.type || "Internship") as PortfolioData["experience"]["roles"][number]["type"],
              location: String(role.location || ""),
              period: String(role.period || ""),
              image: role.image_url ? String(role.image_url) : undefined,
              description: String(role.description || ""),
              responsibilities: Array.isArray(role.responsibilities) ? (role.responsibilities as string[]) : [],
              technologies: Array.isArray(role.technologies) ? (role.technologies as string[]) : [],
              certificateUrl: role.certificate_url ? String(role.certificate_url) : undefined,
              companyUrl: role.company_url ? String(role.company_url) : undefined,
            }))
          : fallbackData.experience.roles,
      },
    };
  } catch {
    return fallbackData;
  }
}

async function buildPrompt(question: string) {
  return [
    "Portfolio data:",
    JSON.stringify(await getAssistantData()),
    "",
    "Recruiter question:",
    question,
  ].join("\n");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Content-Type", "application/json");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are supported." });
  }

  const contentType = getHeader(req, "content-type");
  if (!contentType.toLowerCase().includes("application/json")) {
    return res.status(415).json({ error: "Content-Type must be application/json." });
  }

  const contentLength = Number(getHeader(req, "content-length") || 0);
  if (contentLength > MAX_BODY_BYTES || getBodySize(req.body) > MAX_BODY_BYTES) {
    return res.status(413).json({ error: "Request body is too large." });
  }

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return res.status(500).json({
      error: "Gemini API key is not configured. Add GEMINI_API_KEY on the server.",
    });
  }

  const { question } = getBody(req.body);

  if (typeof question !== "string") {
    return res.status(400).json({ error: "Question must be a string." });
  }

  const normalizedQuestion = question.trim();

  if (!normalizedQuestion) {
    return res.status(400).json({ error: "Please enter a question." });
  }

  if (normalizedQuestion.length > MAX_QUESTION_CHARS) {
    return res.status(400).json({
      error: `Questions must be ${MAX_QUESTION_CHARS} characters or fewer.`,
    });
  }

  const rateLimit = checkRateLimit(getClientId(req));
  if (rateLimit.limited) {
    res.setHeader("Retry-After", String(rateLimit.retryAfter));
    return res.status(429).json({
      error: "Too many questions. Please wait a moment before trying again.",
    });
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;

  try {
    const geminiResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text:
                "You are Asim Ilyas Rathore's AI recruiter assistant. Answer only from the supplied portfolio data and never invent information. Write like a concise hiring-screening assistant: direct, specific, and professional. Keep answers under 80 words. Prefer 3-4 short Markdown bullet points, with each bullet under 14 words. Use brief bold labels when helpful. If the data does not contain the answer, say that clearly in one short sentence. Do not include HTML or Markdown tables.",
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: await buildPrompt(normalizedQuestion) }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 170,
          thinkingConfig: {
            thinkingLevel: "minimal",
          },
        },
      }),
    });

    const data = (await geminiResponse.json()) as GeminiResponse;

    if (geminiResponse.status === 429) {
      return res.status(429).json({
        error: "The AI assistant quota is currently exhausted. Please try again later.",
      });
    }

    if (!geminiResponse.ok) {
      return res.status(502).json({
        error: "The AI assistant is temporarily unavailable.",
      });
    }

    const answer = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join(" ")
      .trim();

    if (!answer) {
      return res.status(502).json({
        error: "The AI assistant did not return an answer. Please try again.",
      });
    }

    return res.status(200).json({ answer: trimWords(answer, MAX_ANSWER_WORDS) });
  } catch {
    return res.status(503).json({
      error: "The AI assistant could not be reached. Please try again later.",
    });
  }
}

