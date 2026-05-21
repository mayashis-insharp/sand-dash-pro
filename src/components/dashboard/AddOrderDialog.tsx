import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  CalendarIcon,
  Clock,
  User,
  Phone,
  Truck,
  MapPin,
  Package,
  Wallet,
  Receipt,
  Plus,
  StickyNote,
  Search,
  Check,
  Sparkles,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { FormShell } from "@/components/dashboard/FormShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";

interface AddOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmitted?: (payload?: { vehicles?: VehicleRow[]; qty?: string; qtyUnit?: string; capacityUnit?: string }) => void;
}

const customers = [
  { id: "1", name: "Gamage", phone: "+94778542369" },
  { id: "2", name: "Dias", phone: "+94778542300" },
  { id: "3", name: "Perera Constructions", phone: "+94771234567" },
  { id: "4", name: "Fernando", phone: "+94776543210" },
  { id: "5", name: "Lanka Build (Pvt) Ltd", phone: "+94114567890" },
];

const drivers = [
  { id: "d1", name: "Sunil Bandara", phone: "+94770001111" },
  { id: "d2", name: "Kamal Silva", phone: "+94770002222" },
  { id: "d3", name: "Ruwan Perera", phone: "+94770003333" },
];

const sandTypes = [
  { value: "river-soft", label: "River Sand – Soft", price: 2400 },
  { value: "river-coarse", label: "River Sand – Coarse", price: 2100 },
  { value: "sea", label: "Sea Sand", price: 2000 },
  { value: "quarry", label: "Quarry Dust", price: 1800 },
  { value: "m-sand", label: "M-Sand", price: 2200 },
];

const expenseTypes = ["Transport", "Other"];

type Charge = { id: string; type: string; amount: string; comment: string; addToInvoice: boolean };
export type VehicleRow = { id: string; vehicleNo: string; capacity: string; driverName: string; driverPhone: string };

