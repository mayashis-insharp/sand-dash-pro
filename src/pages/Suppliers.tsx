import { useState } from "react";
import { PageShell, TabBar, Pagination } from "@/components/dashboard/PageShell";
import { ViewToggle, type ViewMode } from "@/components/dashboard/ViewToggle";
import { DataCards } from "@/components/dashboard/DataCards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormShell, FormSection } from "@/components/dashboard/FormShell";
import { Plus, Search, Eye, X, Truck, Building2, ClipboardList, Download } from "lucide-react";
import { toast } from "sonner";
import { ExportReportDialog } from "@/components/dashboard/ExportReportDialog";

const tabs = ["Suppliers", "Drafts"] as const;

const suppliers = [
  { id: "SP_201", name: "Riverside Mining", address: "Avissawella", contact: "+94778520011", sand: "River Sand – Soft", price: 1800 },
  { id: "SP_202", name: "Coastal Sands Pvt", address: "Negombo", contact: "+94778520022", sand: "Sea Sand", price: 1500 },
  { id: "SP_203", name: "Lanka Quarry", address: "Kalutara", contact: "+94778520033", sand: "Quarry Dust", price: 1200 },
  { id: "SP_204", name: "M-Sand Industries", address: "Galle", contact: "+94778520044", sand: "M-Sand", price: 1700 },
];

const Suppliers = () => {
  const [tab, setTab] = useState<typeof tabs[number]>("Suppliers");
  const [view, setView] = useState<ViewMode>("table");
  const [addOpen, setAddOpen] = useState(false);
  const [viewSupplier, setViewSupplier] = useState<typeof suppliers[number] | null>(null);
  const [sandList, setSandList] = useState<{ id: string; type: string; price: string }[]>([{ id: "1", type: "", price: "" }]);
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <PageShell icon={Truck} breadcrumb={["Operations", "Suppliers"]} title="Suppliers" description="Manage your sand supplier network.">
      <TabBar
        tabs={tabs}
        active={tab}
        onChange={setTab}
        right={
          <>
            {tab === "Suppliers" && <Button variant="outline" size="sm" className="gap-2" onClick={() => setExportOpen(true)}><Download className="h-4 w-4" /> Export</Button>}
            <Button size="sm" className="gap-2 gradient-primary border-0 shadow-glow" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" /> Add Supplier
            </Button>
          </>
        }
      />

      {tab === "Suppliers" && (
        <>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search suppliers…" className="pl-9 h-10 bg-card" />
            </div>
            <ViewToggle value={view} onChange={setView} className="ml-auto" />
          </div>
          {view === "table" ? (
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
          ) : (
            <DataCards
              items={suppliers.map(s => ({
                id: s.id,
                title: s.name,
                subtitle: s.id,
                badge: <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">{s.sand}</span>,
                fields: [
                  { label: "Address", value: s.address, full: true },
                  { label: "Contact", value: s.contact, mono: true },
                  { label: "Unit Price", value: s.price.toLocaleString(), mono: true },
                ],
                actions: (
                  <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => setViewSupplier(s)}>
                    <Eye className="h-3.5 w-3.5" /> View
                  </Button>
                ),
              }))}
            />
          )}
          <Pagination from={1} to={4} total={24} />
        </>
      )}

      {tab === "Drafts" && (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center text-sm text-muted-foreground">No supplier drafts yet.</div>
      )}

      {/* Add Supplier */}
      <FormShell
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Supplier"
        subtitle="Register a new sand supplier and their materials."
        icon={<Building2 className="h-5 w-5" />}
        size="lg"
        footer={
          <div className="px-5 md:px-8 py-3 flex items-center justify-between gap-3">
            <Button variant="ghost" className="text-muted-foreground" onClick={() => setAddOpen(false)}>Cancel</Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5 hover:text-primary">Save as Draft</Button>
              <Button className="gap-2 gradient-primary border-0 shadow-glow px-6" onClick={() => { toast.success("Supplier added"); setAddOpen(false); }}>
                <Plus className="h-4 w-4" /> Add Supplier
              </Button>
            </div>
          </div>
        }
      >
        <FormSection icon={<Building2 className="h-4 w-4" />} title="Supplier Info" description="Basic identification & contact.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Supplier Name</Label><Input className="mt-1.5 h-11 bg-background" /></div>
            <div><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Contact</Label><Input className="mt-1.5 h-11 bg-background" /></div>
            <div className="md:col-span-2"><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Address</Label><Input className="mt-1.5 h-11 bg-background" /></div>
          </div>
        </FormSection>

        <FormSection icon={<ClipboardList className="h-4 w-4" />} title="Sand Types & Prices" description="Add one or more sand materials this supplier offers.">
          <div className="space-y-2">
            {sandList.map((s) => (
              <div key={s.id} className="flex gap-2">
                <Input placeholder="Sand type" className="flex-1 h-11 bg-background" />
                <Input placeholder="Unit price" className="w-36 h-11 bg-background" />
                <Button variant="ghost" size="icon" className="h-11 w-11" onClick={() => setSandList(l => l.filter(x => x.id !== s.id))}><X className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="gap-1 mt-2" onClick={() => setSandList(l => [...l, { id: Date.now() + "", type: "", price: "" }])}>
              <Plus className="h-3.5 w-3.5" /> Add sand type
            </Button>
          </div>
        </FormSection>
      </FormShell>

      {/* View Supplier */}
      <FormShell
        open={!!viewSupplier}
        onOpenChange={(o) => !o && setViewSupplier(null)}
        title="Supplier Details"
        subtitle={viewSupplier?.id}
        icon={<Building2 className="h-5 w-5" />}
        size="lg"
        footer={
          <div className="px-5 md:px-8 py-3 flex items-center justify-end gap-2">
            <Button variant="outline" onClick={() => setViewSupplier(null)}>Close</Button>
          </div>
        }
      >
        {viewSupplier && (
          <>
            <FormSection icon={<Building2 className="h-4 w-4" />} title="Supplier Info">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground text-xs">Name</p><p className="font-medium">{viewSupplier.name}</p></div>
                <div><p className="text-muted-foreground text-xs">ID</p><p className="font-mono">{viewSupplier.id}</p></div>
                <div><p className="text-muted-foreground text-xs">Address</p><p>{viewSupplier.address}</p></div>
                <div><p className="text-muted-foreground text-xs">Contact</p><p className="font-mono">{viewSupplier.contact}</p></div>
              </div>
            </FormSection>

            <FormSection icon={<Truck className="h-4 w-4" />} title="Vehicles">
              <div className="flex flex-wrap gap-2">
                {["WP-7891", "MD-0214", "GH-5423"].map(v => (
                  <span key={v} className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-mono">
                    <Truck className="h-3 w-3" /> {v}
                  </span>
                ))}
              </div>
            </FormSection>

            <FormSection icon={<ClipboardList className="h-4 w-4" />} title="Recent Transactions">
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
            </FormSection>
          </>
        )}
      </FormShell>

    </PageShell>
  );
};

export default Suppliers;
