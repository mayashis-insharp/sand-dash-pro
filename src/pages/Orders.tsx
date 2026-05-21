import { useState, ReactNode } from "react";
import { PageShell, TabBar, Pagination } from "@/components/dashboard/PageShell";
import { OrdersTable, type Order } from "@/components/dashboard/OrdersTable";
import { OrdersCards } from "@/components/dashboard/OrdersCards";
import { AddOrderDialog } from "@/components/dashboard/AddOrderDialog";
import { ExportReportDialog } from "@/components/dashboard/ExportReportDialog";
import { DocumentsDialog, type DocData } from "@/components/dashboard/DocumentsDialog";
import { FormShell, FormSection } from "@/components/dashboard/FormShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Download, Plus, Calendar as CalendarIcon, Clock, LayoutGrid, List, Edit, Bell, CheckCircle2, Eye, FileText, Trash2, X, ShoppingCart, User, Package, Truck, Wallet, MapPin, Receipt, StickyNote } from "lucide-react";
import { toast } from "sonner";

const orders: Order[] = [
  { id: "OD_12457", date: "12/02/2026", type: "Retail", sandType: "River Sand – Soft", customer: { name: "Gamage", phone: "+94778542369" }, address: "Kaduwela", vehicle: "GH-5423", qty: "75 sqft", total: 180000, due: 100000, payment: "Credit" },
  { id: "OD_12455", date: "01/02/2026", type: "Corporate", sandType: "Sea Sand", customer: { name: "Dias", phone: "+94778542369" }, address: "Kelaniya", vehicle: "MD-0214", qty: "100 sqft", total: 200000, balance: 20000, payment: "Cash" },
  { id: "OD_12454", date: "28/01/2026", type: "Corporate", sandType: "River Sand – Coarse", customer: { name: "Perera Constructions", phone: "+94771234567" }, address: "Negombo", vehicle: "WP-7891", qty: "250 sqft", total: 525000, due: 125000, payment: "Credit" },
  { id: "OD_12453", date: "25/01/2026", type: "Retail", sandType: "Quarry Dust", customer: { name: "Fernando", phone: "+94776543210" }, address: "Moratuwa", vehicle: "CAB-3344", qty: "40 sqft", total: 72000, payment: "Cash" },
  { id: "OD_12452", date: "22/01/2026", type: "Corporate", sandType: "M-Sand", customer: { name: "Lanka Build (Pvt) Ltd", phone: "+94114567890" }, address: "Colombo 07", vehicle: "KP-9920", qty: "180 sqft", total: 396000, due: 196000, payment: "Pending" },
];

const preOrders = [
  { id: "PR_881", date: "15/02/2026", who: "Gamage", phone: "+94778542369", sand: "River Sand – Soft", qty: "60 sqft", status: "upcoming", side: "customer" },
  { id: "PR_880", date: "14/02/2026", who: "Lanka Build", phone: "+94114567890", sand: "M-Sand", qty: "200 sqft", status: "upcoming", side: "customer" },
  { id: "PR_879", date: "16/02/2026", who: "Riverside Mining", phone: "+94778520011", sand: "River Sand – Soft", qty: "300 sqft", status: "upcoming", side: "supplier" },
  { id: "PR_870", date: "02/02/2026", who: "Fernando", phone: "+94776543210", sand: "Quarry Dust", qty: "40 sqft", status: "past", side: "customer" },
];

const drafts = [
  { no: "DR_104", type: "Order", created: "08/02/2026 10:14", edited: "10/02/2026 12:02" },
  { no: "DR_103", type: "Order", created: "06/02/2026 16:30", edited: "08/02/2026 09:11" },
];

const tabs = ["Orders", "Pre-Orders", "Drafts"] as const;
const fmt = (n: number) => "LKR " + n.toLocaleString();

const Fld = ({ label, children, full }: { label: string; children: ReactNode; full?: boolean }) => (
  <div className={full ? "md:col-span-2" : ""}>
    <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
    <div className="mt-1.5">{children}</div>
  </div>
);

