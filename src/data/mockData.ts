export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  specs: Record<string, string>;
  description: string;
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
}

export const categories: Category[] = [
  { id: "laptops", name: "Laptops", icon: "💻", count: 142, color: "#22c55e" },
  { id: "desktops", name: "Desktop PCs", icon: "🖥️", count: 89, color: "#3b82f6" },
  { id: "components", name: "Components", icon: "⚡", count: 304, color: "#f59e0b" },
  { id: "gaming", name: "Gaming", icon: "🎮", count: 217, color: "#ef4444" },
  { id: "monitors", name: "Monitors", icon: "🖵", count: 78, color: "#8b5cf6" },
  { id: "peripherals", name: "Peripherals", icon: "⌨️", count: 195, color: "#06b6d4" },
];

export const products: Product[] = [
  {
    id: "p1",
    name: "VOLT Predator X Pro 16",
    category: "laptops",
    price: 2499,
    originalPrice: 2999,
    rating: 4.9,
    reviews: 847,
    image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
    badge: "BEST SELLER",
    description: "The ultimate gaming laptop with RTX 5090 and 240Hz OLED display. Engineered for professionals who demand peak performance.",
    specs: {
      CPU: "Intel Core i9-14900HX",
      GPU: "NVIDIA RTX 5090 16GB",
      RAM: "64GB DDR5-5600",
      Storage: "2TB NVMe PCIe 5.0",
      Display: '16" QHD+ 240Hz OLED',
      Battery: "99.9Wh",
    },
    inStock: true,
  },
  {
    id: "p2",
    name: "Carbon X Desktop Tower",
    category: "desktops",
    price: 3199,
    originalPrice: 3499,
    rating: 4.8,
    reviews: 412,
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80",
    badge: "NEW",
    description: "A precision-engineered desktop powerhouse designed for creators and gamers who refuse to compromise.",
    specs: {
      CPU: "AMD Ryzen 9 7950X",
      GPU: "RTX 4090 24GB",
      RAM: "128GB DDR5",
      Storage: "4TB NVMe RAID",
      PSU: "1000W 80+ Platinum",
      Cooling: "360mm AIO Liquid",
    },
    inStock: true,
  },
  {
    id: "p3",
    name: "Arc Pro 27 Monitor",
    category: "monitors",
    price: 899,
    originalPrice: 1099,
    rating: 4.7,
    reviews: 623,
    image: "https://images.unsplash.com/photo-1527443224154-c4a573d4cde2?w=600&q=80",
    description: "Professional-grade 4K display with nano-IPS panel and 1ms response time.",
    specs: {
      Resolution: "3840×2160 (4K)",
      Panel: "Nano-IPS",
      "Refresh Rate": "144Hz",
      "Response Time": "1ms GTG",
      Brightness: "600 nits",
      HDR: "DisplayHDR 600",
    },
    inStock: true,
  },
  {
    id: "p4",
    name: "GeForce RTX 5080 Ti",
    category: "components",
    price: 1199,
    rating: 4.9,
    reviews: 1204,
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?w=600&q=80",
    badge: "HOT",
    description: "Next-gen GPU with DLSS 4 and ray tracing. 7,400MB/s memory bandwidth that crushes every benchmark.",
    specs: {
      VRAM: "20GB GDDR7",
      "Cuda Cores": "10,240",
      "Memory Bandwidth": "960 GB/s",
      "TDP": "380W",
      Interface: "PCIe 5.0 x16",
      Connectors: "3x DP 2.1, 1x HDMI 2.1",
    },
    inStock: true,
  },
  {
    id: "p5",
    name: "Volt Pro Mechanical Keyboard",
    category: "peripherals",
    price: 189,
    originalPrice: 229,
    rating: 4.8,
    reviews: 2341,
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=600&q=80",
    description: "Per-key RGB mechanical keyboard with custom optical switches rated for 100M keystrokes.",
    specs: {
      Switch: "Volt Optical Linear",
      Actuation: "1.5mm",
      "Key Life": "100M keystrokes",
      Backlighting: "Per-key RGB",
      Interface: "USB-C + Wireless",
      Battery: "4000mAh",
    },
    inStock: true,
  },
  {
    id: "p6",
    name: "Apex Pro Mouse",
    category: "peripherals",
    price: 149,
    rating: 4.9,
    reviews: 3892,
    image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&q=80",
    badge: "TOP RATED",
    description: "26,000 DPI optical sensor, 0.2ms polling rate. The world's fastest gaming mouse.",
    specs: {
      Sensor: "TrueMove Pro 26K",
      DPI: "100 – 26,000",
      "Polling Rate": "8,000Hz (0.125ms)",
      Buttons: "8 programmable",
      Weight: "61g",
      Cable: "Speedflex braided",
    },
    inStock: true,
  },
  {
    id: "p7",
    name: "NovaBlade 7900X CPU",
    category: "components",
    price: 549,
    originalPrice: 649,
    rating: 4.7,
    reviews: 987,
    image: "https://images.unsplash.com/photo-1555617766-c94173f616f8?w=600&q=80",
    description: "16-core powerhouse with 5nm architecture and 5.7GHz boost clock for creators and gamers.",
    specs: {
      Cores: "16C / 32T",
      "Boost Clock": "5.7 GHz",
      "Base Clock": "4.7 GHz",
      TDP: "170W",
      Cache: "96MB L3",
      Socket: "AM5",
    },
    inStock: false,
  },
  {
    id: "p8",
    name: "Void Pro Headset",
    category: "gaming",
    price: 129,
    rating: 4.6,
    reviews: 1567,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    description: "2.4GHz wireless headset with spatial audio, 30-hour battery, and broadcast-grade microphone.",
    specs: {
      Driver: "50mm NeoDymium",
      Frequency: "20Hz – 20kHz",
      Wireless: "2.4GHz USB-C",
      Battery: "30 hours",
      Microphone: "Cardioid Unidirectional",
      Weight: "320g",
    },
    inStock: true,
  },
];

export const getFeaturedProducts = () => products.slice(0, 6);
export const getProductById = (id: string) => products.find((p) => p.id === id);
export const getProductsByCategory = (cat: string) =>
  cat === "all" ? products : products.filter((p) => p.category === cat);
