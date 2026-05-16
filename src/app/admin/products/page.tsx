"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  Plus,
  Search as SearchIcon,
  X,
  Upload,
  Check,
  Trash2,
  ChevronDown,
  ChevronRight,
  DollarSign,
  Layers,
  ShieldCheck,
  Sparkles,
  Shirt,
  Box,
  Eye,
  Edit2,
  MoreVertical,
  Palette as PaletteIcon,
  Hash,
  AlertCircle,
  Copy,
  Scissors,
  FileText,
  Clock,
  TrendingUp,
  Zap,
  LayoutGrid,
  Globe,
  Settings,
  MousePointer2,
  RefreshCw,
  Archive,
  ArrowUpRight,
  BarChart3,
  Flame,
  Target,
  Users,
  Compass,
  ZapOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useLanguageStore, translations } from "@/store/languageStore";
import { useFormatCurrency } from "@/hooks/useFormatCurrency";
import { useNotificationStore } from "@/store/notificationStore";

// --- Types ---
interface Product {
  id: string;
  name: string;
  sku: string;
  brand: string;
  collection: string;
  category: string;
  subcategory: string;
  price: number;
  stock: number;
  totalStock: number;
  status: "Draft" | "Published" | "Archived";
  image: string;
  material?: string;
  gsm?: string;
  fitProfile?: string;
  careLabel?: string;
  origin?: string;
  editorialDescription?: string;
}

interface Variant {
  id: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
  sku: string;
  price: number;
}

interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

interface ColorOption {
  name: string;
  hex: string;
}

// --- Fashion Fit Mapping Engine ---

const FIT_PROFILES_MAPPING: Record<string, string[]> = {
  "Kaos": ["Slim Fit", "Regular Fit", "Relaxed Fit", "Oversized Fit", "Boxy Fit", "Cropped Fit", "Longline Fit", "Muscle Fit"],
  "Kemeja": ["Slim Fit", "Regular Fit", "Tailored Fit", "Relaxed Fit", "Oversized Fit"],
  "Hoodie": ["Regular Fit", "Relaxed Fit", "Oversized Fit", "Boxy Fit", "Drop Shoulder Fit"],
  "Sweater": ["Regular Fit", "Relaxed Fit", "Oversized Fit", "Boxy Fit", "Drop Shoulder Fit"],
  "Jaket": ["Slim Fit", "Regular Fit", "Relaxed Fit", "Oversized Fit", "Structured Fit", "Bomber Fit"],
  "Blazer": ["Tailored Fit", "Slim Fit", "Modern Fit", "Classic Fit", "Italian Fit"],
  "Jas": ["Tailored Fit", "Slim Fit", "Modern Fit", "Classic Fit", "Italian Fit"],
  "Tuxedo": ["Tailored Fit", "Slim Fit", "Modern Fit", "Classic Fit", "Italian Fit"],
  "Tank top": ["Slim Fit", "Regular Fit", "Athletic Fit", "Compression Fit"],
  "Polo shirt": ["Slim Fit", "Regular Fit", "Relaxed Fit"],
  "Celana jeans": ["Skinny Fit", "Slim Fit", "Straight Fit", "Relaxed Fit", "Wide Leg Fit", "Baggy Fit", "Tapered Fit"],
  "Celana chino": ["Slim Fit", "Straight Fit", "Relaxed Fit", "Tailored Fit"],
  "Celana cargo": ["Relaxed Fit", "Baggy Fit", "Straight Fit", "Tapered Fit"],
  "Jogger": ["Slim Fit", "Relaxed Fit", "Athletic Fit", "Tapered Fit"],
  "Short pants": ["Slim Fit", "Regular Fit", "Relaxed Fit"],
  "Legging": ["Compression Fit", "Slim Fit", "Sculpt Fit"],
  "Rok": ["A-Line Fit", "Straight Fit", "Flowy Fit", "Pleated Fit"],
  "Dress": ["Bodycon Fit", "A-Line Fit", "Flowy Fit", "Empire Fit", "Shift Fit"],
  "Jumpsuit": ["Slim Fit", "Relaxed Fit", "Tailored Fit"],
  "Kaftan": ["Loose Fit", "Relaxed Fit", "Flowy Fit", "Modest Fit"],
  "Gamis": ["Loose Fit", "Relaxed Fit", "Flowy Fit", "Modest Fit"],
  "Jersey": ["Athletic Fit", "Regular Fit", "Compression Fit"],
  "Compression wear": ["Compression Fit", "Second Skin Fit"],
  "Training pants": ["Athletic Fit", "Slim Fit", "Relaxed Fit"],
  "Sneakers": ["Narrow Fit", "Regular Fit", "Wide Fit", "Extra Wide Fit", "Snug Fit", "Locked-In Fit"],
  "Loafers": ["Narrow Fit", "Regular Fit", "Wide Fit", "Extra Wide Fit", "Snug Fit", "Locked-In Fit"],
  "Boots": ["Narrow Fit", "Regular Fit", "Wide Fit", "Extra Wide Fit", "Snug Fit", "Locked-In Fit"],
  "Sandal": ["Narrow Fit", "Regular Fit", "Wide Fit", "Extra Wide Fit", "Snug Fit", "Locked-In Fit"],
  "Heels": ["Narrow Fit", "Regular Fit", "Wide Fit", "Extra Wide Fit", "Snug Fit", "Locked-In Fit"],
  "Flat shoes": ["Narrow Fit", "Regular Fit", "Wide Fit", "Extra Wide Fit", "Snug Fit", "Locked-In Fit"],
  "Sepatu olahraga": ["Narrow Fit", "Regular Fit", "Wide Fit", "Extra Wide Fit", "Snug Fit", "Locked-In Fit"],
  "Sepatu formal": ["Narrow Fit", "Regular Fit", "Wide Fit", "Extra Wide Fit", "Snug Fit", "Locked-In Fit"],
  "Leather shoes": ["Narrow Fit", "Regular Fit", "Wide Fit", "Extra Wide Fit", "Snug Fit", "Locked-In Fit"],
};

