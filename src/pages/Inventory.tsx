import { useState } from "react";
import { PageShell, TabBar, Pagination } from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, Upload, AlertTriangle, Edit, Eye, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const tabs = ["Sand Stock", "Set Alert", "Drafts"] as const;

const stocks = [
  { date: "12/02/2026 09:30", id: "ST_4421", supplier: "Riverside Mining", sand: "River Sand – Soft", qty: "200 sqft", status: "Checked", finalPrice: 1800, sellPrice: 2400, vehicle: "WP-7891" },
  { date: "11/02/2026 14:15", id: "ST_4420", supplier: "Coastal Sands Pvt", sand: "Sea Sand", qty: "150 sqft", status: "In Progress", finalPrice: 1500, sellPrice: 2000, vehicle: "MD-0214" },
  { date: "10/02/2026 10:00", id: "ST_4419", supplier: "Lanka Quarry", sand: "Quarry Dust", qty: "300 sqft", status: "Checked", finalPrice: 1200, sellPrice: 1800, vehicle: "GH-5423" },
];

const alerts = [
  { sand: "River Sand – Soft", unit: "sqft", level: 500, current: 1200 },
  { sand: "Sea Sand", unit: "sqft", level: 500, current: 420 },
  { sand: "M-Sand", unit: "sqft", level: 300, current: 280 },
];

const Inventory = () => {
  const [tab, setTab] = useState<typeof tabs[number]>("Sand Stock");
  const [addStock, setAddStock] = useState(false);
  const [setAlertOpen, setSetAlertOpen] = useState(false);

  return (
    <PageShell breadcrumb={["Operations", "Inventory"]} title="Inventory" description="Track sand stock levels, suppliers, and quality.">
      <TabBar
        tabs={tabs}
        active={tab}
        onChange={setTab}
        right={
          <>
            <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
            {tab === "Sand Stock" && <Button size="sm" className="gap-2 gradient-primary border-0 shadow-glow" onClick={() => setAddStock(true)}><Plus className="h-4 w-4" /> Add Stock</Button>}
            {tab === "Set Alert" && <Button size="sm" className="gap-2 gradient-primary border-0 shadow-glow" onClick={() => setSetAlertOpen(true)}><Plus className="h-4 w-4" /> Set Alert</Button>}
          </>
        }
      />

      {tab === "Sand Stock" && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search stock…" className="pl-9 h-10 bg-card" />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    {["Date & Time", "Stock ID", "Supplier", "Sand Type", "Qty", "Quality", "Final Price", "Selling Price", "Vehicle", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stocks.map(s => (
                    <tr key={s.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30 transition-smooth">
                      <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">{s.date}</td>
                      <td className="px-4 py-4 font-mono text-xs font-semibold">{s.id}</td>
                      <td className="px-4 py-4">{s.supplier}</td>
                      <td className="px-4 py-4">{s.sand}</td>
                      <td className="px-4 py-4 font-medium">{s.qty}</td>
                      <td className="px-4 py-4">
                        <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium",
                          s.status === "Checked" ? "bg-success/10 text-success border-success/20" : "bg-warning/15 text-warning border-warning/30")}>
                          {s.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-mono">{s.finalPrice.toLocaleString()}</td>
                      <td className="px-4 py-4 font-mono">{s.sellPrice.toLocaleString()}</td>
                      <td className="px-4 py-4 font-mono text-xs">{s.vehicle}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1">
                          <button className="rounded-md px-2 py-1 text-xs hover:bg-muted"><Eye className="h-3.5 w-3.5" /></button>
                          <button className="rounded-md px-2 py-1 text-xs hover:bg-muted"><Edit className="h-3.5 w-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination from={1} to={3} total={186} />
        </>
      )}

      {tab === "Set Alert" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {alerts.map((a, i) => {
            const low = a.current < a.level;
            return (
              <div key={i} className={cn("rounded-2xl border bg-card p-5 shadow-soft", low ? "border-destructive/30" : "border-border")}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{a.sand}</p>
                    <p className="mt-1 text-xl font-display font-bold">{a.current} {a.unit}</p>
                  </div>
                  <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium",
                    low ? "bg-destructive/10 text-destructive" : "bg-success/10 text-success")}>
                    {low && <AlertTriangle className="h-3 w-3" />}
                    {low ? "Below alert" : "Healthy"}
                  </span>
                </div>
                <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                  <div className={cn("h-full", low ? "bg-destructive" : "gradient-primary")} style={{ width: `${Math.min(100, (a.current / (a.level * 2)) * 100)}%` }} />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Alert level: {a.level} {a.unit}</p>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1"><Edit className="h-3.5 w-3.5 mr-1" /> Edit</Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "Drafts" && (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center text-sm text-muted-foreground">No stock drafts yet.</div>
      )}

      <Dialog open={addStock} onOpenChange={setAddStock}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add Stock</DialogTitle></DialogHeader>
          <div className="space-y-5">
            <section>
              <h4 className="text-sm font-display font-bold mb-3">Stock Details</h4>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Supplier</Label><Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select supplier" /></SelectTrigger><SelectContent><SelectItem value="r">Riverside Mining</SelectItem></SelectContent></Select></div>
                <div><Label>Sand Type</Label><Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select sand type" /></SelectTrigger><SelectContent><SelectItem value="rs">River Sand – Soft</SelectItem></SelectContent></Select></div>
                <div><Label>Quantity</Label><Input className="mt-1.5" placeholder="200" /></div>
                <div><Label>Final Unit Price</Label><Input className="mt-1.5" placeholder="1800" /></div>
              </div>
            </section>
            <section>
              <h4 className="text-sm font-display font-bold mb-3">Delivery Details</h4>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Vehicle No</Label><Input className="mt-1.5" /></div>
                <div><Label>Driver Name</Label><Input className="mt-1.5" /></div>
              </div>
              <div className="mt-3">
                <Label>Supplier Invoice</Label>
                <button className="mt-1.5 w-full rounded-xl border-2 border-dashed border-border p-6 text-center hover:bg-muted/30 transition-smooth">
                  <Upload className="h-6 w-6 mx-auto text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">Click or drop invoice here</p>
                </button>
              </div>
            </section>
            <section>
              <h4 className="text-sm font-display font-bold mb-3">Quality Status</h4>
              <Select><SelectTrigger><SelectValue placeholder="In Progress" /></SelectTrigger><SelectContent><SelectItem value="ip">In Progress</SelectItem><SelectItem value="ck">Checked</SelectItem></SelectContent></Select>
            </section>
            <section>
              <h4 className="text-sm font-display font-bold mb-3">Comments</h4>
              <Textarea placeholder="Notes about this stock entry..." />
            </section>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddStock(false)}>Cancel</Button>
            <Button className="gradient-primary border-0" onClick={() => { toast.success("Stock added"); setAddStock(false); }}>Add Stock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={setAlertOpen} onOpenChange={setSetAlertOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Set Alert Level</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Sand Type</Label><Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="rs">River Sand – Soft</SelectItem></SelectContent></Select></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Quantity Level</Label><Input className="mt-1.5" placeholder="500" /></div>
              <div><Label>Unit</Label><Select defaultValue="sqft"><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="sqft">sqft</SelectItem><SelectItem value="cube">cube</SelectItem></SelectContent></Select></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSetAlertOpen(false)}>Cancel</Button>
            <Button className="gradient-primary border-0" onClick={() => { toast.success("Alert set"); setSetAlertOpen(false); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
};

export default Inventory;
