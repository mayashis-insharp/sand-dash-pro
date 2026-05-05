import { PageShell } from "@/components/dashboard/PageShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Wallet, AlertTriangle, Boxes, Clock, Receipt, Download, Plus, TrendingUp, Bell } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ordersByMonth = [
  { m: "Sep", o: 142 }, { m: "Oct", o: 168 }, { m: "Nov", o: 201 },
  { m: "Dec", o: 188 }, { m: "Jan", o: 224 }, { m: "Feb", o: 262 },
];

const revenueByMethod = [
  { name: "Cash", value: 4200000, color: "hsl(145 55% 42%)" },
  { name: "Bank", value: 3100000, color: "hsl(210 80% 55%)" },
  { name: "Cheque", value: 1450000, color: "hsl(38 92% 52%)" },
  { name: "Credit", value: 2200000, color: "hsl(24 70% 52%)" },
];

const stockLevels = [
  { type: "River Soft", qty: 1200, alert: 500 },
  { type: "River Coarse", qty: 850, alert: 600 },
  { type: "Sea Sand", qty: 420, alert: 500 },
  { type: "Quarry Dust", qty: 1500, alert: 400 },
  { type: "M-Sand", qty: 280, alert: 300 },
];

const alerts = [
  { type: "stock", title: "Sea Sand below threshold", body: "420 sqft remaining (alert at 500)", color: "warning" },
  { type: "stock", title: "M-Sand critically low", body: "280 sqft remaining (alert at 300)", color: "destructive" },
  { type: "preorder", title: "3 pre-orders due in next 24h", body: "Gamage, Dias, Lanka Build", color: "info" },
  { type: "credit", title: "5 credit payments overdue", body: "LKR 642,000 outstanding", color: "destructive" },
];

const Dashboard = () => {
  return (
    <PageShell
      breadcrumb={["Operations", "Dashboard"]}
      title="Dashboard"
      description="Live overview of your sand supply business."
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
          <Button size="sm" className="gap-2 gradient-primary border-0 shadow-glow"><Plus className="h-4 w-4" /> New Order</Button>
        </>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <StatCard label="Total Orders" value="1,284" delta="+12.4%" trend="up" icon={ShoppingCart} accent="primary" />
        <StatCard label="Today's Revenue" value="LKR 384K" delta="+8.1%" trend="up" icon={Wallet} accent="success" />
        <StatCard label="Outstanding Credit" value="LKR 1.2M" delta="-3.2%" trend="down" icon={AlertTriangle} accent="warning" />
        <StatCard label="Stock Available" value="4,250 sqft" delta="-5.5%" trend="down" icon={Boxes} accent="info" />
        <StatCard label="Pending Pre-Orders" value="18" delta="+4" trend="up" icon={Clock} accent="warning" />
        <StatCard label="Monthly Expenses" value="LKR 612K" delta="+2.0%" trend="up" icon={Receipt} accent="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold">Orders by Month</h3>
              <p className="text-xs text-muted-foreground">Last 6 months performance</p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs text-success font-medium"><TrendingUp className="h-3 w-3" /> 17% vs prev</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ordersByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Line type="monotone" dataKey="o" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-display font-bold mb-1">Revenue by Method</h3>
          <p className="text-xs text-muted-foreground mb-4">February 2026</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenueByMethod} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {revenueByMethod.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-display font-bold mb-1">Sand Stock Levels</h3>
          <p className="text-xs text-muted-foreground mb-4">Current quantity vs alert threshold</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockLevels}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="type" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Bar dataKey="qty" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="alert" fill="hsl(var(--muted))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold">Alerts</h3>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {alerts.map((a, i) => (
              <div key={i} className={`rounded-xl border p-3 ${
                a.color === "destructive" ? "border-destructive/20 bg-destructive/5" :
                a.color === "warning" ? "border-warning/20 bg-warning/5" :
                "border-info/20 bg-info/5"
              }`}>
                <p className="text-sm font-semibold text-foreground">{a.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default Dashboard;