const ReadOnlyField = ({ value }: { value: ReactNode }) => (
  <div className="h-11 px-3 rounded-md border border-border bg-muted/40 flex items-center text-sm text-foreground">{value}</div>
);

function OrderFormSections({ order, readOnly }: { order: Order; readOnly?: boolean }) {
  const renderInput = (val: string | number, opts?: { mono?: boolean }) =>
    readOnly ? <ReadOnlyField value={<span className={opts?.mono ? "font-mono" : ""}>{val}</span>} /> : <Input className={`h-11 bg-background ${opts?.mono ? "font-mono" : ""}`} defaultValue={String(val)} />;

  // Mock data so layout fully mirrors Add Order
  const mockTime = "09:00";
  const mockDiscount = "0";
  const mockPaid = order.balance !== undefined ? order.total - (order.balance ?? 0) : (order.due !== undefined ? order.total - (order.due ?? 0) : order.total);
  const mockVehicles = [
    { id: "v1", vehicleNo: order.vehicle, capacity: order.qty.split(" ")[0] || "", driverName: "Sunil Bandara", driverPhone: "+94770001111" },
  ];
  const mockCharges = [
    { id: "c1", type: "Transport", amount: "4500", comment: "Loading & handling", addToInvoice: true },
  ];
  const mockNotes = "—";

  return (
    <>
      <FormSection icon={<CalendarIcon className="h-4 w-4" />} title="Schedule" description="When should this order be fulfilled?">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Fld label="Order Date">{renderInput(order.date)}</Fld>
          <Fld label="Order Time">{renderInput(mockTime)}</Fld>
        </div>
      </FormSection>

      <FormSection icon={<User className="h-4 w-4" />} title="Customer" description="Who is placing this order?">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Fld label="Customer">{renderInput(order.customer.name)}</Fld>
          <Fld label="Contact Number">{renderInput(order.customer.phone, { mono: true })}</Fld>
        </div>
      </FormSection>

      <FormSection icon={<Package className="h-4 w-4" />} title="Order" description="Type, material, and quantity.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Fld label="Order Type">
            {readOnly ? <ReadOnlyField value={order.type} /> : (
              <Select defaultValue={order.type.toLowerCase()}>
                <SelectTrigger className="h-11 bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                </SelectContent>
              </Select>
            )}
          </Fld>
          <Fld label="Sand Type">{renderInput(order.sandType)}</Fld>
          <Fld label="Quantity">{renderInput(order.qty)}</Fld>
          <Fld label="Subtotal"><ReadOnlyField value={<span className="font-display font-semibold">{fmt(order.total)}</span>} /></Fld>
        </div>
      </FormSection>

      <FormSection icon={<Truck className="h-4 w-4" />} title="Logistics" description="Vehicle, driver, and delivery.">
        <div className="space-y-3">
          {mockVehicles.map((v, idx) => (
            <div key={v.id} className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Vehicle #{idx + 1}</span>
                {!readOnly && (
                  <button type="button" disabled={mockVehicles.length === 1} className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-40">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Fld label="Vehicle No">{renderInput(v.vehicleNo, { mono: true })}</Fld>
                <Fld label="Vehicle Capacity">{renderInput(v.capacity)}</Fld>
                <Fld label="Driver Name">{renderInput(v.driverName)}</Fld>
                <Fld label="Driver Contact">{renderInput(v.driverPhone, { mono: true })}</Fld>
              </div>
            </div>
          ))}
          {!readOnly && (
            <button type="button" className="w-full rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary py-3 text-sm font-medium transition-smooth flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" /> Add Vehicle
            </button>
          )}
        </div>
        <div className="mt-4">
          <Fld label="Delivery Address" full>
            {readOnly ? <ReadOnlyField value={order.address} /> : <Textarea defaultValue={order.address} className="bg-background min-h-[80px] resize-none" />}
          </Fld>
        </div>
      </FormSection>

      <FormSection icon={<Wallet className="h-4 w-4" />} title="Payment" description="Discounts, method, and amount paid.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Fld label="Discount">{renderInput(mockDiscount, { mono: true })}</Fld>
          <Fld label="Payment Method">{renderInput(order.payment)}</Fld>
          <Fld label="Amount Paid">{renderInput(String(mockPaid), { mono: true })}</Fld>
          <Fld label="Total">{renderInput(fmt(order.total), { mono: true })}</Fld>
          {order.due !== undefined && <Fld label="Due"><ReadOnlyField value={<span className="font-mono text-destructive">{fmt(order.due)}</span>} /></Fld>}
          {order.balance !== undefined && <Fld label="Balance"><ReadOnlyField value={<span className="font-mono text-success">{fmt(order.balance)}</span>} /></Fld>}
        </div>
      </FormSection>

      <FormSection icon={<Receipt className="h-4 w-4" />} title="Additional Charges" description="Fuel, tolls, loading or other expenses.">
        <div className="space-y-3">
          {mockCharges.map((c, idx) => (
            <div key={c.id} className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Charge #{idx + 1}</span>
                {!readOnly && (
                  <button type="button" className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Fld label="Type">{renderInput(c.type)}</Fld>
                <Fld label="Amount">{renderInput(c.amount, { mono: true })}</Fld>
              </div>
              <div className="mt-3"><Fld label="Note">{renderInput(c.comment)}</Fld></div>
              <label className="mt-3 flex items-center gap-2 text-xs font-medium text-foreground select-none">
                <Checkbox checked={c.addToInvoice} disabled={readOnly} />
                <span>Add to Invoice</span>
                <span className="text-muted-foreground font-normal">— include this charge in the customer invoice</span>
              </label>
            </div>
          ))}
          {!readOnly && (
            <button type="button" className="w-full rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary py-4 text-sm font-medium transition-smooth flex items-center justify-center gap-2">
              <Plus className="h-4 w-4" /> Add Charge
            </button>
          )}
        </div>
      </FormSection>

      <FormSection icon={<StickyNote className="h-4 w-4" />} title="Comments" description="Internal notes or special instructions.">
        {readOnly ? <ReadOnlyField value={mockNotes} /> : <Textarea defaultValue="" placeholder="Anything the team should know..." className="bg-background min-h-[100px] resize-none" />}
      </FormSection>
    </>
  );
}

const Orders = () => {
  const [tab, setTab] = useState<typeof tabs[number]>("Orders");
  const [view, setView] = useState<"table" | "card">("table");
  const [addOpen, setAddOpen] = useState(false);
  const [poSide, setPoSide] = useState<"customer" | "supplier">("customer");
  const [addPo, setAddPo] = useState(false);
  const [poType, setPoType] = useState<"customer" | "supplier">("customer");
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const [delOrder, setDelOrder] = useState<Order | null>(null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [downloadInv, setDownloadInv] = useState<Order | null>(null);
  const [cancelInv, setCancelInv] = useState<Order | null>(null);
  const [docsOrder, setDocsOrder] = useState<Order | null>(null);
  const [submittedVehicles, setSubmittedVehicles] = useState<any[] | null>(null);
  const [informConfirm, setInformConfirm] = useState<any>(null);
  const [receivedConfirm, setReceivedConfirm] = useState<any>(null);
  const [exportOpen, setExportOpen] = useState(false);

  const toDocData = (o: Order): DocData => {
    const qNum = parseInt(o.qty) || 1;
    const unit = Math.round(o.total / qNum);
    const vehicles = submittedVehicles && submittedVehicles.length > 0
      ? submittedVehicles
          .filter((v) => v.vehicleNo)
          .map((v) => ({
            vehicleNo: v.vehicleNo,
            capacity: v.capacity,
            driverName: v.driverName,
            driverPhone: v.driverPhone,
            assignedQty: v.capacity ? `${v.capacity}` : undefined,
          }))
      : undefined;
    return {
      source: "order",
      refNo: o.id,
      date: o.date,
      party: { label: "Bill To", name: o.customer.name, phone: o.customer.phone, address: o.address },
      product: o.sandType,
      qty: o.qty,
      unitPrice: unit,
      subtotal: o.total,
      charges: [
        { description: "Loading & handling", amount: 4500, addToInvoice: true },
        { description: "Driver allowance (internal)", amount: 2000, addToInvoice: false },
      ],
      vehicle: o.vehicle,
      driver: { name: "Sunil Bandara", phone: "+94770001111" },
      vehicles: vehicles && vehicles.length > 0 ? vehicles : undefined,
      paymentMethod: o.payment,
      paymentStatus: o.due || o.balance ? "Pending" : "Paid",
      deliveryDate: o.date,
    };
  };

  const handleAddOrder = (payload?: { vehicles?: any[] }) => {
    setSubmittedVehicles(payload?.vehicles || null);
    setDocsOrder(orders[0]);
  };

  return (
    <PageShell icon={ShoppingCart} title="Orders" description="Manage and track all customer sand orders.">
      <TabBar
        tabs={tabs}
        active={tab}
        onChange={setTab}
        right={
          <>
            {tab !== "Drafts" && <Button variant="outline" size="sm" className="gap-2" onClick={() => setExportOpen(true)}><Download className="h-4 w-4" /> Export</Button>}
            {tab === "Orders" && <Button size="sm" className="gap-2 gradient-primary border-0 shadow-glow" onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> Add Order</Button>}
            {tab === "Pre-Orders" && <Button size="sm" className="gap-2 gradient-primary border-0 shadow-glow" onClick={() => setAddPo(true)}><Plus className="h-4 w-4" /> Add Pre-Order</Button>}
          </>
        }
      />

      {tab === "Orders" && (
        <>
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search by ID, customer, vehicle…" className="pl-9 h-10 bg-card" /></div>
            <div className="flex items-center gap-2 flex-wrap">
              <Select defaultValue="feb"><SelectTrigger className="w-[160px] h-10 bg-card"><CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" /><SelectValue /></SelectTrigger><SelectContent><SelectItem value="feb">February 2026</SelectItem><SelectItem value="jan">January 2026</SelectItem></SelectContent></Select>
              <Select><SelectTrigger className="w-[140px] h-10 bg-card"><SelectValue placeholder="Order Type" /></SelectTrigger><SelectContent><SelectItem value="retail">Retail</SelectItem><SelectItem value="corp">Corporate</SelectItem></SelectContent></Select>
              <Select><SelectTrigger className="w-[160px] h-10 bg-card"><SelectValue placeholder="Payment Method" /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="bank">Bank Transfer</SelectItem><SelectItem value="cheque">Cheque</SelectItem><SelectItem value="credit">Credit</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select>
              <div className="ml-auto lg:ml-2 inline-flex items-center rounded-lg border border-border bg-card p-0.5">
                <button onClick={() => setView("table")} className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-smooth ${view === "table" ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><List className="h-3.5 w-3.5" /> Table</button>
                <button onClick={() => setView("card")} className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-smooth ${view === "card" ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}><LayoutGrid className="h-3.5 w-3.5" /> Cards</button>
              </div>
            </div>
          </div>
          {view === "table"
            ? <OrdersTable orders={orders} onView={setViewOrder} onInvoice={setDocsOrder} />
            : <OrdersCards orders={orders} onView={setViewOrder} onInvoice={setDocsOrder} />}
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
                {preOrders.filter(p => p.status === sec && p.side === poSide).map(p => (
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
                    <div className="mt-3 rounded-lg bg-muted/40 px-3 py-2 text-xs"><span className="text-muted-foreground">Sand:</span> {p.sand} • <span className="text-muted-foreground">Qty:</span> {p.qty}</div>
                    {sec === "upcoming" && (
                      <div className="mt-3 flex items-center gap-2">
                        {poSide === "customer"
                          ? <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => setInformConfirm(p)}><Bell className="h-3.5 w-3.5" /> Inform</Button>
                          : <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => setReceivedConfirm(p)}><CheckCircle2 className="h-3.5 w-3.5" /> Received</Button>}
                        <Button size="sm" variant="ghost" className="gap-1"><Eye className="h-3.5 w-3.5" /> View</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "Drafts" && (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-muted/50 border-b border-border">{["Draft No", "Draft Type", "Created Date", "Created Time", "Last Edited Date", "Last Edited Time", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold whitespace-nowrap">{h}</th>)}</tr></thead>
            <tbody>
              {drafts.map(d => {
                const [cd, ct] = d.created.split(" ");
                const [ed, et] = d.edited.split(" ");
                return (
                  <tr key={d.no} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-4 font-mono text-xs font-semibold">{d.no}</td>
                    <td className="px-4 py-4">{d.type}</td>
                    <td className="px-4 py-4 text-muted-foreground text-xs">{cd}</td>
                    <td className="px-4 py-4 text-muted-foreground text-xs">{ct}</td>
                    <td className="px-4 py-4 text-muted-foreground text-xs">{ed}</td>
                    <td className="px-4 py-4 text-muted-foreground text-xs">{et}</td>
                    <td className="px-4 py-4"><Button size="sm" variant="outline" className="gap-1" onClick={() => setAddOpen(true)}><Edit className="h-3.5 w-3.5" /> Edit</Button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AddOrderDialog open={addOpen} onOpenChange={setAddOpen} onSubmitted={handleAddOrder} />

      {/* View Order — same layout as Add Order, read-only */}
      <FormShell
        open={!!viewOrder}
        onOpenChange={(o) => !o && setViewOrder(null)}
        title="Order Details"
        subtitle={viewOrder?.id}
        icon={<ShoppingCart className="h-5 w-5" />}
        size="xl"
        footer={
          <div className="px-5 md:px-8 py-3 flex items-center justify-between gap-3">
            <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => { setDelOrder(viewOrder); setViewOrder(null); }}>
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="text-muted-foreground" onClick={() => setViewOrder(null)}>Close</Button>
              <Button className="gap-2 gradient-primary border-0 shadow-glow px-6" onClick={() => { setEditOrder(viewOrder); setViewOrder(null); }}>
                <Edit className="h-4 w-4" /> Edit
              </Button>
            </div>
          </div>
        }
      >
        {viewOrder && <OrderFormSections order={viewOrder} readOnly />}
      </FormShell>

      {/* Edit Order — same layout as Add Order, editable */}
      <FormShell
        open={!!editOrder}
        onOpenChange={(o) => !o && setEditOrder(null)}
        title="Edit Order"
        subtitle={editOrder?.id}
        icon={<Edit className="h-5 w-5" />}
        size="xl"
        footer={
          <div className="px-5 md:px-8 py-3 flex items-center justify-between gap-3">
            <Button variant="ghost" className="text-muted-foreground" onClick={() => setEditOrder(null)}>Cancel</Button>
            <Button className="gap-2 gradient-primary border-0 shadow-glow px-6" onClick={() => { toast.success("Changes saved"); setEditOrder(null); }}>
              Save Changes
            </Button>
          </div>
        }
      >
        {editOrder && <OrderFormSections order={editOrder} />}
      </FormShell>

      <AlertDialog open={!!delOrder} onOpenChange={(o) => !o && setDelOrder(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete this order?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => { toast.success("Order deleted"); setDelOrder(null); }}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Invoice preview */}
      <Dialog open={!!invoiceOrder} onOpenChange={(o) => !o && setInvoiceOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Invoice Preview</DialogTitle></DialogHeader>
          {invoiceOrder && (
            <div className="rounded-xl border border-border bg-muted/20 p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display font-bold text-xl">Madu Enterprises</p>
                  <p className="text-xs text-muted-foreground">No. 25, Colombo Rd, Kaduwela</p>
                </div>
                <div className="text-right text-xs">
                  <p className="text-muted-foreground">Invoice No</p>
                  <p className="font-mono font-semibold">INV-{invoiceOrder.id.replace("OD_", "")}</p>
                  <p className="text-muted-foreground mt-1">Date</p>
                  <p>{invoiceOrder.date}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground">Bill To</p><p className="font-medium">{invoiceOrder.customer.name}</p><p className="text-xs">{invoiceOrder.customer.phone}</p><p className="text-xs">{invoiceOrder.address}</p></div>
                <div><p className="text-xs text-muted-foreground">Order ID</p><p className="font-mono font-semibold">{invoiceOrder.id}</p><p className="text-xs text-muted-foreground mt-1">Vehicle</p><p className="font-mono text-xs">{invoiceOrder.vehicle}</p></div>
              </div>
              <table className="w-full text-sm">
                <thead className="border-b border-border"><tr>{["Item", "Qty", "Unit Price", "Total"].map(h => <th key={h} className="px-2 py-2 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>)}</tr></thead>
                <tbody><tr className="border-b border-border"><td className="px-2 py-3">{invoiceOrder.sandType}</td><td className="px-2 py-3">{invoiceOrder.qty}</td><td className="px-2 py-3 font-mono">{Math.round(invoiceOrder.total / parseInt(invoiceOrder.qty)).toLocaleString()}</td><td className="px-2 py-3 font-mono font-semibold">{fmt(invoiceOrder.total)}</td></tr></tbody>
              </table>
              <div className="flex justify-end">
                <div className="w-56 text-sm space-y-1">
                  <div className="flex justify-between text-muted-foreground"><span>Discount</span><span>—</span></div>
                  <div className="flex justify-between font-display font-bold text-base border-t border-border pt-2"><span>Total</span><span>{fmt(invoiceOrder.total)}</span></div>
                </div>
              </div>
              <div className="pt-3 border-t border-border/60 text-center text-[10px] text-muted-foreground italic">Generated by Cita ERP</div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" className="text-destructive border-destructive/30" onClick={() => { setCancelInv(invoiceOrder); setInvoiceOrder(null); }}>Cancel Invoice</Button>
            <Button className="gradient-primary border-0" onClick={() => { setDownloadInv(invoiceOrder); setInvoiceOrder(null); }}><Download className="h-4 w-4 mr-1" /> Download</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!downloadInv} onOpenChange={(o) => !o && setDownloadInv(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Download Invoice</DialogTitle></DialogHeader>
          {downloadInv && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Order ID</Label><Input className="mt-1.5" disabled value={downloadInv.id} /></div>
                <div><Label>Invoice No</Label><Input className="mt-1.5" disabled value={"INV-" + downloadInv.id.replace("OD_", "")} /></div>
              </div>
              <div><Label>File Type</Label><Select defaultValue="pdf"><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="pdf">PDF</SelectItem><SelectItem value="png">PNG</SelectItem></SelectContent></Select></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDownloadInv(null)}>Cancel</Button>
            <Button className="gradient-primary border-0" onClick={() => { toast.success("Invoice downloaded"); setDownloadInv(null); }}><Download className="h-4 w-4 mr-1" /> Download</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!cancelInv} onOpenChange={(o) => !o && setCancelInv(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Cancel this invoice?</AlertDialogTitle><AlertDialogDescription>The invoice for {cancelInv?.id} will be cancelled.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Keep Invoice</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => { toast.success("Invoice cancelled"); setCancelInv(null); }}>Cancel Invoice</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Post-Add: Document selection */}
      <DocumentsDialog
        open={!!docsOrder}
        onOpenChange={(o) => !o && setDocsOrder(null)}
        data={docsOrder ? toDocData(docsOrder) : null}
      />


      {/* Inform */}
      <AlertDialog open={!!informConfirm} onOpenChange={(o) => !o && setInformConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Inform customer?</AlertDialogTitle><AlertDialogDescription>Has {informConfirm?.who} been informed about this pre-order?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { toast.success("SMS sent"); setInformConfirm(null); }}>No, Send SMS</AlertDialogCancel>
            <AlertDialogAction className="gradient-primary border-0" onClick={() => { toast.success("Marked as informed"); setInformConfirm(null); }}>Yes, Informed</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Received */}
      <AlertDialog open={!!receivedConfirm} onOpenChange={(o) => !o && setReceivedConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Stock received?</AlertDialogTitle><AlertDialogDescription>Has the stock from {receivedConfirm?.who} been received?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { toast.message("Marked as pending"); setReceivedConfirm(null); }}>No, Pending</AlertDialogCancel>
            <AlertDialogAction className="gradient-primary border-0" onClick={() => { toast.success("Marked as received"); setReceivedConfirm(null); }}>Yes, Received</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Pre-Order */}
      <Dialog open={addPo} onOpenChange={setAddPo}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Add Pre-Order</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="inline-flex items-center rounded-lg border border-border bg-card p-0.5">
              {(["customer", "supplier"] as const).map(s => (
                <button key={s} onClick={() => setPoType(s)} className={`px-4 py-1.5 text-xs font-medium rounded-md capitalize ${poType === s ? "gradient-primary text-primary-foreground" : "text-muted-foreground"}`}>{s}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Sand Type</Label><Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="rs">River Sand – Soft</SelectItem></SelectContent></Select></div>
              <div><Label>Quantity</Label><Input className="mt-1.5" /></div>
              <div><Label>Schedule Date</Label><Input type="date" className="mt-1.5" /></div>
              {poType === "supplier" && <div><Label>Vehicle to Send</Label><Input className="mt-1.5" /></div>}
              <div className="col-span-2"><Label>{poType === "customer" ? "Customer" : "Supplier"} Name</Label><Input className="mt-1.5" /></div>
              <div className="col-span-2"><Label>Contact</Label><Input className="mt-1.5" /></div>
            </div>
            <div><Label>Comments</Label><Textarea className="mt-1.5" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddPo(false)}>Cancel</Button>
            <Button className="gradient-primary border-0" onClick={() => { toast.success("Pre-order added"); setAddPo(false); }}>Add Pre-Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <ExportReportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        moduleName={tab === "Pre-Orders" ? `PreOrder - ${poSide === "customer" ? "Customer" : "Supplier"}` : "Order"}
        columns={
          tab === "Pre-Orders"
            ? [
                { name: "Date Range", filter: { kind: "dateRange" } },
                { name: "Scheduled Date", filter: { kind: "dateRange" } },
                { name: poSide === "customer" ? "Customer" : "Supplier", filter: { kind: "multiSelect", options: poSide === "customer" ? ["Gamage", "Dias", "Perera Constructions", "Fernando", "Lanka Build"] : ["Riverside Mining", "Coastal Mines", "Quarry Co"], allLabel: poSide === "customer" ? "All Customers" : "All Suppliers" } },
                { name: "Sand Type", filter: { kind: "multiSelect", options: ["River Sand – Soft", "River Sand – Coarse", "Sea Sand", "Quarry Dust", "M-Sand"], allLabel: "All Sand Types" } },
                { name: "Vehicle No", filter: { kind: "multiSelect", options: ["GH-5423", "MD-0214", "WP-7891", "CAB-3344", "KP-9920"], allLabel: "All Vehicles" } },
                { name: "Quantity", filter: { kind: "numberRange", unit: "sqft" } },
              ]
            : [
                { name: "Order ID", filter: { kind: "text" } },
                { name: "Order Date", filter: { kind: "dateRange" } },
                { name: "Sand Type", filter: { kind: "multiSelect", options: ["River Sand – Soft", "River Sand – Coarse", "Sea Sand", "Quarry Dust", "M-Sand"], allLabel: "All Sand Types" } },
                { name: "Customer", filter: { kind: "multiSelect", options: ["Gamage", "Dias", "Perera Constructions", "Fernando", "Lanka Build"], allLabel: "All Customers" } },
                { name: "Delivery Address", filter: { kind: "text" } },
                { name: "Vehicle No", filter: { kind: "multiSelect", options: ["GH-5423", "MD-0214", "WP-7891", "CAB-3344", "KP-9920"], allLabel: "All Vehicles" } },
                { name: "Driver", filter: { kind: "multiSelect", options: ["Driver A", "Driver B", "Driver C"], allLabel: "All Drivers" } },
                { name: "Order Quantity", filter: { kind: "numberRange", unit: "sqft" } },
                { name: "Unit Price", filter: { kind: "numberRange", unit: "LKR" } },
                { name: "Payment Details", filter: { kind: "multiSelect", options: ["Cash", "Bank Transfer", "Cheque", "Credit", "Other"], allLabel: "All Payment Methods" } },
                { name: "Additional Charges", filter: { kind: "numberRange", unit: "LKR" } },
              ]
        }
      />
    </PageShell>
  );
};

export default Orders;
