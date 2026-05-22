import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Truck, ShieldCheck, Printer, Download, X, CheckCircle2, QrCode, ClipboardCheck, Clock, Building2, LogOut } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type DocCharge = { description: string; amount: number; addToInvoice: boolean };

export type DocVehicle = {
  vehicleNo: string;
  capacity?: string;
  driverName?: string;
  driverPhone?: string;
  assignedQty?: string;
};

export type DocData = {
  source: "order" | "stock";
  refNo: string;            // OD_xxxx or ST_xxxx
  date: string;
  time?: string;
  party: { label: string; name: string; phone?: string; address?: string }; // customer or supplier
  product: string;          // sand type
  qty: string;              // "100 sqft"
  unitPrice: number;
  subtotal: number;
  discount?: number;
  charges: DocCharge[];
  vehicle?: string;         // legacy single vehicle (fallback)
  driver?: { name: string; phone?: string };
  vehicles?: DocVehicle[];  // multi-vehicle (preferred)
  paymentMethod?: string;
  paymentStatus?: string;
  deliveryDate?: string;
};

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  data: DocData | null;
  initialStage?: "select" | "preview";
  initialSelection?: { invoice?: boolean; delivery?: boolean; gatepass?: boolean };
}

const COMPANY = { name: "Madu Enterprises", addr: "No. 25, Colombo Rd, Kaduwela", phone: "+94 11 234 5678" };
const fmt = (n: number) => "LKR " + Math.round(n).toLocaleString();
const mockUser = "Nuwan P. (Cashier)";
const mockSecUser = "S. Bandara (Security)";

type GpStatus = "Pending" | "Ready for Dispatch" | "Dispatched" | "Verified by Security" | "Completed";
const GP_STATUSES: GpStatus[] = ["Pending", "Ready for Dispatch", "Dispatched", "Verified by Security", "Completed"];

const gpStatusClass = (s: GpStatus) =>
  s === "Completed" ? "bg-success/15 text-success border-success/30"
    : s === "Verified by Security" ? "bg-info/15 text-info border-info/30"
    : s === "Dispatched" ? "bg-primary/15 text-primary border-primary/30"
    : s === "Ready for Dispatch" ? "bg-warning/15 text-warning border-warning/30"
    : "bg-muted text-muted-foreground border-border";

