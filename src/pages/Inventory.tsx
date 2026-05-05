import { useState } from "react";
import { PageShell, TabBar, Pagination } from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Search, Upload, Edit, Eye, Download, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const tabs = ["Sand Stock", "Set Alert", "Received", "Drafts"] as const;

const stocks = [
  { date: "12/02/2026 09:30", id: "ST_4421", supplier: "Riverside Mining", sand: "River Sand – Soft", qty: "200 sqft", status: "Quality Checked", finalPrice: 1800, sellPrice: 2400, vehicle: "WP-7891" },
  { date: "11/02/2026 14:15", id: "ST_4420", supplier: "Coastal Sands Pvt", sand: "Sea Sand", qty: "150 sqft", status: "In Progress", finalPrice: 1500, sellPrice: 2000, vehicle: "MD-0214" },
  { date: "10/02/2026 10:00", id: "ST_4419", supplier: "Lanka Quarry", sand: "Quarry Dust", qty: "300 sqft", status: "Quality Checked", finalPrice: 1200, sellPrice: 1800, vehicle: "GH-5423" },
];

const alertList = [
  { id: 1, sand: "River Sand – Soft", unit: "sqft", level: 500 },
  { id: 2, sand: "Sea Sand", unit: "sqft", level: 500 },
  { id: 3, sand: "M-Sand", unit: "sqft", level: 300 },
];

const received = [
  { date: "12/02/2026", id: "ST_4421", supplier: "Riverside Mining", sand: "River Sand – Soft", qty: "200 sqft", amount: 360000, paid: 200000, due: 160000, method: "Bank Transfer" },
  { date: "10/02/2026", id: "ST_4419", supplier: "Lanka Quarry", sand: "Quarry Dust", qty: "300 sqft", amount: 360000, paid: 360000, due: 0, method: "Cash" },
];

const drafts = [
  { no: "DR_S05", type: "Stock", created: "08/02/2026 14:21", edited: "10/02/2026 09:11" },
];

