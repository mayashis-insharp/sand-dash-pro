import { Eye, FileText, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

export function OrdersTable({ orders, onView, onInvoice }: { orders: Order[]; onView?: (o: Order) => void; onInvoice?: (o: Order) => void }) {
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
                <td className="px-4 py-4 font-mono text-xs">{o.vehicle}</td>
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
                    <button onClick={() => onInvoice?.(o)} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-info hover:bg-info/10 transition-smooth">
                      <FileText className="h-3.5 w-3.5" /> Invoice
                    </button>
                    <button onClick={() => onView?.(o)} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-foreground hover:bg-muted transition-smooth">
                      <Eye className="h-3.5 w-3.5" /> View
                    </button>
                    <button className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-muted transition-smooth">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
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
