import { PageShell } from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  ShoppingCart,
  DollarSign,
  Tag,
  Pickaxe,
  TrendingUp,
  AlertCircle,
  Calendar,
  Wallet,
  Smile,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const topStats = [
  { label: "Total Orders", value: "1", sub: "", icon: ShoppingCart, tone: "muted" },
  { label: "Total Payments", value: "Rs. 20,000", sub: "", icon: DollarSign, tone: "success" },
  { label: "Total Credits", value: "Rs. 260,001", sub: "1 Credit Order", icon: Tag, tone: "destructive" },
  { label: "Petty Cash Expenses", value: "Rs. 0", sub: "0 Expenses", icon: Pickaxe, tone: "muted" },
];

const stockAlerts = [
  { name: "River Sand - Rough", value: "0 / 0 sqft", pct: 5 },
  { name: "Manufactured Sand", value: "0 / 0 sqft", pct: 5 },
];

const credits = [
  { name: "yashiii", ref: "ORD_0014", amount: "Rs. 260,001", status: "credit", tone: "success" },
  { name: "Savinya", ref: "ORD_0006", amount: "Rs. 98,000", status: "outstanding", tone: "warning" },
  { name: "Nimal", ref: "ORD_0004", amount: "Rs. 20,000", status: "outstanding", tone: "warning" },
  { name: "Palitha", ref: "ORD_0015", amount: "Rs. 10,000", status: "outstanding", tone: "warning" },
];

const topCustomers = [
  { type: "Retail", name: "Kamal Perera", orders: 12, spent: "Rs. 1,500,000" },
  { type: "Corporate", name: "Lanka Freight Solutions", orders: 55, spent: "Rs. 38,000,000" },
];

const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const toneAccent: Record<string, string> = {
  success: "border-l-success",
  destructive: "border-l-destructive",
  warning: "border-l-warning",
  info: "border-l-info",
};

const Dashboard = () => {
  const nav = useNavigate();
  return (
    <PageShell title="Dashboard" description={today}>
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        {topStats.map((s) => {
          const Icon = s.icon;
          const iconCls =
            s.tone === "success"
              ? "text-success bg-success/10"
              : s.tone === "destructive"
              ? "text-destructive bg-destructive/10"
              : "text-muted-foreground bg-muted";
          return (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-start justify-between">
                <p className="text-sm text-muted-foreground font-medium">{s.label}</p>
                <div className={`h-8 w-8 rounded-lg grid place-items-center ${iconCls}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-display font-bold tracking-tight">{s.value}</p>
              {s.sub && <p className="mt-2 text-xs text-muted-foreground">{s.sub}</p>}
            </div>
          );
        })}
      </div>

      {/* Three column row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        {/* Stock Alerts */}
        <div className={`rounded-2xl border border-l-4 ${toneAccent.success} bg-card shadow-soft flex flex-col`}>
          <div className="p-5 pb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-success" />
            <h3 className="font-display font-bold">Stock Alerts</h3>
          </div>
          <div className="px-5 space-y-4 flex-1">
            {stockAlerts.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted-foreground">{s.value}</span>
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-destructive" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 pt-5">
            <Button variant="secondary" className="w-full" onClick={() => nav("/inventories")}>
              View Inventory
            </Button>
          </div>
        </div>

        {/* Credit & Outstanding */}
        <div className={`rounded-2xl border border-l-4 ${toneAccent.destructive} bg-card shadow-soft flex flex-col`}>
          <div className="p-5 pb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <h3 className="font-display font-bold">Credit & Outstanding</h3>
          </div>
          <div className="px-5 space-y-2 flex-1">
            {credits.map((c) => (
              <div key={c.ref} className="rounded-lg bg-muted/40 px-3 py-2 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground font-mono">{c.ref}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{c.amount}</p>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      c.tone === "success"
                        ? "bg-success/15 text-success"
                        : "bg-warning/15 text-warning"
                    }`}
                  >
                    {c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 pt-5">
            <Button variant="secondary" className="w-full" onClick={() => nav("/payments")}>
              Check Payments
            </Button>
          </div>
        </div>

        {/* Pre-Orders */}
        <div className={`rounded-2xl border border-l-4 ${toneAccent.warning} bg-card shadow-soft flex flex-col`}>
          <div className="p-5 pb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-warning" />
            <h3 className="font-display font-bold">Pre-Orders</h3>
          </div>
          <div className="px-5 flex-1 grid place-items-center text-sm text-muted-foreground">
            No upcoming pre-orders.
          </div>
          <div className="p-4 pt-5">
            <Button variant="secondary" className="w-full" onClick={() => nav("/orders")}>
              Check Pre-Orders
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Salary Outstanding */}
        <div className={`rounded-2xl border border-l-4 ${toneAccent.success} bg-card shadow-soft flex flex-col`}>
          <div className="p-5 pb-3 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-success" />
            <h3 className="font-display font-bold">Salary Outstanding</h3>
          </div>
          <div className="px-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border p-4 text-center">
              <p className="text-xs text-muted-foreground">Advances Paid</p>
              <p className="mt-1 text-lg font-display font-bold">Rs. 1,500</p>
            </div>
            <div className="rounded-xl border border-border p-4 text-center">
              <p className="text-xs text-muted-foreground">Outstanding Trip-Based Payable</p>
              <p className="mt-1 text-lg font-display font-bold">Rs. 0</p>
            </div>
          </div>
          <div className="px-5 mt-4">
            <div className="rounded-lg bg-muted/40 p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">23/04/2026</span>
                <span className="font-medium">AAAA</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Advance Payment</span>
                <span>Rs.1,500</span>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs">
                <span className="font-medium">Outstanding Payment</span>
                <span className="font-semibold">Rs.73,500</span>
              </div>
            </div>
          </div>
          <div className="p-4 pt-5 mt-auto">
            <Button variant="secondary" className="w-full" onClick={() => nav("/employees")}>
              Manage Salaries
            </Button>
          </div>
        </div>

        {/* Top Customers */}
        <div className={`rounded-2xl border border-l-4 ${toneAccent.warning} bg-card shadow-soft flex flex-col`}>
          <div className="p-5 pb-3 flex items-center gap-2">
            <Smile className="h-4 w-4 text-warning" />
            <h3 className="font-display font-bold">Top Customers</h3>
          </div>
          <div className="px-5 space-y-3 flex-1">
            {topCustomers.map((c) => (
              <div key={c.name} className="rounded-xl border border-border p-4">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">{c.type}</p>
                <p className="mt-1 font-display font-bold">{c.name}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Orders</span>
                    <span className="font-semibold">{c.orders}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Spent</span>
                    <span className="font-semibold">{c.spent}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 pt-5">
            <Button variant="secondary" className="w-full" onClick={() => nav("/customers")}>
              Check Customers
            </Button>
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default Dashboard;
