// Invented placeholder content — no real catalogue exists yet.
// Structured so a future Vendure GraphQL layer can replace this module
// without touching the components that consume it.

export type ProductBadge = "new" | "sale" | "low-stock" | "bestseller" | "trending" | "out-of-stock";

export interface Product {
  id: string;
  slug: string;
  variantId?: string;
  name: string;
  brand: string;
  category: string;
  categorySlug?: string;
  price: number;
  compareAtPrice?: number;
  sku?: string;
  rating?: number;
  reviewCount?: number;
  badge?: ProductBadge;
  stockLeft?: number;
  inStock?: boolean;
  description?: string;
  createdAt?: string;
  image: string;
  images?: string[];
}

export interface Category {
  slug: string;
  name: string;
  itemCount: string;
  icon: string;
  image: string;
}

export interface FeaturedCategory {
  slug: string;
  name: string;
  itemCount: string;
  image: string;
}

export interface ShoppableSetup {
  id: string;
  title: string;
  description: string;
  itemCount: number;
  fromPrice: number;
  icon: string;
  size: "large" | "small";
}

export interface FaqItem {
  question: string;
  answer: string;
  icon: string;
}

export interface PromoBanner {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  image: string;
  theme: "blue" | "green";
}

export const categories: Category[] = [
  { slug: "laptops", name: "Laptops", itemCount: "180+ items", icon: "Laptop", image: "/images/categories/icons/laptops.png" },
  { slug: "desktops", name: "Desktops", itemCount: "95+ items", icon: "Cpu", image: "/images/categories/icons/desktops.png" },
  { slug: "monitors", name: "Monitors", itemCount: "120+ items", icon: "Monitor", image: "/images/categories/icons/monitors.png" },
  { slug: "smart-tvs", name: "Smart TVs", itemCount: "140+ items", icon: "Tv", image: "/images/categories/icons/smart-tvs.png" },
  { slug: "mobiles-tablets", name: "Mobile & Tablets", itemCount: "410+ items", icon: "Smartphone", image: "/images/categories/icons/mobiles-tablets.png" },
  { slug: "gaming", name: "Gaming", itemCount: "165+ items", icon: "Gamepad2", image: "/images/categories/icons/gaming.png" },
  { slug: "audio", name: "Audio", itemCount: "230+ items", icon: "Headphones", image: "/images/categories/icons/audio.png" },
  { slug: "cameras", name: "Cameras", itemCount: "88+ items", icon: "Camera", image: "/images/categories/icons/cameras.png" },
  { slug: "networking", name: "Networking", itemCount: "76+ items", icon: "Router", image: "/images/categories/icons/networking.png" },
  { slug: "printers", name: "Printers", itemCount: "54+ items", icon: "Printer", image: "/images/categories/icons/printers.png" },
  { slug: "storage", name: "Storage", itemCount: "112+ items", icon: "HardDrive", image: "/images/categories/icons/storage.png" },
  { slug: "components", name: "Components", itemCount: "199+ items", icon: "CircuitBoard", image: "/images/categories/icons/components.png" },
  { slug: "accessories", name: "Accessories", itemCount: "520+ items", icon: "Cable", image: "/images/categories/icons/accessories.png" },
  { slug: "home-appliances", name: "Home Appliances", itemCount: "175+ items", icon: "Refrigerator", image: "/images/categories/icons/home-appliances.png" },
  { slug: "kitchen-appliances", name: "Kitchen Appliances", itemCount: "310+ items", icon: "ChefHat", image: "/images/categories/icons/kitchen-appliances.png" },
  { slug: "toys", name: "Toys", itemCount: "140+ items", icon: "Blocks", image: "/images/categories/icons/toys.png" },
  { slug: "smart-home", name: "Smart Home", itemCount: "155+ items", icon: "Home", image: "/images/categories/icons/smart-home.png" },
  { slug: "gadgets", name: "Gadgets", itemCount: "98+ items", icon: "Puzzle", image: "/images/categories/icons/gadgets.png" },
  { slug: "personal-care", name: "Personal Care", itemCount: "132+ items", icon: "Sparkles", image: "/images/categories/icons/personal-care.png" },
  { slug: "sports-outdoor", name: "Sports & Outdoor", itemCount: "121+ items", icon: "Dumbbell", image: "/images/categories/icons/sports-outdoor.png" },
  { slug: "fashion", name: "Fashion", itemCount: "260+ items", icon: "Shirt", image: "/images/categories/icons/fashion.png" },
  { slug: "beauty", name: "Beauty", itemCount: "144+ items", icon: "Gem", image: "/images/categories/icons/beauty.png" },
  { slug: "home-living", name: "Home & Living", itemCount: "205+ items", icon: "Sofa", image: "/images/categories/icons/home-living.png" },
  { slug: "more", name: "More", itemCount: "Browse all", icon: "LayoutGrid", image: "/images/categories/icons/more.png" },
];

