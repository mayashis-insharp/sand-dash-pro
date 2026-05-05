import { useState } from "react";
import { PageShell, TabBar, Pagination } from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, Eye, X, Truck } from "lucide-react";
import { toast } from "sonner";

const tabs = ["Suppliers", "Drafts"] as const;

const suppliers = [
  { id: "SP_201", name: "Riverside Mining", address: "Avissawella", contact: "+94778520011", sand: "River Sand – Soft", price: 1800 },
  { id: "SP_202", name: "Coastal Sands Pvt", address: "Negombo", contact: "+94778520022", sand: "Sea Sand", price: 1500 },
  { id: "SP_203", name: "Lanka Quarry", address: "Kalutara", contact: "+94778520033", sand: "Quarry Dust", price: 1200 },
  { id: "SP_204", name: "M-Sand Industries", address: "Galle", contact: "+94778520044", sand: "M-Sand", price: 1700 },
];

const Suppliers = () => {
  const [tab, setTab] = useState<typeof tabs[number]>("Suppliers");
  const [addOpen, setAddOpen] = useState(false);
  const [viewSupplier, setViewSupplier] = useState<typeof suppliers[number] | null>(null);
  const [sandList, setSandList] = useState<{ id: string; type: string; price: string }[]>([{ id: "1", type: "", price: "" }]);

  return (
    <PageShell breadcrumb={["Operations", "Suppliers"]} title="Suppliers" description="Manage your sand supplier network.">
      <TabBar
        tabs={tabs}
        active={tab}
        onChange={setTab}
        right={
          <Button size="sm" className="gap-2 gradient-primary border-0 shadow-glow" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" /> Add Supplier
          </Button>
        }
      />

      {tab === "Suppliers" && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search suppliers…" className="pl-9 h-10 bg-card" />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    {["Supplier ID", "Name", "Address", "Contact", "Sand Type", "Unit Price", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {suppliers.map(s => (
                    <tr key={s.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30 transition-smooth">
                      <td className="px-4 py-4 font-mono text-xs font-semibold">{s.id}</td>
                      <td className="px-4 py-4 font-medium">{s.name}</td>
                      <td className="px-4 py-4 text-muted-foreground">{s.address}</td>
                      <td className="px-4 py-4 font-mono text-xs">{s.contact}</td>
                      <td className="px-4 py-4">{s.sand}</td>
                      <td className="px-4 py-4 font-mono">{s.price.toLocaleString()}</td>
                      <td className="px-4 py-4">
                        <Button size="sm" variant="ghost" className="gap-1" onClick={() => setViewSupplier(s)}>
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination from={1} to={4} total={24} />
        </>
      )}

      {tab === "Drafts" && (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center text-sm text-muted-foreground">No supplier drafts yet.</div>
      )}

      {/* Add */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Add Supplier</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Supplier Name</Label><Input className="mt-1.5" /></div>
            <div><Label>Address</Label><Input className="mt-1.5" /></div>
            <div><Label>Contact</Label><Input className="mt-1.5" /></div>
            <div>
              <Label>Sand Types & Prices</Label>
              <div className="mt-1.5 space-y-2">
                {sandList.map((s, i) => (
                  <div key={s.id} className="flex gap-2">
                    <Input placeholder="Sand type" className="flex-1" />
                    <Input placeholder="Unit price" className="w-32" />
                    <Button variant="ghost" size="icon" onClick={() => setSandList(l => l.filter(x => x.id !== s.id))}><X className="h-4 w-4" /></Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="gap-1" onClick={() => setSandList(l => [...l, { id: Date.now() + "", type: "", price: "" }])}>
                  <Plus className="h-3.5 w-3.5" /> Add sand type
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button className="gradient-primary border-0" onClick={() => { toast.success("Supplier added"); setAddOpen(false); }}>Add Supplier</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View */}
      <Dialog open={!!viewSupplier} onOpenChange={(o) => !o && setViewSupplier(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Supplier Details</DialogTitle></DialogHeader>
          {viewSupplier && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-muted-foreground text-xs">Name</p><p className="font-medium">{viewSupplier.name}</p></div>
                <div><p className="text-muted-foreground text-xs">ID</p><p className="font-mono">{viewSupplier.id}</p></div>
                <div><p className="text-muted-foreground text-xs">Address</p><p>{viewSupplier.address}</p></div>
                <div><p className="text-muted-foreground text-xs">Contact</p><p className="font-mono">{viewSupplier.contact}</p></div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Vehicles</p>
                <div className="flex flex-wrap gap-2">
                  {["WP-7891", "MD-0214", "GH-5423"].map(v => (
                    <span key={v} className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-mono">
                      <Truck className="h-3 w-3" /> {v}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-display font-bold mb-2">Recent Transactions</p>
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/50"><tr>{["Date", "Stock ID", "Qty", "Amount"].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground">{h}</th>)}</tr></thead>
                    <tbody>
                      {[["12/02/2026", "ST_4421", "200 sqft", "360,000"], ["05/02/2026", "ST_4410", "150 sqft", "270,000"]].map((r, i) => (
                        <tr key={i} className="border-t border-border"><td className="px-3 py-2">{r[0]}</td><td className="px-3 py-2 font-mono">{r[1]}</td><td className="px-3 py-2">{r[2]}</td><td className="px-3 py-2 font-medium">{r[3]}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
};

export default Suppliers;
