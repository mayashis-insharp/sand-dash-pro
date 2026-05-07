import { useState } from "react";
import { PageShell, TabBar, Pagination } from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { FormShell, FormSection } from "@/components/dashboard/FormShell";
import { Plus, Search, Eye, Edit, Download, Upload, Trash2, Receipt as ReceiptIcon, FileText, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";

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
  const [edit, setEdit] = useState<any>(null);
  const [del, setDel] = useState<any>(null);
  const [expType, setExpType] = useState<ExpType>("bill");

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
    <PageShell title="Expenses" description="Track bills, transport, and petty cash spend.">
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
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="overflow-x-auto">{renderTable()}</div>
      </div>

      <Pagination from={1} to={3} total={68} />

      {/* Add Expense */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Expense Type</Label>
              <Select value={expType} onValueChange={(v) => setExpType(v as ExpType)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bill">Bill Payment</SelectItem>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="petty">Petty Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {expType === "bill" && (
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Date</Label><Input type="date" className="mt-1.5" /></div>
                <div><Label>Bill Type</Label><Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="e">Electricity</SelectItem><SelectItem value="f">Fuel</SelectItem><SelectItem value="m">Maintenance</SelectItem></SelectContent></Select></div>
                <div><Label>Bill Amount</Label><Input className="mt-1.5" /></div>
                <div><Label>Paid Amount</Label><Input className="mt-1.5" /></div>
                <div className="col-span-2"><Label>Bill Reference No</Label><Input className="mt-1.5" /></div>
                <div className="col-span-2"><Label>Upload Bill</Label><button className="mt-1.5 w-full rounded-xl border-2 border-dashed border-border p-4 text-center hover:bg-muted/30 transition-smooth"><Upload className="h-5 w-5 mx-auto text-muted-foreground" /><p className="text-xs text-muted-foreground mt-1">Click to upload</p></button></div>
                <div className="col-span-2"><Label>Comments</Label><Textarea className="mt-1.5" /></div>
              </div>
            )}

            {expType === "transport" && (
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Date</Label><Input type="date" className="mt-1.5" /></div>
                <div><Label>Cost Amount</Label><Input className="mt-1.5" /></div>
                <div><Label>Order / Stock Reference</Label><Input className="mt-1.5" /></div>
                <div><Label>Vehicle No</Label><Input className="mt-1.5" /></div>
                <div className="col-span-2"><Label>Driver</Label><Input className="mt-1.5" /></div>
                <div className="col-span-2"><Label>Upload Receipt</Label><button className="mt-1.5 w-full rounded-xl border-2 border-dashed border-border p-4 text-center"><Upload className="h-5 w-5 mx-auto text-muted-foreground" /><p className="text-xs text-muted-foreground mt-1">Optional receipt</p></button></div>
                <div className="col-span-2"><Label>Comments</Label><Textarea className="mt-1.5" /></div>
              </div>
            )}

            {(expType === "petty" || expType === "other") && (
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Date</Label><Input type="date" className="mt-1.5" /></div>
                <div><Label>Cost Amount</Label><Input className="mt-1.5" /></div>
                <div className="col-span-2"><Label>{expType === "other" ? "Expense Type" : "Description"}</Label><Input className="mt-1.5" /></div>
                <div className="col-span-2"><Label>Comments</Label><Textarea className="mt-1.5" /></div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button variant="outline" onClick={() => { toast.success("Saved as draft"); setAddOpen(false); }}>Save as Draft</Button>
            <Button className="gradient-primary border-0" onClick={() => { toast.success("Expense added"); setAddOpen(false); }}>Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Expense */}
      <Dialog open={!!view} onOpenChange={(o) => !o && setView(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Expense Details</DialogTitle></DialogHeader>
          {view && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              {Object.entries(view).map(([k, v]) => (
                <div key={k}><p className="text-xs text-muted-foreground capitalize">{k}</p><p className="font-medium">{String(v)}</p></div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" className="text-destructive border-destructive/30" onClick={() => { setDel(view); setView(null); }}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
            <Button className="gradient-primary border-0" onClick={() => { setEdit(view); setView(null); }}>Edit Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Expense (reuse Add) */}
      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Edit Expense</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Editing form prefilled with existing values.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEdit(null)}>Cancel</Button>
            <Button className="gradient-primary border-0" onClick={() => { toast.success("Changes saved"); setEdit(null); }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