export const featuredCategories: FeaturedCategory[] = [
  { slug: "laptops", name: "Laptops", itemCount: "180+ items", image: "/images/categories/laptops.png" },
  { slug: "desktop-pc", name: "Desktop PC", itemCount: "95+ items", image: "/images/categories/desktop-pc.png" },
  { slug: "all-in-one-pc", name: "All-in-One PC", itemCount: "60+ items", image: "/images/categories/all-in-one-pc.png" },
  { slug: "gaming-pc", name: "Gaming PC", itemCount: "120+ items", image: "/images/categories/gaming-pc.png" },
  { slug: "workstations", name: "Workstations", itemCount: "45+ items", image: "/images/categories/workstations.png" },
  { slug: "mini-pc", name: "Mini PC", itemCount: "50+ items", image: "/images/categories/mini-pc.png" },
  { slug: "nas-storages", name: "NAS & Storage", itemCount: "70+ items", image: "/images/categories/nas-storages.png" },
  { slug: "monitors", name: "Monitors", itemCount: "120+ items", image: "/images/categories/desktop-pc.png" },
  { slug: "networking", name: "Networking", itemCount: "76+ items", image: "/images/categories/nas-storages.png" },
];

export const promoBanners: PromoBanner[] = [
  {
    id: "promo-laptops",
    eyebrow: "Work & play",
    title: "Latest Laptops for Work & Play",
    description: "Powerful. Portable. Reliable.",
    cta: "Shop Laptops",
    href: "/category/laptops",
    image: "/images/promo/laptops.jpg",
    theme: "blue",
  },
  {
    id: "promo-home",
    eyebrow: "Home & kitchen",
    title: "Upgrade Your Home with Smart Appliances",
    description: "Modern living made easy.",
    cta: "Shop Home & Kitchen",
    href: "/category/kitchen-appliances",
    image: "/images/promo/home-appliances.jpg",
    theme: "green",
  },
];

export const shoppableSetups: ShoppableSetup[] = [
  { id: "s1", title: "Morning Routine", description: "Coffee maker, smart speaker & earbuds to start the day right.", itemCount: 3, fromPrice: 899, icon: "Coffee", size: "large" },
  { id: "s2", title: "Work-From-Home Desk", description: "Laptop, monitor & mechanical keyboard.", itemCount: 3, fromPrice: 2199, icon: "Monitor", size: "small" },
  { id: "s3", title: "Movie Night", description: "TV, soundbar & streaming stick.", itemCount: 3, fromPrice: 2499, icon: "Tv", size: "small" },
  { id: "s4", title: "Smart Entryway", description: "Video doorbell, smart lock & hub.", itemCount: 3, fromPrice: 749, icon: "ShieldCheck", size: "small" },
  { id: "s5", title: "Kids' Play Corner", description: "Building sets, tablet case & headphones.", itemCount: 3, fromPrice: 399, icon: "Blocks", size: "small" },
];

export const brands = ["Dell", "HP", "Lenovo", "Samsung", "LG", "Sony", "Apple", "Asus", "Acer", "Canon"];

export const faqs: FaqItem[] = [
  { question: "Are your laptops, TVs, and gadgets 100% genuine?", answer: "Yes — every device is sourced from authorized distributors and ships with its original manufacturer warranty, never grey-market or refurbished units unless clearly labeled.", icon: "ShieldCheck" },
  { question: "Do you deliver across the UAE?", answer: "Yes — same-day delivery in Dubai on eligible orders placed before 2pm, and next-day delivery across the other Emirates.", icon: "Truck" },
  { question: "Can I pay with Tabby or Tamara?", answer: "Yes, both are available at checkout — split your order into 4 interest-free payments, no extra fees.", icon: "CreditCard" },
  { question: "What's your return policy on electronics?", answer: "15 days, no questions asked, on unopened items. Request a return from your order history and we'll arrange doorstep pickup.", icon: "RotateCcw" },
  { question: "Will my laptop or phone work with UAE plugs and networks?", answer: "Yes — all laptops, TVs, and mobile devices we list are UAE-spec: Type G plug compatible or shipped with an adapter, and phones are unlocked for any local carrier.", icon: "Cable" },
  { question: "How do I track my order?", answer: "A tracking link is emailed and sent to WhatsApp the moment your order leaves the warehouse.", icon: "MapPin" },
];

export const popularSearches = [
  "Gaming Laptops",
  "4K Smart TVs",
  "Wireless Earbuds",
  "Mechanical Keyboards",
  "PlayStation 5",
  "Air Fryers",
  "Robot Vacuums",
  "Noise Cancelling Headphones",
  "Smart Watches",
  "Monitors Under AED 500",
  "Home Security Cameras",
  "Portable SSDs",
  "Gaming Mice",
  "Coffee Machines",
  "Bluetooth Speakers",
  "Laptop Bags & Sleeves",
];
