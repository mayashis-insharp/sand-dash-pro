import { useState } from "react";
import { PageShell, TabBar, Pagination } from "@/components/dashboard/PageShell";
import { ViewToggle, type ViewMode } from "@/components/dashboard/ViewToggle";
import { DataCards } from "@/components/dashboard/DataCards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, FileText, Receipt as ReceiptIcon, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { ExportReportDialog } from "@/components/dashboard/ExportReportDialog";

const tabs = ["All Payments", "Cash", "Bank Transfer", "Cheque", "Credits", "Other"] as const;

interface Payment {
  date: string;
  orderId: string;
  customer: string;
  amount: number;
  method: typeof tabs[number];
  ref?: string;
  comments?: string;
}

const payments: Payment[] = [
  { date: "12/02/2026", orderId: "OD_12457", customer: "Gamage", amount: 80000, method: "Credits", ref: "—", comments: "Partial payment" },
  { date: "01/02/2026", orderId: "OD_12455", customer: "Dias", amount: 220000, method: "Cash", ref: "RCT_5521", comments: "Full settled + advance" },
  { date: "28/01/2026", orderId: "OD_12454", customer: "Perera Constructions", amount: 400000, method: "Bank Transfer", ref: "TXN_998812", comments: "BoC transfer" },
  { date: "25/01/2026", orderId: "OD_12453", customer: "Fernando", amount: 72000, method: "Cash", ref: "RCT_5489", comments: "" },
  { date: "22/01/2026", orderId: "OD_12452", customer: "Lanka Build", amount: 200000, method: "Cheque", ref: "CHQ_004412", comments: "Sampath Bank" },
  { date: "20/01/2026", orderId: "OD_12451", customer: "Silva Cons.", amount: 145000, method: "Other", ref: "WIRE_221", comments: "Card payment" },
];

const methodStyles: Record<Payment["method"], string> = {
  "All Payments": "",
  Cash: "bg-success/10 text-success border-success/20",
  "Bank Transfer": "bg-info/10 text-info border-info/20",
  Cheque: "bg-warning/15 text-warning border-warning/30",
  Credits: "bg-primary/10 text-primary border-primary/20",
  Other: "bg-muted text-muted-foreground border-border",
};

const fmt = (n: number) => "LKR " + n.toLocaleString();

const Payments = () => {
  const [tab, setTab] = useState<typeof tabs[number]>("All Payments");
  const [view, setView] = useState<ViewMode>("table");
  const [exportOpen, setExportOpen] = useState(false);

  const filtered = tab === "All Payments" ? payments : payments.filter(p => p.method === tab);
  const showOutstanding = tab === "Credits" || tab === "Other";
  const totalAmount = filtered.reduce((s, p) => s + p.amount, 0);
  const paid = Math.round(totalAmount * 0.65);
  const outstanding = totalAmount - paid;

  return (
    <PageShell icon={Wallet} breadcrumb={["Finance", "Payments"]} title="Payments" description="Track all incoming payments across methods.">
      <TabBar
        tabs={tabs}
        active={tab}
        onChange={setTab}
        right={<Button variant="outline" size="sm" className="gap-2" onClick={() => setExportOpen(true)}><Download className="h-4 w-4" /> Export</Button>}
      />

      {showOutstanding && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Total Amount</p>
            <p className="mt-2 text-2xl font-display font-bold">{fmt(totalAmount)}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Paid Amount</p>
            <p className="mt-2 text-2xl font-display font-bold text-success">{fmt(paid)}</p>
          </div>
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-5 shadow-soft">
            <p className="text-xs uppercase tracking-wider text-destructive/70">Outstanding</p>
            <p className="mt-2 text-2xl font-display font-bold text-destructive">{fmt(outstanding)}</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search payments…" className="pl-9 h-10 bg-card" />
        </div>
        <ViewToggle value={view} onChange={setView} className="ml-auto" />
      </div>

      {view === "table" ? (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  {["Date", "Order ID", "Customer", "Amount", "Method", "Reference", "Comments", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={i} className="border-b border-border/60 last:border-0 hover:bg-muted/30 transition-smooth">
                    <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">{p.date}</td>
                    <td className="px-4 py-4 font-mono text-xs font-semibold">{p.orderId}</td>
                    <td className="px-4 py-4 font-medium">{p.customer}</td>
                    <td className="px-4 py-4 font-semibold">{fmt(p.amount)}</td>
                    <td className="px-4 py-4">
                      <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium", methodStyles[p.method])}>
                        {p.method}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-mono text-xs">{p.ref || "—"}</td>
                    <td className="px-4 py-4 text-muted-foreground text-xs max-w-[180px] truncate">{p.comments || "—"}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-info hover:bg-info/10"><FileText className="h-3.5 w-3.5" /> Invoice</button>
                        <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-foreground hover:bg-muted"><ReceiptIcon className="h-3.5 w-3.5" /> Receipt</button>
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
          items={filtered.map((p, i) => ({
            id: p.orderId + "-" + i,
            title: p.customer,
            subtitle: <span className="font-mono">{p.orderId} · {p.date}</span>,
            badge: <span className={cn("inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium", methodStyles[p.method])}>{p.method}</span>,
            fields: [
              { label: "Amount", value: fmt(p.amount) },
              { label: "Reference", value: p.ref || "—", mono: true },
              { label: "Comments", value: p.comments || "—", full: true },
            ],
            actions: (
              <>
                <Button size="sm" variant="outline" className="flex-1 gap-1 text-info"><FileText className="h-3.5 w-3.5" /> Invoice</Button>
                <Button size="sm" variant="outline" className="flex-1 gap-1"><ReceiptIcon className="h-3.5 w-3.5" /> Receipt</Button>
              </>
            ),
          }))}
        />
      )}
      <Pagination from={1} to={filtered.length} total={482} />
    </PageShell>
  );
};

export default Payments;
