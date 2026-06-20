import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { ExternalLink, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { adminNavItems } from "@/lib/admin-config";
import ThemeToggle from "@/components/ThemeToggle";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { isAdminEmail, isSupabaseConfigured, supabase } from "@/lib/supabase";

const AdminLayout: React.FC = () => {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const { data: portfolioData } = usePortfolioData();
  const location = useLocation();
  const navigate = useNavigate();

  const activeItem = useMemo(() => {
    return adminNavItems.find((item) => item.href === location.pathname) || adminNavItems[0];
  }, [location.pathname]);

  useEffect(() => {
    if (!supabase) {
      setUser(null);
      return;
    }

    let mounted = true;

    // 1. Immediately fetch the current session so we don't depend on
    //    the INITIAL_SESSION event (which may have already fired).
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setUser(session?.user ?? null);
      }
    });

    // 2. Listen for future auth changes (sign-in, sign-out, token refresh).
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase?.auth.signOut();
    toast.success("Signed out.");
    navigate("/admin/login");
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-background px-6 py-16 text-foreground">
        <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <ShieldCheck className="mx-auto mb-4 h-10 w-10 text-indigo-500" />
          <h1 className="mb-2 text-2xl font-bold">Supabase is not configured</h1>
          <p className="text-muted-foreground">
            Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to use the admin dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (user === undefined) {
    return <div className="min-h-screen bg-background p-8 text-muted-foreground">Loading admin...</div>;
  }

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (!isAdminEmail(user.email)) {
    void supabase?.auth.signOut();
    toast.error("This email is not allowed to access the portfolio admin.");
    return <Navigate to="/admin/login" replace />;
  }

  const navLinkClass = (href: string) => {
    const active = location.pathname === href;
    return `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
      active
        ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-purple-500/20"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.12),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.08),transparent_30%)]" />

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-border/80 bg-card/90 p-5 shadow-xl shadow-black/5 backdrop-blur-xl xl:flex xl:flex-col">
        <Link to="/admin" className="mb-8 flex items-center gap-3 rounded-3xl border border-border bg-background/70 p-3">
          <img
            src={portfolioData.profile.logoAvatar}
            alt={portfolioData.profile.name}
            className="h-12 w-12 rounded-2xl border-2 border-indigo-500 bg-white object-cover object-top shadow-md"
          />
          <div className="min-w-0">
            <span className="block truncate text-sm font-black text-foreground">{portfolioData.profile.brandName}</span>
            <span className="block text-xs font-medium text-muted-foreground">Portfolio Admin</span>
          </div>
        </Link>

        <nav className="grid gap-2">
          {adminNavItems.map((item) => (
            <Link key={item.href} to={item.href} className={navLinkClass(item.href)}>
              <span>{item.label}</span>
              {location.pathname === item.href && <span className="h-2 w-2 rounded-full bg-white/90" />}
            </Link>
          ))}
        </nav>

        <div className="mt-auto space-y-3 rounded-3xl border border-border bg-background/70 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Signed in</p>
            <p className="mt-1 truncate text-sm font-semibold">{user.email}</p>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" />
              View Site
            </a>
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-muted px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-red-500/10 hover:text-red-500"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="relative xl:pl-72">
        <header className="sticky top-0 z-30 border-b border-border/80 bg-background/85 backdrop-blur-xl xl:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <Link to="/admin" className="flex min-w-0 items-center gap-3">
              <img
                src={portfolioData.profile.logoAvatar}
                alt={portfolioData.profile.name}
                className="h-10 w-10 rounded-2xl border-2 border-indigo-500 bg-white object-cover object-top"
              />
              <div className="min-w-0">
                <span className="block truncate text-sm font-black">{portfolioData.profile.brandName}</span>
                <span className="block text-xs text-muted-foreground">Admin</span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={signOut}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-4 pb-3">
            {adminNavItems.map((item) => (
              <Link key={item.href} to={item.href} className={`${navLinkClass(item.href)} whitespace-nowrap py-2`}>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </header>

        <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6 hidden items-center justify-between rounded-3xl border border-border bg-card/80 px-5 py-4 shadow-sm backdrop-blur xl:flex">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Admin Studio</p>
                <h1 className="mt-1 text-2xl font-black tracking-tight">{activeItem.label}</h1>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span>Clean edits. Fast publishing. Secure access.</span>
              </div>
            </div>

            <Outlet />

            <footer className="mt-10 flex flex-col gap-2 border-t border-border/70 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>Portfolio Admin Studio</span>
              <span>Review uploaded content before publishing.</span>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
