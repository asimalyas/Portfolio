import React, { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { LogOut, ShieldCheck } from "lucide-react";
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

  useEffect(() => {
    if (!supabase) {
      setUser(null);
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase?.auth.signOut();
    toast.success("Signed out.");
    navigate("/admin/login");
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-background px-6 py-16 text-foreground">
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <Link to="/admin" className="flex items-center gap-3 font-bold">
            <img
              src={portfolioData.profile.logoAvatar}
              alt={portfolioData.profile.name}
              className="h-10 w-10 rounded-full border-2 border-indigo-500 bg-white object-cover object-top shadow-md"
            />
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {portfolioData.profile.brandName}
            </span>
          </Link>

          <nav className="flex flex-wrap gap-2">
            {adminNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                  location.pathname === item.href
                    ? "bg-indigo-500 text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;


