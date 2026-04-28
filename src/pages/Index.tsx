import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { OrdersTable, type Order } from "@/components/dashboard/OrdersTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, Plus, ShoppingCart, Wallet, Truck, TrendingUp, Calendar } from "lucide-react";
import { toast } from "sonner";

const orders: Order[] = [
  { id: "OD_12457", date: "12/02/2026", type: "Retail", sandType: "River Sand – Soft", customer: { name: "Gamage", phone: "+94778542369" }, address: "Kaduwela", vehicle: "GH-5423", qty: "75 sqft", total: 180000, due: 100000, payment: "Credit" },
  { id: "OD_12455", date: "01/02/2026", type: "Corporate", sandType: "Sea Sand", customer: { name: "Dias", phone: "+94778542369" }, address: "Kelaniya", vehicle: "MD-0214", qty: "100 sqft", total: 200000, balance: 20000, payment: "Cash" },
  { id: "OD_12454", date: "28/01/2026", type: "Wholesale", sandType: "River Sand – Coarse", customer: { name: "Perera Constructions", phone: "+94771234567" }, address: "Negombo", vehicle: "WP-7891", qty: "250 sqft", total: 525000, due: 125000, payment: "Credit" },
  { id: "OD_12453", date: "25/01/2026", type: "Retail", sandType: "Quarry Dust", customer: { name: "Fernando", phone: "+94776543210" }, address: "Moratuwa", vehicle: "CAB-3344", qty: "40 sqft", total: 72000, payment: "Cash" },
  { id: "OD_12452", date: "22/01/2026", type: "Corporate", sandType: "M-Sand", customer: { name: "Lanka Build (Pvt) Ltd", phone: "+94114567890" }, address: "Colombo 07", vehicle: "KP-9920", qty: "180 sqft", total: 396000, due: 196000, payment: "Pending" },
];

const tabs = ["Orders", "Pre-Orders", "Drafts"] as const;

const Index = () => {
  const [tab, setTab] = useState<typeof tabs[number]>("Orders");

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span>Operations</span>
            <span>/</span>
            <span className="text-foreground font-medium">Orders</span>
          </div>
          <h1 className="text-3xl font-display font-bold tracking-tight">Orders Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage and track all customer sand orders in real time.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.success("Export started", { description: "Your CSV will download shortly." })}>
            <Download className="h-4 w-4" /> Export
          </Button>
          <Button size="sm" className="gap-2 gradient-primary border-0 shadow-glow hover:shadow-elevated transition-smooth" onClick={() => toast("New order draft created")}>
            <Plus className="h-4 w-4" /> Add Order
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Orders" value="1,284" delta="+12.4%" icon={ShoppingCart} accent="primary" />
        <StatCard label="Revenue (LKR)" value="4.82M" delta="+8.2%" icon={Wallet} accent="success" />
        <StatCard label="Active Deliveries" value="37" delta="+3" icon={Truck} accent="info" />
        <StatCard label="Pending Dues" value="921K" delta="-4.1%" trend="down" icon={TrendingUp} accent="warning" />
      </div>

      {/* Tabbed card */}
      <div className="rounded-2xl border border-border bg-card shadow-soft mb-6">
        <div className="flex flex-col gap-4 p-6 border-b border-border">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-display font-semibold">Orders</h2>
            <p className="text-sm text-muted-foreground">All customer sand orders</p>
          </div>
          <div className="flex items-center gap-1 border-b border-border -mb-6 -mx-6 px-6">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative px-4 py-3 text-sm font-medium transition-smooth ${
                  tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
                {tab === t && <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full gradient-primary" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by ID, customer, vehicle…" className="pl-9 h-10 bg-card" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Select defaultValue="feb">
            <SelectTrigger className="w-[160px] h-10 bg-card">
              <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="feb">February 2026</SelectItem>
              <SelectItem value="jan">January 2026</SelectItem>
              <SelectItem value="dec">December 2025</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[140px] h-10 bg-card"><SelectValue placeholder="Order Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="corp">Corporate</SelectItem>
              <SelectItem value="whole">Wholesale</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[160px] h-10 bg-card"><SelectValue placeholder="Payment Method" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <OrdersTable orders={orders} />

      {/* Footer / pagination */}
      <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing <span className="font-medium text-foreground">1–5</span> of <span className="font-medium text-foreground">1,284</span> orders</span>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="sm" disabled>Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
