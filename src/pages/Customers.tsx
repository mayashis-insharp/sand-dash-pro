import { useState } from "react";
import { PageShell } from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Phone, Truck, Award, Sparkles, Building2, User, Crown, TrendingUp, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ViewToggle, ViewMode } from "@/components/dashboard/ViewToggle";
import { ExportReportDialog } from "@/components/dashboard/ExportReportDialog";

type Badge =
  | "Top Retail"
  | "Top Corporate"
  | "Rising Retail"
  | "Rising Corporate"
  | "Retail"
  | "Corporate";

const customers: {
  id: string;
  name: string;
  badge: Badge;
  phone: string;
  vehicles: string[];
  orders: number;
  total: number;
  outstanding: number;
}[] = [
  { id: "C_01", name: "Gamage", badge: "Top Retail", phone: "+94778542369", vehicles: ["GH-5423", "WP-7891"], orders: 42, total: 6_540_000, outstanding: 100000 },
  { id: "C_02", name: "Dias", badge: "Retail", phone: "+94778542300", vehicles: ["MD-0214"], orders: 8, total: 1_120_000, outstanding: 0 },
  { id: "C_03", name: "Perera Constructions", badge: "Rising Corporate", phone: "+94771234567", vehicles: ["WP-7891", "KP-9920"], orders: 18, total: 3_440_000, outstanding: 125000 },
  { id: "C_04", name: "Fernando", badge: "Rising Retail", phone: "+94776543210", vehicles: ["CAB-3344"], orders: 9, total: 720_000, outstanding: 0 },
  { id: "C_05", name: "Lanka Build (Pvt) Ltd", badge: "Top Corporate", phone: "+94114567890", vehicles: ["KP-9920", "WP-1122", "MD-3344"], orders: 56, total: 9_980_000, outstanding: 196000 },
  { id: "C_06", name: "Silva Constructions", badge: "Corporate", phone: "+94770009988", vehicles: ["CAR-4422"], orders: 12, total: 2_100_000, outstanding: 45000 },
];

const badgeStyles: Record<Badge, { cls: string; ring: string; Icon: any }> = {
  "Top Retail": {
    cls: "bg-primary/10 text-primary border-primary/20",
    ring: "bg-primary/[0.08] group-hover:bg-primary/[0.14]",
    Icon: Crown,
  },
  "Top Corporate": {
    cls: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
    ring: "bg-amber-500/[0.08] group-hover:bg-amber-500/[0.14]",
    Icon: Award,
  },
  "Rising Retail": {
    cls: "bg-info/10 text-info border-info/20",
    ring: "bg-info/[0.06] group-hover:bg-info/[0.10]",
    Icon: Sparkles,
  },
  "Rising Corporate": {
    cls: "bg-success/10 text-success border-success/20",
    ring: "bg-success/[0.06] group-hover:bg-success/[0.10]",
    Icon: TrendingUp,
  },
  Retail: {
    cls: "bg-muted text-muted-foreground border-border",
    ring: "bg-muted/40 group-hover:bg-muted/60",
    Icon: User,
  },
  Corporate: {
    cls: "bg-secondary text-secondary-foreground border-border",
    ring: "bg-secondary/60 group-hover:bg-secondary/80",
    Icon: Building2,
  },
};

const Customers = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <PageShell
      icon={UserCircle2}
      breadcrumb={["People", "Customers"]}
      title="Customers"
      description="A modern view of every customer relationship."
      actions={
        <Button variant="outline" size="sm" className="gap-2" onClick={() => setExportOpen(true)}><Download className="h-4 w-4" /> Export</Button>
      }
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search customers…" className="pl-9 h-10 bg-card" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select>
            <SelectTrigger className="w-[180px] h-10 bg-card"><SelectValue placeholder="Customer Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
              <SelectItem value="top-retail">Top Retail</SelectItem>
              <SelectItem value="top-corporate">Top Corporate</SelectItem>
              <SelectItem value="rising-retail">Rising Retail</SelectItem>
              <SelectItem value="rising-corporate">Rising Corporate</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[160px] h-10 bg-card"><SelectValue placeholder="Outstanding" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any</SelectItem>
              <SelectItem value="overdue">With Overdue</SelectItem>
            </SelectContent>
          </Select>
          <ViewToggle value={viewMode} onChange={setViewMode} />
        </div>
      </div>

      {viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {customers.map(c => {
            const style = badgeStyles[c.badge];
            const Icon = style.Icon;
            return (
              <div key={c.id} className="group relative rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-elevated transition-smooth overflow-hidden">
                <div className={cn("absolute -right-8 -top-8 h-28 w-28 rounded-full transition-smooth", style.ring)} />
                <div className="relative">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display font-bold text-foreground truncate">{c.name}</p>
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">{c.id}</p>
                    </div>
                    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium whitespace-nowrap", style.cls)}>
                      <Icon className="h-3 w-3" />{c.badge}
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
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider">
                <tr>
                  <th className="text-left px-4 py-3 font-medium">ID</th>
                  <th className="text-left px-4 py-3 font-medium">Name</th>
                  <th className="text-left px-4 py-3 font-medium">Badge</th>
                  <th className="text-left px-4 py-3 font-medium">Phone</th>
                  <th className="text-left px-4 py-3 font-medium">Vehicles</th>
                  <th className="text-right px-4 py-3 font-medium">Orders</th>
                  <th className="text-right px-4 py-3 font-medium">Spent</th>
                  <th className="text-right px-4 py-3 font-medium">Outstanding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {customers.map(c => {
                  const style = badgeStyles[c.badge];
                  const Icon = style.Icon;
                  return (
                    <tr key={c.id} className="hover:bg-muted/30 transition-smooth">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{c.id}</td>
                      <td className="px-4 py-3 font-medium">{c.name}</td>
                      <td className="px-4 py-3">
                        <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium whitespace-nowrap", style.cls)}>
                          <Icon className="h-3 w-3" />{c.badge}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{c.phone}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {c.vehicles.map(v => (
                            <span key={v} className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-mono">
                              <Truck className="h-2.5 w-2.5 text-muted-foreground" /> {v}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-display font-bold">{c.orders}</td>
                      <td className="px-4 py-3 text-right font-display font-bold">{(c.total / 1000000).toFixed(1)}M</td>
                      <td className={cn("px-4 py-3 text-right font-display font-bold", c.outstanding > 0 ? "text-destructive" : "text-success")}>
                        {c.outstanding > 0 ? (c.outstanding / 1000).toFixed(0) + "K" : "0"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageShell>
  );
};

export default Customers;
