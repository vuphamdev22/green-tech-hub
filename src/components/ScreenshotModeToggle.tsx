import { useCallback, useEffect, useState } from "react";
import { Camera, CameraOff } from "lucide-react";

/**
 * One-click "Screenshot Mode" toggle.
 * - Forces the brightest light theme
 * - Disables animations & transitions
 * - Normalizes spacing for clean report captures
 *
 * Behavior is driven by the `.screenshot-mode` class on <html>
 * (styles defined in src/index.css).
 */
const STORAGE_KEY = "screenshot-mode";

export default function ScreenshotModeToggle() {
  const [active, setActive] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(STORAGE_KEY) === "1";
  });

  const apply = useCallback((on: boolean) => {
    const html = document.documentElement;
    if (on) {
      html.classList.add("screenshot-mode");
      html.classList.remove("dark"); // force light
    } else {
      html.classList.remove("screenshot-mode");
      // Restore user's saved theme preference
      const stored = localStorage.getItem("theme");
      if (stored === "dark") html.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    apply(active);
    localStorage.setItem(STORAGE_KEY, active ? "1" : "0");
  }, [active, apply]);

  // Keyboard shortcut: Shift + S
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /input|textarea|select/i.test(target.tagName)) return;
      if (e.shiftKey && (e.key === "S" || e.key === "s") && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setActive((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <button
      type="button"
      onClick={() => setActive((v) => !v)}
      title={active ? "Exit Screenshot Mode (Shift+S)" : "Enter Screenshot Mode (Shift+S)"}
      aria-pressed={active}
      aria-label="Toggle screenshot mode"
      className={[
        "fixed z-[9999] bottom-5 left-5 inline-flex items-center gap-2",
        "rounded-full border px-3.5 py-2 text-xs font-medium",
        "shadow-lg backdrop-blur transition-colors",
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background/90 text-foreground border-border hover:bg-accent",
      ].join(" ")}
    >
      {active ? <CameraOff className="w-4 h-4" /> : <Camera className="w-4 h-4" />}
      <span className="hidden sm:inline">{active ? "Exit Screenshot Mode" : "Screenshot Mode"}</span>
    </button>
  );
}