const Inventory = () => {
  const [tab, setTab] = useState<typeof tabs[number]>("Sand Stock");
  const [addStock, setAddStock] = useState(false);
  const [viewStock, setViewStock] = useState<any>(null);
  const [editStock, setEditStock] = useState<any>(null);
  const [delStock, setDelStock] = useState<any>(null);
  const [qcOpen, setQcOpen] = useState<any>(null);
  const [setAlertOpen, setSetAlertOpen] = useState(false);
  const [editAlert, setEditAlert] = useState<any>(null);
  const [delAlert, setDelAlert] = useState<any>(null);
  const [recordPay, setRecordPay] = useState<any>(null);
  const [viewPay, setViewPay] = useState<any>(null);
  const [qStatus, setQStatus] = useState("ip");
  const [qResult, setQResult] = useState("none");
  const [charges, setCharges] = useState<{ id: string }[]>([{ id: "1" }]);

  return (
    <PageShell title="Inventory" description="Track sand stock levels, suppliers, and quality.">
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
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search stock…" className="pl-9 h-10 bg-card" /></div>
            <Select defaultValue="feb"><SelectTrigger className="w-[160px] h-10 bg-card"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="feb">February 2026</SelectItem></SelectContent></Select>
            <Select><SelectTrigger className="w-[160px] h-10 bg-card"><SelectValue placeholder="Quality Status" /></SelectTrigger><SelectContent><SelectItem value="ip">In Progress</SelectItem><SelectItem value="ck">Quality Checked</SelectItem></SelectContent></Select>
          </div>
          <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-muted/50 border-b border-border">{["Date & Time", "Stock ID", "Supplier", "Sand Type", "Quantity", "Quality Status", "Final Price", "Selling Price", "Vehicle", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody>
                  {stocks.map(s => (
                    <tr key={s.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">{s.date}</td>
                      <td className="px-4 py-4 font-mono text-xs font-semibold">{s.id}</td>
                      <td className="px-4 py-4">{s.supplier}</td>
                      <td className="px-4 py-4">{s.sand}</td>
                      <td className="px-4 py-4 font-medium">{s.qty}</td>
                      <td className="px-4 py-4">
                        <button onClick={() => setQcOpen(s)} className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium hover:opacity-80",
                          s.status === "Quality Checked" ? "bg-success/10 text-success border-success/20" : "bg-warning/15 text-warning border-warning/30")}>{s.status}</button>
                      </td>
                      <td className="px-4 py-4 font-mono">{s.finalPrice.toLocaleString()}</td>
                      <td className="px-4 py-4 font-mono">{s.sellPrice.toLocaleString()}</td>
                      <td className="px-4 py-4 font-mono text-xs">{s.vehicle}</td>
                      <td className="px-4 py-4"><div className="flex gap-1"><button onClick={() => setViewStock(s)} className="rounded-md px-2 py-1 hover:bg-muted"><Eye className="h-3.5 w-3.5" /></button><button onClick={() => setEditStock(s)} className="rounded-md px-2 py-1 hover:bg-muted"><Edit className="h-3.5 w-3.5" /></button></div></td>
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
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-muted/50 border-b border-border">{["Sand Type", "Unit", "Quantity Level", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>)}</tr></thead>
            <tbody>
              {alertList.map(a => (
                <tr key={a.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-4 font-medium">{a.sand}</td>
                  <td className="px-4 py-4">{a.unit}</td>
                  <td className="px-4 py-4 font-mono">{a.level}</td>
                  <td className="px-4 py-4"><div className="flex gap-1"><button onClick={() => setEditAlert(a)} className="rounded-md px-2 py-1 hover:bg-muted"><Edit className="h-3.5 w-3.5" /></button><button onClick={() => setDelAlert(a)} className="rounded-md px-2 py-1 hover:bg-muted text-destructive"><Trash2 className="h-3.5 w-3.5" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Received" && (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-muted/50 border-b border-border">{["Date", "Stock ID", "Supplier", "Sand Type", "Quantity", "Total", "Paid", "Due", "Method", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold whitespace-nowrap">{h}</th>)}</tr></thead>
              <tbody>
                {received.map(r => (
                  <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-4 text-muted-foreground">{r.date}</td>
                    <td className="px-4 py-4 font-mono text-xs font-semibold">{r.id}</td>
                    <td className="px-4 py-4">{r.supplier}</td>
                    <td className="px-4 py-4">{r.sand}</td>
                    <td className="px-4 py-4">{r.qty}</td>
                    <td className="px-4 py-4 font-mono">{r.amount.toLocaleString()}</td>
                    <td className="px-4 py-4 font-mono text-success">{r.paid.toLocaleString()}</td>
                    <td className={`px-4 py-4 font-mono ${r.due > 0 ? "text-destructive" : "text-success"}`}>{r.due.toLocaleString()}</td>
                    <td className="px-4 py-4">{r.method}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-1">
                        {r.due > 0
                          ? <Button size="sm" variant="outline" onClick={() => setRecordPay(r)}>Record Payment</Button>
                          : <Button size="sm" variant="outline" onClick={() => setViewPay(r)}>View Payment</Button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "Drafts" && (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-muted/50 border-b border-border">{["Draft No", "Type", "Created", "Last Edited", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>)}</tr></thead>
            <tbody>
              {drafts.map(d => (
                <tr key={d.no} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-4 font-mono text-xs font-semibold">{d.no}</td>
                  <td className="px-4 py-4">{d.type}</td>
                  <td className="px-4 py-4 text-muted-foreground text-xs">{d.created}</td>
                  <td className="px-4 py-4 text-muted-foreground text-xs">{d.edited}</td>
                  <td className="px-4 py-4"><Button size="sm" variant="outline" className="gap-1" onClick={() => setEditStock(d)}><Edit className="h-3.5 w-3.5" /> Edit</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Stock */}
      <Dialog open={addStock} onOpenChange={setAddStock}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add Stock</DialogTitle></DialogHeader>
          <div className="space-y-5">
            <section>
              <h4 className="text-sm font-display font-bold mb-3">Stock Details</h4>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Date</Label><Input type="date" className="mt-1.5" /></div>
                <div><Label>Time</Label><Input type="time" className="mt-1.5" /></div>
                <div><Label>Supplier</Label><Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select supplier" /></SelectTrigger><SelectContent><SelectItem value="r">Riverside Mining</SelectItem></SelectContent></Select></div>
                <div><Label>Sand Type</Label><Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select sand type" /></SelectTrigger><SelectContent><SelectItem value="rs">River Sand – Soft</SelectItem></SelectContent></Select></div>
                <div><Label>Quantity</Label><Input className="mt-1.5" placeholder="200" /></div>
                <div><Label>Supplier Unit Price</Label><Input className="mt-1.5" placeholder="1800" /></div>
                <div className="col-span-2"><Label>Total Price</Label><Input className="mt-1.5" disabled value="360,000" /></div>
                <div className="col-span-2"><Label>Supplier Invoice</Label><button className="mt-1.5 w-full rounded-xl border-2 border-dashed border-border p-4 text-center hover:bg-muted/30"><Upload className="h-5 w-5 mx-auto text-muted-foreground" /><p className="text-xs text-muted-foreground mt-1">Upload invoice</p></button></div>
              </div>
            </section>
            <section>
              <h4 className="text-sm font-display font-bold mb-3">Delivery Details</h4>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Vehicle Type</Label><Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="own">Own</SelectItem><SelectItem value="sup">Supplier</SelectItem></SelectContent></Select></div>
                <div><Label>Vehicle No</Label><Input className="mt-1.5" /></div>
                <div><Label>Vehicle Capacity</Label><Input className="mt-1.5" /></div>
                <div><Label>Driver Name</Label><Input className="mt-1.5" /></div>
                <div className="col-span-2"><Label>Driver Contact</Label><Input className="mt-1.5" /></div>
              </div>
            </section>
            <section>
              <h4 className="text-sm font-display font-bold mb-3">Quality Status</h4>
              <RadioGroup value={qStatus} onValueChange={setQStatus} className="grid grid-cols-2 gap-3">
                {[{ v: "ip", l: "In Progress" }, { v: "ck", l: "Quality Checked" }].map(o => (
                  <label key={o.v} className={`flex items-center gap-3 rounded-xl border-2 p-3 cursor-pointer ${qStatus === o.v ? "border-primary bg-primary/5" : "border-border"}`}><RadioGroupItem value={o.v} /><span className="font-medium text-sm">{o.l}</span></label>
                ))}
              </RadioGroup>
              {qStatus === "ck" && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="col-span-2"><Label>Quality Result</Label>
                    <Select value={qResult} onValueChange={setQResult}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="none">No Quality Difference</SelectItem><SelectItem value="dropped">Quality Dropped</SelectItem></SelectContent>
                    </Select>
                  </div>
                  {qResult === "dropped" && <div className="col-span-2"><Label>Actual Order Quantity</Label><Input className="mt-1.5" /></div>}
                  <div><Label>Final Unit Price</Label><Input className="mt-1.5" /></div>
                  <div><Label>Selling Unit Price</Label><Input className="mt-1.5" /></div>
                  <div className="col-span-2"><Label>Payment Method</Label><Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="bank">Bank Transfer</SelectItem><SelectItem value="cheque">Cheque</SelectItem><SelectItem value="credit">Credit</SelectItem></SelectContent></Select></div>
                </div>
              )}
            </section>
            <section>
              <h4 className="text-sm font-display font-bold mb-3">Additional Charges</h4>
              <div className="space-y-2">
                {charges.map(c => (
                  <div key={c.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
                    <Input placeholder="Type / Description" />
                    <Input placeholder="Amount" />
                    <Input placeholder="Comments" />
                    <Button size="icon" variant="ghost" onClick={() => setCharges(s => s.filter(x => x.id !== c.id))}><X className="h-4 w-4" /></Button>
                  </div>
                ))}
                <Button size="sm" variant="outline" className="gap-1" onClick={() => setCharges(s => [...s, { id: Date.now() + "" }])}><Plus className="h-3.5 w-3.5" /> Add Charge</Button>
              </div>
            </section>
            <section>
              <h4 className="text-sm font-display font-bold mb-3">Comments</h4>
              <Textarea placeholder="Notes about this stock entry..." />
            </section>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddStock(false)}>Cancel</Button>
            <Button variant="outline" onClick={() => { toast.success("Saved as draft"); setAddStock(false); }}>Save as Draft</Button>
            <Button className="gradient-primary border-0" onClick={() => { toast.success("Stock added"); setAddStock(false); }}>Add Stock</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Stock */}
      <Dialog open={!!viewStock} onOpenChange={(o) => !o && setViewStock(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Stock Details</DialogTitle></DialogHeader>
          {viewStock && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(viewStock).map(([k, v]) => (
                  <div key={k}><p className="text-xs text-muted-foreground capitalize">{k}</p><p className="font-medium">{String(v)}</p></div>
                ))}
              </div>
              <div className="rounded-xl border border-border p-3 bg-muted/30"><p className="text-xs text-muted-foreground">Additional Charges</p><p className="text-sm">Loading + cleaning · LKR 4,500</p></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" className="text-destructive border-destructive/30" onClick={() => { setDelStock(viewStock); setViewStock(null); }}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
            <Button className="gradient-primary border-0" onClick={() => { setEditStock(viewStock); setViewStock(null); }}>Edit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editStock} onOpenChange={(o) => !o && setEditStock(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Edit Stock</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Editing form prefilled with existing values.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditStock(null)}>Cancel</Button>
            <Button className="gradient-primary border-0" onClick={() => { toast.success("Changes saved"); setEditStock(null); }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!delStock} onOpenChange={(o) => !o && setDelStock(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete this stock?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => { toast.success("Deleted"); setDelStock(null); }}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Quality Check */}
      <Dialog open={!!qcOpen} onOpenChange={(o) => !o && setQcOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Quality Check Status</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <RadioGroup defaultValue={qcOpen?.status === "Quality Checked" ? "ck" : "ip"} onValueChange={setQStatus} className="grid grid-cols-2 gap-3">
              {[{ v: "ip", l: "In Progress" }, { v: "ck", l: "Quality Checked" }].map(o => (
                <label key={o.v} className="flex items-center gap-2 rounded-xl border border-border p-2.5 cursor-pointer hover:bg-muted/30"><RadioGroupItem value={o.v} /> {o.l}</label>
              ))}
            </RadioGroup>
            {qStatus === "ck" && (
              <div className="space-y-3">
                <div><Label>Quality Result</Label>
                  <Select value={qResult} onValueChange={setQResult}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="none">No Quality Difference</SelectItem><SelectItem value="dropped">Quality Dropped</SelectItem></SelectContent>
                  </Select>
                </div>
                {qResult === "dropped" && <div><Label>Actual Order Quantity</Label><Input className="mt-1.5" /></div>}
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Final Unit Price</Label><Input className="mt-1.5" /></div>
                  <div><Label>Selling Unit Price</Label><Input className="mt-1.5" /></div>
                </div>
                <div><Label>Payment Method</Label><Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="bank">Bank Transfer</SelectItem></SelectContent></Select></div>
                <div><Label>Comments</Label><Textarea className="mt-1.5" /></div>
              </div>
            )}
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setQcOpen(null)}>Cancel</Button><Button className="gradient-primary border-0" onClick={() => { toast.success("Saved"); setQcOpen(null); }}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Set Alert */}
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
          <DialogFooter><Button variant="outline" onClick={() => setSetAlertOpen(false)}>Cancel</Button><Button className="gradient-primary border-0" onClick={() => { toast.success("Alert set"); setSetAlertOpen(false); }}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editAlert} onOpenChange={(o) => !o && setEditAlert(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Alert</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Sand Type</Label><Input className="mt-1.5" defaultValue={editAlert?.sand} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Quantity Level</Label><Input className="mt-1.5" defaultValue={editAlert?.level} /></div>
              <div><Label>Unit</Label><Input className="mt-1.5" defaultValue={editAlert?.unit} /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setEditAlert(null)}>Cancel</Button><Button className="gradient-primary border-0" onClick={() => { toast.success("Updated"); setEditAlert(null); }}>Save Changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!delAlert} onOpenChange={(o) => !o && setDelAlert(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete alert?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => { toast.success("Deleted"); setDelAlert(null); }}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Record / View Payment */}
      <Dialog open={!!recordPay} onOpenChange={(o) => !o && setRecordPay(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
          {recordPay && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 rounded-xl border border-border bg-muted/30 p-3 text-sm">
                <div><p className="text-xs text-muted-foreground">Supplier</p><p className="font-medium">{recordPay.supplier}</p></div>
                <div><p className="text-xs text-muted-foreground">Stock ID</p><p className="font-mono">{recordPay.id}</p></div>
                <div><p className="text-xs text-muted-foreground">Sand</p><p>{recordPay.sand}</p></div>
                <div><p className="text-xs text-muted-foreground">Outstanding</p><p className="font-mono text-destructive">{recordPay.due.toLocaleString()}</p></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Amount</Label><Input className="mt-1.5" /></div>
                <div><Label>Method</Label><Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="bank">Bank Transfer</SelectItem></SelectContent></Select></div>
              </div>
              <div><Label>Comments</Label><Textarea className="mt-1.5" /></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setRecordPay(null)}>Cancel</Button><Button className="gradient-primary border-0" onClick={() => { toast.success("Payment recorded"); setRecordPay(null); }}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewPay} onOpenChange={(o) => !o && setViewPay(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Payment Details</DialogTitle></DialogHeader>
          {viewPay && (
            <div className="grid grid-cols-2 gap-3 text-sm">
              {Object.entries(viewPay).map(([k, v]) => <div key={k}><p className="text-xs text-muted-foreground capitalize">{k}</p><p className="font-medium">{String(v)}</p></div>)}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
};

export default Inventory;
