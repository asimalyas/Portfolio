import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

type VercelRequest = {
  method?: string;
  headers?: Record<string, string | string[] | undefined>;
  body?: unknown;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
};

type Collection = "certificates" | "achievements" | "experience";
type SuggestionValue = string | string[];

type ExtractRequestBody = {
  collection?: unknown;
  fieldKey?: unknown;
  assetUrl?: unknown;
  fileName?: unknown;
  mimeType?: unknown;
  existingValues?: unknown;
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

const ADMIN_EMAIL = "asimalyas4440@gmail.com";
const DEFAULT_MODEL = "gemini-3.1-flash-lite";
const MAX_BODY_BYTES = 16_384;
const MAX_FILE_BYTES = 8 * 1024 * 1024;

const allowedFields: Record<Collection, string[]> = {
  certificates: ["title", "issuer", "date_label", "description", "credential_url", "categories"],
  achievements: ["title", "description", "date_label", "credential_url", "categories"],
  experience: [
    "title",
    "company",
    "type",
    "location",
    "period",
    "description",
    "responsibilities",
    "technologies",
    "company_url",
  ],
};

const categoryOptions = ["Studies", "Projects", "Activities", "Sports", "Skills"];
const experienceTypes = ["Internship", "Job", "Freelance", "Contract", "Volunteer"];

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

function getGeminiModel() {
  return process.env.GEMINI_EXTRACTION_MODEL || getLocalEnvValue("GEMINI_EXTRACTION_MODEL") || DEFAULT_MODEL;
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

function getBodySize(body: unknown) {
  if (typeof body === "string") return Buffer.byteLength(body, "utf8");
  if (body && typeof body === "object") return Buffer.byteLength(JSON.stringify(body), "utf8");
  return 0;
}

function parseBody(body: unknown): ExtractRequestBody {
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as ExtractRequestBody;
    } catch {
      return {};
    }
  }

  if (body && typeof body === "object") return body as ExtractRequestBody;
  return {};
}

function isCollection(value: unknown): value is Collection {
  return value === "certificates" || value === "achievements" || value === "experience";
}

async function verifyAdmin(req: VercelRequest) {
  const authHeader = getHeader(req, "authorization");
  const token = authHeader.toLowerCase().startsWith("bearer ") ? authHeader.slice(7).trim() : "";
  if (!token) return false;

  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) return false;

  const response = await fetch(`${url.replace(/\/$/, "")}/auth/v1/user`, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) return false;

  const user = (await response.json()) as { email?: string };
  return user.email?.trim().toLowerCase() === ADMIN_EMAIL;
}

function fileToBase64(buffer: ArrayBuffer) {
  return Buffer.from(buffer).toString("base64");
}

function buildExtractionPrompt(collection: Collection, fieldKey: string, fileName: string, existingValues: unknown) {
  return [
    `You extract admin form fields for the "${collection}" portfolio section from an uploaded document or image.`,
    "Return strict JSON only. Do not wrap it in Markdown.",
    "JSON shape: {\"suggestions\":{},\"confidence\":\"low|medium|high\",\"notes\":[]}",
    `Allowed suggestion keys: ${allowedFields[collection].join(", ")}.`,
    `The uploaded file came from field "${fieldKey}" and is named "${fileName}".`,
    "Use only information visible in the uploaded file. Do not invent missing data.",
    "Leave uncertain fields out of suggestions instead of guessing.",
    `Categories must be chosen only from: ${categoryOptions.join(", ")}.`,
    `Experience type must be one of: ${experienceTypes.join(", ")}.`,
    "Descriptions must match the portfolio's existing style: professional, short, specific, efficient, and not exaggerated.",
    "Description examples: Completed through Cisco Networking Academy, September 2025. Awarded for organizing the Communication Event, December 2022. Won the Inter-Subject Project Competition in Database at COMSATS University, January 2025.",
    "For descriptions, summarize what the document proves, who issued or awarded it if visible, and date/context if visible.",
    "For array fields, return arrays of short strings.",
    "Existing form values are provided only for context. Do not repeat empty values.",
    `Existing values: ${JSON.stringify(existingValues || {})}`,
  ].join("\n");
}

