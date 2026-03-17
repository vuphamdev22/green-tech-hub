import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Welcome back!");
    setTimeout(() => navigate("/profile"), 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-carbon-900 grid-pattern px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-brand rounded-sm flex items-center justify-center">
              <Zap className="w-6 h-6 text-carbon-900" fill="currentColor" />
            </div>
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-foreground mt-4">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Sign in to your VoltGear account
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-white/[0.06] rounded-md p-8 space-y-5"
        >
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Email
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full bg-carbon-700 border border-white/10 rounded-sm px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-brand/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full bg-carbon-700 border border-white/10 rounded-sm px-4 py-3 pr-10 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-brand/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-right mt-1">
              <a href="#" className="text-xs text-brand hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand text-carbon-900 font-black text-sm uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            Sign In <ArrowRight className="w-4 h-4" />
          </button>

          <div className="relative">
            <div className="border-t border-white/5" />
            <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-card px-3 text-xs text-muted-foreground">
              or
            </span>
          </div>

          <button
            type="button"
            className="w-full py-3 border border-white/10 text-foreground font-bold text-sm rounded-sm hover:bg-white/5 hover:border-white/20 transition-colors flex items-center justify-center gap-3"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-brand hover:underline font-bold">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
