import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  FolderKanban,
  GraduationCap,
  Medal,
  Sparkles,
  TrendingUp,
  UploadCloud,
  Wrench,
} from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { adminCollections } from "@/lib/admin-config";
import { supabase } from "@/lib/supabase";

type CountRow = { active?: boolean | null };
type DashboardMetric = {
  slug: string;
  title: string;
  total: number;
  publicCount: number;
  hiddenCount: number;
  color: string;
};

const aiSlugs = new Set(["certificates", "experience", "achievements"]);

const sectionMeta: Record<string, { icon: React.ReactNode; color: string; softClass: string; hint: string }> = {
  projects: {
    icon: <FolderKanban className="h-5 w-5" />,
    color: "#0ea5e9",
    softClass: "bg-sky-500/10 text-sky-600 dark:text-sky-300",
    hint: "Project cards and live links",
  },
  certificates: {
    icon: <Award className="h-5 w-5" />,
    color: "#f97316",
    softClass: "bg-orange-500/10 text-orange-600 dark:text-orange-300",
    hint: "Certificate images and issuers",
  },
  skills: {
    icon: <Wrench className="h-5 w-5" />,
    color: "#14b8a6",
    softClass: "bg-teal-500/10 text-teal-600 dark:text-teal-300",
    hint: "Skill cards and highlights",
  },
  experience: {
    icon: <BriefcaseBusiness className="h-5 w-5" />,
    color: "#8b5cf6",
    softClass: "bg-violet-500/10 text-violet-600 dark:text-violet-300",
    hint: "Roles, certificates, and tools",
  },
  education: {
    icon: <GraduationCap className="h-5 w-5" />,
    color: "#3b82f6",
    softClass: "bg-blue-500/10 text-blue-600 dark:text-blue-300",
    hint: "Degrees and institution records",
  },
  achievements: {
    icon: <Medal className="h-5 w-5" />,
    color: "#ec4899",
    softClass: "bg-pink-500/10 text-pink-600 dark:text-pink-300",
    hint: "Awards and public proof",
  },
};

const barChartConfig = {
  total: {
    label: "Total items",
    color: "#8b5cf6",
  },
} satisfies ChartConfig;

const statusChartConfig = {
  public: {
    label: "Public",
    color: "#22c55e",
  },
  hidden: {
    label: "Hidden",
    color: "#f43f5e",
  },
} satisfies ChartConfig;

