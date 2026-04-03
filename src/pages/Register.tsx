import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Eye, EyeOff, Check } from "lucide-react";
import { toast } from "sonner";
import authService from "@/services/authService";

export default function Register() {
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", agree: false,
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.firstName || !form.email || !form.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!form.agree) {
      toast.error("Please accept the terms");
      return;
    }

    try {
      // ✅ CALL API (chỉ thêm đoạn này)
      await authService.register({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      });

      toast.success("Account created! Welcome to VoltGear 🎉");

      setTimeout(() => navigate("/login"), 500); // 👉 chuyển sang login hợp lý hơn

    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Register failed";
      toast.error(message);
    }
  };

  const passwordStrength = () => {
    const pw = form.password;
    if (!pw) return 0;
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };

  const strength = passwordStrength();
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["", "bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-brand"];

  return (
    <div className="min-h-screen flex items-center justify-center bg-carbon-900 grid-pattern px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 bg-brand rounded-sm flex items-center justify-center">
              <Zap className="w-6 h-6 text-carbon-900" fill="currentColor" />
            </div>
          </Link>
          <h1 className="text-3xl font-black tracking-tight text-foreground mt-4">
            Create Account
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Join 2.4M+ VoltGear customers
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-white/[0.06] rounded-md p-8 space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: "firstName", label: "First Name", placeholder: "John" },
              { key: "lastName", label: "Last Name", placeholder: "Doe" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  {label}
                </label>
                <input
                  placeholder={placeholder}
                  value={(form as unknown as Record<string, string>)[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full bg-carbon-700 border border-white/10 rounded-sm px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-brand/50 transition-colors"
                />
              </div>
            ))}
          </div>

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
                placeholder="Min. 8 characters"
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

            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                        i < strength ? strengthColors[strength] : "bg-white/10"
                      }`}
                    />
                  ))}
                </div>
                <span className={`text-[10px] font-bold ${strengthColors[strength].replace("bg-", "text-")}`}>
                  {strengthLabels[strength]}
                </span>
              </div>
            )}
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <div
              onClick={() => setForm((f) => ({ ...f, agree: !f.agree }))}
              className={`w-4 h-4 rounded-sm border flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                form.agree ? "bg-brand border-brand" : "border-white/20 bg-carbon-700"
              }`}
            >
              {form.agree && <Check className="w-3 h-3 text-carbon-900" strokeWidth={3} />}
            </div>
            <span className="text-xs text-muted-foreground">
              I agree to the{" "}
              <a href="#" className="text-brand hover:underline">Terms of Service</a>{" "}
              and{" "}
              <a href="#" className="text-brand hover:underline">Privacy Policy</a>
            </span>
          </label>

          <button
            type="submit"
            className="w-full py-3 bg-brand text-carbon-900 font-black text-sm uppercase tracking-widest rounded-sm hover:opacity-90 transition-opacity"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-brand hover:underline font-bold">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
