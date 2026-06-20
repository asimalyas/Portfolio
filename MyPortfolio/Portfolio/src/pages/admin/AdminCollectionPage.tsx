import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { BadgeCheck, ExternalLink, FileText, ImagePlus, Loader2, Plus, Save, Sparkles, Trash2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { adminCollections, type AdminCollectionConfig, type AdminField } from "@/lib/admin-config";
import { arrayToInput, inputToArray, isValidUrl, normalizeFormValue, uploadPortfolioAsset } from "@/lib/admin-utils";
import { supabase } from "@/lib/supabase";

type Row = Record<string, unknown> & { id?: string };
type FormState = Record<string, string | boolean>;
type AiCollection = "certificates" | "achievements" | "experience";
type AiSuggestionValue = string | string[];
type UploadState = { phase: "uploading" | "analyzing"; message: string };
type UploadPreview = { url: string; fileName: string; mimeType: string; isLocal?: boolean };
type AiExtractResponse = {
  suggestions?: Record<string, AiSuggestionValue>;
  confidence?: "low" | "medium" | "high";
  notes?: string[];
  error?: string;
};

const MAX_AI_FILE_BYTES = 8 * 1024 * 1024;
const AI_COLLECTIONS = new Set(["certificates", "achievements", "experience"]);

const sectionAccents: Record<string, string> = {
  projects: "from-cyan-500 to-blue-500",
  certificates: "from-amber-500 to-orange-500",
  skills: "from-emerald-500 to-teal-500",
  experience: "from-violet-500 to-purple-500",
  education: "from-indigo-500 to-sky-500",
  achievements: "from-pink-500 to-rose-500",
};

function valueForField(row: Row | null, field: AdminField): string | boolean {
  const value = row?.[field.key];
  if (field.type === "boolean") return typeof value === "boolean" ? value : field.key === "active";
  if (field.type === "array") return arrayToInput(value);
  if (field.type === "number") return String(value ?? 0);
  if (field.type === "select") return String(value ?? field.options?.[0] ?? "");
  return String(value ?? "");
}

function createInitialForm(config: AdminCollectionConfig, row: Row | null): FormState {
  return Object.fromEntries(config.fields.map((field) => [field.key, valueForField(row, field)]));
}

function valuesFromUnknown(value: unknown) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string" && value.trim()) return [value.trim()];
  return [];
}

function isCategoryField(field: AdminField) {
  return field.key === "categories";
}

function isUploadField(field: AdminField) {
  return field.key.includes("image") || field.key.includes("certificate");
}

function isWideField(field: AdminField) {
  return field.type === "textarea" || field.type === "array" || isCategoryField(field) || isUploadField(field);
}

function isAiCollection(slug: string): slug is AiCollection {
  return AI_COLLECTIONS.has(slug);
}

function isBlankFormValue(value: string | boolean | undefined) {
  if (typeof value === "boolean") return false;
  return !String(value || "").trim();
}

function suggestionToFormValue(value: AiSuggestionValue) {
  if (Array.isArray(value)) return arrayToInput(value);
  return String(value || "").trim();
}