const AdminDashboard: React.FC = () => {
  const { data: portfolioData } = usePortfolioData();
  const fallbackMetrics = useMemo(() => createFallbackMetrics(portfolioData), [portfolioData]);
  const [metrics, setMetrics] = useState<DashboardMetric[]>(fallbackMetrics);
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  useEffect(() => {
    setMetrics(fallbackMetrics);
  }, [fallbackMetrics]);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;

    const loadMetrics = async () => {
      setLoadingMetrics(true);
      const nextMetrics = await Promise.all(
        adminCollections.map(async (collection) => {
          const fallback = fallbackMetrics.find((item) => item.slug === collection.slug);
          const meta = sectionMeta[collection.slug];
          const { data, count, error } = await supabase
            .from(collection.table)
            .select("active", { count: "exact" });

          if (error) {
            return fallback || createMetric(collection.slug, collection.title, 0, 0, meta?.color);
          }

          const rows = (data || []) as CountRow[];
          const total = count ?? rows.length;
          const publicCount = rows.filter((row) => row.active !== false).length;
          return createMetric(collection.slug, collection.title, total, publicCount, meta?.color);
        }),
      );

      if (mounted) {
        setMetrics(nextMetrics);
        setLoadingMetrics(false);
      }
    };

    void loadMetrics();

    return () => {
      mounted = false;
    };
  }, [fallbackMetrics]);

  const aiCollections = adminCollections.filter((collection) => aiSlugs.has(collection.slug));
  const totalItems = metrics.reduce((sum, item) => sum + item.total, 0);
  const publicItems = metrics.reduce((sum, item) => sum + item.publicCount, 0);
  const hiddenItems = metrics.reduce((sum, item) => sum + item.hiddenCount, 0);
  const largestSection = metrics.reduce<DashboardMetric | null>((largest, item) => {
    if (!largest || item.total > largest.total) return item;
    return largest;
  }, null);

  const barData = metrics.map((metric) => ({
    label: metric.title,
    total: metric.total,
    fill: metric.color,
  }));

  const statusData = [
    { name: "Public", key: "public", value: publicItems, fill: "#22c55e" },
    { name: "Hidden", key: "hidden", value: hiddenItems, fill: "#f43f5e" },
  ].filter((item) => item.value > 0 || item.key === "public");

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.18),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(14,165,233,0.12),transparent_28%)]" />
        <div className="relative grid gap-6 lg:grid-cols-[1.25fr_0.75fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-300">
              <BarChart3 className="h-3.5 w-3.5" />
              Portfolio analytics dashboard
            </div>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Content overview at a glance.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
              The sidebar already handles navigation. This dashboard now focuses on item counts, public visibility, and upload-first AI sections.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatTile label="Total items" value={totalItems} icon={<TrendingUp className="h-4 w-4" />} />
            <StatTile label="Public" value={publicItems} icon={<Eye className="h-4 w-4" />} tone="success" />
            <StatTile label="Hidden" value={hiddenItems} icon={<EyeOff className="h-4 w-4" />} tone="danger" />
            <StatTile label="AI sections" value={aiCollections.length} icon={<Sparkles className="h-4 w-4" />} />
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-black">Section item counts</p>
              <p className="mt-1 text-xs text-muted-foreground">Projects, certificates, skills, experience, education, and achievements.</p>
            </div>
            {loadingMetrics && (
              <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-300">
                Refreshing counts
              </span>
            )}
          </div>

          <ChartContainer config={barChartConfig} className="h-[310px] w-full aspect-auto">
            <BarChart data={barData} margin={{ top: 12, right: 12, left: -18, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={10} interval={0} fontSize={11} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={32} fontSize={11} />
              <ChartTooltip cursor={{ fill: "rgba(99,102,241,0.08)" }} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="total" radius={[10, 10, 4, 4]}>
                {barData.map((entry) => (
                  <Cell key={entry.label} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-black">Visibility status</p>
          <p className="mt-1 text-xs text-muted-foreground">Public versus hidden admin content.</p>
          <div className="relative mt-4">
            <ChartContainer config={statusChartConfig} className="h-[240px] w-full aspect-auto">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={64} outerRadius={92} paddingAngle={5}>
                  {statusData.map((entry) => (
                    <Cell key={entry.key} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-black">{totalItems}</p>
                <p className="text-xs font-semibold text-muted-foreground">items</p>
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-2">
            <StatusLegend label="Public" value={publicItems} className="bg-emerald-500" />
            <StatusLegend label="Hidden" value={hiddenItems} className="bg-rose-500" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black">Content inventory</p>
              <p className="mt-1 text-xs text-muted-foreground">Compact count list, not navigation cards.</p>
            </div>
            {largestSection && (
              <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-bold text-muted-foreground">
                Highest: {largestSection.title}
              </span>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {metrics.map((metric) => {
              const meta = sectionMeta[metric.slug];
              const percent = totalItems > 0 ? Math.round((metric.total / totalItems) * 100) : 0;

              return (
                <div key={metric.slug} className="rounded-2xl border border-border bg-background p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${meta?.softClass || "bg-indigo-500/10 text-indigo-500"}`}>
                        {meta?.icon || <BarChart3 className="h-5 w-5" />}
                      </span>
                      <div>
                        <p className="font-black">{metric.title}</p>
                        <p className="text-xs text-muted-foreground">{meta?.hint}</p>
                      </div>
                    </div>
                    <span className="text-2xl font-black">{metric.total}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full" style={{ width: `${percent}%`, backgroundColor: metric.color }} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{percent}% of content</span>
                    <span>{metric.publicCount} public / {metric.hiddenCount} hidden</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-black">AI upload sections</p>
              <p className="mt-1 text-xs text-muted-foreground">Only upload-first sections stay on the dashboard.</p>
            </div>
            <BadgeCheck className="h-5 w-5 text-indigo-500" />
          </div>

          <div className="grid gap-3">
            {aiCollections.map((collection) => {
              const metric = metrics.find((item) => item.slug === collection.slug);
              const meta = sectionMeta[collection.slug];

              return (
                <Link
                  key={collection.slug}
                  to={`/admin/${collection.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4 transition-all hover:border-indigo-500/40 hover:bg-muted/50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl ${meta?.softClass || "bg-indigo-500/10 text-indigo-500"}`}>
                      {meta?.icon || <UploadCloud className="h-5 w-5" />}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-black">{collection.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {metric?.total ?? 0} items. Upload proof, AI fills blank fields.
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

function createMetric(slug: string, title: string, total: number, publicCount: number, color = "#8b5cf6"): DashboardMetric {
  return {
    slug,
    title,
    total,
    publicCount,
    hiddenCount: Math.max(total - publicCount, 0),
    color,
  };
}

function createFallbackMetrics(portfolioData: ReturnType<typeof usePortfolioData>["data"]): DashboardMetric[] {
  const fallbackCounts: Record<string, number> = {
    projects: portfolioData.projects.length,
    certificates: portfolioData.certificates.length,
    skills: portfolioData.skills.length,
    experience: portfolioData.experience.roles.length,
    education: portfolioData.education.length,
    achievements: portfolioData.achievements.length,
  };

  return adminCollections.map((collection) => {
    const total = fallbackCounts[collection.slug] || 0;
    return createMetric(collection.slug, collection.title, total, total, sectionMeta[collection.slug]?.color);
  });
}

function StatTile({
  label,
  value,
  icon,
  tone = "default",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  tone?: "default" | "success" | "danger";
}) {
  const toneClass =
    tone === "success"
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
      : tone === "danger"
        ? "bg-rose-500/10 text-rose-600 dark:text-rose-300"
        : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300";

  return (
    <div className="rounded-2xl border border-border bg-background/70 p-4">
      <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${toneClass}`}>{icon}</div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-black">{value}</p>
    </div>
  );
}

function StatusLegend({ label, value, className }: { label: string; value: number; className: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3 text-sm">
      <span className="flex items-center gap-2 font-semibold">
        <span className={`h-2.5 w-2.5 rounded-full ${className}`} />
        {label}
      </span>
      <span className="font-black">{value}</span>
    </div>
  );
}

export default AdminDashboard;
