import { useState } from "react";
import { PageShell, TabBar, Pagination } from "@/components/dashboard/PageShell";
import { ViewToggle, type ViewMode } from "@/components/dashboard/ViewToggle";
import { DataCards } from "@/components/dashboard/DataCards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { FormShell, FormSection } from "@/components/dashboard/FormShell";
import { Plus, Search, Eye, Edit, Download, Upload, Trash2, Receipt as ReceiptIcon, FileText, Calendar as CalendarIcon, Paperclip, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { ExportReportDialog } from "@/components/dashboard/ExportReportDialog";

const tabs = ["Bill Payments", "Transport", "Petty Cash", "Drafts"] as const;

const bills = [
  { date: "12/02/2026", id: "EX_3301", type: "Electricity", amount: 28500, ref: "INV-CEB-441", paid: 28500, comments: "Feb bill" },
  { date: "10/02/2026", id: "EX_3300", type: "Fuel", amount: 142000, ref: "FL-2026-22", paid: 100000, comments: "Partial" },
  { date: "05/02/2026", id: "EX_3299", type: "Maintenance", amount: 65000, ref: "MNT-018", paid: 65000, comments: "Vehicle service" },
];

const transport = [
  { date: "12/02/2026", ref: "OD_12457", vehicle: "GH-5423 / Sunil", amount: 12000, comments: "Kaduwela trip" },
  { date: "10/02/2026", ref: "ST_4420", vehicle: "MD-0214 / Kamal", amount: 18500, comments: "Coastal pickup" },
];

const petty = [
  { date: "12/02/2026", id: "PC_044", desc: "Office supplies", amount: 4200, comments: "Stationery" },
  { date: "10/02/2026", id: "PC_043", desc: "Tea & snacks", amount: 1800, comments: "" },
];

const drafts = [
  { no: "DR_E12", type: "Bill Payment", created: "08/02/2026 10:14", edited: "10/02/2026 12:02" },
];

type ExpType = "bill" | "transport" | "petty" | "other";

const Expenses = () => {
  const [tab, setTab] = useState<typeof tabs[number]>("Bill Payments");
  const [addOpen, setAddOpen] = useState(false);
  const [view, setView] = useState<any>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [edit, setEdit] = useState<any>(null);
  const [del, setDel] = useState<any>(null);
  const [expType, setExpType] = useState<ExpType>("bill");
  const [exportOpen, setExportOpen] = useState(false);

  const exportConfig = (() => {
    if (tab === "Transport") return {
      name: "Expenses - Transport",
      cols: ["Date", "Order/Stock", "Vehicle/Driver", "Cost", "Comments"],
    };
    if (tab === "Petty Cash") return {
      name: "Expenses - Petty Cash",
      cols: ["Date", "Expense ID", "Description", "Cost"],
    };
    return {
      name: "Expenses - Bill Payments",
      cols: ["Date", "Expense ID", "Bill Type", "Bill Amount", "Reference", "Paid Amount", "Comments"],
    };
  })();

  const renderTable = () => {
    if (tab === "Bill Payments") {
      return (
        <table className="w-full text-sm">
          <thead><tr className="bg-muted/50 border-b border-border">{["Date", "Expense ID", "Bill Type", "Bill Amount", "Reference", "Paid Amount", "Comments", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold whitespace-nowrap">{h}</th>)}</tr></thead>
          <tbody>
            {bills.map(b => (
              <tr key={b.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                <td className="px-4 py-4 text-muted-foreground">{b.date}</td>
                <td className="px-4 py-4 font-mono text-xs font-semibold">{b.id}</td>
                <td className="px-4 py-4">{b.type}</td>
                <td className="px-4 py-4 font-mono">{b.amount.toLocaleString()}</td>
                <td className="px-4 py-4 font-mono text-xs">{b.ref}</td>
                <td className={`px-4 py-4 font-mono ${b.paid < b.amount ? "text-destructive" : "text-success"}`}>{b.paid.toLocaleString()}</td>
                <td className="px-4 py-4 text-muted-foreground text-xs">{b.comments || "—"}</td>
                <td className="px-4 py-4"><div className="flex gap-1"><button onClick={() => setView(b)} className="rounded-md px-2 py-1 hover:bg-muted"><Eye className="h-3.5 w-3.5" /></button><button onClick={() => setEdit(b)} className="rounded-md px-2 py-1 hover:bg-muted"><Edit className="h-3.5 w-3.5" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    if (tab === "Transport") {
      return (
        <table className="w-full text-sm">
          <thead><tr className="bg-muted/50 border-b border-border">{["Date", "Order/Stock", "Vehicle/Driver", "Cost", "Comments", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>)}</tr></thead>
          <tbody>
            {transport.map((t, i) => (
              <tr key={i} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                <td className="px-4 py-4 text-muted-foreground">{t.date}</td>
                <td className="px-4 py-4 font-mono text-xs font-semibold">{t.ref}</td>
                <td className="px-4 py-4">{t.vehicle}</td>
                <td className="px-4 py-4 font-mono">{t.amount.toLocaleString()}</td>
                <td className="px-4 py-4 text-muted-foreground text-xs">{t.comments}</td>
                <td className="px-4 py-4"><div className="flex gap-1"><button onClick={() => setView(t)} className="rounded-md px-2 py-1 hover:bg-muted"><Eye className="h-3.5 w-3.5" /></button><button onClick={() => setEdit(t)} className="rounded-md px-2 py-1 hover:bg-muted"><Edit className="h-3.5 w-3.5" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    if (tab === "Petty Cash") {
      return (
        <table className="w-full text-sm">
          <thead><tr className="bg-muted/50 border-b border-border">{["Date", "Expense ID", "Description", "Cost", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>)}</tr></thead>
          <tbody>
            {petty.map(p => (
              <tr key={p.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                <td className="px-4 py-4 text-muted-foreground">{p.date}</td>
                <td className="px-4 py-4 font-mono text-xs font-semibold">{p.id}</td>
                <td className="px-4 py-4 font-medium">{p.desc}</td>
                <td className="px-4 py-4 font-mono">{p.amount.toLocaleString()}</td>
                <td className="px-4 py-4"><div className="flex gap-1"><button onClick={() => setView(p)} className="rounded-md px-2 py-1 hover:bg-muted"><Eye className="h-3.5 w-3.5" /></button><button onClick={() => setEdit(p)} className="rounded-md px-2 py-1 hover:bg-muted"><Edit className="h-3.5 w-3.5" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    return (
      <table className="w-full text-sm">
        <thead><tr className="bg-muted/50 border-b border-border">{["Draft No", "Type", "Created", "Last Edited", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>)}</tr></thead>
        <tbody>
          {drafts.map(d => (
            <tr key={d.no} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
              <td className="px-4 py-4 font-mono text-xs font-semibold">{d.no}</td>
              <td className="px-4 py-4">{d.type}</td>
              <td className="px-4 py-4 text-muted-foreground text-xs">{d.created}</td>
              <td className="px-4 py-4 text-muted-foreground text-xs">{d.edited}</td>
              <td className="px-4 py-4"><Button size="sm" variant="outline" onClick={() => setEdit(d)} className="gap-1"><Edit className="h-3.5 w-3.5" /> Edit</Button></td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <PageShell icon={ReceiptIcon} title="Expenses" description="Track bills, transport, and petty cash spend.">
      <TabBar
        tabs={tabs}
        active={tab}
        onChange={(t) => { setTab(t); setExpType(t === "Transport" ? "transport" : t === "Petty Cash" ? "petty" : "bill"); }}
        right={
          <>
            <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
            <Button size="sm" className="gap-2 gradient-primary border-0 shadow-glow" onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> Add Expense</Button>
          </>
        }
      />

      {tab !== "Drafts" && (
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search expenses…" className="pl-9 h-10 bg-card" />
          </div>
          <Select defaultValue="feb"><SelectTrigger className="w-[160px] h-10 bg-card"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="feb">February 2026</SelectItem><SelectItem value="jan">January 2026</SelectItem></SelectContent></Select>
          <ViewToggle value={viewMode} onChange={setViewMode} className="ml-auto" />
        </div>
      )}

      {tab === "Drafts" || viewMode === "table" ? (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <div className="overflow-x-auto">{renderTable()}</div>
        </div>
      ) : (
        <DataCards
          items={
            tab === "Bill Payments"
              ? bills.map(b => ({
                  id: b.id,
                  title: b.type,
                  subtitle: b.id,
                  badge: <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${b.paid < b.amount ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-success/10 text-success border-success/20"}`}>{b.paid < b.amount ? "Partial" : "Paid"}</span>,
                  fields: [
                    { label: "Date", value: b.date },
                    { label: "Reference", value: b.ref, mono: true },
                    { label: "Amount", value: b.amount.toLocaleString(), mono: true },
                    { label: "Paid", value: b.paid.toLocaleString(), mono: true },
                    { label: "Comments", value: b.comments || "—", full: true },
                  ],
                  actions: (
                    <>
                      <Button size="sm" variant="outline" className="gap-1 flex-1" onClick={() => setView(b)}><Eye className="h-3.5 w-3.5" /> View</Button>
                      <Button size="sm" variant="outline" className="gap-1 flex-1" onClick={() => setEdit(b)}><Edit className="h-3.5 w-3.5" /> Edit</Button>
                    </>
                  ),
                }))
              : tab === "Transport"
              ? transport.map((t, i) => ({
                  id: String(i),
                  title: t.vehicle,
                  subtitle: t.ref,
                  fields: [
                    { label: "Date", value: t.date },
                    { label: "Cost", value: t.amount.toLocaleString(), mono: true },
                    { label: "Comments", value: t.comments || "—", full: true },
                  ],
                  actions: (
                    <>
                      <Button size="sm" variant="outline" className="gap-1 flex-1" onClick={() => setView(t)}><Eye className="h-3.5 w-3.5" /> View</Button>
                      <Button size="sm" variant="outline" className="gap-1 flex-1" onClick={() => setEdit(t)}><Edit className="h-3.5 w-3.5" /> Edit</Button>
                    </>
                  ),
                }))
              : petty.map(p => ({
                  id: p.id,
                  title: p.desc,
                  subtitle: p.id,
                  fields: [
                    { label: "Date", value: p.date },
                    { label: "Cost", value: p.amount.toLocaleString(), mono: true },
                    { label: "Comments", value: p.comments || "—", full: true },
                  ],
                  actions: (
                    <>
                      <Button size="sm" variant="outline" className="gap-1 flex-1" onClick={() => setView(p)}><Eye className="h-3.5 w-3.5" /> View</Button>
                      <Button size="sm" variant="outline" className="gap-1 flex-1" onClick={() => setEdit(p)}><Edit className="h-3.5 w-3.5" /> Edit</Button>
                    </>
                  ),
                }))
          }
        />
      )}

      {tab !== "Drafts" && <Pagination from={1} to={3} total={68} />}

      {/* Add Expense */}
      <FormShell
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Expense"
        subtitle="Record a new business expense."
        icon={<ReceiptIcon className="h-5 w-5" />}
        size="lg"
        footer={
          <div className="px-5 md:px-8 py-3 flex items-center justify-between gap-3">
            <Button variant="ghost" className="text-muted-foreground" onClick={() => setAddOpen(false)}>Cancel</Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5 hover:text-primary" onClick={() => { toast.success("Saved as draft"); setAddOpen(false); }}>Save as Draft</Button>
              <Button className="gap-2 gradient-primary border-0 shadow-glow px-6" onClick={() => { toast.success("Expense added"); setAddOpen(false); }}>
                <Plus className="h-4 w-4" /> Add Expense
              </Button>
            </div>
          </div>
        }
      >
        <FormSection icon={<FileText className="h-4 w-4" />} title="Expense Type" description="Choose the category of expense.">
          <Select value={expType} onValueChange={(v) => setExpType(v as ExpType)}>
            <SelectTrigger className="h-11 bg-background"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="bill">Bill Payment</SelectItem>
              <SelectItem value="transport">Transport</SelectItem>
              <SelectItem value="other">Other</SelectItem>
              <SelectItem value="petty">Petty Cash</SelectItem>
            </SelectContent>
          </Select>
        </FormSection>

        {expType === "bill" && (
          <FormSection icon={<CalendarIcon className="h-4 w-4" />} title="Bill Details">
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Date</Label><Input type="date" className="mt-1.5 h-11 bg-background" /></div>
              <div><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Bill Type</Label><Select><SelectTrigger className="mt-1.5 h-11 bg-background"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="e">Electricity</SelectItem><SelectItem value="f">Fuel</SelectItem><SelectItem value="m">Maintenance</SelectItem></SelectContent></Select></div>
              <div><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Bill Amount</Label><Input className="mt-1.5 h-11 bg-background" /></div>
              <div><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Paid Amount</Label><Input className="mt-1.5 h-11 bg-background" /></div>
              <div className="col-span-2"><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Bill Reference No</Label><Input className="mt-1.5 h-11 bg-background" /></div>
              <div className="col-span-2"><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Upload Bill</Label><button className="mt-1.5 w-full rounded-xl border-2 border-dashed border-border p-4 text-center hover:bg-muted/30 transition-smooth bg-background"><Upload className="h-5 w-5 mx-auto text-muted-foreground" /><p className="text-xs text-muted-foreground mt-1">Click to upload</p></button></div>
              <div className="col-span-2"><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Comments</Label><Textarea className="mt-1.5 bg-background" /></div>
            </div>
          </FormSection>
        )}

        {expType === "transport" && (
          <FormSection icon={<CalendarIcon className="h-4 w-4" />} title="Transport Details">
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Date</Label><Input type="date" className="mt-1.5 h-11 bg-background" /></div>
              <div><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Cost Amount</Label><Input className="mt-1.5 h-11 bg-background" /></div>
              <div><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Order / Stock Reference</Label><Input className="mt-1.5 h-11 bg-background" /></div>
              <div><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Vehicle No</Label><Input className="mt-1.5 h-11 bg-background" /></div>
              <div className="col-span-2"><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Driver</Label><Input className="mt-1.5 h-11 bg-background" /></div>
              <div className="col-span-2"><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Upload Receipt</Label><button className="mt-1.5 w-full rounded-xl border-2 border-dashed border-border p-4 text-center bg-background"><Upload className="h-5 w-5 mx-auto text-muted-foreground" /><p className="text-xs text-muted-foreground mt-1">Optional receipt</p></button></div>
              <div className="col-span-2"><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Comments</Label><Textarea className="mt-1.5 bg-background" /></div>
            </div>
          </FormSection>
        )}

        {(expType === "petty" || expType === "other") && (
          <FormSection icon={<CalendarIcon className="h-4 w-4" />} title={expType === "other" ? "Other Expense" : "Petty Cash"}>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Date</Label><Input type="date" className="mt-1.5 h-11 bg-background" /></div>
              <div><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Cost Amount</Label><Input className="mt-1.5 h-11 bg-background" /></div>
              <div className="col-span-2"><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{expType === "other" ? "Expense Type" : "Description"}</Label><Input className="mt-1.5 h-11 bg-background" /></div>
              <div className="col-span-2"><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Comments</Label><Textarea className="mt-1.5 bg-background" /></div>
            </div>
          </FormSection>
        )}
      </FormShell>

      {/* View Expense */}
      <FormShell
        open={!!view}
        onOpenChange={(o) => !o && setView(null)}
        title="Expense Details"
        icon={<ReceiptIcon className="h-5 w-5" />}
        size="md"
        footer={
          <div className="px-5 md:px-8 py-3 flex items-center justify-between gap-3">
            <Button variant="outline" className="text-destructive border-destructive/30" onClick={() => { setDel(view); setView(null); }}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setView(null)}>Close</Button>
              <Button className="gradient-primary border-0 shadow-glow px-5" onClick={() => { setEdit(view); setView(null); }}>Edit Expense</Button>
            </div>
          </div>
        }
      >
        {view && (
          <>
            <FormSection icon={<FileText className="h-4 w-4" />} title="Information">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {Object.entries(view).map(([k, v]) => (
                  <div key={k}><p className="text-xs text-muted-foreground capitalize">{k}</p><p className="font-medium">{String(v)}</p></div>
                ))}
              </div>
            </FormSection>
            <FormSection icon={<Paperclip className="h-4 w-4" />} title="Attachment" description="Uploaded receipt or supporting document.">
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); toast.success("Opening receipt…"); }}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background hover:bg-muted/40 transition-smooth px-4 py-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center ring-1 ring-primary/20 shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">receipt-{(view as any).id || (view as any).ref || "file"}.pdf</p>
                    <p className="text-xs text-muted-foreground">Click to open in a new tab</p>
                  </div>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
              </a>
            </FormSection>
          </>
        )}
      </FormShell>

      {/* Edit Expense */}
      <FormShell
        open={!!edit}
        onOpenChange={(o) => !o && setEdit(null)}
        title="Edit Expense"
        subtitle="Update details for this expense record."
        icon={<Edit className="h-5 w-5" />}
        size="lg"
        footer={
          <div className="px-5 md:px-8 py-3 flex items-center justify-between gap-3">
            <Button variant="ghost" className="text-muted-foreground" onClick={() => setEdit(null)}>Cancel</Button>
            <Button className="gradient-primary border-0 shadow-glow px-6" onClick={() => { toast.success("Changes saved"); setEdit(null); }}>Save Changes</Button>
          </div>
        }
      >
        <FormSection icon={<CalendarIcon className="h-4 w-4" />} title="Bill Details" description="Editing form prefilled with existing values.">
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Date</Label><Input type="date" defaultValue={(edit as any)?.date ? "" : ""} className="mt-1.5 h-11 bg-background" /></div>
            <div><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Bill Type</Label><Select defaultValue={(edit as any)?.type?.toLowerCase?.()}><SelectTrigger className="mt-1.5 h-11 bg-background"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="electricity">Electricity</SelectItem><SelectItem value="fuel">Fuel</SelectItem><SelectItem value="maintenance">Maintenance</SelectItem></SelectContent></Select></div>
            <div><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Bill Amount</Label><Input defaultValue={(edit as any)?.amount} className="mt-1.5 h-11 bg-background" /></div>
            <div><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Paid Amount</Label><Input defaultValue={(edit as any)?.paid} className="mt-1.5 h-11 bg-background" /></div>
            <div className="col-span-2"><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Bill Reference No</Label><Input defaultValue={(edit as any)?.ref} className="mt-1.5 h-11 bg-background" /></div>
            <div className="col-span-2"><Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Comments</Label><Textarea defaultValue={(edit as any)?.comments} className="mt-1.5 bg-background" /></div>
          </div>
        </FormSection>

        <FormSection icon={<Paperclip className="h-4 w-4" />} title="Attachment" description="View, replace, or remove the existing receipt.">
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background px-4 py-3 mb-3">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); toast.success("Opening receipt…"); }}
              className="flex items-center gap-3 min-w-0 group"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary grid place-items-center ring-1 ring-primary/20 shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-primary transition-smooth">receipt-{(edit as any)?.id || (edit as any)?.ref || "file"}.pdf</p>
                <p className="text-xs text-muted-foreground">Click to open in a new tab</p>
              </div>
            </a>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => toast.success("Attachment removed")}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
          <button className="w-full rounded-xl border-2 border-dashed border-border p-4 text-center hover:bg-muted/30 transition-smooth bg-background">
            <Upload className="h-5 w-5 mx-auto text-muted-foreground" />
            <p className="text-xs text-muted-foreground mt-1">Click to replace receipt</p>
          </button>
        </FormSection>
      </FormShell>

      <AlertDialog open={!!del} onOpenChange={(o) => !o && setDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this expense?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => { toast.success("Expense deleted"); setDel(null); }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
  );
};

export default Expenses;
