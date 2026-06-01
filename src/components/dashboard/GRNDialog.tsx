import { useMemo } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2, Printer, Download, X, FileText } from "lucide-react";
import { toast } from "sonner";

const COMPANY = { name: "Madu Enterprises", addr: "No. 25, Colombo Rd, Kaduwela", phone: "+94 11 234 5678" };

export type GRNVehicle = {
  vehicleNo: string;
  driverName?: string;
  driverPhone?: string;
};

export type GRNData = {
  stockId: string;
  date: string;
  supplier: string;
  supplierPhone?: string;
  sandType: string;
  orderedQty: string;
  actualQty?: string;          // if quality dropped
  vehicles: GRNVehicle[];
  supplierUnitPrice: number;
  finalUnitPrice: number;
  totalAmount: number;
  qualityStatus: string;
  qualityResult?: string;
  comments?: string;
};

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  data: GRNData | null;
}

const fmt = (n: number) => "LKR " + Math.round(n).toLocaleString();

export function GRNDialog({ open, onOpenChange, data }: Props) {
  const grnNo = useMemo(
    () => "GRN-" + (data?.stockId?.replace(/[^0-9]/g, "") || "00000"),
    [data]
  );
  const generatedAt = useMemo(() => new Date().toLocaleString(), [open]);
  if (!data) return null;

  const SigBlock = ({ label }: { label: string }) => (
    <div className="rounded-lg border border-border p-3">
      <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">{label}</p>
      <div className="space-y-2 text-xs">
        <div>
          <p className="text-[9px] uppercase text-muted-foreground">Name</p>
          <div className="h-7 border-b border-border" />
        </div>
        <div>
          <p className="text-[9px] uppercase text-muted-foreground">Signature</p>
          <div className="h-9 border-b border-dashed border-border" />
        </div>
        <div>
          <p className="text-[9px] uppercase text-muted-foreground">Date</p>
          <div className="h-7 border-b border-border" />
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Goods Received Note
            <span className="text-xs font-mono font-normal text-muted-foreground ml-2">{data.stockId}</span>
          </DialogTitle>
        </DialogHeader>

        <div id="grn-print-area" className="rounded-xl border border-border bg-card p-6 shadow-soft print:border-0 print:shadow-none">
          {/* Header */}
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
              <p className="font-display font-bold text-lg text-primary uppercase tracking-wide">Goods Received Note</p>
              <p className="text-muted-foreground mt-1">GRN No.</p>
              <p className="font-mono font-semibold">{grnNo}</p>
              <p className="text-muted-foreground mt-1">Date</p>
              <p>{data.date}</p>
            </div>
          </div>

          {/* Supplier */}
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Supplier</p>
              <p className="font-semibold">{data.supplier}</p>
              {data.supplierPhone && <p className="text-xs">{data.supplierPhone}</p>}
            </div>
            <div className="text-right text-xs space-y-0.5">
              <p className="text-muted-foreground">Stock ID</p>
              <p className="font-mono font-semibold">{data.stockId}</p>
            </div>
          </div>

          {/* Material */}
          <table className="w-full text-sm mb-4">
            <thead className="bg-muted/40">
              <tr>
                {["Sand Type", "Ordered Qty", "Actual Qty", "Supplier Unit Price", "Final Unit Price", "Total Amount"].map(h => (
                  <th key={h} className="px-3 py-2 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="px-3 py-2.5">{data.sandType}</td>
                <td className="px-3 py-2.5 font-mono">{data.orderedQty}</td>
                <td className="px-3 py-2.5 font-mono">{data.actualQty || data.orderedQty}</td>
                <td className="px-3 py-2.5 font-mono">{data.supplierUnitPrice.toLocaleString()}</td>
                <td className="px-3 py-2.5 font-mono">{data.finalUnitPrice.toLocaleString()}</td>
                <td className="px-3 py-2.5 font-mono font-semibold">{fmt(data.totalAmount)}</td>
              </tr>
            </tbody>
          </table>

          {/* Vehicles */}
          <div className="mb-4">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">Vehicle & Driver</p>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/40">
                  <tr>{["Vehicle No", "Driver", "Driver Contact"].map(h => <th key={h} className="px-3 py-2 text-left text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {(data.vehicles && data.vehicles.length > 0 ? data.vehicles : [{ vehicleNo: "—" }]).map((v, i) => (
                    <tr key={i} className="border-t border-border/60">
                      <td className="px-3 py-2 font-mono text-xs">{v.vehicleNo || "—"}</td>
                      <td className="px-3 py-2">{v.driverName || "—"}</td>
                      <td className="px-3 py-2 font-mono text-xs">{v.driverPhone || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quality + Comments */}
          <div className="grid grid-cols-2 gap-4 text-xs mb-5">
            <div className="rounded-lg border border-border p-3 bg-muted/20">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Quality Status</p>
              <p className="font-semibold mt-1">{data.qualityStatus}</p>
              {data.qualityResult && <>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-2">Quality Result</p>
                <p className="mt-1">{data.qualityResult}</p>
              </>}
            </div>
            <div className="rounded-lg border border-border p-3 bg-muted/20">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Comments</p>
              <p className="mt-1 whitespace-pre-wrap">{data.comments || "—"}</p>
            </div>
          </div>

          {/* Signatures */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <SigBlock label="Prepared By" />
            <SigBlock label="Checked By" />
            <SigBlock label="Supplier Receiver" />
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-border/60 grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
            <span>GRN No: <span className="font-mono text-foreground">{grnNo}</span></span>
            <span className="text-right">Generated at: <span className="font-mono text-foreground">{generatedAt}</span></span>
            <span className="col-span-2 text-center pt-2 text-[10px] text-muted-foreground/80 italic">Generated by Cita ERP</span>
          </div>
        </div>

        <DialogFooter className="gap-2 print:hidden">
          <Button variant="ghost" onClick={() => onOpenChange(false)}><X className="h-4 w-4 mr-1" /> Close</Button>
          <Button variant="outline" onClick={() => window.print()} className="gap-1.5"><Printer className="h-4 w-4" /> Print</Button>
          <Button className="gradient-primary border-0 gap-1.5" onClick={() => toast.success("PDF export ready (mock)")}><Download className="h-4 w-4" /> Export PDF</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
