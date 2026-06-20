import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Save } from "lucide-react";
import { toast } from "sonner";
import { arrayToInput, inputToArray, isValidUrl, uploadPortfolioAsset } from "@/lib/admin-utils";
import { fallbackPortfolioData } from "@/lib/portfolio-data";
import { supabase } from "@/lib/supabase";

type ProfileForm = {
  name: string;
  short_name: string;
  brand_name: string;
  headline: string;
  summary: string;
  about: string;
  location: string;
  avatar_url: string;
  logo_avatar_url: string;
  roles: string;
  github_url: string;
  linkedin_url: string;
  resume_url: string;
  contact_email: string;
  phones: string;
  suggested_questions: string;
};

const fallback = fallbackPortfolioData;

const emptyForm: ProfileForm = {
  name: fallback.profile.name,
  short_name: fallback.profile.shortName,
  brand_name: fallback.profile.brandName,
  headline: fallback.profile.headline,
  summary: fallback.profile.summary,
  about: fallback.profile.about,
  location: fallback.profile.location,
  avatar_url: fallback.profile.avatar,
  logo_avatar_url: fallback.profile.logoAvatar,
  roles: arrayToInput(fallback.profile.roles),
  github_url: fallback.links.github,
  linkedin_url: fallback.links.linkedin,
  resume_url: fallback.links.resume,
  contact_email: fallback.contact.email,
  phones: arrayToInput(fallback.contact.phones),
  suggested_questions: arrayToInput(fallback.suggestedQuestions),
};

