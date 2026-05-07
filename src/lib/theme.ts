// Per-module accent color theming.
// Default system colors; applied to CSS vars whenever route changes.

export const MODULE_ROUTES: Record<string, string> = {
  Dashboard: "/",
  Orders: "/orders",
  Payments: "/payments",
  Inventory: "/inventories",
  Suppliers: "/suppliers",
  Expenses: "/expenses",
  Employees: "/employees",
  Customers: "/customers",
  Users: "/users",
  Settings: "/settings",
};

export const DEFAULT_MODULE_COLORS: Record<string, string> = {
  Dashboard: "#E48444",
  Orders: "#3B82F6",
  Payments: "#10B981",
  Inventory: "#F59E0B",
  Suppliers: "#8B5CF6",
  Expenses: "#EF4444",
  Employees: "#0EA5E9",
  Customers: "#EC4899",
  Users: "#14B8A6",
  Settings: "#64748B",
};

const STORAGE_KEY = "sand-supply.module-colors";

export function loadColors(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_MODULE_COLORS, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_MODULE_COLORS };
}

export function saveColors(map: Record<string, string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {}
  window.dispatchEvent(new CustomEvent("module-colors-changed"));
}

// hex → "h s% l%"
export function hexToHslTriplet(hex: string): string {
  const m = hex.replace("#", "").match(/^([0-9a-f]{6}|[0-9a-f]{3})$/i);
  if (!m) return "24 75% 58%";
  let h = m[0];
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let hh = 0,
    s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        hh = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        hh = (b - r) / d + 2;
        break;
      case b:
        hh = (r - g) / d + 4;
        break;
    }
    hh /= 6;
  }
  return `${Math.round(hh * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function applyAccentForRoute(pathname: string) {
  const colors = loadColors();
  const moduleName =
    Object.entries(MODULE_ROUTES).find(([, p]) =>
      p === "/" ? pathname === "/" : pathname.startsWith(p)
    )?.[0] ?? "Dashboard";
  const hex = colors[moduleName] ?? DEFAULT_MODULE_COLORS[moduleName];
  const triplet = hexToHslTriplet(hex);
  const root = document.documentElement;
  root.style.setProperty("--primary", triplet);
  root.style.setProperty("--ring", triplet);
  root.style.setProperty("--sidebar-primary", triplet);
  root.style.setProperty("--sidebar-ring", triplet);
  // glow = same hue, +10% lightness
  const [hh, ss, ll] = triplet.split(" ");
  const lightened = `${hh} ${ss} ${Math.min(95, parseInt(ll) + 10)}%`;
  root.style.setProperty("--primary-glow", lightened);
  root.style.setProperty(
    "--gradient-primary",
    `linear-gradient(135deg, hsl(${triplet}), hsl(${lightened}))`
  );
  root.style.setProperty("--shadow-glow", `0 8px 24px -8px hsl(${triplet} / 0.32)`);
}
