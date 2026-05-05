import { useState } from "react";
import { PageShell, TabBar, Pagination } from "@/components/dashboard/PageShell";
import { OrdersTable, type Order } from "@/components/dashboard/OrdersTable";
import { OrdersCards } from "@/components/dashboard/OrdersCards";
import { AddOrderDialog } from "@/components/dashboard/AddOrderDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Plus, Calendar, LayoutGrid, List, Edit, Bell, CheckCircle2, Eye } from "lucide-react";
import { toast } from "sonner";

const orders: Order[] = [
  { id: "OD_12457", date: "12/02/2026", type: "Retail", sandType: "River Sand – Soft", customer: { name: "Gamage", phone: "+94778542369" }, address: "Kaduwela", vehicle: "GH-5423", qty: "75 sqft", total: 180000, due: 100000, payment: "Credit" },
  { id: "OD_12455", date: "01/02/2026", type: "Corporate", sandType: "Sea Sand", customer: { name: "Dias", phone: "+94778542369" }, address: "Kelaniya", vehicle: "MD-0214", qty: "100 sqft", total: 200000, balance: 20000, payment: "Cash" },
  { id: "OD_12454", date: "28/01/2026", type: "Wholesale", sandType: "River Sand – Coarse", customer: { name: "Perera Constructions", phone: "+94771234567" }, address: "Negombo", vehicle: "WP-7891", qty: "250 sqft", total: 525000, due: 125000, payment: "Credit" },
  { id: "OD_12453", date: "25/01/2026", type: "Retail", sandType: "Quarry Dust", customer: { name: "Fernando", phone: "+94776543210" }, address: "Moratuwa", vehicle: "CAB-3344", qty: "40 sqft", total: 72000, payment: "Cash" },
  { id: "OD_12452", date: "22/01/2026", type: "Corporate", sandType: "M-Sand", customer: { name: "Lanka Build (Pvt) Ltd", phone: "+94114567890" }, address: "Colombo 07", vehicle: "KP-9920", qty: "180 sqft", total: 396000, due: 196000, payment: "Pending" },
];

const preOrders = [
  { id: "PR_881", date: "15/02/2026", who: "Gamage", phone: "+94778542369", sand: "River Sand – Soft", qty: "60 sqft", status: "upcoming" },
  { id: "PR_880", date: "14/02/2026", who: "Lanka Build", phone: "+94114567890", sand: "M-Sand", qty: "200 sqft", status: "upcoming" },
  { id: "PR_870", date: "02/02/2026", who: "Fernando", phone: "+94776543210", sand: "Quarry Dust", qty: "40 sqft", status: "past" },
];

const drafts = [
  { id: "DR_104", customer: "Silva Constructions", sand: "Sea Sand", qty: "120 sqft", updated: "10/02/2026" },
  { id: "DR_103", customer: "New Customer", sand: "River Sand – Coarse", qty: "80 sqft", updated: "08/02/2026" },
];

const tabs = ["Orders", "Pre-Orders", "Drafts"] as const;

