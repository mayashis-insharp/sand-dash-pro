import { Eye, FileText, Edit, MoreHorizontal, Truck, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type DocKind = "invoice" | "delivery" | "gatepass";

export interface OrderVehicle {
  vehicleNo: string;
  capacity?: string;
  driverName?: string;
  driverPhone?: string;
}

export interface Order {
  id: string;
  date: string;
  type: "Retail" | "Corporate";
  sandType: string;
  customer: { name: string; phone: string };
  address: string;
  vehicle: string;
  qty: string;
  total: number;
  due?: number;
  balance?: number;
  payment: "Credit" | "Cash" | "Pending";
  vehicles?: OrderVehicle[];
  generated?: { invoice?: boolean; delivery?: boolean; gatepass?: boolean };
}

const fmt = (n: number) => n.toLocaleString();

const typeStyles: Record<Order["type"], string> = {
  Retail: "bg-info/10 text-info border-info/20",
  Corporate: "bg-primary/10 text-primary border-primary/20",
};

const payStyles: Record<Order["payment"], string> = {
  Credit: "text-warning",
  Cash: "text-success",
  Pending: "text-destructive",
};

interface Props {
  orders: Order[];
  onView?: (o: Order) => void;
  onEdit?: (o: Order) => void;
  onInvoice?: (o: Order) => void;
  onDoc?: (o: Order, kind: DocKind) => void;
}

export function OrdersTable({ orders, onView, onEdit, onDoc }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              {["Order ID", "Date", "Type", "Sand Type", "Customer", "Delivery", "Vehicle", "Qty", "Payment Summary", "Method", "Actions"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o, i) => (
              <tr key={o.id} className={cn("border-b border-border/60 last:border-0 hover:bg-muted/30 transition-smooth", i % 2 === 1 && "bg-muted/[0.15]")}>
                <td className="px-4 py-4 font-mono text-xs font-semibold text-foreground">{o.id}</td>
                <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">{o.date}</td>
                <td className="px-4 py-4">
                  <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium", typeStyles[o.type])}>
                    {o.type}
                  </span>
                </td>
                <td className="px-4 py-4 text-foreground whitespace-nowrap">{o.sandType}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{o.customer.name}</span>
                    <span className="text-xs text-muted-foreground">{o.customer.phone}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-muted-foreground">{o.address}</td>
                <td className="px-4 py-4 font-mono text-xs">
                  {o.vehicles && o.vehicles.length > 1 ? `${o.vehicles.length} vehicles` : o.vehicle}
                </td>
                <td className="px-4 py-4 font-medium">{o.qty}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-col text-xs">
                    <span className="text-foreground"><span className="text-muted-foreground">Total:</span> {fmt(o.total)}</span>
                    {o.due !== undefined && <span className="text-destructive"><span className="text-muted-foreground">Due:</span> {fmt(o.due)}</span>}
                    {o.balance !== undefined && <span className="text-success"><span className="text-muted-foreground">Bal:</span> {fmt(o.balance)}</span>}
                  </div>
                </td>
                <td className={cn("px-4 py-4 font-semibold", payStyles[o.payment])}>{o.payment}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <button onClick={() => onView?.(o)} aria-label="View" title="View" className="inline-flex items-center justify-center h-7 w-7 rounded-md text-foreground hover:bg-muted transition-smooth">
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => onEdit?.(o)} aria-label="Edit" title="Edit" className="inline-flex items-center justify-center h-7 w-7 rounded-md text-foreground hover:bg-muted transition-smooth">
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-smooth" aria-label="More actions">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">Documents</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onDoc?.(o, "invoice")} className="gap-2 text-xs">
                          <FileText className="h-3.5 w-3.5 text-info" /> Invoice
                          {o.generated?.invoice && <Badge variant="outline" className="ml-auto text-[9px] border-success/40 text-success">Ready</Badge>}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDoc?.(o, "delivery")} className="gap-2 text-xs">
                          <Truck className="h-3.5 w-3.5 text-primary" /> Delivery Note
                          {o.generated?.delivery && <Badge variant="outline" className="ml-auto text-[9px] border-success/40 text-success">Ready</Badge>}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDoc?.(o, "gatepass")} className="gap-2 text-xs">
                          <ShieldCheck className="h-3.5 w-3.5 text-warning" /> Gate Passes
                          {o.generated?.gatepass && <Badge variant="outline" className="ml-auto text-[9px] border-success/40 text-success">Ready</Badge>}
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
  );
}
