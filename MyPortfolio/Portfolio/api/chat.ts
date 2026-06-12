import { portfolioData } from "../src/data/portfolio";

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

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

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

function getAssistantData() {
  return {
    ...portfolioData,
    projects: portfolioData.projects.map((project) => ({
      ...project,
      url: project.url === "#" ? "Unavailable in current portfolio data" : project.url,
    })),
  };
}

function buildPrompt(question: string) {
  return [
    "Portfolio data:",
    JSON.stringify(getAssistantData()),
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

  const apiKey = process.env.GEMINI_API_KEY;
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
                "You are a professional AI recruiter assistant for Asim Alyas Rathore's portfolio. Answer only from the supplied portfolio data. Never invent information. Keep answers concise, recruiter-friendly, and under 90 words. Prefer 3-5 short Markdown bullet points when listing skills, projects, or fit. Use brief bold labels where helpful. If information is unavailable, say so clearly in one short sentence. Do not include HTML or Markdown tables.",
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [{ text: buildPrompt(normalizedQuestion) }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 140,
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
