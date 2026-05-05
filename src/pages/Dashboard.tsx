import { PageShell } from "@/components/dashboard/PageShell";
import { ShoppingCart, Wallet, Boxes, Clock, AlertTriangle } from "lucide-react";

const stats = [
  { label: "Total Orders", value: "1,284", icon: ShoppingCart },
  { label: "Today's Revenue", value: "LKR 384K", icon: Wallet },
  { label: "Stock Available", value: "4,250 sqft", icon: Boxes },
  { label: "Pending Pre-Orders", value: "18", icon: Clock },
];

const alerts = [
  { title: "Sea Sand below threshold", body: "420 sqft remaining (alert at 500)", tone: "warning" },
  { title: "M-Sand critically low", body: "280 sqft remaining (alert at 300)", tone: "destructive" },
  { title: "5 credit payments overdue", body: "LKR 642,000 outstanding", tone: "destructive" },
];

const Dashboard = () => {
  return (
    <PageShell title="Dashboard" description="Welcome back to Sand Supply.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary grid place-items-center">
                <s.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-display font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <h3 className="font-display font-bold">Alerts</h3>
        </div>
        <div className="space-y-3">
          {alerts.map((a, i) => (
            <div
              key={i}
              className={`rounded-xl border p-3 ${
                a.tone === "destructive" ? "border-destructive/20 bg-destructive/5" : "border-warning/20 bg-warning/5"
              }`}
            >
              <p className="text-sm font-semibold">{a.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{a.body}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
};

export default Dashboard;