const NO_FIT_SUBCATEGORIES = [
  "Jam tangan", "Kacamata", "Topi", "Belt", "Dasi", "Scarf", "Dompet", "Tas",
  "Tote bag", "Backpack", "Sling bag", "Handbag", "Duffel bag",
  "Cincin", "Kalung", "Gelang", "Anting"
];

const FASHION_CATEGORIES: Record<string, string[]> = {
  "Pakaian Atasan": ["Kaos", "Kemeja", "Hoodie", "Sweater", "Jaket", "Blazer", "Tank top", "Polo shirt"],
  "Pakaian Bawahan": ["Celana jeans", "Celana chino", "Celana cargo", "Rok", "Legging", "Short pants", "Jogger"],
  "Pakaian Terusan": ["Dress", "Jumpsuit", "Overall", "Gamis", "Kaftan"],
  "Fashion Muslim": ["Hijab", "Pashmina", "Mukena", "Baju koko", "Sarung"],
  "Alas Kaki": ["Sneakers", "Loafers", "Boots", "Sandal", "Heels", "Flat shoes"],
  "Aksesori Fashion": ["Jam tangan", "Kacamata", "Topi", "Belt", "Dasi", "Scarf", "Dompet"],
  Tas: ["Tote bag", "Backpack", "Sling bag", "Handbag", "Duffel bag"],
  Perhiasan: ["Cincin", "Kalung", "Gelang", "Anting"],
  "Pakaian Dalam": ["Bra", "Boxer", "Brief", "Singlet", "Kaos kaki"],
  Sportswear: ["Jersey", "Training pants", "Compression wear", "Sepatu olahraga"],
  Streetwear: ["Oversized tee", "Cargo pants", "Varsity jacket", "Beanie"],
  "Formal Wear": ["Jas", "Tuxedo", "Vest", "Sepatu formal"],
  "Fashion Vintage": ["Flannel", "Retro jacket", "High waist pants"],
  "Luxury Fashion": ["Designer bag", "Luxury watch", "Silk shirt", "Leather shoes"],
  "Sustainable Fashion": ["Thrift clothes", "Recycled fabric apparel", "Organic cotton wear"],
};

const BRANDS = ["Nike", "Adidas", "Uniqlo", "Zara", "Gucci", "Lumina Core", "Pijak"];
const INITIAL_COLORS: ColorOption[] = [
  { name: "Onyx Black", hex: "#000000" },
  { name: "Pearl White", hex: "#FFFFFF" },
  { name: "Desert Beige", hex: "#D2B48C" },
  { name: "Olive Moss", hex: "#556B2F" },
  { name: "Stone Gray", hex: "#708090" },
  { name: "Classic Red", hex: "#E11D48" },
  { name: "Royal Blue", hex: "#1D4ED8" },
  { name: "Emerald Green", hex: "#059669" },
];

const INITIAL_MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Oxford Minimalist Shirt",
    sku: "LUM-OX-001",
    brand: "Uniqlo",
    collection: "Urban Echo FW24",
    category: "Pakaian Atasan",
    subcategory: "Kemeja",
    price: 899000,
    stock: 45,
    totalStock: 100,
    status: "Published",
    image: "https://images.unsplash.com/photo-1598033129183-c4f50c717658?w=800",
    material: "100% Organic Cotton",
    fitProfile: "Slim Fit",
    gsm: "180 GSM",
  },
  {
    id: "2",
    name: "Classic Chino Trousers",
    sku: "LUM-CH-002",
    brand: "Zara",
    collection: "Core Collection",
    category: "Pakaian Bawahan",
    subcategory: "Celana chino",
    price: 1249000,
    stock: 8,
    totalStock: 50,
    status: "Published",
    image: "https://images.unsplash.com/photo-1624371414361-e6e0ed2b13e0?w=800",
    material: "Stretch Twill",
    fitProfile: "Regular Fit",
    gsm: "240 GSM",
  },
];