function extractJson(text: string) {
  const trimmed = text.trim().replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```$/i, "").trim();
  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first === -1 || last === -1 || last <= first) return "{}";
  return trimmed.slice(first, last + 1);
}

function normalizeSuggestions(collection: Collection, raw: unknown) {
  const result: Record<string, SuggestionValue> = {};
  if (!raw || typeof raw !== "object") return result;

  const source = raw as Record<string, unknown>;
  const allowed = new Set(allowedFields[collection]);

  Object.entries(source).forEach(([key, value]) => {
    if (!allowed.has(key)) return;

    if (Array.isArray(value)) {
      const list = value.map((item) => String(item).trim()).filter(Boolean);
      if (!list.length) return;
      result[key] = key === "categories" ? list.filter((item) => categoryOptions.includes(item)) : list;
      return;
    }

    if (typeof value === "string" || typeof value === "number") {
      const text = String(value).trim();
      if (!text) return;
      if (key === "categories") {
        const categories = text
          .split(",")
          .map((item) => item.trim())
          .filter((item) => categoryOptions.includes(item));
        if (categories.length) result[key] = categories;
        return;
      }
      if (key === "type" && !experienceTypes.includes(text)) return;
      result[key] = text;
    }
  });

  return result;
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

  if (Number(getHeader(req, "content-length") || 0) > MAX_BODY_BYTES || getBodySize(req.body) > MAX_BODY_BYTES) {
    return res.status(413).json({ error: "Request body is too large." });
  }

  if (!(await verifyAdmin(req))) {
    return res.status(401).json({ error: "Only the configured admin can use AI autofill." });
  }

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return res.status(500).json({ error: "Gemini API key is not configured." });
  }

  const body = parseBody(req.body);
  if (!isCollection(body.collection)) {
    return res.status(400).json({ error: "Invalid admin collection." });
  }

  const assetUrl = typeof body.assetUrl === "string" ? body.assetUrl.trim() : "";
  const fieldKey = typeof body.fieldKey === "string" ? body.fieldKey.trim() : "";
  const fileName = typeof body.fileName === "string" ? body.fileName.trim() : "uploaded-file";
  const mimeType = typeof body.mimeType === "string" && body.mimeType.trim() ? body.mimeType.trim() : "application/octet-stream";

  if (!assetUrl || !fieldKey) {
    return res.status(400).json({ error: "Missing uploaded file details." });
  }

  try {
    const assetResponse = await fetch(assetUrl);
    if (!assetResponse.ok) {
      return res.status(400).json({ error: "Uploaded file could not be read." });
    }

    const buffer = await assetResponse.arrayBuffer();
    if (buffer.byteLength > MAX_FILE_BYTES) {
      return res.status(413).json({ error: "File uploaded, but it is too large for AI autofill." });
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${getGeminiModel()}:generateContent?key=${encodeURIComponent(apiKey)}`;
    const geminiResponse = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: "You are a careful portfolio admin assistant. Extract only visible facts from the uploaded document and return valid JSON only.",
            },
          ],
        },
        contents: [
          {
            role: "user",
            parts: [
              { text: buildExtractionPrompt(body.collection, fieldKey, fileName, body.existingValues) },
              {
                inlineData: {
                  mimeType,
                  data: fileToBase64(buffer),
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 700,
        },
      }),
    });

    const geminiData = (await geminiResponse.json()) as GeminiResponse;
    if (!geminiResponse.ok) {
      return res.status(502).json({
        error: geminiData.error?.message || "AI could not read this file type. You can fill fields manually.",
      });
    }

    const answer = geminiData.candidates?.[0]?.content?.parts?.map((part) => part.text || "").join("").trim();
    if (!answer) {
      return res.status(502).json({ error: "AI did not return extractable fields." });
    }

    const parsed = JSON.parse(extractJson(answer)) as {
      suggestions?: unknown;
      confidence?: unknown;
      notes?: unknown;
    };

    return res.status(200).json({
      suggestions: normalizeSuggestions(body.collection, parsed.suggestions),
      confidence:
        parsed.confidence === "low" || parsed.confidence === "medium" || parsed.confidence === "high"
          ? parsed.confidence
          : "low",
      notes: Array.isArray(parsed.notes) ? parsed.notes.map(String).filter(Boolean).slice(0, 5) : [],
    });
  } catch {
    return res.status(503).json({ error: "AI autofill is temporarily unavailable. You can fill fields manually." });
  }
}
