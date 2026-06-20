import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { adminCollections, type AdminCollectionConfig, type AdminField } from "@/lib/admin-config";
import { arrayToInput, inputToArray, isValidUrl, normalizeFormValue, uploadPortfolioAsset } from "@/lib/admin-utils";
import { supabase } from "@/lib/supabase";

type Row = Record<string, unknown> & { id?: string };
type FormState = Record<string, string | boolean>;

function valueForField(row: Row | null, field: AdminField): string | boolean {
  const value = row?.[field.key];
  if (field.type === "boolean") return typeof value === "boolean" ? value : field.key === "active";
  if (field.type === "array") return arrayToInput(value);
  if (field.type === "number") return String(value ?? 0);
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
      <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-background p-3">
        {allOptions.length ? (
          allOptions.map((category) => {
            const active = selected.includes(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => toggle(category)}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  active
                    ? "border-indigo-500 bg-indigo-500 text-white"
                    : "border-border bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {category}
              </button>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">No categories yet. Add one below.</p>
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
          className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 outline-none focus:border-indigo-500"
        />
        <button
          type="button"
          onClick={addCategory}
          className="rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
  const queryClient = useQueryClient();

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
    setEditing(null);
    setForm(createInitialForm(config, null));
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
    setEditing(null);
    setForm(createInitialForm(config, null));
  };

  const startEdit = (row: Row) => {
    setEditing(row);
    setForm(createInitialForm(config, row));
  };

  const updateField = (key: string, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
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
    if (!supabase || !validate()) return;

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

  const uploadForField = async (field: AdminField, file: File | null) => {
    if (!file) return;
    try {
      const url = await uploadPortfolioAsset(file, config.slug);
      updateField(field.key, url);
      toast.success("File uploaded.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed.");
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <section>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{config.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{config.description}</p>
          </div>
          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            New
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-card">
          {loading ? (
            <p className="p-5 text-muted-foreground">Loading...</p>
          ) : rows.length === 0 ? (
            <p className="p-5 text-muted-foreground">No items yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {rows.map((row) => (
                <div key={row.id} className="flex items-center justify-between gap-3 p-4">
                  <button type="button" onClick={() => startEdit(row)} className="min-w-0 text-left">
                    <p className="truncate font-medium">{String(row[config.listLabel] || "Untitled")}</p>
                    <p className="text-xs text-muted-foreground">
                      {row.active === false ? "Hidden" : "Public"} | Sort {String(row.sort_order ?? 0)}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => void remove(row)}
                    className="rounded-lg p-2 text-red-500 transition-colors hover:bg-red-500/10"
                    aria-label="Delete item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="mb-5 text-xl font-bold">{editing ? "Edit Item" : "Create Item"}</h2>
        <form onSubmit={save} className="space-y-4">
          {config.fields.map((field) => (
            <div key={field.key}>
              <label className="mb-1.5 block text-sm font-medium">{field.label}</label>
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
                  rows={4}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:border-indigo-500"
                />
              ) : field.type === "boolean" ? (
                <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={Boolean(form[field.key])}
                    onChange={(event) => updateField(field.key, event.target.checked)}
                  />
                  Enabled
                </label>
              ) : field.type === "select" ? (
                <select
                  value={String(form[field.key] || field.options?.[0] || "")}
                  onChange={(event) => updateField(field.key, event.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:border-indigo-500"
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
                  placeholder={field.placeholder}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:border-indigo-500"
                />
              )}

              {(field.key.includes("image") || field.key.includes("certificate")) && (
                <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-muted">
                  <ImagePlus className="h-4 w-4" />
                  Upload file
                  <input
                    type="file"
                    className="hidden"
                    onChange={(event) => void uploadForField(field, event.target.files?.[0] || null)}
                  />
                </label>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3 font-semibold text-white"
          >
            <Save className="h-4 w-4" />
            {editing ? "Save Changes" : "Create"}
          </button>
        </form>
      </section>
    </div>
  );
};

export default AdminCollectionPage;

