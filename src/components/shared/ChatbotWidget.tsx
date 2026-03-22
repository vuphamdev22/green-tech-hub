import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, X, Send, Bot, User,
  Sparkles, ChevronDown, Loader2,
} from "lucide-react";
import { products } from "@/data/mockData";
import { useCartStore } from "@/store/cartStore";
import { useNavigate } from "react-router-dom";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  products?: typeof products;
  timestamp: Date;
}

// ─── Knowledge base for the bot ────────────────────────────────────────────────
const KB = {
  greet: [
    "Hi there! 👋 I'm **VoltBot**, your AI shopping assistant. I can help you find the perfect computer gear, compare specs, or answer any questions about our products!",
    "Hey! Welcome to VoltGear! 🚀 I'm VoltBot. Looking for a laptop, gaming accessory, or PC component? Ask me anything!",
  ],
  fallback: [
    "I'm not sure about that one. Want me to show you our **best-selling products** instead?",
    "Hmm, that's a tricky one! Let me help you find what you're looking for. Try asking about laptops, gaming gear, or monitors.",
  ],
  price: (min: number, max: number) =>
    products.filter((p) => p.price >= min && p.price <= max),
};

type Intent = {
  keywords: RegExp;
  response: (query: string) => string;
  products?: () => typeof products;
};

const INTENTS: Intent[] = [
  {
    keywords: /\b(hi|hello|hey|sup|yo|greet)\b/i,
    response: () => KB.greet[Math.floor(Math.random() * KB.greet.length)],
  },
  {
    keywords: /\b(laptop|notebook|macbook|portable)\b/i,
    response: () =>
      "Here are our top **laptops** — engineered for performance and portability:",
    products: () => products.filter((p) => p.category === "laptops"),
  },
  {
    keywords: /\b(desktop|tower|pc|workstation|rig)\b/i,
    response: () => "Check out our powerful **desktop PCs** built for speed:",
    products: () => products.filter((p) => p.category === "desktops"),
  },
  {
    keywords: /\b(monitor|display|screen|4k)\b/i,
    response: () => "Our **monitors** offer stunning visuals for work and gaming:",
    products: () => products.filter((p) => p.category === "monitors"),
  },
  {
    keywords: /\b(keyboard|mouse|headset|headphone|peripheral)\b/i,
    response: () => "Upgrade your setup with our premium **peripherals**:",
    products: () => products.filter((p) => p.category === "peripherals"),
  },
  {
    keywords: /\b(gaming|game|gamer|fps|esport)\b/i,
    response: () => "Here's our **gaming gear** built for competitive play:",
    products: () =>
      products.filter((p) => ["gaming", "peripherals"].includes(p.category)),
  },
  {
    keywords: /\b(gpu|graphics|rtx|amd|nvidia|card)\b/i,
    response: () => "Our **graphics cards** dominate every benchmark:",
    products: () => products.filter((p) => p.category === "components" && p.name.toLowerCase().includes("geforce")),
  },
  {
    keywords: /\b(cpu|processor|core i9|ryzen|intel)\b/i,
    response: () => "Here are our high-performance **CPUs**:",
    products: () => products.filter((p) => p.category === "components" && (p.name.toLowerCase().includes("cpu") || p.name.toLowerCase().includes("nova"))),
  },
  {
    keywords: /\b(cheap|budget|affordable|under 200|under 500|low price)\b/i,
    response: () => "Here are our most **budget-friendly options** under $200:",
    products: () => KB.price(0, 200),
  },
  {
    keywords: /\b(best|top|popular|recommend|best seller|bestsell)\b/i,
    response: () => "These are our **most popular products** right now:",
    products: () => products.filter((p) => p.badge),
  },
  {
    keywords: /\b(sale|discount|deal|off|promo)\b/i,
    response: () => "🔥 Here are products currently **on sale** with discounts:",
    products: () => products.filter((p) => p.originalPrice),
  },
  {
    keywords: /\b(in stock|available|stock)\b/i,
    response: () => "These products are **in stock and ready to ship**:",
    products: () => products.filter((p) => p.inStock),
  },
  {
    keywords: /\b(spec|specification|detail|feature)\b/i,
    response: () =>
      "You can find full specs on each product page. Here are our **top-rated** picks — click any to see detailed specifications:",
    products: () => products.sort((a, b) => b.rating - a.rating).slice(0, 3),
  },
  {
    keywords: /\b(price|cost|how much|expensive)\b/i,
    response: () =>
      "Our prices range from $129 for accessories to $3,199 for high-end desktops. Here are some popular options at different price points:",
    products: () => [products[4], products[0], products[1]],
  },
  {
    keywords: /\b(ship|delivery|shipping|deliver|dispatch)\b/i,
    response: () =>
      "📦 We offer **free shipping** on all orders! Standard delivery takes 3–5 business days. Express delivery (1–2 days) is available at checkout for $9.99.",
  },
  {
    keywords: /\b(return|refund|warranty|guarantee)\b/i,
    response: () =>
      "🔒 All products come with a **12-month warranty**. We accept returns within 30 days of purchase — no questions asked!",
  },
  {
    keywords: /\b(cart|add|buy|purchase|order)\b/i,
    response: () =>
      "🛒 You can add any product to your cart directly from the product page. Need help finding what you're looking for?",
    products: () => products.filter((p) => p.badge).slice(0, 2),
  },
  {
    keywords: /\b(thank|thanks|great|awesome|nice|perfect|wow)\b/i,
    response: () =>
      "You're welcome! 😊 Is there anything else I can help you with today?",
  },
];

