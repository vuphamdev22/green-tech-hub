import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Store, Bell, Shield, Save, Camera, Key, Mail, Phone, Globe, Palette, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import userService from "@/services/userService";
import authService from "@/services/authService";
import tokenService from "@/services/tokenService";
import { cn } from "@/lib/utils";

const pageVariants = { initial: { opacity: 0, y: 12 }, in: { opacity: 1, y: 0 }, out: { opacity: 0 } };

const tabs = [
  { id: "profile",       label: "Profile",       icon: User },
  { id: "store",         label: "Store",         icon: Store },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security",      label: "Security",      icon: Shield },
];

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border/50 rounded-2xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: () => void; label: string; description: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={cn(
          "relative w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          checked ? "bg-primary" : "bg-muted-foreground/30"
        )}
      >
        <motion.span
          animate={{ x: checked ? 18 : 2 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow"
        />
      </button>
    </div>
  );
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  // Profile state
  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "", phone: "", address: "" });

  // Store state
  const [store, setStore] = useState({ name: "VoltGear", email: "support@voltgear.com", currency: "USD", timezone: "America/New_York", website: "https://voltgear.com" });

  // Notifications state
  const [notifs, setNotifs] = useState({ newOrder: true, lowStock: true, newUser: false, newReview: true, dailyReport: false, weeklyReport: true });

  // Security state
  const [security, setSecurity] = useState({ twoFactor: false, sessionTimeout: "30", loginAlerts: true });
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await userService.getProfile();
        setProfile({
          firstName: response.data.firstName ?? "",
          lastName: response.data.lastName ?? "",
          email: response.data.email ?? "",
          phone: response.data.phone ?? "",
          address: response.data.address ?? "",
        });
      } catch (err) {
        console.error("Unable to load profile", err);
      }
    };

    void loadProfile();
  }, []);

  const handleSave = async () => {
    if (activeTab !== "profile") {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      return;
    }

    setError(null);
    setSavingProfile(true);

    try {
      await userService.updateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        address: profile.address,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError("Không thể lưu thông tin cá nhân");
      console.error(err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordMessage(null);

    if (passwords.newPass !== passwords.confirm) {
      setPasswordError("Mật khẩu mới không khớp");
      return;
    }

    setSavingPassword(true);
    try {
      await userService.changePassword({ oldPassword: passwords.current, newPassword: passwords.newPass });
      setPasswordMessage("Mật khẩu đã được cập nhật");
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      setPasswordError("Không thể đổi mật khẩu");
      console.error(err);
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);

    try {
      await authService.logout();
      toast.success("Bạn đã đăng xuất");
    } catch (err) {
      toast.error("Không thể đăng xuất ngay bây giờ");
      console.error(err);
    } finally {
      tokenService.clearTokens();
      navigate("/login", { replace: true });
      setLoggingOut(false);
    }
  };

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={{ duration: 0.3 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-foreground">Settings</h1>
          <p className="text-xs text-muted-foreground">Manage your admin preferences</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={handleSave} disabled={savingProfile || savingPassword}>
          <Save className="w-3.5 h-3.5" />
          {saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 rounded-xl p-1 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                activeTab === tab.id
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <SectionCard title="Profile Information">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center text-primary font-bold text-xl">
                  {`${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase()}
                </div>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow text-primary-foreground">
                  <Camera className="w-3 h-3" />
                </button>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{`${profile.firstName} ${profile.lastName}`.trim() || "Admin"}</p>
                <p className="text-xs text-muted-foreground">Super Admin</p>
                <button className="text-xs text-primary hover:underline mt-0.5">Change avatar</button>
              </div>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium mb-1.5 block">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input value={profile.firstName} onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))} className="pl-9 h-9 text-sm" />
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input value={profile.lastName} onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))} className="pl-9 h-9 text-sm" />
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input type="email" value={profile.email} disabled className="pl-9 h-9 text-sm bg-muted/30" />
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} className="pl-9 h-9 text-sm" />
                </div>
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs font-medium mb-1.5 block">Address</Label>
                <Input value={profile.address} onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))} className="h-9 text-sm" />
              </div>
            </div>
          </SectionCard>
        </motion.div>
      )}

      {/* Store Tab */}
      {activeTab === "store" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <SectionCard title="Store Configuration">
            <p className="text-xs text-muted-foreground">These settings are currently UI placeholders until a backend store settings API is available.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Store Name</Label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input value={store.name} onChange={(e) => setStore((s) => ({ ...s, name: e.target.value }))} className="pl-9 h-9 text-sm" />
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Support Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input value={store.email} onChange={(e) => setStore((s) => ({ ...s, email: e.target.value }))} className="pl-9 h-9 text-sm" />
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input value={store.website} onChange={(e) => setStore((s) => ({ ...s, website: e.target.value }))} className="pl-9 h-9 text-sm" />
                </div>
              </div>
              <div>
                <Label className="text-xs font-medium mb-1.5 block">Currency</Label>
                <select value={store.currency} onChange={(e) => setStore((s) => ({ ...s, currency: e.target.value }))}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="USD">USD — US Dollar</option>
                  <option value="EUR">EUR — Euro</option>
                  <option value="GBP">GBP — British Pound</option>
                  <option value="VND">VND — Vietnamese Dong</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs font-medium mb-1.5 block">Timezone</Label>
                <select value={store.timezone} onChange={(e) => setStore((s) => ({ ...s, timezone: e.target.value }))}
                  className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="America/New_York">Eastern Time (ET)</option>
                  <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Asia/Ho_Chi_Minh">Ho Chi Minh City (ICT)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                </select>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Appearance">
            <div className="flex items-center gap-3">
              {["green", "blue", "purple", "orange"].map((color) => {
                const palette: Record<string, string> = { green: "bg-green-500", blue: "bg-blue-500", purple: "bg-purple-500", orange: "bg-orange-500" };
                return (
                  <button key={color} className={cn("w-8 h-8 rounded-full border-2 transition-all", palette[color], color === "green" ? "border-foreground scale-110" : "border-transparent opacity-60 hover:opacity-100")} />
                );
              })}
              <span className="text-xs text-muted-foreground ml-2 flex items-center gap-1"><Palette className="w-3 h-3" /> Primary color theme</span>
            </div>
          </SectionCard>
        </motion.div>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <SectionCard title="Email Notifications">
            <p className="text-xs text-muted-foreground">Notification options are currently managed in the UI only; backend notification preferences are not yet connected.</p>
            <div className="divide-y divide-border/30">
              <Toggle checked={notifs.newOrder} onChange={() => setNotifs((n) => ({ ...n, newOrder: !n.newOrder }))}
                label="New Orders" description="Get notified when a new order is placed" />
              <Toggle checked={notifs.lowStock} onChange={() => setNotifs((n) => ({ ...n, lowStock: !n.lowStock }))}
                label="Low Stock Alerts" description="Alert when a product falls below minimum stock" />
              <Toggle checked={notifs.newUser} onChange={() => setNotifs((n) => ({ ...n, newUser: !n.newUser }))}
                label="New User Registrations" description="Notify when a new customer registers" />
              <Toggle checked={notifs.newReview} onChange={() => setNotifs((n) => ({ ...n, newReview: !n.newReview }))}
                label="New Reviews" description="Alert when a product review is submitted" />
            </div>
          </SectionCard>
          <SectionCard title="Reports">
            <div className="divide-y divide-border/30">
              <Toggle checked={notifs.dailyReport} onChange={() => setNotifs((n) => ({ ...n, dailyReport: !n.dailyReport }))}
                label="Daily Summary" description="Receive a daily performance digest" />
              <Toggle checked={notifs.weeklyReport} onChange={() => setNotifs((n) => ({ ...n, weeklyReport: !n.weeklyReport }))}
                label="Weekly Report" description="Comprehensive weekly analytics report" />
            </div>
          </SectionCard>
        </motion.div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <SectionCard title="Change Password">
            <p className="text-xs text-muted-foreground">Password changes are connected to the backend. Other security options are currently local UI state only.</p>
            <div className="space-y-3 max-w-sm">
              {[
                { label: "Current Password", key: "current" },
                { label: "New Password", key: "newPass" },
                { label: "Confirm New Password", key: "confirm" },
              ].map((f) => (
                <div key={f.key}>
                  <Label className="text-xs font-medium mb-1.5 block">{f.label}</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      type="password"
                      value={passwords[f.key as keyof typeof passwords]}
                      onChange={(e) => setPasswords((p) => ({ ...p, [f.key]: e.target.value }))}
                      className="pl-9 h-9 text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              ))}
              <Button size="sm" className="w-full mt-1" onClick={handleChangePassword} disabled={savingPassword}>
                {savingPassword ? "Updating..." : "Update Password"}
              </Button>
              {passwordError && <p className="text-xs text-destructive mt-2">{passwordError}</p>}
              {passwordMessage && <p className="text-xs text-foreground mt-2">{passwordMessage}</p>}
            </div>
          </SectionCard>

          <SectionCard title="Security Options">
            <div className="divide-y divide-border/30">
              <Toggle checked={security.twoFactor} onChange={() => setSecurity((s) => ({ ...s, twoFactor: !s.twoFactor }))}
                label="Two-Factor Authentication" description="Add an extra layer of security to your account" />
              <Toggle checked={security.loginAlerts} onChange={() => setSecurity((s) => ({ ...s, loginAlerts: !s.loginAlerts }))}
                label="Login Alerts" description="Get notified of new sign-ins to your account" />
            </div>
            <div className="mt-2">
              <Label className="text-xs font-medium mb-1.5 block">Session Timeout (minutes)</Label>
              <select value={security.sessionTimeout} onChange={(e) => setSecurity((s) => ({ ...s, sessionTimeout: e.target.value }))}
                className="w-40 h-9 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">60 minutes</option>
                <option value="120">2 hours</option>
                <option value="0">Never</option>
              </select>
            </div>
          </SectionCard>

          <SectionCard title="Sign Out">
            <p className="text-xs text-muted-foreground">Use this button to end your admin session and return to the login screen.</p>
            <Button
              variant="destructive"
              size="sm"
              className="w-full mt-3"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut ? "Signing out..." : "Sign out"}
            </Button>
          </SectionCard>

          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-destructive mb-1">Danger Zone</h4>
            <p className="text-xs text-muted-foreground mb-3">These actions are irreversible. Please proceed with caution.</p>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground text-xs">
                Reset All Settings
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
