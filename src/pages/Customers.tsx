import { PageShell } from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Phone, Truck, Award, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const customers = [
  { id: "C_01", name: "Gamage", badge: "Top Customer", phone: "+94778542369", vehicles: ["GH-5423", "WP-7891"], orders: 42, total: 6_540_000, outstanding: 100000 },
  { id: "C_02", name: "Dias", badge: "Top Customer", phone: "+94778542300", vehicles: ["MD-0214"], orders: 38, total: 5_120_000, outstanding: 0 },
  { id: "C_03", name: "Perera Constructions", badge: "Rising Customer", phone: "+94771234567", vehicles: ["WP-7891", "KP-9920"], orders: 18, total: 3_440_000, outstanding: 125000 },
  { id: "C_04", name: "Fernando", badge: "Rising Customer", phone: "+94776543210", vehicles: ["CAB-3344"], orders: 9, total: 720_000, outstanding: 0 },
  { id: "C_05", name: "Lanka Build (Pvt) Ltd", badge: "Top Customer", phone: "+94114567890", vehicles: ["KP-9920", "WP-1122", "MD-3344"], orders: 56, total: 9_980_000, outstanding: 196000 },
  { id: "C_06", name: "Silva Constructions", badge: "Rising Customer", phone: "+94770009988", vehicles: ["CAR-4422"], orders: 12, total: 2_100_000, outstanding: 45000 },
];

const Customers = () => {
  return (
    <PageShell
      breadcrumb={["People", "Customers"]}
      title="Customers"
      description="A modern view of every customer relationship."
      actions={<Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Export</Button>}
    >
      <div className="flex flex-col lg:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search customers…" className="pl-9 h-10 bg-card" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select><SelectTrigger className="w-[160px] h-10 bg-card"><SelectValue placeholder="Customer Type" /></SelectTrigger><SelectContent><SelectItem value="t">Top Customer</SelectItem><SelectItem value="r">Rising Customer</SelectItem></SelectContent></Select>
          <Select><SelectTrigger className="w-[160px] h-10 bg-card"><SelectValue placeholder="Outstanding" /></SelectTrigger><SelectContent><SelectItem value="any">Any</SelectItem><SelectItem value="overdue">With Overdue</SelectItem></SelectContent></Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {customers.map(c => {
          const top = c.badge === "Top Customer";
          return (
            <div key={c.id} className="group relative rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-elevated transition-smooth overflow-hidden">
              <div className={cn("absolute -right-8 -top-8 h-28 w-28 rounded-full transition-smooth",
                top ? "bg-primary/[0.08] group-hover:bg-primary/[0.14]" : "bg-info/[0.06] group-hover:bg-info/[0.10]")} />
              <div className="relative">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display font-bold text-foreground truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground font-mono mt-0.5">{c.id}</p>
                  </div>
                  <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium whitespace-nowrap",
                    top ? "bg-primary/10 text-primary border-primary/20" : "bg-info/10 text-info border-info/20")}>
                    {top ? <Award className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}{c.badge}
                  </span>
                </div>

                <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground"><Phone className="h-3 w-3" /> {c.phone}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.vehicles.map(v => (
                    <span key={v} className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2.5 py-0.5 text-[11px] font-mono">
                      <Truck className="h-3 w-3 text-muted-foreground" /> {v}
                    </span>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-muted/30 p-3">
                  <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Orders</p><p className="font-display font-bold">{c.orders}</p></div>
                  <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Spent</p><p className="font-display font-bold">{(c.total / 1000000).toFixed(1)}M</p></div>
                  <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Outstanding</p><p className={cn("font-display font-bold", c.outstanding > 0 ? "text-destructive" : "text-success")}>{c.outstanding > 0 ? (c.outstanding / 1000).toFixed(0) + "K" : "0"}</p></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PageShell>
  );
};

export default Customers;
