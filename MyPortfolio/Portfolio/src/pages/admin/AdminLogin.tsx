import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { toast } from "sonner";
import { ADMIN_EMAIL, isAdminEmail, isSupabaseConfigured, supabase } from "@/lib/supabase";

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
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
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background px-6 py-16 text-foreground">
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage portfolio content securely with Supabase Auth.
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-500">
            Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY before logging in.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading || !isSupabaseConfigured}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-3 font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <Link to="/" className="mt-6 block text-center text-sm text-muted-foreground hover:text-foreground">
          Back to portfolio
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;
