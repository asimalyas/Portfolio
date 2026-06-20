import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { isAdminEmail, isSupabaseConfigured, supabase } from "@/lib/supabase";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supabase) {
      toast.error("Supabase is not configured.");
      return;
    }

    if (!isAdminEmail(email)) {
      toast.error("Only the configured admin email can log in.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    if (!isAdminEmail(data.user?.email)) {
      await supabase.auth.signOut();
      toast.error("This email is not allowed to access the dashboard.");
      return;
    }

    toast.success("Welcome back.");

    // Wait for the Supabase client's internal auth state to fully settle
    // before navigating, so AdminLayout's getSession() call will
    // immediately return the authenticated session.
    await new Promise<void>((resolve) => {
      const { data: sub } = supabase.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_IN" || event === "INITIAL_SESSION") {
          sub.subscription.unsubscribe();
          resolve();
        }
      });
      // Safety timeout — resolve even if the event somehow doesn't fire
      setTimeout(() => {
        sub.subscription.unsubscribe();
        resolve();
      }, 500);
    });

    navigate("/admin", { replace: true });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.18),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_32%)]" />
      <div className="pointer-events-none absolute left-1/2 top-8 h-56 w-56 -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-border/80 bg-card/95 shadow-2xl shadow-black/10 backdrop-blur-xl lg:grid-cols-[0.9fr_1.1fr]">
          <aside className="hidden border-r border-border bg-gradient-to-br from-indigo-500 via-purple-500 to-fuchsia-500 p-8 text-white lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Portfolio Admin Studio
              </div>
              <h1 className="max-w-sm text-4xl font-black leading-tight tracking-tight">
                Manage your portfolio with a cleaner control room.
              </h1>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/80">
                Update projects, certificates, achievements, experience, and AI-assisted document fields from one secure dashboard.
              </p>
            </div>

            <div className="grid gap-3 text-sm">
              {[
                "Secure Supabase authentication",
                "AI document autofill for admin uploads",
                "Fast content edits without touching code",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur">
                  <ShieldCheck className="h-4 w-4 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </aside>

          <main className="p-6 sm:p-8 lg:p-12">
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to portfolio
            </Link>

            <div className="mb-8">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-xl shadow-purple-500/20">
                <Lock className="h-7 w-7" />
              </div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-300">
                Admin Access
              </p>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">Sign in to manage content</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                Use the configured owner account. Autofill is disabled here so the email field starts clean.
              </p>
            </div>

            {!isSupabaseConfigured && (
              <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
                Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before logging in.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">
              <div>
                <label htmlFor="admin-email" className="mb-2 block text-sm font-semibold">
                  Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter admin email"
                    autoComplete="off"
                    name="admin-email"
                    className="w-full rounded-2xl border border-border bg-background px-12 py-4 text-base outline-none transition-all placeholder:text-muted-foreground focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="admin-password" className="mb-2 block text-sm font-semibold">
                  Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter password"
                    autoComplete="new-password"
                    name="admin-password"
                    className="w-full rounded-2xl border border-border bg-background px-12 py-4 pr-14 text-base outline-none transition-all placeholder:text-muted-foreground focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !isSupabaseConfigured}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500 px-4 py-4 text-base font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:-translate-y-0.5 hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
              >
                {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