const Orders = () => {
  const [tab, setTab] = useState<typeof tabs[number]>("Orders");
  const [view, setView] = useState<"table" | "card">("table");
  const [addOpen, setAddOpen] = useState(false);
  const [poSide, setPoSide] = useState<"customer" | "supplier">("customer");

  const addLabel = tab === "Orders" ? "Add Order" : tab === "Pre-Orders" ? "Add Pre-Order" : "New Draft";
  const handleAdd = () => {
    if (tab === "Orders") setAddOpen(true);
    else toast(`${addLabel} created`);
  };

  return (
    <PageShell breadcrumb={["Operations", "Orders"]} title="Orders Overview" description="Manage and track all customer sand orders in real time.">
      <TabBar
        tabs={tabs}
        active={tab}
        onChange={setTab}
        right={
          <>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.success("Export started")}>
              <Download className="h-4 w-4" /> Export
            </Button>
            <Button size="sm" className="gap-2 gradient-primary border-0 shadow-glow hover:shadow-elevated transition-smooth" onClick={handleAdd}>
              <Plus className="h-4 w-4" /> {addLabel}
            </Button>
          </>
        }
      />

      {tab === "Orders" && (
        <>
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by ID, customer, vehicle…" className="pl-9 h-10 bg-card" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Select defaultValue="feb">
                <SelectTrigger className="w-[160px] h-10 bg-card">
                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" /><SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="feb">February 2026</SelectItem>
                  <SelectItem value="jan">January 2026</SelectItem>
                </SelectContent>
              </Select>
              <Select><SelectTrigger className="w-[140px] h-10 bg-card"><SelectValue placeholder="Order Type" /></SelectTrigger>
                <SelectContent><SelectItem value="retail">Retail</SelectItem><SelectItem value="corp">Corporate</SelectItem><SelectItem value="whole">Wholesale</SelectItem></SelectContent>
              </Select>
              <Select><SelectTrigger className="w-[160px] h-10 bg-card"><SelectValue placeholder="Payment" /></SelectTrigger>
                <SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="credit">Credit</SelectItem><SelectItem value="pending">Pending</SelectItem></SelectContent>
              </Select>
              <div className="ml-auto lg:ml-2 inline-flex items-center rounded-lg border border-border bg-card p-0.5">
                <button onClick={() => setView("table")} className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-smooth ${view === "table" ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  <List className="h-3.5 w-3.5" /> Table
                </button>
                <button onClick={() => setView("card")} className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-smooth ${view === "card" ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                  <LayoutGrid className="h-3.5 w-3.5" /> Cards
                </button>
              </div>
            </div>
          </div>
          {view === "table" ? <OrdersTable orders={orders} /> : <OrdersCards orders={orders} />}
          <Pagination from={1} to={5} total={1284} />
        </>
      )}

      {tab === "Pre-Orders" && (
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-lg border border-border bg-card p-0.5">
            {(["customer", "supplier"] as const).map((s) => (
              <button key={s} onClick={() => setPoSide(s)} className={`px-4 py-1.5 text-xs font-medium rounded-md capitalize transition-smooth ${poSide === s ? "gradient-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}>
                {s} pre-orders
              </button>
            ))}
          </div>

          {(["upcoming", "past"] as const).map((sec) => (
            <div key={sec}>
              <h3 className="font-display font-bold mb-3 capitalize">{sec} pre-orders</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {preOrders.filter(p => p.status === sec).map(p => (
                  <div key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-elevated transition-smooth">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-mono text-xs font-semibold">{p.id}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{p.date}</p>
                      </div>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${sec === "upcoming" ? "bg-info/10 text-info" : "bg-muted text-muted-foreground"}`}>{sec}</span>
                    </div>
                    <p className="font-semibold">{p.who}</p>
                    <p className="text-xs text-muted-foreground">{p.phone}</p>
                    <div className="mt-3 rounded-lg bg-muted/40 px-3 py-2 text-xs">
                      <span className="text-muted-foreground">Sand:</span> {p.sand} • <span className="text-muted-foreground">Qty:</span> {p.qty}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <Button size="sm" variant="outline" className="flex-1 gap-1"><Bell className="h-3.5 w-3.5" /> Inform</Button>
                      <Button size="sm" variant="outline" className="flex-1 gap-1"><CheckCircle2 className="h-3.5 w-3.5" /> Received</Button>
                      <Button size="sm" variant="ghost" className="gap-1"><Eye className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "Drafts" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {drafts.map(d => (
            <div key={d.id} className="rounded-2xl border border-dashed border-border bg-card p-5 shadow-soft hover:shadow-elevated transition-smooth">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold">{d.id}</span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-muted text-muted-foreground">Draft</span>
              </div>
              <p className="mt-2 font-semibold">{d.customer}</p>
              <p className="text-xs text-muted-foreground">{d.sand} • {d.qty}</p>
              <p className="text-xs text-muted-foreground mt-1">Updated {d.updated}</p>
              <Button size="sm" variant="outline" className="mt-4 w-full gap-1.5"><Edit className="h-3.5 w-3.5" /> Edit Draft</Button>
            </div>
          ))}
        </div>
      )}

      <AddOrderDialog open={addOpen} onOpenChange={setAddOpen} />
    </PageShell>
  );
};

export default Orders;
