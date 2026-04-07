export const adminStats = {
  revenue: { value: 284750, change: 12.5, period: "vs last month" },
  orders: { value: 1284, change: 8.2, period: "vs last month" },
  users: { value: 9420, change: 3.7, period: "vs last month" },
  products: { value: 342, change: -1.2, period: "vs last month" },
};

export const revenueData = [
  { date: "Jan", revenue: 42000, orders: 180 },
  { date: "Feb", revenue: 38500, orders: 165 },
  { date: "Mar", revenue: 51000, orders: 220 },
  { date: "Apr", revenue: 47000, orders: 198 },
  { date: "May", revenue: 63000, orders: 270 },
  { date: "Jun", revenue: 58000, orders: 245 },
  { date: "Jul", revenue: 71000, orders: 305 },
  { date: "Aug", revenue: 65000, orders: 280 },
  { date: "Sep", revenue: 78000, orders: 334 },
  { date: "Oct", revenue: 82000, orders: 350 },
  { date: "Nov", revenue: 91000, orders: 390 },
  { date: "Dec", revenue: 105000, orders: 445 },
];

export const dailyRevenueData = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}`,
  revenue: Math.floor(Math.random() * 8000) + 2000,
  orders: Math.floor(Math.random() * 40) + 10,
}));

export const topProducts = [
  { id: 1, name: "MacBook Pro 16\"", sales: 234, revenue: 468000, stock: 45 },
  { id: 2, name: "RTX 4090 GPU", sales: 189, revenue: 378000, stock: 12 },
  { id: 3, name: "Dell UltraSharp 27\"", sales: 312, revenue: 218400, stock: 67 },
  { id: 4, name: "Logitech MX Keys", sales: 445, revenue: 89000, stock: 203 },
  { id: 5, name: "Corsair K100 RGB", sales: 378, revenue: 75600, stock: 89 },
];

export const adminOrders = [
  { id: "ORD-10042", customer: "Alice Johnson", email: "alice@example.com", product: "MacBook Pro 16\"", amount: 2499, status: "delivered", date: "2024-01-15", items: 1 },
  { id: "ORD-10041", customer: "Bob Smith", email: "bob@example.com", product: "RTX 4090 + Case", amount: 2180, status: "shipping", date: "2024-01-15", items: 3 },
  { id: "ORD-10040", customer: "Carol White", email: "carol@example.com", product: "Gaming Setup Bundle", amount: 1840, status: "confirmed", date: "2024-01-14", items: 5 },
  { id: "ORD-10039", customer: "Dave Brown", email: "dave@example.com", product: "Dell Monitor 27\"", amount: 699, status: "pending", date: "2024-01-14", items: 1 },
  { id: "ORD-10038", customer: "Eva Green", email: "eva@example.com", product: "Keyboard + Mouse", amount: 289, status: "cancelled", date: "2024-01-13", items: 2 },
  { id: "ORD-10037", customer: "Frank Lee", email: "frank@example.com", product: "Intel i9 + Motherboard", amount: 1250, status: "delivered", date: "2024-01-13", items: 2 },
  { id: "ORD-10036", customer: "Grace Kim", email: "grace@example.com", product: "SSD 2TB Samsung", amount: 189, status: "confirmed", date: "2024-01-12", items: 1 },
  { id: "ORD-10035", customer: "Henry Park", email: "henry@example.com", product: "Corsair RAM 64GB", amount: 320, status: "shipping", date: "2024-01-12", items: 2 },
  { id: "ORD-10034", customer: "Isla Torres", email: "isla@example.com", product: "Razer Headset Pro", amount: 249, status: "pending", date: "2024-01-11", items: 1 },
  { id: "ORD-10033", customer: "Jack Wilson", email: "jack@example.com", product: "Asus ROG Laptop", amount: 1899, status: "delivered", date: "2024-01-11", items: 1 },
];

export const adminProducts = [
  { id: 1, name: "MacBook Pro 16\"", category: "Laptops", price: 2499, stock: 45, status: "active", image: "💻", sku: "APP-MBP16-001" },
  { id: 2, name: "ASUS ROG Strix G15", category: "Laptops", price: 1499, stock: 23, status: "active", image: "💻", sku: "ASU-ROG-002" },
  { id: 3, name: "RTX 4090 FE", category: "Components", price: 1999, stock: 12, status: "active", image: "🖥️", sku: "NVI-4090-003" },
  { id: 4, name: "Intel Core i9-14900K", category: "Components", price: 589, stock: 67, status: "active", image: "🔧", sku: "INT-I9-004" },
  { id: 5, name: "Samsung 990 Pro 2TB", category: "Storage", price: 189, stock: 234, status: "active", image: "💾", sku: "SAM-990-005" },
  { id: 6, name: "Corsair Vengeance 64GB", category: "Memory", price: 320, stock: 89, status: "active", image: "🔩", sku: "COR-VEN-006" },
  { id: 7, name: "Dell UltraSharp 27\"", category: "Monitors", price: 699, stock: 56, status: "active", image: "🖥️", sku: "DEL-US27-007" },
  { id: 8, name: "LG UltraWide 34\"", category: "Monitors", price: 899, stock: 34, status: "active", image: "🖥️", sku: "LG-UW34-008" },
  { id: 9, name: "Logitech MX Master 3S", category: "Accessories", price: 99, stock: 312, status: "active", image: "🖱️", sku: "LOG-MX3-009" },
  { id: 10, name: "Corsair K100 RGB", category: "Keyboards", price: 199, stock: 8, status: "low_stock", image: "⌨️", sku: "COR-K100-010" },
  { id: 11, name: "Razer BlackShark V2", category: "Headphones", price: 149, stock: 0, status: "out_of_stock", image: "🎧", sku: "RAZ-BSV2-011" },
  { id: 12, name: "NZXT H510 Case", category: "Cases", price: 89, stock: 145, status: "active", image: "📦", sku: "NZX-H510-012" },
];

export const adminCategories = [
  { id: 1, name: "Laptops", slug: "laptops", parent: null, products: 45, status: "active", icon: "💻" },
  { id: 2, name: "Gaming Laptops", slug: "gaming-laptops", parent: "Laptops", products: 18, status: "active", icon: "🎮" },
  { id: 3, name: "Business Laptops", slug: "business-laptops", parent: "Laptops", products: 14, status: "active", icon: "💼" },
  { id: 4, name: "Desktop PCs", slug: "desktop-pcs", parent: null, products: 32, status: "active", icon: "🖥️" },
  { id: 5, name: "Gaming PCs", slug: "gaming-pcs", parent: "Desktop PCs", products: 20, status: "active", icon: "🎮" },
  { id: 6, name: "Components", slug: "components", parent: null, products: 89, status: "active", icon: "🔧" },
  { id: 7, name: "CPUs", slug: "cpus", parent: "Components", products: 24, status: "active", icon: "⚡" },
  { id: 8, name: "GPUs", slug: "gpus", parent: "Components", products: 31, status: "active", icon: "🎴" },
  { id: 9, name: "RAM", slug: "ram", parent: "Components", products: 18, status: "active", icon: "🔩" },
  { id: 10, name: "Storage", slug: "storage", parent: "Components", products: 16, status: "active", icon: "💾" },
  { id: 11, name: "Monitors", slug: "monitors", parent: null, products: 28, status: "active", icon: "🖥️" },
  { id: 12, name: "Accessories", slug: "accessories", parent: null, products: 67, status: "active", icon: "🎯" },
  { id: 13, name: "Keyboards", slug: "keyboards", parent: "Accessories", products: 22, status: "active", icon: "⌨️" },
  { id: 14, name: "Mice", slug: "mice", parent: "Accessories", products: 19, status: "active", icon: "🖱️" },
  { id: 15, name: "Headphones", slug: "headphones", parent: "Accessories", products: 15, status: "inactive", icon: "🎧" },
];

export const adminUsers = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", phone: "+1 555-0101", role: "customer", status: "active", orders: 12, spent: 4580, joined: "2023-06-12", avatar: "AJ" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", phone: "+1 555-0102", role: "customer", status: "active", orders: 7, spent: 2340, joined: "2023-07-20", avatar: "BS" },
  { id: 3, name: "Carol White", email: "carol@example.com", phone: "+1 555-0103", role: "customer", status: "locked", orders: 3, spent: 890, joined: "2023-08-05", avatar: "CW" },
  { id: 4, name: "Dave Brown", email: "dave@example.com", phone: "+1 555-0104", role: "customer", status: "active", orders: 21, spent: 9870, joined: "2023-03-15", avatar: "DB" },
  { id: 5, name: "Eva Green", email: "eva@example.com", phone: "+1 555-0105", role: "customer", status: "active", orders: 5, spent: 1230, joined: "2023-09-10", avatar: "EG" },
  { id: 6, name: "Frank Lee", email: "frank@example.com", phone: "+1 555-0106", role: "admin", status: "active", orders: 0, spent: 0, joined: "2022-11-01", avatar: "FL" },
  { id: 7, name: "Grace Kim", email: "grace@example.com", phone: "+1 555-0107", role: "customer", status: "active", orders: 9, spent: 3450, joined: "2023-05-22", avatar: "GK" },
  { id: 8, name: "Henry Park", email: "henry@example.com", phone: "+1 555-0108", role: "customer", status: "locked", orders: 2, spent: 540, joined: "2023-10-30", avatar: "HP" },
  { id: 9, name: "Isla Torres", email: "isla@example.com", phone: "+1 555-0109", role: "customer", status: "active", orders: 15, spent: 6780, joined: "2023-04-08", avatar: "IT" },
  { id: 10, name: "Jack Wilson", email: "jack@example.com", phone: "+1 555-0110", role: "customer", status: "active", orders: 8, spent: 2890, joined: "2023-08-19", avatar: "JW" },
];

export const adminVouchers = [
  { id: 1, code: "SUMMER25", type: "percentage", discount: 25, minOrder: 100, maxUses: 500, usedCount: 234, expiry: "2024-08-31", status: "active" },
  { id: 2, code: "NEWUSER50", type: "fixed", discount: 50, minOrder: 200, maxUses: 1000, usedCount: 892, expiry: "2024-12-31", status: "active" },
  { id: 3, code: "FLASH10", type: "percentage", discount: 10, minOrder: 50, maxUses: 200, usedCount: 200, expiry: "2024-01-31", status: "expired" },
  { id: 4, code: "GAMING15", type: "percentage", discount: 15, minOrder: 300, maxUses: 300, usedCount: 87, expiry: "2024-06-30", status: "active" },
  { id: 5, code: "WELCOME100", type: "fixed", discount: 100, minOrder: 500, maxUses: 150, usedCount: 43, expiry: "2024-09-15", status: "active" },
  { id: 6, code: "BLACKFRI30", type: "percentage", discount: 30, minOrder: 150, maxUses: 2000, usedCount: 1450, expiry: "2023-11-30", status: "inactive" },
];

export const adminReviews = [
  { id: 1, product: "MacBook Pro 16\"", user: "Alice Johnson", rating: 5, comment: "Absolutely incredible machine! Fast, reliable, the display is stunning.", date: "2024-01-14", status: "approved" },
  { id: 2, product: "RTX 4090 FE", user: "Bob Smith", rating: 4, comment: "Beastly performance. Runs a bit hot under load but nothing serious.", date: "2024-01-13", status: "approved" },
  { id: 3, product: "Dell UltraSharp 27\"", user: "Carol White", rating: 2, comment: "Screen has backlight bleed on the corners. Very disappointed for this price.", date: "2024-01-12", status: "pending" },
  { id: 4, product: "Corsair K100 RGB", user: "Dave Brown", rating: 5, comment: "Best keyboard I've ever typed on. The actuation is perfect.", date: "2024-01-12", status: "approved" },
  { id: 5, product: "Razer BlackShark V2", user: "Eva Green", rating: 1, comment: "Broke after 2 weeks. Terrible build quality for the price.", date: "2024-01-11", status: "pending" },
  { id: 6, product: "Samsung 990 Pro 2TB", user: "Frank Lee", rating: 5, comment: "Lightning fast. Huge difference from my old HDD.", date: "2024-01-10", status: "approved" },
  { id: 7, product: "ASUS ROG Strix G15", user: "Grace Kim", rating: 4, comment: "Great gaming performance. Battery life could be better.", date: "2024-01-09", status: "pending" },
  { id: 8, product: "Logitech MX Master 3S", user: "Henry Park", rating: 3, comment: "Good mouse but the scroll wheel sometimes skips. Software is decent.", date: "2024-01-08", status: "rejected" },
];

export const userGrowthData = [
  { month: "Jan", users: 420, newUsers: 45 },
  { month: "Feb", users: 480, newUsers: 60 },
  { month: "Mar", users: 560, newUsers: 80 },
  { month: "Apr", users: 620, newUsers: 60 },
  { month: "May", users: 750, newUsers: 130 },
  { month: "Jun", users: 890, newUsers: 140 },
  { month: "Jul", users: 1020, newUsers: 130 },
  { month: "Aug", users: 1180, newUsers: 160 },
  { month: "Sep", users: 1350, newUsers: 170 },
  { month: "Oct", users: 1540, newUsers: 190 },
  { month: "Nov", users: 1780, newUsers: 240 },
  { month: "Dec", users: 2100, newUsers: 320 },
];

export const categoryRevenueData = [
  { name: "Laptops", value: 98000, color: "#22c55e" },
  { name: "Components", value: 72000, color: "#3b82f6" },
  { name: "Monitors", value: 45000, color: "#f59e0b" },
  { name: "Accessories", value: 38000, color: "#ec4899" },
  { name: "Gaming PCs", value: 31000, color: "#8b5cf6" },
];
