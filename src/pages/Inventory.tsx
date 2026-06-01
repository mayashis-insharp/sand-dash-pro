import { useState, ReactNode } from "react";
import { PageShell, TabBar, Pagination } from "@/components/dashboard/PageShell";
import { ViewToggle, type ViewMode } from "@/components/dashboard/ViewToggle";
import { DataCards } from "@/components/dashboard/DataCards";
import { FormShell, FormSection } from "@/components/dashboard/FormShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Upload, Edit, Eye, Download, Trash2, X, Boxes, Truck, BadgeCheck, Bell, Receipt as ReceiptIcon, FileText, Calendar as CalendarIcon, Wallet, MoreHorizontal, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { ExportReportDialog } from "@/components/dashboard/ExportReportDialog";
import { DocumentsDialog, type DocData } from "@/components/dashboard/DocumentsDialog";
import { GRNDialog, type GRNData } from "@/components/dashboard/GRNDialog";

const tabs = ["Sand Stock", "Set Alert", "Drafts"] as const;

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

const drafts = [
  { no: "DR_S05", type: "Stock", created: "08/02/2026 14:21", edited: "10/02/2026 09:11" },
];

const Fld = ({ label, children, full, hint }: { label: string; children: ReactNode; full?: boolean; hint?: string }) => (
  <div className={full ? "col-span-2" : ""}>
    <div className="flex items-center justify-between">
      <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
      {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
    </div>
    <div className="mt-1.5">{children}</div>
  </div>
);

const FooterBtns = ({
  onCancel, onDraft, onSave, saveLabel = "Save", saveIcon,
}: { onCancel: () => void; onDraft?: () => void; onSave: () => void; saveLabel?: string; saveIcon?: ReactNode }) => (
  <div className="px-5 md:px-8 py-3 flex items-center justify-between gap-3">
    <Button variant="ghost" className="text-muted-foreground" onClick={onCancel}>Cancel</Button>
    <div className="flex items-center gap-2">
      {onDraft && <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5 hover:text-primary" onClick={onDraft}>Save as Draft</Button>}
      <Button className="gap-2 gradient-primary border-0 shadow-glow px-6" onClick={onSave}>
        {saveIcon}{saveLabel}
      </Button>
    </div>
  </div>
);

const Inventory = () => {
  const [tab, setTab] = useState<typeof tabs[number]>("Sand Stock");
  const [view, setView] = useState<ViewMode>("table");
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
  const [charges, setCharges] = useState<{ id: string; type: string; amount: string; comment: string; addToInvoice: boolean }[]>([
    { id: "1", type: "", amount: "", comment: "", addToInvoice: false },
  ]);
  const [stockVehicles, setStockVehicles] = useState<{ id: string; vehicleNo: string; capacity: string; driverName: string; driverPhone: string }[]>([
    { id: "v1", vehicleNo: "", capacity: "", driverName: "", driverPhone: "" },
  ]);
  const [stockQty, setStockQty] = useState("");
  const stockTotalCap = stockVehicles.reduce((s, v) => s + (parseFloat(v.capacity) || 0), 0);
  const stockQtyNum = parseFloat(stockQty || "0");
  const stockCapShort = stockQtyNum > 0 && stockTotalCap > 0 && stockQtyNum > stockTotalCap;
  const [exportOpen, setExportOpen] = useState(false);
  const [docsStock, setDocsStock] = useState<any>(null);

  // GRN state
  const [grnPreview, setGrnPreview] = useState<any>(null);
  const [grnConfirm, setGrnConfirm] = useState<any>(null);
  const [grnWarn, setGrnWarn] = useState<any>(null);
  const [grnGenerated, setGrnGenerated] = useState<Record<string, boolean>>({
    ST_4421: true, // mock: one is already generated
  });
  const [postSaveGrn, setPostSaveGrn] = useState<any>(null);

  const buildGrnData = (s: any): GRNData => ({
    stockId: s.id,
    date: s.date?.split(" ")[0] || s.date,
    supplier: s.supplier,
    supplierPhone: "+94 77 850 0011",
    sandType: s.sand,
    orderedQty: s.qty,
    actualQty: s.actualQty,
    vehicles: (stockVehicles.filter(v => v.vehicleNo).length > 0
      ? stockVehicles.filter(v => v.vehicleNo).map(v => ({ vehicleNo: v.vehicleNo, driverName: v.driverName, driverPhone: v.driverPhone }))
      : [{ vehicleNo: s.vehicle, driverName: "Driver", driverPhone: "—" }]),
    supplierUnitPrice: s.finalPrice,
    finalUnitPrice: s.finalPrice,
    totalAmount: s.finalPrice * (parseInt(s.qty) || 1),
    qualityStatus: s.status,
    qualityResult: s.status === "Quality Checked" ? "No Quality Difference" : undefined,
    comments: s.comments || "",
  });

  const handleGrnAction = (s: any) => {
    if (s.status !== "Quality Checked") {
      setGrnWarn(s);
      return;
    }
    if (grnGenerated[s.id]) {
      setGrnPreview(s);
    } else {
      setGrnConfirm(s);
    }
  };

  const buildStockDoc = (s: any): DocData => {
    const vList = stockVehicles
      .filter((v) => v.vehicleNo)
      .map((v) => ({
        vehicleNo: v.vehicleNo,
        capacity: v.capacity,
        driverName: v.driverName,
        driverPhone: v.driverPhone,
        assignedQty: v.capacity ? `${v.capacity}` : undefined,
      }));
    return {
      source: "stock",
      refNo: s.id,
      date: s.date?.split(" ")[0] || s.date,
      time: s.date?.split(" ")[1],
      party: { label: "Supplier", name: s.supplier, phone: "—" },
      product: s.sand,
      qty: s.qty,
      unitPrice: s.finalPrice,
      subtotal: s.finalPrice * (parseInt(s.qty) || 1),
      charges: charges
        .filter((c) => c.amount)
        .map((c) => ({ description: c.type || c.comment || "Charge", amount: parseFloat(c.amount) || 0, addToInvoice: c.addToInvoice })),
      vehicle: s.vehicle,
      driver: { name: "Driver", phone: "—" },
      vehicles: vList.length > 0 ? vList : undefined,
      paymentMethod: "Cash",
      paymentStatus: "Pending",
      deliveryDate: s.date?.split(" ")[0] || s.date,
    };
  };

  return (
    <PageShell icon={Boxes} title="Inventory" description="Track sand stock levels, suppliers, and quality.">
      <TabBar
        tabs={tabs}
        active={tab}
        onChange={setTab}
        right={
          <>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setExportOpen(true)}><Download className="h-4 w-4" /> Export</Button>
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
            <ViewToggle value={view} onChange={setView} className="ml-auto" />
          </div>
          {view === "table" ? (
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
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1">
                            <button onClick={() => setViewStock(s)} aria-label="View" title="View" className="inline-flex items-center justify-center h-7 w-7 rounded-md text-foreground hover:bg-muted"><Eye className="h-3.5 w-3.5" /></button>
                            <button onClick={() => setEditStock(s)} aria-label="Edit" title="Edit" className="inline-flex items-center justify-center h-7 w-7 rounded-md text-foreground hover:bg-muted"><Edit className="h-3.5 w-3.5" /></button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="More actions">
                                  <MoreHorizontal className="h-4 w-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">Documents</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleGrnAction(s)} className="gap-2 text-xs">
                                  <FileText className="h-3.5 w-3.5 text-primary" /> GRN
                                  {grnGenerated[s.id] && <Badge variant="outline" className="ml-auto text-[9px] border-success/40 text-success">Ready</Badge>}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <DataCards
              items={stocks.map(s => ({
                id: s.id,
                title: s.sand,
                subtitle: <span className="font-mono">{s.id} · {s.date}</span>,
                badge: (
                  <button onClick={() => setQcOpen(s)} className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium hover:opacity-80",
                    s.status === "Quality Checked" ? "bg-success/10 text-success border-success/20" : "bg-warning/15 text-warning border-warning/30")}>{s.status}</button>
                ),
                fields: [
                  { label: "Supplier", value: s.supplier, full: true },
                  { label: "Quantity", value: s.qty },
                  { label: "Vehicle", value: s.vehicle, mono: true },
                  { label: "Final Price", value: s.finalPrice.toLocaleString(), mono: true },
                  { label: "Selling Price", value: s.sellPrice.toLocaleString(), mono: true },
                ],
                actions: (
                  <>
                    <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => setViewStock(s)}><Eye className="h-3.5 w-3.5" /> View</Button>
                    <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => setEditStock(s)}><Edit className="h-3.5 w-3.5" /> Edit</Button>
                  </>
                ),
              }))}
            />
          )}
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
                  <td className="px-4 py-4"><Button size="icon" variant="ghost" aria-label="Edit" title="Edit" onClick={() => setEditStock(d)} className="h-7 w-7"><Edit className="h-3.5 w-3.5" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Stock */}
      <FormShell
        open={addStock}
        onOpenChange={setAddStock}
        title="Add Stock"
        subtitle="Record a new sand stock arrival."
        icon={<Boxes className="h-5 w-5" />}
        size="xl"
        footer={
          <FooterBtns
            onCancel={() => setAddStock(false)}
            onDraft={() => { toast.success("Saved as draft"); setAddStock(false); }}
            onSave={() => {
              toast.success("Stock added");
              setAddStock(false);
              if (qStatus === "ck") {
                const mockNew = { id: "ST_NEW", date: new Date().toLocaleDateString(), supplier: "Supplier", sand: "Sand", qty: stockQty + " sqft", status: "Quality Checked", finalPrice: 1800, sellPrice: 2400, vehicle: stockVehicles[0]?.vehicleNo || "—" };
                setPostSaveGrn(mockNew);
              }
            }}
            saveLabel="Add Stock"
            saveIcon={<Plus className="h-4 w-4" />}
          />
        }
      >
        <FormSection icon={<Boxes className="h-4 w-4" />} title="Stock Details" description="Supplier and material information.">
          <div className="grid grid-cols-2 gap-4">
            <Fld label="Date"><Input type="date" className="h-11 bg-background" /></Fld>
            <Fld label="Time"><Input type="time" className="h-11 bg-background" /></Fld>
            <Fld label="Supplier"><Select><SelectTrigger className="h-11 bg-background"><SelectValue placeholder="Select supplier" /></SelectTrigger><SelectContent><SelectItem value="r">Riverside Mining</SelectItem></SelectContent></Select></Fld>
            <Fld label="Sand Type"><Select><SelectTrigger className="h-11 bg-background"><SelectValue placeholder="Select sand type" /></SelectTrigger><SelectContent><SelectItem value="rs">River Sand – Soft</SelectItem></SelectContent></Select></Fld>
            <Fld label="Quantity"><Input className="h-11 bg-background" placeholder="200" value={stockQty} onChange={(e) => setStockQty(e.target.value)} /></Fld>
            <Fld label="Supplier Unit Price"><Input className="h-11 bg-background" placeholder="1800" /></Fld>
            <Fld label="Total Price" full hint="Auto-calculated"><Input className="h-11 bg-muted/40" disabled value="360,000" /></Fld>
            <Fld label="Supplier Invoice" full>
              <button className="w-full rounded-xl border-2 border-dashed border-border bg-background p-4 text-center hover:bg-muted/30 transition-smooth"><Upload className="h-5 w-5 mx-auto text-muted-foreground" /><p className="text-xs text-muted-foreground mt-1">Upload invoice</p></button>
            </Fld>
          </div>
        </FormSection>

        <FormSection icon={<Truck className="h-4 w-4" />} title="Logistics" description="Vehicle, driver, and delivery.">
          <div className="space-y-3">
            {stockVehicles.map((v, idx) => (
              <div key={v.id} className="rounded-xl border border-border bg-background p-4 group hover:border-primary/30 transition-smooth">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Vehicle #{idx + 1}</span>
                  <button type="button" onClick={() => setStockVehicles(s => s.length > 1 ? s.filter(x => x.id !== v.id) : s)} disabled={stockVehicles.length === 1} className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Fld label="Vehicle No"><Input className="h-10 bg-card" placeholder="e.g. GH-5423" value={v.vehicleNo} onChange={(e) => setStockVehicles(s => s.map(x => x.id === v.id ? { ...x, vehicleNo: e.target.value } : x))} /></Fld>
                  <Fld label="Vehicle Capacity"><Input type="number" placeholder="0" className="h-10 bg-card" value={v.capacity} onChange={(e) => setStockVehicles(s => s.map(x => x.id === v.id ? { ...x, capacity: e.target.value } : x))} /></Fld>
                  <Fld label="Driver Name"><Input className="h-10 bg-card" placeholder="Driver name" value={v.driverName} onChange={(e) => setStockVehicles(s => s.map(x => x.id === v.id ? { ...x, driverName: e.target.value } : x))} /></Fld>
                  <Fld label="Driver Contact"><Input className="h-10 bg-card" placeholder="+94 77 000 0000" value={v.driverPhone} onChange={(e) => setStockVehicles(s => s.map(x => x.id === v.id ? { ...x, driverPhone: e.target.value } : x))} /></Fld>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => setStockVehicles(s => [...s, { id: Date.now() + "", vehicleNo: "", capacity: "", driverName: "", driverPhone: "" }])} className="w-full rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary py-3 text-sm font-medium transition-smooth flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" /> Add Vehicle
            </button>
            <div className={cn("rounded-lg border px-3 py-2 text-xs flex items-center justify-between", stockCapShort ? "border-warning/40 bg-warning/10 text-warning" : "border-border bg-muted/30 text-muted-foreground")}>
              <span>Total vehicle capacity</span>
              <span className="font-mono font-semibold">{stockTotalCap}{stockQtyNum > 0 ? ` / ${stockQtyNum} required` : ""}</span>
            </div>
            {stockCapShort && <p className="text-xs text-warning font-medium">⚠ Total vehicle capacity is less than required quantity.</p>}
          </div>
        </FormSection>

        <FormSection icon={<BadgeCheck className="h-4 w-4" />} title="Quality Status" description="Inspection result and pricing.">
          <RadioGroup value={qStatus} onValueChange={setQStatus} className="grid grid-cols-2 gap-3">
            {[{ v: "ip", l: "In Progress" }, { v: "ck", l: "Quality Checked" }].map(o => (
              <label key={o.v} className={`flex items-center gap-3 rounded-xl border-2 bg-background p-3 cursor-pointer ${qStatus === o.v ? "border-primary bg-primary/5" : "border-border"}`}><RadioGroupItem value={o.v} /><span className="font-medium text-sm">{o.l}</span></label>
            ))}
          </RadioGroup>
          {qStatus === "ck" && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <Fld label="Quality Result" full>
                <Select value={qResult} onValueChange={setQResult}><SelectTrigger className="h-11 bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="none">No Quality Difference</SelectItem><SelectItem value="dropped">Quality Dropped</SelectItem></SelectContent>
                </Select>
              </Fld>
              {qResult === "dropped" && <Fld label="Actual Order Quantity" full><Input className="h-11 bg-background" /></Fld>}
              <Fld label="Final Unit Price"><Input className="h-11 bg-background" /></Fld>
              <Fld label="Selling Unit Price"><Input className="h-11 bg-background" /></Fld>
              <Fld label="Payment Method" full><Select><SelectTrigger className="h-11 bg-background"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="bank">Bank Transfer</SelectItem><SelectItem value="cheque">Cheque</SelectItem><SelectItem value="credit">Credit</SelectItem></SelectContent></Select></Fld>
            </div>
          )}
        </FormSection>

        <FormSection icon={<ReceiptIcon className="h-4 w-4" />} title="Additional Charges" description="Fuel, tolls, loading or other expenses.">
          <div className="space-y-3">
            {charges.map((c, idx) => (
              <div key={c.id} className="rounded-xl border border-border bg-background p-4 group hover:border-primary/30 transition-smooth">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Charge #{idx + 1}</span>
                  <button type="button" onClick={() => setCharges(s => s.filter(x => x.id !== c.id))} className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Select value={c.type} onValueChange={(v) => setCharges(s => s.map(x => x.id === c.id ? { ...x, type: v } : x))}>
                    <SelectTrigger className="h-10 bg-card"><SelectValue placeholder="Expense type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Transport">Transport</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">LKR</span>
                    <Input type="number" placeholder="Amount" value={c.amount} onChange={(e) => setCharges(s => s.map(x => x.id === c.id ? { ...x, amount: e.target.value } : x))} className="pl-12 h-10 bg-card" />
                  </div>
                </div>
                <Input placeholder="Optional note..." value={c.comment} onChange={(e) => setCharges(s => s.map(x => x.id === c.id ? { ...x, comment: e.target.value } : x))} className="h-10 bg-card mt-3" />
                <label className="mt-3 flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
                  <Checkbox checked={c.addToInvoice} onCheckedChange={(v) => setCharges(s => s.map(x => x.id === c.id ? { ...x, addToInvoice: !!v } : x))} />
                  <span>Add to Invoice</span>
                  <span className="text-muted-foreground font-normal">— include this charge in the customer invoice</span>
                </label>
              </div>
            ))}
            <button type="button" onClick={() => setCharges(s => [...s, { id: Date.now() + "", type: "", amount: "", comment: "", addToInvoice: false }])} className="w-full rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary py-4 text-sm font-medium transition-smooth flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" /> Add Charge
            </button>
          </div>
        </FormSection>

        <FormSection icon={<FileText className="h-4 w-4" />} title="Comments">
          <Textarea placeholder="Notes about this stock entry..." className="bg-background" />
        </FormSection>
      </FormShell>

      {/* View Stock */}
      <FormShell
        open={!!viewStock}
        onOpenChange={(o) => !o && setViewStock(null)}
        title="Stock Details"
        subtitle={viewStock?.id}
        icon={<Boxes className="h-5 w-5" />}
        size="lg"
        footer={
          <div className="px-5 md:px-8 py-3 flex items-center justify-between gap-3">
            <Button variant="outline" className="text-destructive border-destructive/30" onClick={() => { setDelStock(viewStock); setViewStock(null); }}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setViewStock(null)}>Close</Button>
              <Button className="gradient-primary border-0 shadow-glow px-5" onClick={() => { setEditStock(viewStock); setViewStock(null); }}>Edit</Button>
            </div>
          </div>
        }
      >
        {viewStock && (
          <>
            <FormSection icon={<Boxes className="h-4 w-4" />} title="Stock Information">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {Object.entries(viewStock).map(([k, v]) => (
                  <div key={k}><p className="text-xs text-muted-foreground capitalize">{k}</p><p className="font-medium">{String(v)}</p></div>
                ))}
              </div>
            </FormSection>
            <FormSection icon={<Wallet className="h-4 w-4" />} title="Additional Charges">
              <div className="rounded-xl border border-border p-3 bg-background"><p className="text-sm">Loading + cleaning · LKR 4,500</p></div>
            </FormSection>
          </>
        )}
      </FormShell>

      {/* Edit Stock */}
      <FormShell
        open={!!editStock}
        onOpenChange={(o) => !o && setEditStock(null)}
        title="Edit Stock"
        icon={<Edit className="h-5 w-5" />}
        size="lg"
        footer={<FooterBtns onCancel={() => setEditStock(null)} onSave={() => { toast.success("Changes saved"); setEditStock(null); }} saveLabel="Save Changes" />}
      >
        <FormSection icon={<Boxes className="h-4 w-4" />} title="Stock Details" description="Editing form prefilled with existing values.">
          <div className="grid grid-cols-2 gap-4">
            <Fld label="Sand Type" full><Input className="h-11 bg-background" defaultValue={editStock?.sand} /></Fld>
            <Fld label="Quantity"><Input className="h-11 bg-background" defaultValue={editStock?.qty} /></Fld>
            <Fld label="Vehicle"><Input className="h-11 bg-background" defaultValue={editStock?.vehicle} /></Fld>
            <Fld label="Final Price"><Input className="h-11 bg-background" defaultValue={editStock?.finalPrice} /></Fld>
            <Fld label="Selling Price"><Input className="h-11 bg-background" defaultValue={editStock?.sellPrice} /></Fld>
          </div>
        </FormSection>
      </FormShell>

      <AlertDialog open={!!delStock} onOpenChange={(o) => !o && setDelStock(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete this stock?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => { toast.success("Deleted"); setDelStock(null); }}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Quality Check */}
      <FormShell
        open={!!qcOpen}
        onOpenChange={(o) => !o && setQcOpen(null)}
        title="Quality Check Status"
        icon={<BadgeCheck className="h-5 w-5" />}
        size="md"
        footer={<FooterBtns onCancel={() => setQcOpen(null)} onSave={() => { toast.success("Saved"); setQcOpen(null); }} saveLabel="Save" />}
      >
        <FormSection icon={<BadgeCheck className="h-4 w-4" />} title="Status">
          <RadioGroup defaultValue={qcOpen?.status === "Quality Checked" ? "ck" : "ip"} onValueChange={setQStatus} className="grid grid-cols-2 gap-3">
            {[{ v: "ip", l: "In Progress" }, { v: "ck", l: "Quality Checked" }].map(o => (
              <label key={o.v} className="flex items-center gap-2 rounded-xl border border-border bg-background p-3 cursor-pointer hover:bg-muted/30"><RadioGroupItem value={o.v} /> {o.l}</label>
            ))}
          </RadioGroup>
        </FormSection>
        {qStatus === "ck" && (
          <FormSection icon={<Wallet className="h-4 w-4" />} title="Result & Pricing">
            <div className="grid grid-cols-2 gap-4">
              <Fld label="Quality Result" full>
                <Select value={qResult} onValueChange={setQResult}><SelectTrigger className="h-11 bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="none">No Quality Difference</SelectItem><SelectItem value="dropped">Quality Dropped</SelectItem></SelectContent>
                </Select>
              </Fld>
              {qResult === "dropped" && <Fld label="Actual Order Quantity" full><Input className="h-11 bg-background" /></Fld>}
              <Fld label="Final Unit Price"><Input className="h-11 bg-background" /></Fld>
              <Fld label="Selling Unit Price"><Input className="h-11 bg-background" /></Fld>
              <Fld label="Payment Method" full><Select><SelectTrigger className="h-11 bg-background"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="bank">Bank Transfer</SelectItem></SelectContent></Select></Fld>
              <Fld label="Comments" full><Textarea className="bg-background" /></Fld>
            </div>
          </FormSection>
        )}
      </FormShell>

      {/* Set Alert */}
      <FormShell
        open={setAlertOpen}
        onOpenChange={setSetAlertOpen}
        title="Set Alert Level"
        icon={<Bell className="h-5 w-5" />}
        size="md"
        footer={<FooterBtns onCancel={() => setSetAlertOpen(false)} onSave={() => { toast.success("Alert set"); setSetAlertOpen(false); }} saveLabel="Save" />}
      >
        <FormSection icon={<Bell className="h-4 w-4" />} title="Alert Configuration">
          <div className="grid grid-cols-2 gap-4">
            <Fld label="Sand Type" full><Select><SelectTrigger className="h-11 bg-background"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="rs">River Sand – Soft</SelectItem></SelectContent></Select></Fld>
            <Fld label="Quantity Level"><Input className="h-11 bg-background" placeholder="500" /></Fld>
            <Fld label="Unit"><Select defaultValue="sqft"><SelectTrigger className="h-11 bg-background"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="sqft">sqft</SelectItem><SelectItem value="cube">cube</SelectItem></SelectContent></Select></Fld>
          </div>
        </FormSection>
      </FormShell>

      <FormShell
        open={!!editAlert}
        onOpenChange={(o) => !o && setEditAlert(null)}
        title="Edit Alert"
        icon={<Edit className="h-5 w-5" />}
        size="md"
        footer={<FooterBtns onCancel={() => setEditAlert(null)} onSave={() => { toast.success("Updated"); setEditAlert(null); }} saveLabel="Save Changes" />}
      >
        <FormSection icon={<Bell className="h-4 w-4" />} title="Alert Configuration">
          <div className="grid grid-cols-2 gap-4">
            <Fld label="Sand Type" full><Input className="h-11 bg-background" defaultValue={editAlert?.sand} /></Fld>
            <Fld label="Quantity Level"><Input className="h-11 bg-background" defaultValue={editAlert?.level} /></Fld>
            <Fld label="Unit"><Input className="h-11 bg-background" defaultValue={editAlert?.unit} /></Fld>
          </div>
        </FormSection>
      </FormShell>

      <AlertDialog open={!!delAlert} onOpenChange={(o) => !o && setDelAlert(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete alert?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => { toast.success("Deleted"); setDelAlert(null); }}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Record Payment */}
      <FormShell
        open={!!recordPay}
        onOpenChange={(o) => !o && setRecordPay(null)}
        title="Record Payment"
        icon={<Wallet className="h-5 w-5" />}
        size="md"
        footer={<FooterBtns onCancel={() => setRecordPay(null)} onSave={() => { toast.success("Payment recorded"); setRecordPay(null); }} saveLabel="Save" />}
      >
        {recordPay && (
          <>
            <FormSection icon={<Boxes className="h-4 w-4" />} title="Stock Summary">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-xs text-muted-foreground">Supplier</p><p className="font-medium">{recordPay.supplier}</p></div>
                <div><p className="text-xs text-muted-foreground">Stock ID</p><p className="font-mono">{recordPay.id}</p></div>
                <div><p className="text-xs text-muted-foreground">Sand</p><p>{recordPay.sand}</p></div>
                <div><p className="text-xs text-muted-foreground">Outstanding</p><p className="font-mono text-destructive">{recordPay.due?.toLocaleString()}</p></div>
              </div>
            </FormSection>
            <FormSection icon={<Wallet className="h-4 w-4" />} title="Payment">
              <div className="grid grid-cols-2 gap-4">
                <Fld label="Amount"><Input className="h-11 bg-background" /></Fld>
                <Fld label="Method"><Select><SelectTrigger className="h-11 bg-background"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="bank">Bank Transfer</SelectItem></SelectContent></Select></Fld>
                <Fld label="Comments" full><Textarea className="bg-background" /></Fld>
              </div>
            </FormSection>
          </>
        )}
      </FormShell>

      {/* View Payment */}
      <FormShell
        open={!!viewPay}
        onOpenChange={(o) => !o && setViewPay(null)}
        title="Payment Details"
        icon={<ReceiptIcon className="h-5 w-5" />}
        size="md"
        footer={
          <div className="px-5 md:px-8 py-3 flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setViewPay(null)}>Close</Button>
          </div>
        }
      >
        {viewPay && (
          <FormSection icon={<FileText className="h-4 w-4" />} title="Information">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {Object.entries(viewPay).map(([k, v]) => <div key={k}><p className="text-xs text-muted-foreground capitalize">{k}</p><p className="font-medium">{String(v)}</p></div>)}
            </div>
          </FormSection>
        )}
      </FormShell>
      <ExportReportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        moduleName={tab === "Set Alert" ? "Inventory - Set Alert" : "Inventory - Sand Stock"}
        columns={
          tab === "Set Alert"
            ? [
                { name: "Sand Type", filter: { kind: "multiSelect", options: ["River Sand – Soft", "River Sand – Coarse", "Sea Sand", "Quarry Dust", "M-Sand"], allLabel: "All Sand Types" } },
                { name: "Unit", filter: { kind: "multiSelect", options: ["sqft", "cube", "tonne"], allLabel: "All Units" } },
                { name: "Quantity Level", filter: { kind: "numberRange" } },
              ]
            : [
                { name: "Date Range", filter: { kind: "dateRange" } },
                { name: "Supplier", filter: { kind: "multiSelect", options: ["Riverside Mining", "Coastal Mines", "Quarry Co"], allLabel: "All Suppliers" } },
                { name: "Sand Type", filter: { kind: "multiSelect", options: ["River Sand – Soft", "River Sand – Coarse", "Sea Sand", "Quarry Dust", "M-Sand"], allLabel: "All Sand Types" } },
                { name: "Quantity", filter: { kind: "numberRange", unit: "sqft" } },
                { name: "Quality Status", filter: { kind: "multiSelect", options: ["Quality Checked", "In Progress"], allLabel: "All Statuses" } },
                { name: "Vehicle", filter: { kind: "multiSelect", options: ["GH-5423", "MD-0214", "WP-7891", "CAB-3344", "KP-9920"], allLabel: "All Vehicles" } },
                { name: "Driver", filter: { kind: "multiSelect", options: ["Driver A", "Driver B", "Driver C"], allLabel: "All Drivers" } },
                { name: "Payment Method", filter: { kind: "multiSelect", options: ["Cash", "Bank Transfer", "Cheque", "Credit", "Other"], allLabel: "All Payment Methods" } },
                { name: "Final Unit Price", filter: { kind: "numberRange", unit: "LKR" } },
                { name: "Selling Unit Price", filter: { kind: "numberRange", unit: "LKR" } },
                { name: "Additional Charges", filter: { kind: "numberRange", unit: "LKR" } },
              ]
        }
      />
      <DocumentsDialog
        open={!!docsStock}
        onOpenChange={(o) => !o && setDocsStock(null)}
        data={docsStock ? buildStockDoc(docsStock) : null}
      />
    </PageShell>
  );
};

export default Inventory;
