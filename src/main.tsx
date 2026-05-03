import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize theme — default to LIGHT for a brighter, screenshot-friendly UI.
// Users can still toggle to dark mode; their choice persists in localStorage.
(() => {
  const stored = localStorage.getItem("theme");
  const useDark = stored === "dark"; // only honor explicit dark choice
  const html = document.documentElement;
  if (useDark) {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
    if (stored !== "light") localStorage.setItem("theme", "light");
  }
})();

createRoot(document.getElementById("root")!).render(<App />);