const Field = ({
  label,
  required,
  children,
  hint,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
  className?: string;
}) => (
  <div className={cn("space-y-1.5", className)}>
    <div className="flex items-center justify-between">
      <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
        {required && <span className="text-primary ml-0.5">*</span>}
      </Label>
      {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
    </div>
    {children}
  </div>
);

const Section = ({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: any;
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <section className="rounded-2xl border border-border bg-card shadow-soft p-5 md:p-6">
    <div className="mb-5 flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <h3 className="text-sm font-display font-bold tracking-tight text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
    {children}
  </section>
);

export function AddOrderDialog({ open, onOpenChange, onSubmitted }: AddOrderDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerId, setCustomerId] = useState<string>("");
  const [phone, setPhone] = useState("");
  const [orderType, setOrderType] = useState("");
  const [sandType, setSandType] = useState("");
  const [vehicleOwner, setVehicleOwner] = useState<"own" | "customer">("own");
  const [vehicles, setVehicles] = useState<VehicleRow[]>([
    { id: crypto.randomUUID(), vehicleNo: "", capacity: "", driverName: "", driverPhone: "" },
  ]);
  const [capacityUnit, setCapacityUnit] = useState("sqft");
  const [address, setAddress] = useState("");
  const [qty, setQty] = useState("");
  const [qtyUnit, setQtyUnit] = useState("sqft");
  const [discount, setDiscount] = useState("");
  const [discountCurrency, setDiscountCurrency] = useState("LKR");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentNote, setPaymentNote] = useState("");
  const [charges, setCharges] = useState<Charge[]>([]);
  const [notes, setNotes] = useState("");

  const selectedCustomer = customers.find((c) => c.id === customerId);
  const selectedSand = sandTypes.find((s) => s.value === sandType);
  const unitPrice = selectedSand?.price ?? 0;

  const subtotal = useMemo(() => {
    const q = parseFloat(qty || "0");
    return q * unitPrice;
  }, [qty, unitPrice]);

  const discountVal = parseFloat(discount || "0");
  const totalCharges = useMemo(
    () => charges.reduce((sum, c) => sum + parseFloat(c.amount || "0"), 0),
    [charges]
  );
  const invoiceCharges = useMemo(
    () => charges.filter((c) => c.addToInvoice).reduce((sum, c) => sum + parseFloat(c.amount || "0"), 0),
    [charges]
  );
  const grandTotal = Math.max(0, subtotal - discountVal) + totalCharges;
  const invoiceTotal = Math.max(0, subtotal - discountVal) + invoiceCharges;
  const paid = parseFloat(paymentAmount || "0");
  const balance = grandTotal - paid;

  const addCharge = () =>
    setCharges((c) => [...c, { id: crypto.randomUUID(), type: "", amount: "", comment: "", addToInvoice: false }]);
  const updateCharge = (id: string, patch: Partial<Charge>) =>
    setCharges((c) => c.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const removeCharge = (id: string) =>
    setCharges((c) => c.filter((x) => x.id !== id));

  const handleSelectCustomer = (id: string) => {
    setCustomerId(id);
    const c = customers.find((x) => x.id === id);
    if (c) setPhone(c.phone);
    setCustomerOpen(false);
  };

  const addVehicle = () =>
    setVehicles((v) => [...v, { id: crypto.randomUUID(), vehicleNo: "", capacity: "", driverName: "", driverPhone: "" }]);
  const updateVehicle = (id: string, patch: Partial<VehicleRow>) =>
    setVehicles((v) => v.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  const removeVehicle = (id: string) =>
    setVehicles((v) => (v.length > 1 ? v.filter((x) => x.id !== id) : v));
  const totalCapacity = vehicles.reduce((s, v) => s + (parseFloat(v.capacity) || 0), 0);
  const qtyNum = parseFloat(qty || "0");
  const capacityShort = qtyNum > 0 && totalCapacity > 0 && qtyNum > totalCapacity;

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(n);

  const submit = () => {
    if (!selectedCustomer || !sandType || !qty) {
      toast.error("Missing fields", { description: "Customer, sand type and quantity are required." });
      return;
    }
    onOpenChange(false);
    onSubmitted?.({ vehicles, qty, qtyUnit, capacityUnit });
  };

  const saveDraft = () => {
    toast("Saved as draft", { description: "Resume from the Drafts tab anytime." });
    onOpenChange(false);
  };

  return (
    <FormShell
      open={open}
      onOpenChange={onOpenChange}
      title="Add Order"
      subtitle="Fill in the sections below to create a new order."
      icon={<Sparkles className="h-5 w-5" />}
      badge={
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
          OD_12458
        </span>
      }
      size="xl"
      footer={
        <>
          <div className="px-5 md:px-8 py-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs border-b border-border/60">
            <div className="flex items-center gap-2"><span className="text-muted-foreground">Subtotal</span><span className="font-mono font-semibold">{fmt(subtotal)}</span></div>
            {discountVal > 0 && <div className="flex items-center gap-2"><span className="text-muted-foreground">Discount</span><span className="font-mono text-destructive">−{fmt(discountVal)}</span></div>}
            {totalCharges > 0 && <div className="flex items-center gap-2"><span className="text-muted-foreground">Charges</span><span className="font-mono">+{fmt(totalCharges)}</span></div>}
            {totalCharges > 0 && invoiceCharges !== totalCharges && <div className="flex items-center gap-2"><span className="text-muted-foreground">Invoice Total</span><span className="font-mono">{fmt(invoiceTotal)}</span></div>}
            <div className="ml-auto flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Grand Total</span>
              <span className="font-display font-bold text-lg text-primary">{fmt(grandTotal)}</span>
            </div>
            {paid > 0 && <div className="w-full md:w-auto flex items-center gap-2"><span className="text-muted-foreground">Balance Due</span><span className={cn("font-mono font-semibold", balance > 0 ? "text-warning" : "text-success")}>{fmt(Math.max(0, balance))}</span></div>}
          </div>
          <div className="px-5 md:px-8 py-3 flex items-center justify-between gap-3">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-muted-foreground">Cancel</Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={saveDraft} className="border-primary/30 text-primary hover:bg-primary/5 hover:text-primary">Save as Draft</Button>
              <Button onClick={submit} className="gap-2 gradient-primary border-0 shadow-glow hover:shadow-elevated transition-smooth px-6">
                <Plus className="h-4 w-4" /> Add Order
              </Button>
            </div>
          </div>
        </>
      }
    >
            <Section icon={CalendarIcon} title="Schedule" description="When should this order be fulfilled?">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Order Date" required>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("justify-start text-left font-normal h-11 bg-background", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </Field>
                <Field label="Order Time" required>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger className="h-11 bg-background">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 24 * 2 }).map((_, i) => {
                        const h = String(Math.floor(i / 2)).padStart(2, "0");
                        const m = i % 2 === 0 ? "00" : "30";
                        const v = `${h}:${m}`;
                        return <SelectItem key={v} value={v}>{v}</SelectItem>;
                      })}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </Section>

            <Section icon={User} title="Customer" description="Who is placing this order?">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Customer" required>
                  <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" className={cn("h-11 w-full justify-between bg-background font-normal", !selectedCustomer && "text-muted-foreground")}>
                        <span className="flex items-center gap-2 truncate">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          {selectedCustomer ? selectedCustomer.name : "Search customer..."}
                        </span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[--radix-popover-trigger-width]" align="start">
                      <Command>
                        <CommandInput placeholder="Search customer..." />
                        <CommandList>
                          <CommandEmpty>No customer found.</CommandEmpty>
                          <CommandGroup>
                            {customers.map((c) => (
                              <CommandItem key={c.id} value={c.name} onSelect={() => handleSelectCustomer(c.id)}>
                                <Check className={cn("mr-2 h-4 w-4", customerId === c.id ? "opacity-100" : "opacity-0")} />
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium">{c.name}</span>
                                  <span className="text-xs text-muted-foreground">{c.phone}</span>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </Field>
                <Field label="Contact Number" required>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="+94 77 000 0000" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-9 h-11 bg-background" />
                  </div>
                </Field>
              </div>
            </Section>

            <Section icon={Package} title="Order" description="Type, material, and quantity.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Order Type" required>
                  <Select value={orderType} onValueChange={setOrderType}>
                    <SelectTrigger className="h-11 bg-background"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="corporate">Corporate</SelectItem>
                      <SelectItem value="wholesale">Wholesale</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Sand Type" required>
                  <Select value={sandType} onValueChange={setSandType}>
                    <SelectTrigger className="h-11 bg-background"><SelectValue placeholder="Select sand type" /></SelectTrigger>
                    <SelectContent>
                      {sandTypes.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          <div className="flex items-center justify-between gap-6 w-full">
                            <span>{s.label}</span>
                            <span className="text-xs text-muted-foreground">LKR {s.price.toLocaleString()}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Field label="Quantity" required hint={selectedSand ? `Unit: ${fmt(unitPrice)}` : undefined}>
                  <div className="flex gap-2">
                    <Input type="number" placeholder="0" value={qty} onChange={(e) => setQty(e.target.value)} className="h-11 bg-background" />
                    <Select value={qtyUnit} onValueChange={setQtyUnit}>
                      <SelectTrigger className="w-24 h-11 bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sqft">sqft</SelectItem>
                        <SelectItem value="cube">cube</SelectItem>
                        <SelectItem value="ton">ton</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Field>
                <Field label="Subtotal" hint="Auto-calculated">
                  <div className="h-11 px-3 rounded-md border border-border bg-muted/40 flex items-center font-display font-semibold text-foreground">
                    {fmt(subtotal)}
                  </div>
                </Field>
              </div>
            </Section>

            <Section icon={Truck} title="Logistics" description="Vehicle, driver, and delivery.">
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted/40 border border-border mb-4">
                {[
                  { v: "own", label: "Own Vehicle", desc: "Company fleet" },
                  { v: "customer", label: "Customer Vehicle", desc: "Customer transport" },
                ].map((opt) => (
                  <button
                    key={opt.v}
                    type="button"
                    onClick={() => setVehicleOwner(opt.v as any)}
                    className={cn("px-4 py-2.5 rounded-lg text-left transition-smooth", vehicleOwner === opt.v ? "bg-card shadow-sm ring-1 ring-primary/30" : "hover:bg-card/60")}
                  >
                    <p className={cn("text-sm font-semibold", vehicleOwner === opt.v ? "text-foreground" : "text-muted-foreground")}>{opt.label}</p>
                    <p className="text-[11px] text-muted-foreground">{opt.desc}</p>
                  </button>
                ))}
              </div>
              <div className="space-y-3">
                {vehicles.map((v, idx) => (
                  <div key={v.id} className="rounded-xl border border-border bg-background p-4 group hover:border-primary/30 transition-smooth">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Vehicle #{idx + 1}</span>
                      <button type="button" onClick={() => removeVehicle(v.id)} disabled={vehicles.length === 1} className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Field label="Vehicle No">
                        <div className="relative">
                          <Truck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="e.g. GH-5423" value={v.vehicleNo} onChange={(e) => updateVehicle(v.id, { vehicleNo: e.target.value })} className="pl-9 h-10 bg-card" />
                        </div>
                      </Field>
                      <Field label="Vehicle Capacity">
                        <div className="flex gap-2">
                          <Input type="number" placeholder="0" value={v.capacity} onChange={(e) => updateVehicle(v.id, { capacity: e.target.value })} className="h-10 bg-card" />
                          <Select value={capacityUnit} onValueChange={setCapacityUnit}>
                            <SelectTrigger className="w-24 h-10 bg-card"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sqft">sqft</SelectItem>
                              <SelectItem value="cube">cube</SelectItem>
                              <SelectItem value="ton">ton</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </Field>
                      <Field label="Driver Name">
                        <Input placeholder="Driver name" value={v.driverName} onChange={(e) => updateVehicle(v.id, { driverName: e.target.value })} className="h-10 bg-card" />
                      </Field>
                      <Field label="Driver Contact">
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input placeholder="+94 77 000 0000" value={v.driverPhone} onChange={(e) => updateVehicle(v.id, { driverPhone: e.target.value })} className="pl-9 h-10 bg-card" />
                        </div>
                      </Field>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={addVehicle} className="w-full rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary py-3 text-sm font-medium transition-smooth flex items-center justify-center gap-2">
                  <Plus className="h-4 w-4" /> Add Vehicle
                </button>
                <div className={cn("rounded-lg border px-3 py-2 text-xs flex items-center justify-between", capacityShort ? "border-warning/40 bg-warning/10 text-warning" : "border-border bg-muted/30 text-muted-foreground")}>
                  <span>Total vehicle capacity</span>
                  <span className="font-mono font-semibold">{totalCapacity} {capacityUnit}{qtyNum > 0 ? ` / ${qtyNum} ${qtyUnit} required` : ""}</span>
                </div>
                {capacityShort && (
                  <p className="text-xs text-warning font-medium">⚠ Total vehicle capacity is less than required quantity.</p>
                )}
              </div>
              <div className="mt-4">
                <Field label="Delivery Address" required>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea placeholder="Building, street, city..." value={address} onChange={(e) => setAddress(e.target.value)} className="pl-9 min-h-[80px] bg-background resize-none" />
                  </div>
                </Field>
              </div>
            </Section>

            <Section icon={Wallet} title="Payment" description="Discounts, method, and amount paid.">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Discount">
                  <div className="flex gap-2">
                    <Select value={discountCurrency} onValueChange={setDiscountCurrency}>
                      <SelectTrigger className="w-24 h-11 bg-background"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LKR">LKR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="%">%</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="number" placeholder="0" value={discount} onChange={(e) => setDiscount(e.target.value)} className="h-11 bg-background" />
                  </div>
                </Field>
                <Field label="Payment Method">
                  <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                    <SelectTrigger className="h-11 bg-background"><SelectValue placeholder="Select method" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="credit">Credit</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Field label="Amount Paid">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">LKR</span>
                    <Input type="number" placeholder="0" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} className="pl-12 h-11 bg-background" />
                  </div>
                </Field>
                <Field label="Reference / Note">
                  <Input placeholder="Cheque #, Txn ID..." value={paymentNote} onChange={(e) => setPaymentNote(e.target.value)} className="h-11 bg-background" />
                </Field>
              </div>
            </Section>

            <Section icon={Receipt} title="Additional Charges" description="Fuel, tolls, loading or other expenses.">
              <div className="space-y-3">
                {charges.map((c, idx) => (
                  <div key={c.id} className="rounded-xl border border-border bg-background p-4 group hover:border-primary/30 transition-smooth">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Charge #{idx + 1}</span>
                      <button onClick={() => removeCharge(c.id)} className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Select value={c.type} onValueChange={(v) => updateCharge(c.id, { type: v })}>
                        <SelectTrigger className="h-10 bg-card"><SelectValue placeholder="Expense type" /></SelectTrigger>
                        <SelectContent>
                          {expenseTypes.map((t) => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
                        </SelectContent>
                      </Select>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">LKR</span>
                        <Input type="number" placeholder="Amount" value={c.amount} onChange={(e) => updateCharge(c.id, { amount: e.target.value })} className="pl-12 h-10 bg-card" />
                      </div>
                    </div>
                    <Input placeholder="Optional note..." value={c.comment} onChange={(e) => updateCharge(c.id, { comment: e.target.value })} className="h-10 bg-card mt-3" />
                    <label className="mt-3 flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
                      <Checkbox checked={c.addToInvoice} onCheckedChange={(v) => updateCharge(c.id, { addToInvoice: !!v })} />
                      <span>Add to Invoice</span>
                      <span className="text-muted-foreground font-normal">— include this charge in the customer invoice</span>
                    </label>
                  </div>
                ))}
                <button type="button" onClick={addCharge} className="w-full rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary py-4 text-sm font-medium transition-smooth flex items-center justify-center gap-2">
                  <Plus className="h-4 w-4" /> Add Charge
                </button>
              </div>
            </Section>

            <Section icon={StickyNote} title="Notes" description="Internal comments or special instructions.">
              <Textarea placeholder="Anything the team should know..." value={notes} onChange={(e) => setNotes(e.target.value)} className="min-h-[110px] bg-background resize-none" />
            </Section>
    </FormShell>
  );
}

