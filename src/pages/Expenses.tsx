import { useState } from "react";
import { PageShell, TabBar, Pagination } from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Search, Eye, Edit, Download } from "lucide-react";
import { toast } from "sonner";

const tabs = ["Bill Payments", "Petty Cash", "Drafts"] as const;

const bills = [
  { date: "12/02/2026", id: "EX_3301", type: "Electricity", amount: 28500, ref: "INV-CEB-441", paid: 28500, comments: "Feb bill" },
  { date: "10/02/2026", id: "EX_3300", type: "Fuel", amount: 142000, ref: "FL-2026-22", paid: 100000, comments: "Partial" },
  { date: "05/02/2026", id: "EX_3299", type: "Maintenance", amount: 65000, ref: "MNT-018", paid: 65000, comments: "Vehicle service" },
];

const petty = [
  { date: "12/02/2026", desc: "Office supplies", amount: 4200, receipt: "RC_011", comments: "Stationery" },
  { date: "10/02/2026", desc: "Tea & snacks", amount: 1800, receipt: "RC_010", comments: "" },
];

const Expenses = () => {
  const [tab, setTab] = useState<typeof tabs[number]>("Bill Payments");
  const [addOpen, setAddOpen] = useState(false);
  const [expType, setExpType] = useState<"bill" | "petty">("bill");

  return (
    <PageShell breadcrumb={["Finance", "Expenses"]} title="Expenses" description="Track bills, petty cash, and operational spend.">
      <TabBar
        tabs={tabs}
        active={tab}
        onChange={setTab}
        right={
          <>
            <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
            <Button size="sm" className="gap-2 gradient-primary border-0 shadow-glow" onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> Add Expense</Button>
          </>
        }
      />

      {tab !== "Drafts" && (
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search expenses…" className="pl-9 h-10 bg-card" />
          </div>
        </div>
      )}

      {tab === "Bill Payments" && (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-muted/50 border-b border-border">
                {["Date", "Expense ID", "Bill Type", "Amount", "Reference", "Paid", "Comments", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold whitespace-nowrap">{h}</th>)}
              </tr></thead>
              <tbody>
                {bills.map(b => (
                  <tr key={b.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-4 text-muted-foreground">{b.date}</td>
                    <td className="px-4 py-4 font-mono text-xs font-semibold">{b.id}</td>
                    <td className="px-4 py-4">{b.type}</td>
                    <td className="px-4 py-4 font-mono">{b.amount.toLocaleString()}</td>
                    <td className="px-4 py-4 font-mono text-xs">{b.ref}</td>
                    <td className={`px-4 py-4 font-mono ${b.paid < b.amount ? "text-destructive" : "text-success"}`}>{b.paid.toLocaleString()}</td>
                    <td className="px-4 py-4 text-muted-foreground text-xs">{b.comments}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1">
                        <button className="rounded-md px-2 py-1 hover:bg-muted"><Eye className="h-3.5 w-3.5" /></button>
                        <button className="rounded-md px-2 py-1 hover:bg-muted"><Edit className="h-3.5 w-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "Petty Cash" && (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-muted/50 border-b border-border">
                {["Date", "Description", "Amount", "Receipt", "Comments"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>)}
              </tr></thead>
              <tbody>
                {petty.map((p, i) => (
                  <tr key={i} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-4 text-muted-foreground">{p.date}</td>
                    <td className="px-4 py-4 font-medium">{p.desc}</td>
                    <td className="px-4 py-4 font-mono">{p.amount.toLocaleString()}</td>
                    <td className="px-4 py-4 font-mono text-xs">{p.receipt}</td>
                    <td className="px-4 py-4 text-muted-foreground text-xs">{p.comments || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "Drafts" && (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center text-sm text-muted-foreground">No expense drafts.</div>
      )}

      <Pagination from={1} to={3} total={68} />

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Add Expense</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <RadioGroup value={expType} onValueChange={(v) => setExpType(v as any)} className="grid grid-cols-2 gap-3">
              {[
                { v: "bill", l: "Bill Payment" },
                { v: "petty", l: "Petty Cash" },
              ].map(o => (
                <label key={o.v} className={`flex items-center gap-3 rounded-xl border-2 p-3 cursor-pointer transition-smooth ${expType === o.v ? "border-primary bg-primary/5" : "border-border"}`}>
                  <RadioGroupItem value={o.v} />
                  <span className="font-medium text-sm">{o.l}</span>
                </label>
              ))}
            </RadioGroup>

            {expType === "bill" ? (
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Bill Type</Label><Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="e">Electricity</SelectItem><SelectItem value="f">Fuel</SelectItem></SelectContent></Select></div>
                <div><Label>Bill Amount</Label><Input className="mt-1.5" /></div>
                <div><Label>Reference No</Label><Input className="mt-1.5" /></div>
                <div><Label>Paid Amount</Label><Input className="mt-1.5" /></div>
                <div className="col-span-2"><Label>Comments</Label><Textarea className="mt-1.5" /></div>
              </div>
            ) : (
              <div className="space-y-3">
                <div><Label>Description</Label><Input className="mt-1.5" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Amount</Label><Input className="mt-1.5" /></div>
                  <div><Label>Receipt No</Label><Input className="mt-1.5" /></div>
                </div>
                <div><Label>Comments</Label><Textarea className="mt-1.5" /></div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button className="gradient-primary border-0" onClick={() => { toast.success("Expense added"); setAddOpen(false); }}>Add Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
};

export default Expenses;