// --- Reusable UI Components ---

const Badge = ({ children, variant = "default" }: { children: React.ReactNode; variant?: string }) => {
  const styles: any = {
    default: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700",
    emerald: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20",
    rose: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20",
    amber: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20",
    zinc: "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white",
  };
  return <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${styles[variant] || styles.default}`}>{children}</span>;
};

const Toggle = ({ label, active, onToggle }: { label: string; active: boolean; onToggle: () => void }) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{label}</span>
    <button onClick={onToggle} className={`w-8 h-4 rounded-full relative transition-all duration-300 ${active ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-800"}`}>
      <motion.div animate={{ left: active ? "18px" : "4px" }} className="absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm" />
    </button>
  </div>
);

const InputField = ({ label, placeholder, type = "text", value, onChange, prefix, suffix, className, disabled }: any) => (
  <div className={`space-y-1 ${className}`}>
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      {prefix && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">{prefix}</span>}
      <input
        type={type} placeholder={placeholder} disabled={disabled} value={value} onChange={(e) => onChange?.(e.target.value)}
        className={`w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 transition-all placeholder:text-slate-300 dark:text-white ${prefix ? "pl-9" : ""} ${suffix ? "pr-9" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-[10px]">{suffix}</span>}
    </div>
  </div>
);

const SelectField = ({ label, options, value, onChange }: any) => (
  <div className="space-y-1">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      <select
        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-600 appearance-none transition-all dark:text-white"
        value={value} onChange={(e) => onChange?.(e.target.value)}
      >
        <option value="" disabled>Select {label}</option>
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
    </div>
  </div>
);

// --- Modal: Complex Fashion Registration ---

const AddProductModal = ({ isOpen, onClose, onAddProduct, initialData }: { isOpen: boolean; onClose: () => void; onAddProduct: (product: Product) => void; initialData?: Product | null }) => {
  const { language } = useLanguageStore();
  const t = translations[language];

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [slug, setSlug] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [collection, setCollection] = useState("");
  const [price, setPrice] = useState("");
  const [material, setMaterial] = useState("");
  const [gsm, setGsm] = useState("");
  const [fitProfile, setFitProfile] = useState("");
  const [careLabel, setCareLabel] = useState("");
  const [origin, setOrigin] = useState("");
  const [editorialDescription, setEditorialDescription] = useState("");

  const [isSkuModified, setIsSkuModified] = useState(false);
  const [isSlugModified, setIsSlugModified] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name); setSku(initialData.sku); setBrand(initialData.brand);
      setCategory(initialData.category); setSubcategory(initialData.subcategory);
      setCollection(initialData.collection); setPrice(initialData.price.toString());
      setMaterial(initialData.material || ""); setGsm(initialData.gsm || "");
      setFitProfile(initialData.fitProfile || ""); setCareLabel(initialData.careLabel || "");
      setOrigin(initialData.origin || ""); setEditorialDescription(initialData.editorialDescription || "");
      setSlug(initialData.sku.toLowerCase()); setIsSkuModified(true); setIsSlugModified(true);
    }
  }, [initialData]);

  const [activeToggles, setActiveToggles] = useState<Record<string, boolean>>({
    "Active Listing": true, "Featured Product": false, "New Arrival": true, "Limited Edition": false,
  });

  const [images, setImages] = useState<ProductImage[]>([]);
  const [variants, setVariants] = useState<Variant[]>([
    { id: "v1", size: "M", color: "Onyx Black", colorHex: "#000000", stock: 10, sku: "", price: 0 }
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [palette, setPalette] = useState<ColorOption[]>(INITIAL_COLORS);
  const [selectedColor, setSelectedColor] = useState<ColorOption>(INITIAL_COLORS[0]);
  const [customHex, setCustomHex] = useState("#f3f3f3");
  const [customName, setCustomName] = useState("");

  const dynamicFitOptions = useMemo(() => {
    if (!subcategory) return [];
    return FIT_PROFILES_MAPPING[subcategory] || [];
  }, [subcategory]);

  const isFitRequired = useMemo(() => {
    if (!subcategory) return false;
    return !NO_FIT_SUBCATEGORIES.includes(subcategory) && (dynamicFitOptions.length > 0 || category === "Alas Kaki");
  }, [subcategory, category, dynamicFitOptions]);

  useEffect(() => {
    if (!isSlugModified && name) {
      setSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  }, [name, isSlugModified]);

  useEffect(() => {
    if (!isSkuModified && (name || category || brand)) {
      const catPart = category ? category.split(" ").map(w => w[0]).join("").toUpperCase() : "XXX";
      const brandPart = brand ? brand.split(" ").map(w => w[0]).join("").toUpperCase() : "LUM";
      const namePart = name ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 3) : "000";
      const randomPart = Math.floor(100 + Math.random() * 900);
      setSku(`LUM-${catPart}-${brandPart}-${namePart}-${randomPart}`);
    }
  }, [name, category, brand, isSkuModified]);

  const toggleSwitch = (label: string) => setActiveToggles(prev => ({ ...prev, [label]: !prev[label] }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map(file => ({
        id: Math.random().toString(36).substr(2, 9),
        url: URL.createObjectURL(file),
        isPrimary: images.length === 0,
      }));
      setImages(prev => [...prev, ...newImages]);
      toast.success(`${files.length} image(s) added.`);
    }
  };

  const addVariant = () => {
    setVariants(prev => [...prev, {
      id: Math.random().toString(36).substr(2, 9),
      size: "M", color: selectedColor.name, colorHex: selectedColor.hex,
      stock: 0, sku: "", price: 0,
    }]);
  };

  const updateVariantColor = (variantId: string, color: ColorOption) => {
    setVariants(prev => prev.map(v => v.id === variantId ? { ...v, color: color.name, colorHex: color.hex } : v));
  };

  const addCustomColor = () => {
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(customHex)) return toast.error("Invalid Hex");
    const finalName = customName.trim() || `Shade ${customHex}`;
    const newColor = { name: finalName, hex: customHex };
    setPalette(prev => [...prev, newColor]);
    setSelectedColor(newColor);
    setCustomName("");
    toast.success(`Color ${finalName} added.`);
  };

  const subcategoryOptions = useMemo(() => category ? FASHION_CATEGORIES[category] || [] : [], [category]);

  const handleSave = () => {
    if (!name || !category || !brand) return toast.error("Fill required fields.");
    setIsSaving(true);
    const newProduct: Product = {
      id: initialData?.id || Math.random().toString(36).substr(2, 9),
      name, sku, brand, category, subcategory: subcategory || "General",
      collection: collection || "Permanent",
      price: parseInt(price) || 0,
      stock: variants.reduce((acc, v) => acc + (v.stock || 0), 0),
      totalStock: variants.reduce((acc, v) => acc + (v.stock || 0), 0) + 15,
      status: "Published",
      image: images.find(img => img.isPrimary)?.url || initialData?.image || "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800",
      material, gsm, fitProfile, careLabel, origin, editorialDescription
    };
    setTimeout(() => {
      onAddProduct(newProduct);
      setIsSaving(false);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-900/40 backdrop-blur-md" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 30 }}
        className="bg-white dark:bg-slate-950 w-full max-w-5xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col relative z-10 border border-slate-100 dark:border-slate-800 h-full max-h-[92vh]"
      >
        <div className="px-8 py-6 border-b border-slate-50 dark:border-slate-900 flex items-center justify-between shrink-0 bg-white dark:bg-slate-950">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg"><Shirt className="w-5 h-5 text-white" /></div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{initialData ? t.editAssetModal : t.registerAssetModal}</h2>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.modalSubtitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-5 space-y-4">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest ml-1">{t.assetImagery}</label>
                <div onClick={() => fileInputRef.current?.click()} className="aspect-square bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 dark:border-slate-800 border-dashed rounded-[28px] flex flex-col items-center justify-center group hover:bg-slate-100/50 dark:hover:bg-slate-900 hover:border-blue-500/20 transition-all cursor-pointer relative overflow-hidden">
                  <input type="file" multiple hidden ref={fileInputRef} onChange={handleImageUpload} accept="image/*" />
                  {images.find(img => img.isPrimary) ? <img src={images.find(img => img.isPrimary)?.url} className="w-full h-full object-cover" /> : <div className="text-center space-y-2"><div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-sm mx-auto mb-2"><Upload className="w-6 h-6 text-blue-600" /></div><p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.selectCampaign}</p></div>}
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-7 space-y-4">
              <div className="bg-slate-50/50 dark:bg-slate-900/30 p-6 rounded-[28px] border border-slate-100 dark:border-slate-800 grid grid-cols-1 gap-4">
                <InputField label={t.assetName} placeholder="Minimalist Oversized Tee" value={name} onChange={setName} />
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <InputField label={t.assetSku} placeholder="Generating..." value={sku} onChange={(v: string) => { setSku(v); setIsSkuModified(true); }} />
                    {!isSkuModified && <span className="absolute top-[1px] right-2 text-[8px] font-bold text-emerald-500 uppercase">Auto</span>}
                  </div>
                  <SelectField label={t.brand} options={BRANDS} value={brand} onChange={setBrand} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <SelectField label={t.category} options={Object.keys(FASHION_CATEGORIES)} value={category} onChange={(v: string) => { setCategory(v); setSubcategory(""); }} />
                  <SelectField label={t.subcategory} options={subcategoryOptions} value={subcategory} onChange={setSubcategory} />
                </div>
                <SelectField label={t.collection} options={["Permanent", "FW24", "SS24", "Limited Drop", "Resort 25"]} value={collection} onChange={setCollection} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <div className="flex items-center gap-3"><Scissors className="w-4 h-4 text-blue-600" /><h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 dark:text-white">{t.fabricationSilhouette}</h3></div>
             <div className="bg-slate-50/50 dark:bg-slate-900/30 p-6 rounded-[28px] border border-slate-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputField label={t.material} placeholder="e.g. 100% Organic Cotton" value={material} onChange={setMaterial} />
                <InputField label={t.gsm} placeholder="e.g. 240 GSM" value={gsm} onChange={setGsm} />
                {isFitRequired ? (
                   <SelectField label={category === "Alas Kaki" ? t.shoeFit : t.fitProfile} options={dynamicFitOptions} value={fitProfile} onChange={setFitProfile} />
                ) : (
                  <div className="space-y-1.5 opacity-40 grayscale pointer-events-none">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">{t.fitProfile}</label>
                    <div className="bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-400 border border-slate-200 dark:border-slate-700">Not Applicable</div>
                  </div>
                )}
                <InputField label={t.careLabel} placeholder="Hand wash cold" value={careLabel} onChange={setCareLabel} />
                <InputField label={t.origin} placeholder="Italy, Indonesia" value={origin} onChange={setOrigin} />
                <div className="flex flex-col justify-end pb-1.5"><Badge variant="amber">Sustainable Certified</Badge></div>
             </div>
          </div>

          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-12 lg:col-span-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 space-y-6 shadow-sm h-full">
                <div className="flex items-center gap-3"><DollarSign className="w-5 h-5 text-blue-600" /><h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">{t.commercialStrategy}</h3></div>
                <div className="grid grid-cols-2 gap-6">
                  <InputField label={t.basePrice} prefix="Rp" placeholder="0" className="col-span-2" value={price} onChange={setPrice} />
                  <InputField label={t.discountPrice} prefix="Rp" placeholder="0" />
                  <InputField label={t.productionCost} prefix="Rp" placeholder="0" />
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-6 space-y-6">
              <div className="bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 space-y-4">
                <div className="flex items-center gap-3 mb-2"><ShieldCheck className="w-5 h-5 text-blue-600" /><h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">{t.assetVisibility}</h3></div>
                <div className="grid grid-cols-2 gap-x-10 gap-y-2">
                  {Object.keys(activeToggles).map(label => <Toggle key={label} label={label} active={activeToggles[label]} onToggle={() => toggleSwitch(label)} />)}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-12 border-t border-slate-50 dark:border-slate-900 pt-12">
            <div className="space-y-8 bg-slate-50/50 dark:bg-slate-900/30 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-3"><div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm"><PaletteIcon className="w-5 h-5 text-blue-600" /></div><div><h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">{t.colorEngine}</h3><p className="text-[9px] text-slate-400 font-bold uppercase">{t.defineVariants}</p></div></div>
                <div className="flex flex-wrap items-end gap-4 bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                  <div className="space-y-1.5"><label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1">{t.pickColor}</label><input type="color" value={customHex} onChange={(e) => setCustomHex(e.target.value)} className="w-12 h-12 rounded-xl border-4 border-slate-50 dark:border-slate-900 shadow-sm cursor-pointer" /></div>
                  <InputField label={t.hexCode} placeholder="#000000" value={customHex} onChange={setCustomHex} className="w-28" />
                  <InputField label={t.colorName} placeholder="Midnight Sea" value={customName} onChange={setCustomName} className="w-40" />
                  <button onClick={addCustomColor} className="h-[46px] px-8 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"><Plus className="w-4 h-4" /> {t.registerColor}</button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {palette.map(c => (
                  <button key={c.hex} onClick={() => setSelectedColor(c)} className={`group relative flex items-center gap-3 p-3 rounded-2xl border-2 transition-all duration-300 ${selectedColor.hex === c.hex ? 'border-blue-600 bg-white dark:bg-slate-800 shadow-xl scale-105' : 'border-transparent bg-slate-100/50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'}`}>
                    <div className="w-8 h-8 rounded-full shadow-inner shrink-0 border border-black/5" style={{ backgroundColor: c.hex }} />
                    <div className="flex-1 min-w-0"><p className={`text-[9px] font-bold uppercase truncate ${selectedColor.hex === c.hex ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{c.name}</p><p className="text-[8px] text-slate-400 font-mono">{c.hex.toUpperCase()}</p></div>
                    {selectedColor.hex === c.hex && <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-600 text-white rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-md"><Check className="w-3 h-3" /></div>}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Layers className="w-5 h-5 text-blue-600" /><h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">{t.assetVariants}</h3></div><button onClick={addVariant} className="px-8 py-3 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/10"><Plus className="w-4 h-4" /> {t.addVariant}</button></div>
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {variants.map(v => (
                    <motion.div key={v.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-8 grid grid-cols-12 gap-8 items-start hover:shadow-2xl hover:shadow-slate-200/40 transition-all duration-700">
                      <div className="col-span-12 md:col-span-2"><SelectField label={t.sizeFit} options={["XS", "S", "M", "L", "XL", "Free Size"]} /></div>
                      <div className="col-span-12 md:col-span-5 space-y-3">
                        <label className="text-[11px] font-bold text-slate-500 uppercase tracking-tight ml-1">{t.assignedColor}</label>
                        <div className="flex flex-wrap gap-2 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                          {palette.map(c => (
                            <button key={c.hex} onClick={() => updateVariantColor(v.id, c)} className={`w-8 h-8 rounded-full border-2 transition-all relative group/clr ${v.colorHex === c.hex ? 'border-blue-600 scale-110 shadow-md' : 'border-white dark:border-slate-900 hover:scale-110'}`} style={{ backgroundColor: c.hex }}>
                              {v.colorHex === c.hex && <Check className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-md" />}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 px-2"><p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase">{v.color}</p><span className="text-[10px] text-slate-400 font-mono uppercase">{v.colorHex}</span></div>
                      </div>
                      <div className="col-span-12 md:col-span-2"><InputField label={t.units} type="number" placeholder="0" value={v.stock} onChange={(val: string) => setVariants(prev => prev.map(vt => vt.id === v.id ? { ...vt, stock: parseInt(val) || 0 } : vt))} /></div>
                      <div className="col-span-12 md:col-span-2"><InputField label={t.customSku} placeholder={t.optional} /></div>
                      <div className="col-span-12 md:col-span-1 flex justify-end pt-8"><button onClick={() => setVariants(variants.filter(vt => vt.id !== v.id))} className="p-3 text-slate-300 hover:text-rose-500 bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all shadow-sm"><Trash2 className="w-4 h-4" /></button></div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-10 border-t border-slate-50 dark:border-slate-900 pt-12">
              <div className="col-span-12 lg:col-span-12 space-y-6">
                <div className="flex items-center gap-3"><Globe className="w-5 h-5 text-blue-600" /><h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">{t.narrativeSeo}</h3></div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="relative group">
                    <InputField label={t.urlSlug} placeholder="Generating..." value={slug} onChange={(v: string) => { setSlug(v); setIsSlugModified(true); }} suffix=".lumina" />
                    {!isSlugModified && <span className="absolute top-[1px] right-2 text-[8px] font-bold text-emerald-500 uppercase">Auto</span>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t.editorialNarrative}</label>
                    <textarea 
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] px-6 py-5 text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all placeholder:text-slate-300 dark:text-white min-h-[160px] custom-scrollbar" 
                      placeholder={t.describeCraft} 
                      value={editorialDescription}
                      onChange={(e) => setEditorialDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-10 py-8 border-t border-slate-50 dark:border-slate-900 bg-white dark:bg-slate-950 flex items-center justify-between shrink-0 sticky bottom-0 z-50">
          <button onClick={onClose} className="px-8 py-4 bg-slate-50 dark:bg-slate-900 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">{t.discard}</button>
          <div className="flex items-center gap-4">
            <button className="px-8 py-4 text-slate-900 dark:text-white text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-900 rounded-xl transition-all">{t.saveDraft}</button>
            <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-3 px-12 py-4 bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 group">
              {isSaving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <>{initialData ? t.updateAsset : t.registerAssetModal} <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const AssetIntelligence = ({ isOpen, onClose, product }: { isOpen: boolean, onClose: () => void, product: Product | null }) => {
  const { language } = useLanguageStore();
  const t = translations[language];

  if (!product) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[150]" />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed top-0 right-0 h-full w-full max-w-xl bg-white dark:bg-slate-900 shadow-2xl z-[160] overflow-y-auto flex flex-col border-l dark:border-slate-800">
            <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20"><Sparkles className="w-6 h-6 text-white" /></div>
                <div><h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">{t.assetIntelligence}</h2><p className="text-xs text-slate-400 font-medium">{product.name} — {product.sku}</p></div>
              </div>
              <button onClick={onClose} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 transition-all"><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            <div className="p-10 space-y-10 flex-1">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[32px] space-y-4 border border-slate-100 dark:border-slate-800"><Flame className="w-6 h-6 text-rose-500" /><div className="space-y-1"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.velocity}</p><p className="text-2xl font-black text-slate-900 dark:text-white">8.4x</p></div></div>
                <div className="bg-emerald-50 dark:bg-emerald-500/10 p-6 rounded-[32px] space-y-4 border border-emerald-100 dark:border-emerald-500/20"><Target className="w-6 h-6 text-emerald-600" /><div className="space-y-1"><p className="text-[10px] font-bold text-emerald-600/60 uppercase tracking-widest">{t.sellThrough}</p><p className="text-2xl font-black text-emerald-700 dark:text-emerald-400">92%</p></div></div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 space-y-4">
                 <div className="flex items-center gap-3"><Zap className="w-5 h-5 text-amber-500" /><h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-900 dark:text-white">{t.aiStrategy}</h4></div>
                 <p className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">"{t.recommendation} <span className="text-slate-900 dark:text-white font-bold not-italic">"{product.subcategory}"</span>. {t.stockAlloc} <span className="text-slate-900 dark:text-white font-bold not-italic">{product.fitProfile}</span> {t.upcomingSeason}"</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default function ProductsPage() {
  const { language } = useLanguageStore();
  const t = translations[language];
  const { format, formatAbbreviated } = useFormatCurrency();
  const { addNotification } = useNotificationStore();

  const [products, setProducts] = useState<Product[]>(INITIAL_MOCK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [intelligenceProduct, setIntelligenceProduct] = useState<Product | null>(null);

  const handleAddOrUpdateProduct = (newProduct: Product) => {
    const isEdit = !!editingProduct;
    setProducts(prev => {
      const exists = prev.find(p => p.id === newProduct.id);
      if (exists) return prev.map(p => p.id === newProduct.id ? newProduct : p);
      return [newProduct, ...prev];
    });
    
    addNotification({
      title: isEdit ? "Produk Diperbarui" : "Produk Baru Terdaftar",
      description: `${newProduct.name} (${newProduct.sku}) telah ${isEdit ? "diperbarui" : "ditambahkan"} ke inventaris.`,
      type: "SUCCESS",
      source: "Products"
    });
    
    toast.success(isEdit ? "Produk diperbarui." : "Produk berhasil didaftarkan.");
    setEditingProduct(null);
  };

  const handleAction = (id: string, action: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return;

    if (action === "Delete") { 
      setProducts(prev => prev.filter(p => p.id !== id)); 
      addNotification({
        title: "Produk Dihapus",
        description: `${product.name} telah dihapus dari sistem oleh Admin.`,
        type: "WARNING",
        source: "Products"
      });
      toast.error("Asset removed."); 
    }
    else if (action === "Duplicate") {
      const copy = { ...product, id: Math.random().toString(36).substr(2, 9), name: `${product.name} (Copy)`, sku: `${product.sku}-COPY` };
      setProducts(prev => [copy, ...prev]);
      addNotification({
        title: "Produk Diduplikasi",
        description: `Salinan dari ${product.name} telah dibuat.`,
        type: "INFO",
        source: "Products"
      });
      toast.success("Asset duplicated.");
    } else if (action === "Archive") { 
      setProducts(prev => prev.map(p => p.id === id ? { ...p, status: "Archived" } : p)); 
      addNotification({
        title: "Produk Diarsipkan",
        description: `${product.name} kini tidak lagi aktif di storefront.`,
        type: "INFO",
        source: "Products"
      });
      toast.success("Asset archived."); 
    }
  };

  const filteredProducts = useMemo(() => products.filter(p => (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase())) && (filterStatus === "ALL" || p.status === filterStatus)), [products, searchQuery, filterStatus]);

  const inventoryValue = products.reduce((acc, p) => acc + (p.price * (p.stock || 0)), 0);

  return (
    <div className="min-h-screen bg-[#FDFDFD] dark:bg-slate-950 p-6 md:p-8 max-w-[1600px] mx-auto space-y-8 font-sans selection:bg-blue-600 selection:text-white transition-colors">
      <AnimatePresence>
        {(isModalOpen || editingProduct) && <AddProductModal isOpen={true} onClose={() => { setIsModalOpen(false); setEditingProduct(null); }} onAddProduct={handleAddOrUpdateProduct} initialData={editingProduct} />}
      </AnimatePresence>
      <AssetIntelligence isOpen={!!intelligenceProduct} onClose={() => setIntelligenceProduct(null)} product={intelligenceProduct} />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-600 rounded-full shadow-lg shadow-blue-600/20" />
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{t.inventoryTitle}</h1>
          </div>
          <p className="text-slate-400 dark:text-slate-500 font-medium text-sm max-w-lg leading-snug">{t.inventorySubtitle}</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-3 px-8 py-3.5 bg-blue-600 text-white text-[9px] font-black uppercase tracking-[0.15em] rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 group">
          <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" /> {t.registerAsset}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: t.activeSku, value: products.length, icon: Layers, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-500/10" },
          { label: t.inventoryValue, value: formatAbbreviated(inventoryValue), icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
          { label: t.lowStockAlerts, value: `${products.filter(p => p.stock < 10).length} ${t.alerts}`, subValue: `${products.filter(p => p.stock < 5).length} ${t.critical}`, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-500/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-4 shadow-sm hover:shadow-xl hover:shadow-blue-200/10 transition-all flex items-center justify-between group">
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-xl font-black text-slate-900 dark:text-white group-hover:translate-x-1 transition-transform origin-left">{stat.value}</p>
                {stat.subValue && <span className="text-[8px] font-black text-rose-500 uppercase tracking-tight">{stat.subValue}</span>}
              </div>
            </div>
            <div className={`p-2.5 rounded-xl ${stat.bg} group-hover:scale-110 transition-transform`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-1 group">
        <SearchIcon className="w-5 h-5 text-slate-300 dark:text-slate-700 absolute left-5 top-1/2 -translate-y-1/2 group-focus-within:text-blue-600 transition-colors" />
        <input 
          type="text" 
          placeholder={t.searchPlaceholder} 
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-14 pr-6 py-3.5 text-xs font-bold focus:outline-none focus:ring-[8px] focus:ring-blue-600/5 transition-all shadow-sm dark:text-white" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map(p => <ProductCard key={p.id} product={p} onEdit={() => setEditingProduct(p)} onAction={handleAction} onShowIntelligence={() => setIntelligenceProduct(p)} />)}
        </AnimatePresence>
      </div>
    </div>
  );
}

const ProductCard = ({ product, onEdit, onAction, onShowIntelligence }: { product: Product, onEdit: () => void, onAction: (id: string, action: string) => void, onShowIntelligence: () => void }) => {
  const { language } = useLanguageStore();
  const t = translations[language];
  const { format } = useFormatCurrency();

  const [showActions, setShowActions] = useState(false);
  const actionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => { if (actionRef.current && !actionRef.current.contains(e.target as Node)) setShowActions(false); };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <motion.div layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[28px] p-5 flex items-center gap-6 group transition-all duration-500 shadow-sm relative overflow-hidden hover:shadow-xl hover:shadow-blue-200/10">
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/30 dark:bg-slate-800/10 rounded-bl-[80px] pointer-events-none" />
      
      {/* Product Image - Smaller & Professional */}
      <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 border border-slate-50 dark:border-slate-800 relative group/img shadow-sm bg-slate-50">
        <img src={product.image} className="w-full h-full object-cover transform group-hover/img:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
          <Eye className="w-4 h-4 text-white" />
        </div>
      </div>

      <div className="flex-1 grid grid-cols-12 gap-6 items-center">
        {/* Info Section */}
        <div className="col-span-6 space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight leading-tight">{product.name}</h2>
              <Badge variant={product.status === "Published" ? "emerald" : "zinc"}>{product.status}</Badge>
            </div>
            <div className="flex items-center gap-2.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
              <span className="text-slate-900 dark:text-slate-300">{product.brand}</span>
              <div className="w-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full" />
              <span>{product.subcategory}</span>
              {product.fitProfile && (
                <>
                  <div className="w-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  <span className="text-blue-600 font-black">{product.fitProfile}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-6 pt-3 border-t border-slate-50 dark:border-slate-800">
            <div className="space-y-0.5">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t.baseSku}</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">{product.sku}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t.globalStock}</p>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${product.stock < 10 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
                <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{product.stock} <span className="text-[10px] text-slate-400 font-medium">U</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Price Section */}
        <div className="col-span-3 space-y-1 border-l border-slate-100 dark:border-slate-800 pl-6 flex flex-col justify-center">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t.msrpPrice}</p>
          <p className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{format(product.price)}</p>
          {product.gsm && <p className="text-[8px] font-bold text-slate-400 uppercase">{product.gsm} {t.quality}</p>}
        </div>

        {/* Actions Section */}
        <div className="col-span-3 flex flex-col items-end gap-3">
          <div className="flex items-center gap-2 relative" ref={actionRef}>
            <button onClick={onEdit} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all shadow-sm active:scale-90" title={t.edit}>
              <Edit2 className="w-4 h-4" />
            </button>
            <button onClick={() => setShowActions(!showActions)} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-xl transition-all shadow-sm active:scale-90">
              <MoreVertical className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {showActions && (
                <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} className="absolute top-full right-0 mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl z-50 overflow-hidden py-1.5 rounded-2xl">
                  {["Duplicate", "Archive", "Delete"].map(action => (
                    <button key={action} onClick={() => { onAction(product.id, action); setShowActions(false); }} className={`w-full px-5 py-2.5 text-left text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${action === 'Delete' ? 'text-rose-500' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                      {action === "Duplicate" ? t.duplicate : action === "Archive" ? t.archive : t.delete}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={onShowIntelligence} className="flex items-center gap-2 text-[9px] font-black text-slate-400 hover:text-blue-600 dark:text-slate-500 dark:hover:text-white uppercase tracking-[0.15em] transition-all group/view">
            {t.assetIntelligence} <ChevronRight className="w-4 h-4 group-hover/view:translate-x-1.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