export function DocumentsDialog({ open, onOpenChange, data, initialStage = "select", initialSelection }: Props) {
  // Stage 1: selection. Stage 2: preview.
  const [stage, setStage] = useState<"select" | "preview">(initialStage);
  const [sel, setSel] = useState({
    invoice: initialSelection?.invoice ?? true,
    delivery: initialSelection?.delivery ?? false,
    gatepass: initialSelection?.gatepass ?? false,
  });
  const [gpStatusMap, setGpStatusMap] = useState<Record<string, GpStatus>>({});
  const [securityOpen, setSecurityOpen] = useState<string | null>(null);
  const [secMap, setSecMap] = useState<Record<string, { user: string; time: string }>>({});
  const [releaseMap, setReleaseMap] = useState<Record<string, { guard: string; time: string }>>({});
  const [releaseForm, setReleaseForm] = useState<Record<string, { guard: string; time: string }>>({});
  const [activeGpTab, setActiveGpTab] = useState<string>("0");

  // Re-sync when dialog (re)opens with new initial props
  useEffect(() => {
    if (open) {
      setStage(initialStage);
      setSel({
        invoice: initialSelection?.invoice ?? true,
        delivery: initialSelection?.delivery ?? false,
        gatepass: initialSelection?.gatepass ?? false,
      });
      setActiveGpTab("0");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);


  // approval state
  const [approvedBy, setApprovedBy] = useState("");
  const [approvedDate, setApprovedDate] = useState(new Date().toISOString().slice(0, 10));

  // issued / received (delivery note)
  const [issuedBy, setIssuedBy] = useState("");
  const [receivedBy, setReceivedBy] = useState("");
  const [receivedQty, setReceivedQty] = useState("");

  const invoiceNo = useMemo(() => "INV-" + (data?.refNo?.replace(/[^0-9]/g, "") || "00000"), [data]);
  const dnNo = useMemo(() => "DN-" + (data?.refNo?.replace(/[^0-9]/g, "") || "00000"), [data]);
  const gpNo = useMemo(() => "GP-" + (data?.refNo?.replace(/[^0-9]/g, "") || "00000"), [data]);
  const generatedAt = useMemo(() => new Date().toLocaleString(), [stage]);

  if (!data) return null;

  const invoiceChargeLines = data.charges.filter((c) => c.addToInvoice);
  const allChargesTotal = data.charges.reduce((s, c) => s + (c.amount || 0), 0);
  const invoiceChargesTotal = invoiceChargeLines.reduce((s, c) => s + (c.amount || 0), 0);
  const finalTotal = Math.max(0, data.subtotal - (data.discount || 0)) + allChargesTotal;
  const invoiceTotal = Math.max(0, data.subtotal - (data.discount || 0)) + invoiceChargesTotal;

  const reset = () => {
    setStage(initialStage);
    setSel({
      invoice: initialSelection?.invoice ?? true,
      delivery: initialSelection?.delivery ?? false,
      gatepass: initialSelection?.gatepass ?? false,
    });
    setGpStatusMap({});
    setSecMap({});
    setReleaseMap({});
    setReleaseForm({});
  };

  const close = () => { onOpenChange(false); setTimeout(reset, 200); };

  const generate = () => {
    if (!sel.invoice && !sel.delivery && !sel.gatepass) {
      toast.error("Select at least one document");
      return;
    }
    setStage("preview");
  };

  const handlePrint = () => window.print();
  const handlePdf = () => toast.success("PDF export ready (mock)");

  // ---------- Renderers ----------
  const Header = ({ docTitle, docNo }: { docTitle: string; docNo: string }) => (
    <div className="flex items-start justify-between border-b border-border pb-4 mb-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground">
          <Building2 className="h-6 w-6" />
        </div>
        <div>
          <p className="font-display font-bold text-xl leading-tight">{COMPANY.name}</p>
          <p className="text-[11px] text-muted-foreground">{COMPANY.addr}</p>
          <p className="text-[11px] text-muted-foreground">{COMPANY.phone}</p>
        </div>
      </div>
      <div className="text-right text-xs">
        <p className="font-display font-bold text-lg text-primary uppercase tracking-wide">{docTitle}</p>
        <p className="text-muted-foreground mt-1">No.</p>
        <p className="font-mono font-semibold">{docNo}</p>
        <p className="text-muted-foreground mt-1">Date</p>
        <p>{data.date}{data.time ? ` · ${data.time}` : ""}</p>
      </div>
    </div>
  );

  const AuditFooter = ({ extra }: { extra?: React.ReactNode }) => (
    <div className="mt-6 pt-3 border-t border-border/60 grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
      <span>Generated by: <span className="font-medium text-foreground">{mockUser}</span></span>
      <span className="text-right">Generated at: <span className="font-mono text-foreground">{generatedAt}</span></span>
      {extra}
      <span className="col-span-2 text-center pt-2 text-[10px] text-muted-foreground/80 italic">Generated by Cita ERP</span>
    </div>
  );

  const InvoiceBlock = (
    <div className="rounded-xl border border-border bg-card p-6 shadow-soft print:border-0 print:shadow-none">
      <Header docTitle="Invoice" docNo={invoiceNo} />
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{data.party.label}</p>
          <p className="font-semibold">{data.party.name}</p>
          {data.party.phone && <p className="text-xs">{data.party.phone}</p>}
          {data.party.address && <p className="text-xs">{data.party.address}</p>}
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Reference</p>
          <p className="font-mono font-semibold">{data.refNo}</p>
          {data.vehicle && <><p className="text-[11px] uppercase tracking-wider text-muted-foreground mt-1">Vehicle</p><p className="font-mono text-xs">{data.vehicle}</p></>}
        </div>
      </div>
      <table className="w-full text-sm">
        <thead className="bg-muted/40">
          <tr>{["Item", "Qty", "Unit Price", "Total"].map(h => <th key={h} className="px-3 py-2 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody>
          <tr className="border-b border-border">
            <td className="px-3 py-2.5">{data.product}</td>
            <td className="px-3 py-2.5">{data.qty}</td>
            <td className="px-3 py-2.5 font-mono">{data.unitPrice.toLocaleString()}</td>
            <td className="px-3 py-2.5 font-mono font-semibold">{fmt(data.subtotal)}</td>
          </tr>
          {invoiceChargeLines.map((c, i) => (
            <tr key={i} className="border-b border-border">
              <td className="px-3 py-2.5 italic text-muted-foreground">{c.description || `Additional Charge ${i + 1}`}</td>
              <td className="px-3 py-2.5">—</td>
              <td className="px-3 py-2.5">—</td>
              <td className="px-3 py-2.5 font-mono">{fmt(c.amount)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-end">
        <div className="w-64 text-sm space-y-1">
          <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span className="font-mono">{fmt(data.subtotal)}</span></div>
          {data.discount ? <div className="flex justify-between text-muted-foreground"><span>Discount</span><span className="font-mono">−{fmt(data.discount)}</span></div> : null}
          {invoiceChargeLines.length > 0 && <div className="flex justify-between text-muted-foreground"><span>Charges</span><span className="font-mono">+{fmt(invoiceChargesTotal)}</span></div>}
          <div className="flex justify-between font-display font-bold text-base border-t border-border pt-2"><span>Invoice Total</span><span className="font-mono text-primary">{fmt(invoiceTotal)}</span></div>
          {invoiceTotal !== finalTotal && (
            <p className="text-[10px] text-muted-foreground italic pt-1">Note: Bill total (incl. internal charges): {fmt(finalTotal)}</p>
          )}
        </div>
      </div>

      {/* Approval */}
      <div className="mt-6 rounded-lg border border-border bg-muted/20 p-4">
        <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">Invoice Approval</p>
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Approved By</Label>
            <Input value={approvedBy} onChange={(e) => setApprovedBy(e.target.value)} placeholder="Name" className="h-9 mt-1 bg-background" />
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Signature</Label>
            <div className="h-9 mt-1 rounded-md border border-dashed border-border bg-background flex items-center justify-center text-[10px] text-muted-foreground italic">Sign here</div>
          </div>
          <div>
            <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Date</Label>
            <Input type="date" value={approvedDate} onChange={(e) => setApprovedDate(e.target.value)} className="h-9 mt-1 bg-background" />
          </div>
        </div>
      </div>
      <AuditFooter />
    </div>
  );

  const DeliveryBlock = (
    <div className="rounded-xl border border-border bg-card p-6 shadow-soft print:border-0 print:shadow-none">
      <Header docTitle="Delivery Note" docNo={dnNo} />
      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{data.party.label}</p>
          <p className="font-semibold">{data.party.name}</p>
          {data.party.phone && <p className="text-xs">{data.party.phone}</p>}
          {data.party.address && <p className="text-xs">{data.party.address}</p>}
        </div>
        <div className="text-right text-xs space-y-0.5">
          <p className="text-muted-foreground">Order No</p>
          <p className="font-mono font-semibold">{data.refNo}</p>
          {data.deliveryDate && <><p className="text-muted-foreground mt-1">Delivery Date</p><p>{data.deliveryDate}</p></>}
        </div>
      </div>

      <table className="w-full text-sm mb-4">
        <thead className="bg-muted/40">
          <tr>{["Product", "Quantity", "Price", "Payment Type", "Payment Status"].map(h => <th key={h} className="px-3 py-2 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody>
          <tr className="border-b border-border">
            <td className="px-3 py-2.5">{data.product}</td>
            <td className="px-3 py-2.5">{data.qty}</td>
            <td className="px-3 py-2.5 font-mono">{fmt(data.subtotal)}</td>
            <td className="px-3 py-2.5">{data.paymentMethod || "—"}</td>
            <td className="px-3 py-2.5">
              <Badge variant="outline" className={cn("text-[10px]", data.paymentStatus === "Paid" ? "border-success/40 text-success" : "border-warning/40 text-warning")}>
                {data.paymentStatus || "Pending"}
              </Badge>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="grid grid-cols-2 gap-4 text-xs mb-4">
        <div className="rounded-lg border border-border p-3 bg-muted/20">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Vehicle Details</p>
          <p className="font-mono font-semibold mt-1">{data.vehicle || "—"}</p>
          {data.driver && <p className="text-[11px] text-muted-foreground">Driver: {data.driver.name} {data.driver.phone ? `· ${data.driver.phone}` : ""}</p>}
        </div>
        <div className="rounded-lg border border-border p-3 bg-muted/20">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Delivery Date</p>
          <p className="font-semibold mt-1">{data.deliveryDate || data.date}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="rounded-lg border border-border p-4">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">Issued By</p>
          <div className="space-y-2 text-xs">
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Name</Label>
              <Input value={issuedBy} onChange={(e) => setIssuedBy(e.target.value)} className="h-9 mt-1 bg-background" placeholder="Issuer name" />
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Signature</Label>
              <div className="h-9 mt-1 rounded-md border border-dashed border-border bg-background flex items-center justify-center text-[10px] text-muted-foreground italic">Sign here</div>
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Date</Label>
              <Input type="date" defaultValue={new Date().toISOString().slice(0,10)} className="h-9 mt-1 bg-background" />
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">Received By</p>
          <div className="space-y-2 text-xs">
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Name</Label>
              <Input value={receivedBy} onChange={(e) => setReceivedBy(e.target.value)} className="h-9 mt-1 bg-background" placeholder="Receiver name" />
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Signature</Label>
              <div className="h-9 mt-1 rounded-md border border-dashed border-border bg-background flex items-center justify-center text-[10px] text-muted-foreground italic">Sign here</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Date</Label>
                <Input type="date" defaultValue={new Date().toISOString().slice(0,10)} className="h-9 mt-1 bg-background" />
              </div>
              <div>
                <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Qty Received</Label>
                <Input value={receivedQty} onChange={(e) => setReceivedQty(e.target.value)} className="h-9 mt-1 bg-background" placeholder={data.qty} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <AuditFooter />
    </div>
  );

  const vehicleList: DocVehicle[] = (data.vehicles && data.vehicles.length > 0)
    ? data.vehicles
    : [{ vehicleNo: data.vehicle || "—", driverName: data.driver?.name, driverPhone: data.driver?.phone, assignedQty: data.qty }];

  const renderGatePass = (v: DocVehicle, idx: number) => {
    const key = v.vehicleNo + ":" + idx;
    const vGpNo = vehicleList.length > 1 ? `${gpNo}-${idx + 1}` : gpNo;
    const status = gpStatusMap[key] || "Pending";
    const sec = secMap[key];
    return (
      <div key={key} className="rounded-xl border border-border bg-card p-6 shadow-soft print:border-0 print:shadow-none print:break-inside-avoid">
        <Header docTitle={`Gate Pass${vehicleList.length > 1 ? ` (${idx + 1} of ${vehicleList.length})` : ""}`} docNo={vGpNo} />
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="grid grid-cols-2 gap-3 text-sm flex-1">
            <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Vehicle Number</p><p className="font-mono font-semibold">{v.vehicleNo || "—"}</p></div>
            <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Vehicle Capacity</p><p className="font-medium">{v.capacity || "—"}</p></div>
            <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Driver Name</p><p className="font-medium">{v.driverName || "—"}</p></div>
            <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Driver Contact</p><p className="font-mono text-xs">{v.driverPhone || "—"}</p></div>
            <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Assigned Quantity</p><p className="font-medium">{v.assignedQty || v.capacity || data.qty}</p></div>
            <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Product</p><p className="font-medium">{data.product}</p></div>
            <div><p className="text-[10px] uppercase tracking-wider text-muted-foreground">Dispatch Time</p><p className="font-mono text-xs">{data.date}{data.time ? ` · ${data.time}` : ""}</p></div>
            
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="h-24 w-24 rounded-lg border-2 border-border bg-background flex items-center justify-center">
              <QrCode className="h-16 w-16 text-foreground/80" />
            </div>
            <p className="text-[9px] text-muted-foreground font-mono">{vGpNo}</p>
          </div>
        </div>


        {/* Gate Security Manual Release */}
        <div className="mt-4 rounded-lg border border-primary/30 bg-primary/5 p-4 print:border-border print:bg-transparent">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-primary flex items-center gap-1.5">
              <LogOut className="h-3.5 w-3.5" /> Gate Security — Manual Release
            </p>
            {releaseMap[key] && (
              <Badge variant="outline" className="text-[10px] border-success/40 text-success bg-success/10">
                <CheckCircle2 className="h-3 w-3 mr-1" /> Released
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Security Guard Name</Label>
              <Input
                value={releaseMap[key]?.guard ?? releaseForm[key]?.guard ?? ""}
                onChange={(e) => setReleaseForm((m) => ({ ...m, [key]: { ...(m[key] || { guard: "", time: "" }), guard: e.target.value } }))}
                disabled={!!releaseMap[key]}
                placeholder="Guard name"
                className="h-9 mt-1 bg-background"
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Time at Gate</Label>
              <Input
                type="time"
                value={releaseMap[key]?.time ?? releaseForm[key]?.time ?? ""}
                onChange={(e) => setReleaseForm((m) => ({ ...m, [key]: { ...(m[key] || { guard: "", time: "" }), time: e.target.value } }))}
                disabled={!!releaseMap[key]}
                className="h-9 mt-1 bg-background"
              />
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Vehicle No</Label>
              <Input value={v.vehicleNo || "—"} disabled className="h-9 mt-1 bg-background font-mono" />
            </div>
            <div>
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Driver Name</Label>
              <Input value={v.driverName || "—"} disabled className="h-9 mt-1 bg-background" />
            </div>
            <div className="col-span-2">
              <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">Signature</Label>
              <div className="h-12 mt-1 rounded-md border border-dashed border-border bg-background flex items-center justify-center text-[10px] text-muted-foreground italic">
                {releaseMap[key] ? `Signed — ${releaseMap[key].guard}` : "Sign here"}
              </div>
            </div>
          </div>
        </div>

        <AuditFooter extra={sec ? (
          <>
            <span>Dispatch confirmed: <span className="font-medium text-foreground">{mockUser}</span></span>
            <span className="text-right">Security confirmed: <span className="font-medium text-foreground">{sec.user}</span></span>
          </>
        ) : undefined} />
      </div>
    );
  };


  const activeSecKey = securityOpen;
  const activeSecVehicle = activeSecKey ? vehicleList.find((vv, i) => vv.vehicleNo + ":" + i === activeSecKey) : null;
  const activeSecVehicleIdx = activeSecKey ? vehicleList.findIndex((vv, i) => vv.vehicleNo + ":" + i === activeSecKey) : -1;
  const activeSecGpNo = activeSecVehicleIdx >= 0 ? (vehicleList.length > 1 ? `${gpNo}-${activeSecVehicleIdx + 1}` : gpNo) : gpNo;

  // ---------- Combined Layout ----------
  const combined = sel.invoice && sel.delivery;

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => { if (!o) close(); else onOpenChange(true); }}>
        <DialogContent className={cn("max-h-[92vh] overflow-y-auto", stage === "preview" ? "max-w-4xl" : "max-w-md")}>
          {stage === "select" ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Generate Documents?</DialogTitle>
              </DialogHeader>
              <p className="text-sm text-muted-foreground">Select the documents you want to generate for <span className="font-mono font-semibold text-foreground">{data.refNo}</span>.</p>
              <div className="space-y-2 mt-2">
                {[
                  { key: "invoice", icon: FileText, label: "Invoice", desc: "Billing document with charges & approval" },
                  { key: "delivery", icon: Truck, label: "Delivery Note", desc: "Issued/received signatures & quantity" },
                  { key: "gatepass", icon: ShieldCheck, label: "Gate Pass", desc: "Vehicle dispatch & security verification" },
                ].map((opt) => {
                  const checked = (sel as any)[opt.key] as boolean;
                  const Icon = opt.icon;
                  return (
                    <label key={opt.key} className={cn(
                      "flex items-center gap-3 rounded-xl border-2 p-3 cursor-pointer transition-smooth",
                      checked ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/30"
                    )}>
                      <Checkbox checked={checked} onCheckedChange={(v) => setSel((s) => ({ ...s, [opt.key]: !!v }))} />
                      <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{opt.label}</p>
                        <p className="text-[11px] text-muted-foreground">{opt.desc}</p>
                      </div>
                    </label>
                  );
                })}
              </div>
              <DialogFooter className="gap-2">
                <Button variant="ghost" onClick={close}>Cancel</Button>
                <Button variant="outline" onClick={() => { toast.message("Skipped"); close(); }}>Skip</Button>
                <Button className="gradient-primary border-0 gap-1.5" onClick={generate}>
                  <FileText className="h-4 w-4" /> Generate Selected
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Document Preview
                  <span className="text-xs font-mono font-normal text-muted-foreground ml-2">{data.refNo}</span>
                </DialogTitle>
              </DialogHeader>

              <div id="docs-print-area" className="space-y-5 print:space-y-0">
                {combined ? (
                  <div className="rounded-2xl border border-border bg-muted/20 p-3 print:p-0 print:border-0 print:bg-transparent">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2 px-1 print:hidden">Combined: Invoice + Delivery Note</p>
                    {InvoiceBlock}
                    <div className="my-4 flex items-center gap-3">
                      <div className="flex-1 border-t-2 border-dashed border-border" />
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Cut here</span>
                      <div className="flex-1 border-t-2 border-dashed border-border" />
                    </div>
                    {DeliveryBlock}
                  </div>
                ) : (
                  <>
                    {sel.invoice && InvoiceBlock}
                    {sel.delivery && DeliveryBlock}
                  </>
                )}
                {sel.gatepass && (
                  <div className="space-y-3">
                    {vehicleList.length > 1 ? (
                      <Tabs value={activeGpTab} onValueChange={setActiveGpTab} className="w-full print:hidden">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                            {vehicleList.length} Gate Passes — one per vehicle
                          </p>
                          <TabsList>
                            {vehicleList.map((v, i) => (
                              <TabsTrigger key={i} value={String(i)} className="text-xs gap-1.5">
                                <Truck className="h-3 w-3" /> {v.vehicleNo || `#${i + 1}`}
                              </TabsTrigger>
                            ))}
                          </TabsList>
                        </div>
                        {vehicleList.map((v, i) => (
                          <TabsContent key={i} value={String(i)} className="mt-3">
                            {renderGatePass(v, i)}
                          </TabsContent>
                        ))}
                      </Tabs>
                    ) : (
                      renderGatePass(vehicleList[0], 0)
                    )}
                    {/* Print-only: show all gate passes stacked */}
                    {vehicleList.length > 1 && (
                      <div className="hidden print:block space-y-4">
                        {vehicleList.map((v, i) => renderGatePass(v, i))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2 print:hidden">
                <Button variant="ghost" onClick={close}><X className="h-4 w-4 mr-1" /> Close</Button>
                <Button variant="outline" onClick={handlePrint} className="gap-1.5"><Printer className="h-4 w-4" /> Print</Button>
                <Button className="gradient-primary border-0 gap-1.5" onClick={handlePdf}><Download className="h-4 w-4" /> Export PDF</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Security Verification */}
      <Dialog open={!!activeSecKey} onOpenChange={(o) => { if (!o) setSecurityOpen(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> Security Verification</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">Verify each item before allowing vehicle to exit.</p>
          <div className="space-y-2 mt-1">
            {[
              `Verify Gate Pass Number — ${activeSecGpNo}`,
              `Verify Vehicle Number — ${activeSecVehicle?.vehicleNo || "—"}`,
              `Verify Driver Details — ${activeSecVehicle?.driverName || "—"}`,
              `Verify Assigned Quantity — ${activeSecVehicle?.assignedQty || data.qty}`,
              `Confirm dispatched products — ${data.product}`,
              "Confirm Gate Pass Validated",
              "Confirm Vehicle Exited",
            ].map((label, i) => (
              <label key={i} className="flex items-start gap-2 rounded-lg border border-border bg-background p-2.5 cursor-pointer hover:bg-muted/30">
                <Checkbox defaultChecked={false} />
                <span className="text-xs">{label}</span>
              </label>
            ))}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setSecurityOpen(null)}>Cancel</Button>
            <Button className="gradient-primary border-0 gap-1.5" onClick={() => {
              if (!activeSecKey) return;
              const t = new Date().toLocaleString();
              setSecMap((m) => ({ ...m, [activeSecKey]: { user: mockSecUser, time: t } }));
              setGpStatusMap((m) => ({ ...m, [activeSecKey]: "Verified by Security" }));
              setSecurityOpen(null);
              toast.success("Gate Pass verified", { description: `Confirmed by ${mockSecUser} at ${t}` });
            }}>
              <ClipboardCheck className="h-4 w-4" /> Confirm Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
