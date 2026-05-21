import { Eye, FileText, MoreHorizontal, Phone, MapPin, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Order } from "./OrdersTable";

const fmt = (n: number) => n.toLocaleString();

const typeStyles: Record<Order["type"], string> = {
  Retail: "bg-info/10 text-info border-info/20",
  Corporate: "bg-primary/10 text-primary border-primary/20",
};

const payStyles: Record<Order["payment"], string> = {
  Credit: "bg-warning/10 text-warning border-warning/20",
  Cash: "bg-success/10 text-success border-success/20",
  Pending: "bg-destructive/10 text-destructive border-destructive/20",
};

export function OrdersCards({ orders, onView, onInvoice }: { orders: Order[]; onView?: (o: Order) => void; onInvoice?: (o: Order) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {orders.map((o) => (
        <div
          key={o.id}
          className="group rounded-2xl border border-border bg-card shadow-soft hover:shadow-elevated transition-smooth p-5 flex flex-col gap-4"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-foreground">{o.id}</span>
                <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-medium", typeStyles[o.type])}>
                  {o.type}
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{o.date}</p>
            </div>
            <button className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted transition-smooth">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>

          {/* Customer */}
          <div className="border-t border-border/60 pt-3">
            <p className="font-semibold text-foreground">{o.customer.name}</p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="h-3 w-3" /> {o.customer.phone}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" /> {o.address}
            </p>
          </div>

          {/* Sand + vehicle */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Sand</p>
              <p className="mt-0.5 text-foreground">{o.sandType}</p>
              <p className="text-muted-foreground">{o.qty}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Vehicle</p>
              <p className="mt-0.5 flex items-center gap-1 font-mono text-foreground">
                <Truck className="h-3 w-3 text-muted-foreground" /> {o.vehicle}
              </p>
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-xl bg-muted/40 px-3 py-2.5 flex items-center justify-between">
            <div className="text-xs">
              <p className="text-muted-foreground">Total</p>
              <p className="font-semibold text-foreground">{fmt(o.total)}</p>
            </div>
            {o.due !== undefined && (
              <div className="text-xs text-right">
                <p className="text-muted-foreground">Due</p>
                <p className="font-semibold text-destructive">{fmt(o.due)}</p>
              </div>
            )}
            {o.balance !== undefined && (
              <div className="text-xs text-right">
                <p className="text-muted-foreground">Balance</p>
                <p className="font-semibold text-success">{fmt(o.balance)}</p>
              </div>
            )}
            <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium", payStyles[o.payment])}>
              {o.payment}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <button onClick={() => onView?.(o)} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-foreground hover:bg-muted transition-smooth">
              <Eye className="h-3.5 w-3.5" /> View
            </button>
            <button onClick={() => onInvoice?.(o)} className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-info hover:bg-info/10 transition-smooth">
              <FileText className="h-3.5 w-3.5" /> Invoice
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