// ─── Quick suggestion chips ─────────────────────────────────────────────────
const QUICK_SUGGESTIONS = [
  "Best laptops",
  "Gaming gear",
  "Budget products",
  "On sale now",
  "Top rated",
  "Monitors",
];

// ─── Bot response engine ────────────────────────────────────────────────────
function getBotResponse(query: string): Omit<Message, "id" | "timestamp" | "role"> {
  const q = query.toLowerCase();

  for (const intent of INTENTS) {
    if (intent.keywords.test(q)) {
      const matchedProducts = intent.products?.() ?? [];
      return {
        text: intent.response(q),
        products: matchedProducts.length > 0 ? matchedProducts.slice(0, 3) : undefined,
      };
    }
  }

  return {
    text: KB.fallback[Math.floor(Math.random() * KB.fallback.length)],
    products: products.filter((p) => p.badge).slice(0, 2),
  };
}

// ─── Product Suggestion Card ────────────────────────────────────────────────
function ProductSuggestionCard({ product }: { product: (typeof products)[0] }) {
  const addItem = useCartStore((s) => s.addItem);
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-carbon-800 border border-white/[0.06] rounded-sm overflow-hidden flex gap-2 p-2 hover:border-brand/30 transition-all cursor-pointer group"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className="w-14 h-14 rounded-sm overflow-hidden flex-shrink-0">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-foreground line-clamp-1">{product.name}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{product.category}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs font-black text-brand">${product.price.toLocaleString()}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addItem(product);
            }}
            className="text-[10px] px-2 py-0.5 bg-brand/20 text-brand rounded-sm hover:bg-brand/30 transition-colors font-bold"
          >
            + Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Formatted message text (supports **bold**)  ───────────────────────────
function BotText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <span>
      {parts.map((part, i) =>
        part.startsWith("**") && part.endsWith("**") ? (
          <strong key={i} className="text-brand font-black">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

// ─── Main Widget ────────────────────────────────────────────────────────────
export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      text: "Hi! 👋 I'm **VoltBot**, your AI shopping assistant. Ask me about laptops, gaming gear, prices, or anything else!",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        role: "user",
        text: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      // Simulate bot thinking delay
      const delay = 600 + Math.random() * 800;
      setTimeout(() => {
        const botResponse = getBotResponse(text);
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          ...botResponse,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
        if (!open) setUnread((n) => n + 1);
      }, delay);
    },
    [open]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* ── Chat Panel ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.92, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[340px] sm:w-[380px] flex flex-col rounded-lg border border-white/[0.08] bg-carbon-900 shadow-2xl overflow-hidden"
            style={{ maxHeight: "min(580px, calc(100vh - 120px))" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-white/[0.06] flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-brand/20 border border-brand/40 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-brand" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-brand border-2 border-carbon-900" />
                </div>
                <div>
                  <p className="text-sm font-black text-foreground leading-none">VoltBot</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
                    AI Shopping Assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-sm bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 scrollbar-thin">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                    msg.role === "bot"
                      ? "bg-brand/20 border border-brand/30"
                      : "bg-white/10 border border-white/10"
                  }`}>
                    {msg.role === "bot"
                      ? <Bot className="w-3.5 h-3.5 text-brand" />
                      : <User className="w-3.5 h-3.5 text-muted-foreground" />
                    }
                  </div>

                  <div className={`flex flex-col gap-2 max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    {/* Bubble */}
                    <div className={`px-3 py-2.5 rounded-md text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-brand text-carbon-900 font-semibold rounded-tr-sm"
                        : "bg-card border border-white/[0.06] text-foreground rounded-tl-sm"
                    }`}>
                      {msg.role === "bot" ? <BotText text={msg.text} /> : msg.text}
                    </div>

                    {/* Product cards */}
                    {msg.products && msg.products.length > 0 && (
                      <div className="space-y-2 w-full">
                        {msg.products.map((p) => (
                          <ProductSuggestionCard key={p.id} product={p} />
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2.5"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-brand" />
                    </div>
                    <div className="bg-card border border-white/[0.06] px-4 py-3 rounded-md rounded-tl-sm flex gap-1.5 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                          animate={{ y: ["0%", "-50%", "0%"] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={bottomRef} />
            </div>

            {/* Quick suggestions */}
            <div className="px-4 pb-2 flex-shrink-0">
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {QUICK_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="flex-shrink-0 text-[11px] font-bold px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-muted-foreground hover:bg-brand/10 hover:border-brand/30 hover:text-brand transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="px-4 pb-4 flex gap-2 flex-shrink-0"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about products, specs, price…"
                className="flex-1 bg-carbon-700 border border-white/10 rounded-sm px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-brand/50 transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 rounded-sm bg-brand flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:opacity-90 transition-opacity"
              >
                {isTyping ? (
                  <Loader2 className="w-4 h-4 text-carbon-900 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 text-carbon-900" />
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Toggle Button ───────────────────────────────────────────────────── */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full bg-brand shadow-lg shadow-brand/30 flex items-center justify-center"
        aria-label="Toggle AI chatbot"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <X className="w-6 h-6 text-carbon-900" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <MessageCircle className="w-6 h-6 text-carbon-900" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        <AnimatePresence>
          {!open && unread > 0 && (
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center"
            >
              <span className="text-[10px] font-black text-white">{unread}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sparkle pulse when closed */}
        <AnimatePresence>
          {!open && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full bg-brand"
            />
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