const AdminProfilePage: React.FC = () => {
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const load = async () => {
      if (!supabase) return;
      setLoading(true);
      const { data, error } = await supabase.from("profile").select("*").eq("id", "main").maybeSingle();
      setLoading(false);

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data) {
        setForm({
          name: data.name || "",
          short_name: data.short_name || "",
          brand_name: data.brand_name || "",
          headline: data.headline || "",
          summary: data.summary || "",
          about: data.about || "",
          location: data.location || "",
          avatar_url: data.avatar_url || "",
          logo_avatar_url: data.logo_avatar_url || "",
          roles: arrayToInput(data.roles),
          github_url: data.github_url || "",
          linkedin_url: data.linkedin_url || "",
          resume_url: data.resume_url || "",
          contact_email: data.contact_email || "",
          phones: arrayToInput(data.phones),
          suggested_questions: arrayToInput(data.suggested_questions),
        });
      }
    };

    void load();
  }, []);

  const update = (key: keyof ProfileForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const upload = async (key: keyof ProfileForm, file: File | null) => {
    if (!file) return;
    try {
      const url = await uploadPortfolioAsset(file, "profile");
      update(key, url);
      toast.success("Image uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    }
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;

    for (const key of ["avatar_url", "logo_avatar_url", "github_url", "linkedin_url", "resume_url"] as const) {
      if (!isValidUrl(form[key])) {
        toast.error(`${key} must be a valid URL or local path.`);
        return;
      }
    }

    const payload = {
      id: "main",
      name: form.name.trim(),
      short_name: form.short_name.trim(),
      brand_name: form.brand_name.trim(),
      headline: form.headline.trim(),
      summary: form.summary.trim(),
      about: form.about.trim(),
      location: form.location.trim(),
      avatar_url: form.avatar_url.trim(),
      logo_avatar_url: form.logo_avatar_url.trim(),
      roles: inputToArray(form.roles),
      github_url: form.github_url.trim(),
      linkedin_url: form.linkedin_url.trim(),
      resume_url: form.resume_url.trim(),
      contact_email: form.contact_email.trim(),
      phones: inputToArray(form.phones),
      suggested_questions: inputToArray(form.suggested_questions),
    };

    const { error } = await supabase.from("profile").upsert(payload);

    if (error) {
      toast.error(error.message);
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["portfolio-data"] });
    toast.success("Profile updated.");
  };

  const inputClass = "w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:border-indigo-500";
  const textareaClass = `${inputClass} min-h-28`;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Profile & About</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Update hero content, about text, contact details, links, and AI assistant shortcuts.
        </p>
      </div>

      <form onSubmit={save} className="grid gap-5 rounded-2xl border border-border bg-card p-5 shadow-sm md:grid-cols-2">
        {loading && <p className="md:col-span-2 text-muted-foreground">Loading profile...</p>}

        <label>
          <span className="mb-1.5 block text-sm font-medium">Full Name</span>
          <input className={inputClass} value={form.name} onChange={(e) => update("name", e.target.value)} required />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-medium">Hero Display Name</span>
          <input className={inputClass} value={form.short_name} onChange={(e) => update("short_name", e.target.value)} required />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-medium">Brand Name</span>
          <input className={inputClass} value={form.brand_name} onChange={(e) => update("brand_name", e.target.value)} required />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-medium">Location</span>
          <input className={inputClass} value={form.location} onChange={(e) => update("location", e.target.value)} />
        </label>
        <label className="md:col-span-2">
          <span className="mb-1.5 block text-sm font-medium">Headline</span>
          <input className={inputClass} value={form.headline} onChange={(e) => update("headline", e.target.value)} />
        </label>
        <label className="md:col-span-2">
          <span className="mb-1.5 block text-sm font-medium">Hero Summary</span>
          <textarea className={textareaClass} value={form.summary} onChange={(e) => update("summary", e.target.value)} />
        </label>
        <label className="md:col-span-2">
          <span className="mb-1.5 block text-sm font-medium">About Text</span>
          <textarea className={textareaClass} value={form.about} onChange={(e) => update("about", e.target.value)} />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-medium">Hero Image URL</span>
          <input className={inputClass} value={form.avatar_url} onChange={(e) => update("avatar_url", e.target.value)} />
          <UploadControl onFile={(file) => void upload("avatar_url", file)} />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-medium">Header Logo Image URL</span>
          <input className={inputClass} value={form.logo_avatar_url} onChange={(e) => update("logo_avatar_url", e.target.value)} />
          <UploadControl onFile={(file) => void upload("logo_avatar_url", file)} />
        </label>
        <label className="md:col-span-2">
          <span className="mb-1.5 block text-sm font-medium">Roles (comma separated)</span>
          <input className={inputClass} value={form.roles} onChange={(e) => update("roles", e.target.value)} />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-medium">GitHub URL</span>
          <input className={inputClass} value={form.github_url} onChange={(e) => update("github_url", e.target.value)} />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-medium">LinkedIn URL</span>
          <input className={inputClass} value={form.linkedin_url} onChange={(e) => update("linkedin_url", e.target.value)} />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-medium">Resume URL</span>
          <input className={inputClass} value={form.resume_url} onChange={(e) => update("resume_url", e.target.value)} />
        </label>
        <label>
          <span className="mb-1.5 block text-sm font-medium">Contact Email</span>
          <input className={inputClass} value={form.contact_email} onChange={(e) => update("contact_email", e.target.value)} />
        </label>
        <label className="md:col-span-2">
          <span className="mb-1.5 block text-sm font-medium">Phones (comma separated)</span>
          <input className={inputClass} value={form.phones} onChange={(e) => update("phones", e.target.value)} />
        </label>
        <label className="md:col-span-2">
          <span className="mb-1.5 block text-sm font-medium">AI Suggested Questions (comma separated)</span>
          <textarea className={textareaClass} value={form.suggested_questions} onChange={(e) => update("suggested_questions", e.target.value)} />
        </label>

        <button
          type="submit"
          className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3 font-semibold text-white"
        >
          <Save className="h-4 w-4" />
          Save Profile
        </button>
      </form>
    </div>
  );
};

function UploadControl({ onFile }: { onFile: (file: File | null) => void }) {
  return (
    <span className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-muted">
      <ImagePlus className="h-4 w-4" />
      Upload
      <input type="file" className="hidden" onChange={(event) => onFile(event.target.files?.[0] || null)} />
    </span>
  );
}

export default AdminProfilePage;

