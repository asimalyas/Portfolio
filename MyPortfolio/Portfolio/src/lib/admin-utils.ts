import { PORTFOLIO_ASSETS_BUCKET, supabase } from "@/lib/supabase";

export type AdminFormValues = Record<string, string | boolean | number | string[] | null>;

export function arrayToInput(value: unknown) {
  return Array.isArray(value) ? value.join(", ") : "";
}

export function inputToArray(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeFormValue(type: string, value: string | boolean) {
  if (type === "boolean") return Boolean(value);
  if (type === "number") return Number(value || 0);
  if (type === "array") return inputToArray(String(value || ""));
  return String(value || "").trim() || null;
}

export function isValidUrl(value: string) {
  if (!value.trim()) return true;
  try {
    const url = new URL(value);
    return ["http:", "https:", "mailto:", "tel:"].includes(url.protocol);
  } catch {
    return value.startsWith("/");
  }
}

export async function uploadPortfolioAsset(file: File, folder: string) {
  if (!supabase) throw new Error("Supabase is not configured.");

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${folder}/${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from(PORTFOLIO_ASSETS_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(PORTFOLIO_ASSETS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
