import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Khởi tạo theme trước khi render
(() => {
  const stored = localStorage.getItem("theme");
  const prefersDark =
    stored === "dark" ||
    (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const html = document.documentElement;
  if (prefersDark) {
    html.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    html.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
})();

createRoot(document.getElementById("root")!).render(<App />);
