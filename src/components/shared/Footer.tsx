import { Link } from "react-router-dom";
import { Zap, Twitter, Youtube, Twitch, Github } from "lucide-react";

const footerLinks = {
  Products: [
    { label: "Laptops", href: "/products?category=laptops" },
    { label: "Desktops", href: "/products?category=desktops" },
    { label: "Components", href: "/products?category=components" },
    { label: "Monitors", href: "/products?category=monitors" },
    { label: "Peripherals", href: "/products?category=peripherals" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Order Tracking", href: "#" },
    { label: "Returns", href: "#" },
    { label: "Warranty", href: "#" },
    { label: "Contact Us", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Partners", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-carbon-800 border-t border-white/5 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand rounded-sm flex items-center justify-center">
                <Zap className="w-5 h-5 text-carbon-900" fill="currentColor" />
              </div>
              <span className="font-black text-xl tracking-tighter">
                VOLT<span className="text-brand">GEAR</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-6">
              Precision tools for digital architects. Every component engineered for
              performance, every pixel designed for clarity.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Youtube, Twitch, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 border border-white/10 rounded-sm flex items-center justify-center text-muted-foreground hover:text-brand hover:border-brand/40 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">
                {section}
              </h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-brand transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2025 VoltGear Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