function isPreviewableImage(preview: UploadPreview | null, url: string) {
  if (preview?.mimeType.startsWith("image/")) return true;
  return /\.(png|jpe?g|gif|webp|svg)(\?|#|$)/i.test(url);
}

function UploadPreviewCard({ preview, url }: { preview: UploadPreview | null; url: string }) {
  if (!url) return null;

  const safeLink = isValidUrl(url);
  const label = preview?.fileName || "Saved upload";
  const showImage = isPreviewableImage(preview, url);

  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-border bg-muted/30">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 text-xs">
        <span className="min-w-0 truncate font-semibold text-muted-foreground">{label}</span>
        {safeLink && (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-shrink-0 items-center gap-1 font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-300"
          >
            Open
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
      {showImage ? (
        <div className="bg-background p-3">
          <img src={url} alt={label} className="max-h-72 w-full rounded-xl object-contain" />
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-background p-4 text-sm text-muted-foreground">
          <FileText className="h-5 w-5 flex-shrink-0 text-indigo-500" />
          <span className="min-w-0 truncate">Document uploaded and linked.</span>
        </div>
      )}
    </div>
  );
}

function FieldBusyState({ state }: { state?: UploadState }) {
  if (!state) return null;

  return (
    <div className="mt-3 rounded-2xl border border-indigo-500/25 bg-indigo-500/10 p-4 text-xs text-indigo-700 dark:text-indigo-200">
      <div className="mb-3 flex items-center gap-2 font-semibold">
        {state.phase === "analyzing" ? <Sparkles className="h-4 w-4" /> : <Loader2 className="h-4 w-4 animate-spin" />}
        <span>{state.message}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-indigo-500/15">
        <div className="h-full w-2/3 animate-pulse rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
      </div>
    </div>
  );
}

function CategoryPicker({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  const [newCategory, setNewCategory] = useState("");
  const selected = inputToArray(value);
  const allOptions = Array.from(new Set([...options, ...selected])).filter(Boolean).sort((a, b) => a.localeCompare(b));

  const toggle = (category: string) => {
    const next = selected.includes(category)
      ? selected.filter((item) => item !== category)
      : [...selected, category];
    onChange(arrayToInput(next));
  };

  const addCategory = () => {
    const category = newCategory.trim();
    if (!category) return;
    if (!selected.includes(category)) onChange(arrayToInput([...selected, category]));
    setNewCategory("");
  };

  return (
    <div className="space-y-3">
      <div className="flex min-h-14 flex-wrap gap-2 rounded-2xl border border-border bg-background p-3">
        {allOptions.length ? (
          allOptions.map((category) => {
            const active = selected.includes(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggle(category)}
                className={`rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
                  active
                    ? "border-indigo-500 bg-indigo-500 text-white shadow-sm shadow-indigo-500/20"
                    : "border-border bg-muted/60 text-muted-foreground hover:border-indigo-500/40 hover:text-foreground"
                }`}
              >
                {category}
              </button>
            );
          })
        ) : (
          <p className="px-1 py-2 text-sm text-muted-foreground">No categories yet. Add one below.</p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(event) => setNewCategory(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addCategory();
            }
          }}
          placeholder={`Add new ${label.toLowerCase()}`}
          className="min-w-0 flex-1 rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
        />
        <button
          type="button"
          onClick={addCategory}
          className="rounded-2xl border border-border px-4 py-3 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          Add
        </button>
      </div>

      <input type="hidden" value={value} readOnly />
    </div>
  );
}

const AdminCollectionPage: React.FC = () => {
  const { section } = useParams();
  const config = useMemo(
    () => adminCollections.find((collection) => collection.slug === section) || adminCollections[0],
    [section],
  );
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<FormState>(() => createInitialForm(config, null));
  const [loading, setLoading] = useState(false);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(() => new Set());
  const [uploadStates, setUploadStates] = useState<Record<string, UploadState>>({});
  const [uploadPreviews, setUploadPreviews] = useState<Record<string, UploadPreview>>({});
  const formRef = useRef<FormState>(form);
  const touchedFieldsRef = useRef<Set<string>>(touchedFields);
  const queryClient = useQueryClient();
  const hasPendingUpload = Object.keys(uploadStates).length > 0;
  const accent = sectionAccents[config.slug] || "from-indigo-500 to-purple-500";
  const aiEnabled = isAiCollection(config.slug);

  const loadRows = useCallback(async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await supabase.from(config.table).select("*").order("sort_order", { ascending: true });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setRows((data || []) as Row[]);
  }, [config.table]);

  useEffect(() => {
    const initialForm = createInitialForm(config, null);
    const initialTouched = new Set<string>();

    setEditing(null);
    setForm(initialForm);
    formRef.current = initialForm;
    setTouchedFields(initialTouched);
    touchedFieldsRef.current = initialTouched;
    setUploadStates({});
    setUploadPreviews({});
    void loadRows();
  }, [config, loadRows]);

  const categoryOptions = useMemo(() => {
    const values = new Set<string>();

    config.fields.forEach((field) => {
      if (isCategoryField(field)) field.options?.forEach((option) => values.add(option));
    });

    rows.forEach((row) => {
      valuesFromUnknown(row.categories).forEach((value) => values.add(value));
      valuesFromUnknown(row.category).forEach((value) => values.add(value));
    });

    return Array.from(values).filter(Boolean);
  }, [config.fields, rows]);

  const startCreate = () => {
    const initialForm = createInitialForm(config, null);
    const initialTouched = new Set<string>();

    setEditing(null);
    setForm(initialForm);
    formRef.current = initialForm;
    setTouchedFields(initialTouched);
    touchedFieldsRef.current = initialTouched;
    setUploadStates({});
    setUploadPreviews({});
  };

  const startEdit = (row: Row) => {
    const nextForm = createInitialForm(config, row);
    const initialTouched = new Set<string>();

    setEditing(row);
    setForm(nextForm);
    formRef.current = nextForm;
    setTouchedFields(initialTouched);
    touchedFieldsRef.current = initialTouched;
    setUploadStates({});
    setUploadPreviews({});
  };

  const updateField = (key: string, value: string | boolean, markTouched = true) => {
    setForm((current) => {
      const next = { ...current, [key]: value };
      formRef.current = next;
      return next;
    });

    if (markTouched) {
      setTouchedFields((current) => {
        const next = new Set(current);
        next.add(key);
        touchedFieldsRef.current = next;
        return next;
      });
    }
  };

  const validate = () => {
    for (const field of config.fields) {
      const value = form[field.key];
      if (field.required && !String(value || "").trim()) {
        toast.error(`${field.label} is required.`);
        return false;
      }

      if (field.type === "url" && typeof value === "string" && !isValidUrl(value)) {
        toast.error(`${field.label} must be a valid URL or local path.`);
        return false;
      }
    }

    return true;
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || hasPendingUpload || !validate()) return;

    const payload = Object.fromEntries(
      config.fields.map((field) => [field.key, normalizeFormValue(field.type, form[field.key])]),
    );

    const result = editing?.id
      ? await supabase.from(config.table).update(payload).eq("id", editing.id)
      : await supabase.from(config.table).insert(payload);

    if (result.error) {
      toast.error(result.error.message);
      return;
    }

    toast.success(editing ? `${config.title} item updated.` : `${config.title} item created.`);
    await queryClient.invalidateQueries({ queryKey: ["portfolio-data"] });
    startCreate();
    await loadRows();
  };

  const remove = async (row: Row) => {
    if (!supabase || !row.id) return;
    const label = String(row[config.listLabel] || "this item");
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;

    const { error } = await supabase.from(config.table).delete().eq("id", row.id);
    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Deleted.");
    await queryClient.invalidateQueries({ queryKey: ["portfolio-data"] });
    if (editing?.id === row.id) startCreate();
    await loadRows();
  };

  const applyAiSuggestions = (suggestions: Record<string, AiSuggestionValue> | undefined) => {
    if (!suggestions) return 0;

    const fieldByKey = new Map(config.fields.map((field) => [field.key, field]));
    const currentForm = formRef.current;
    const currentTouchedFields = touchedFieldsRef.current;
    const appliedValues: FormState = {};
    let appliedCount = 0;

    Object.entries(suggestions).forEach(([key, value]) => {
      const field = fieldByKey.get(key);
      if (!field || currentTouchedFields.has(key) || !isBlankFormValue(currentForm[key])) return;

      const nextValue = suggestionToFormValue(value);
      if (!nextValue) return;
      if (field.type === "select" && field.options?.length && !field.options.includes(nextValue)) return;

      appliedValues[key] = nextValue;
      appliedCount += 1;
    });

    if (appliedCount) {
      setForm((current) => {
        const next = { ...current };

        Object.entries(appliedValues).forEach(([key, value]) => {
          if (!touchedFieldsRef.current.has(key) && isBlankFormValue(next[key])) {
            next[key] = value;
          }
        });

        formRef.current = next;
        return next;
      });
    }

    return appliedCount;
  };

  const requestAiExtraction = async (field: AdminField, file: File, assetUrl: string) => {
    if (!supabase || !isAiCollection(config.slug)) return null;

    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new Error("Please sign in again before using AI autofill.");

    const response = await fetch("/api/extract-admin-item", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        collection: config.slug,
        fieldKey: field.key,
        assetUrl,
        fileName: file.name,
        mimeType: file.type || "application/octet-stream",
        existingValues: formRef.current,
      }),
    });

    const dataJson = (await response.json().catch(() => ({}))) as AiExtractResponse;
    if (!response.ok) {
      throw new Error(dataJson.error || "AI autofill failed. You can fill fields manually.");
    }

    return dataJson;
  };

  const uploadForField = async (field: AdminField, file: File | null) => {
    if (!file) return;

    let localPreviewUrl = "";
    try {
      localPreviewUrl = URL.createObjectURL(file);
    } catch {
      localPreviewUrl = "";
    }

    if (localPreviewUrl) {
      setUploadPreviews((current) => ({
        ...current,
        [field.key]: {
          url: localPreviewUrl,
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
          isLocal: true,
        },
      }));
    }

    setUploadStates((current) => ({
      ...current,
      [field.key]: { phase: "uploading", message: `Uploading ${file.name}...` },
    }));

    try {
      const url = await uploadPortfolioAsset(file, config.slug);
      updateField(field.key, url, false);
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
      setUploadPreviews((current) => ({
        ...current,
        [field.key]: {
          url,
          fileName: file.name,
          mimeType: file.type || "application/octet-stream",
        },
      }));
      toast.success("File uploaded.");

      if (!isAiCollection(config.slug)) return;

      if (file.size > MAX_AI_FILE_BYTES) {
        toast("File uploaded, but it is too large for AI autofill. You can fill fields manually.");
        return;
      }

      setUploadStates((current) => ({
        ...current,
        [field.key]: { phase: "analyzing", message: "AI is reading this document..." },
      }));

      try {
        const aiResult = await requestAiExtraction(field, file, url);
        const appliedCount = applyAiSuggestions(aiResult?.suggestions);

        if (appliedCount > 0) {
          toast.success(`AI filled ${appliedCount} fields. Review before saving.`);
        } else {
          toast("AI read the document, but found no empty fields to fill.");
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "File uploaded, but AI autofill failed.");
      }
    } catch (error) {
      if (localPreviewUrl) URL.revokeObjectURL(localPreviewUrl);
      setUploadPreviews((current) => {
        const next = { ...current };
        delete next[field.key];
        return next;
      });
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setUploadStates((current) => {
        const next = { ...current };
        delete next[field.key];
        return next;
      });
    }
  };

  const inputClass = "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15";

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accent}`} />
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-border bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                {rows.length} {rows.length === 1 ? "item" : "items"}
              </span>
              {aiEnabled && (
                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-300">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  AI upload enabled
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">{config.title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{config.description}</p>
          </div>
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:-translate-y-0.5 hover:shadow-purple-500/30"
          >
            <Plus className="h-4 w-4" />
            New Item
          </button>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(320px,0.9fr)_minmax(0,1.25fr)]">
        <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
          <div className="border-b border-border p-5">
            <p className="text-sm font-black">Existing items</p>
            <p className="mt-1 text-xs text-muted-foreground">Select an item to edit, or create a new record.</p>
          </div>

          <div className="max-h-[calc(100vh-18rem)] space-y-2 overflow-y-auto p-3">
            {loading ? (
              <div className="rounded-2xl border border-border bg-background p-5 text-sm text-muted-foreground">
                Loading items...
              </div>
            ) : rows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-background p-6 text-center">
                <UploadCloud className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                <p className="font-bold">No items yet</p>
                <p className="mt-1 text-sm text-muted-foreground">Create the first {config.title.toLowerCase()} item.</p>
                <button
                  type="button"
                  onClick={startCreate}
                  className="mt-4 rounded-2xl border border-border px-4 py-2 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  Start empty item
                </button>
              </div>
            ) : (
              rows.map((row, index) => {
                const selected = editing?.id === row.id;
                return (
                  <div
                    key={String(row.id || `${config.slug}-${index}`)}
                    className={`group flex items-center gap-3 rounded-2xl border p-3 transition-all ${
                      selected
                        ? "border-indigo-500/40 bg-indigo-500/10 shadow-sm shadow-indigo-500/10"
                        : "border-transparent bg-background hover:border-border hover:bg-muted/40"
                    }`}
                  >
                    <button type="button" onClick={() => startEdit(row)} className="min-w-0 flex-1 text-left">
                      <p className="truncate text-sm font-black">{String(row[config.listLabel] || "Untitled")}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-muted-foreground">
                        <span className={`rounded-full px-2 py-0.5 ${row.active === false ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"}`}>
                          {row.active === false ? "Hidden" : "Public"}
                        </span>
                        <span>Sort {String(row.sort_order ?? 0)}</span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => void remove(row)}
                      className="rounded-xl p-2 text-muted-foreground opacity-70 transition-colors hover:bg-red-500/10 hover:text-red-500 group-hover:opacity-100"
                      aria-label="Delete item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm">
          <div className="border-b border-border p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  {editing ? "Editing record" : "Create record"}
                </p>
                <h2 className="mt-1 text-xl font-black">{editing ? String(editing[config.listLabel] || "Edit Item") : `New ${config.title} Item`}</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {aiEnabled
                    ? "Upload a document first if you want AI to fill blank fields. Review everything before saving."
                    : "Fill the fields below and save when the item is ready to publish."}
                </p>
              </div>
              {hasPendingUpload && (
                <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-300">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Working
                </span>
              )}
            </div>
          </div>

          <form onSubmit={save} className="p-5 sm:p-6">
            <div className="grid gap-5 md:grid-cols-2">
              {config.fields.map((field) => {
                const fieldBusyState = uploadStates[field.key];
                const preview = uploadPreviews[field.key] || null;
                const previewUrl = preview?.url || String(form[field.key] || "");
                const wide = isWideField(field);

                return (
                  <div key={field.key} className={wide ? "md:col-span-2" : undefined}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label className="block text-sm font-bold">{field.label}</label>
                      {field.required && <span className="text-[11px] font-bold text-indigo-500">Required</span>}
                    </div>

                    {isCategoryField(field) ? (
                      <CategoryPicker
                        label={field.label}
                        value={String(form[field.key] || "")}
                        options={categoryOptions}
                        onChange={(value) => updateField(field.key, value)}
                      />
                    ) : field.type === "textarea" ? (
                      <textarea
                        value={String(form[field.key] || "")}
                        onChange={(event) => updateField(field.key, event.target.value)}
                        placeholder={field.placeholder}
                        rows={5}
                        className={`${inputClass} min-h-32 resize-y`}
                      />
                    ) : field.type === "boolean" ? (
                      <button
                        type="button"
                        onClick={() => updateField(field.key, !form[field.key])}
                        className="inline-flex items-center gap-3 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <span className={`relative h-6 w-11 rounded-full transition-colors ${form[field.key] ? "bg-indigo-500" : "bg-muted"}`}>
                          <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${form[field.key] ? "translate-x-6" : "translate-x-1"}`} />
                        </span>
                        {form[field.key] ? "Visible publicly" : "Hidden publicly"}
                      </button>
                    ) : field.type === "select" ? (
                      <select
                        value={String(form[field.key] || field.options?.[0] || "")}
                        onChange={(event) => updateField(field.key, event.target.value)}
                        className={inputClass}
                      >
                        {(field.options || []).map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type === "number" ? "number" : "text"}
                        value={String(form[field.key] || "")}
                        onChange={(event) => updateField(field.key, event.target.value)}
                        placeholder={field.placeholder || (field.type === "array" ? "Separate values with commas" : undefined)}
                        className={inputClass}
                      />
                    )}

                    {field.type === "array" && !isCategoryField(field) && (
                      <p className="mt-2 text-xs text-muted-foreground">Use commas between multiple values.</p>
                    )}

                    {isUploadField(field) && (
                      <>
                        <label className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-border bg-background px-4 py-3 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                          {fieldBusyState ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                          {fieldBusyState ? "Working on upload..." : "Upload file"}
                          <input
                            type="file"
                            className="hidden"
                            disabled={Boolean(fieldBusyState)}
                            onChange={(event) => {
                              const file = event.currentTarget.files?.[0] || null;
                              event.currentTarget.value = "";
                              void uploadForField(field, file);
                            }}
                          />
                        </label>
                        <FieldBusyState state={fieldBusyState} />
                        <UploadPreviewCard preview={preview} url={previewUrl} />
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-background p-4 sm:flex sm:items-center sm:justify-between sm:gap-4">
              <p className="mb-3 text-sm text-muted-foreground sm:mb-0">
                {hasPendingUpload ? "Please wait for upload or AI extraction to finish before saving." : "Create/Save is the final confirmation for public content."}
              </p>
              <button
                type="submit"
                disabled={hasPendingUpload}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:-translate-y-0.5 hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 sm:w-auto"
              >
                {hasPendingUpload ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {hasPendingUpload ? "Please wait" : editing ? "Save Changes" : "Create Item"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default AdminCollectionPage;
