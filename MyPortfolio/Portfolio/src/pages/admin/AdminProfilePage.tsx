import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AtSign, ImagePlus, Link as LinkIcon, Loader2, MapPin, Save, Sparkles, UserRound } from "lucide-react";
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
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<Partial<Record<keyof ProfileForm, boolean>>>({});
  const queryClient = useQueryClient();
  const hasUpload = Object.values(uploading).some(Boolean);
  const roleChips = inputToArray(form.roles).slice(0, 4);

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

    setUploading((current) => ({ ...current, [key]: true }));
    try {
      const url = await uploadPortfolioAsset(file, "profile");
      update(key, url);
      toast.success("Image uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploading((current) => ({ ...current, [key]: false }));
    }
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || hasUpload) return;

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

    setSaving(true);
    const { error } = await supabase.from("profile").upsert(payload);
    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["portfolio-data"] });
    toast.success("Profile updated.");
  };

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.16),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.10),transparent_28%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <img
              src={form.logo_avatar_url || form.avatar_url}
              alt={form.name || "Profile"}
              className="h-16 w-16 rounded-3xl border-2 border-indigo-500 bg-white object-cover object-top shadow-lg shadow-indigo-500/10"
            />
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-300">
                <UserRound className="h-3.5 w-3.5" />
                Profile & About
              </div>
              <h1 className="truncate text-2xl font-black tracking-tight sm:text-3xl">{form.brand_name || form.name || "Portfolio profile"}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Update hero content, about text, contact details, links, images, and AI assistant shortcuts.</p>
            </div>
          </div>

          <div className="grid gap-2 rounded-3xl border border-border bg-background/70 p-4 sm:min-w-80">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{form.location || "Location not set"}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {roleChips.length ? (
                roleChips.map((role) => (
                  <span key={role} className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-300">
                    {role}
                  </span>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">Add portfolio roles below.</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <form onSubmit={save} className="space-y-5">
        {loading && (
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading profile...
          </div>
        )}

        <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
          <FormSection
            title="Identity"
            description="Names, headline, location, and public role chips."
            icon={<UserRound className="h-5 w-5" />}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput label="Full Name" value={form.name} onChange={(value) => update("name", value)} required />
              <TextInput label="Hero Display Name" value={form.short_name} onChange={(value) => update("short_name", value)} required />
              <TextInput label="Brand Name" value={form.brand_name} onChange={(value) => update("brand_name", value)} required />
              <TextInput label="Location" value={form.location} onChange={(value) => update("location", value)} />
              <div className="md:col-span-2">
                <TextInput label="Roles (comma separated)" value={form.roles} onChange={(value) => update("roles", value)} placeholder="AI Engineer, Web Developer" />
              </div>
            </div>
          </FormSection>

          <FormSection
            title="Images"
            description="Upload or paste image URLs used by the public portfolio."
            icon={<ImagePlus className="h-5 w-5" />}
          >
            <div className="grid gap-4">
              <ImageUrlField
                label="Hero Image URL"
                value={form.avatar_url}
                onChange={(value) => update("avatar_url", value)}
                onFile={(file) => void upload("avatar_url", file)}
                uploading={Boolean(uploading.avatar_url)}
              />
              <ImageUrlField
                label="Header Logo Image URL"
                value={form.logo_avatar_url}
                onChange={(value) => update("logo_avatar_url", value)}
                onFile={(file) => void upload("logo_avatar_url", file)}
                uploading={Boolean(uploading.logo_avatar_url)}
              />
            </div>
          </FormSection>
        </div>

        <FormSection
          title="Portfolio Story"
          description="Keep this concise, confident, and aligned with the public hero section."
          icon={<Sparkles className="h-5 w-5" />}
        >
          <div className="grid gap-4">
            <TextInput label="Headline" value={form.headline} onChange={(value) => update("headline", value)} />
            <TextArea label="Hero Summary" value={form.summary} onChange={(value) => update("summary", value)} rows={4} />
            <TextArea label="About Text" value={form.about} onChange={(value) => update("about", value)} rows={6} />
          </div>
        </FormSection>

        <div className="grid gap-5 xl:grid-cols-2">
          <FormSection
            title="Links & Contact"
            description="Public profile links, resume, email, and phone numbers."
            icon={<LinkIcon className="h-5 w-5" />}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput label="GitHub URL" value={form.github_url} onChange={(value) => update("github_url", value)} />
              <TextInput label="LinkedIn URL" value={form.linkedin_url} onChange={(value) => update("linkedin_url", value)} />
              <TextInput label="Resume URL" value={form.resume_url} onChange={(value) => update("resume_url", value)} />
              <TextInput label="Contact Email" value={form.contact_email} onChange={(value) => update("contact_email", value)} icon={<AtSign className="h-4 w-4" />} />
              <div className="md:col-span-2">
                <TextInput label="Phones (comma separated)" value={form.phones} onChange={(value) => update("phones", value)} placeholder="+92..., +92..." />
              </div>
            </div>
          </FormSection>

          <FormSection
            title="AI Assistant Shortcuts"
            description="Questions shown to visitors so they can start useful conversations quickly."
            icon={<Sparkles className="h-5 w-5" />}
          >
            <TextArea
              label="AI Suggested Questions (comma separated)"
              value={form.suggested_questions}
              onChange={(value) => update("suggested_questions", value)}
              rows={8}
              placeholder="What projects has Asim built?, What skills does Asim have?"
            />
          </FormSection>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-4 shadow-sm sm:flex sm:items-center sm:justify-between sm:gap-4">
          <p className="mb-3 text-sm text-muted-foreground sm:mb-0">
            {hasUpload ? "Please wait for image upload to finish before saving." : "Save updates only after reviewing the public-facing text and links."}
          </p>
          <button
            type="submit"
            disabled={saving || hasUpload}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:-translate-y-0.5 hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 sm:w-auto"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

function FormSection({
  title,
  description,
  icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-black">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function TextInput({
  label,
  value,
  onChange,
  required,
  placeholder,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-3 text-sm font-bold">
        <span>{label}</span>
        {required && <span className="text-[11px] text-indigo-500">Required</span>}
      </span>
      <span className="relative block">
        {icon && <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
        <input
          className={`w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 ${icon ? "pl-11" : ""}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          required={required}
        />
      </span>
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold">{label}</span>
      <textarea
        className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={rows}
        placeholder={placeholder}
      />
    </label>
  );
}

function ImageUrlField({
  label,
  value,
  onChange,
  onFile,
  uploading,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onFile: (file: File | null) => void;
  uploading: boolean;
}) {
  return (
    <div>
      <TextInput label={label} value={value} onChange={onChange} />
      <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-background">
        {value ? (
          <img src={value} alt={label} className="max-h-56 w-full object-contain p-3" />
        ) : (
          <div className="flex min-h-32 items-center justify-center p-4 text-sm text-muted-foreground">No image selected.</div>
        )}
        <div className="flex items-center justify-between gap-3 border-t border-border px-3 py-3">
          <span className="min-w-0 truncate text-xs text-muted-foreground">{value || "Upload an image or paste a URL"}</span>
          <label className="inline-flex flex-shrink-0 cursor-pointer items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            {uploading ? "Uploading" : "Upload"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(event) => {
                const file = event.currentTarget.files?.[0] || null;
                event.currentTarget.value = "";
                onFile(file);
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default AdminProfilePage;
