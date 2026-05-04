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
  X,
  StickyNote,
  Search,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Separator } from "@/components/ui/separator";

interface AddOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const expenseTypes = ["Fuel", "Toll", "Loading", "Driver Allowance", "Maintenance", "Other"];

type Charge = { id: string; type: string; amount: string; comment: string };

const SectionHeader = ({
  icon: Icon,
  title,
  step,
}: {
  icon: any;
  title: string;
  step: number;
}) => (
  <div className="flex items-center gap-3 mb-4">
    <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary text-primary-foreground shadow-glow">
      <Icon className="h-4 w-4" />
    </div>
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Step {step}
      </p>
      <h3 className="text-base font-display font-semibold tracking-tight">{title}</h3>
    </div>
  </div>
);

const Field = ({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("space-y-1.5", className)}>
    <Label className="text-xs font-medium text-foreground/80">
      {label}
      {required && <span className="text-primary ml-0.5">*</span>}
    </Label>
    {children}
  </div>
);

export function AddOrderDialog({ open, onOpenChange }: AddOrderDialogProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("09:00");
  const [customerOpen, setCustomerOpen] = useState(false);
  const [customerId, setCustomerId] = useState<string>("");
  const [phone, setPhone] = useState("");
  const [orderType, setOrderType] = useState("");
  const [sandType, setSandType] = useState("");
  const [vehicleOwner, setVehicleOwner] = useState<"own" | "customer">("own");
  const [vehicle, setVehicle] = useState("");
  const [capacity, setCapacity] = useState("");
  const [capacityUnit, setCapacityUnit] = useState("sqft");
  const [address, setAddress] = useState("");
  const [driverId, setDriverId] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
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
  const grandTotal = Math.max(0, subtotal - discountVal) + totalCharges;

  const addCharge = () =>
    setCharges((c) => [
      ...c,
      { id: crypto.randomUUID(), type: "", amount: "", comment: "" },
    ]);
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

  const handleSelectDriver = (id: string) => {
    setDriverId(id);
    const d = drivers.find((x) => x.id === id);
    if (d) setDriverPhone(d.phone);
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-LK", { style: "currency", currency: "LKR", maximumFractionDigits: 0 }).format(n);

  const submit = () => {
    if (!selectedCustomer || !sandType || !qty) {
      toast.error("Please fill in customer, sand type and quantity");
      return;
    }
    toast.success("Order created", { description: `Total ${fmt(grandTotal)} for ${selectedCustomer.name}` });
    onOpenChange(false);
  };

  const saveDraft = () => {
    toast("Saved as draft", { description: "You can finish it later from the Drafts tab." });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 py-5 border-b border-border bg-gradient-to-br from-card to-secondary/40">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-display font-bold tracking-tight">
                New Order
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                Create a new sand supply order with customer, vehicle and payment details.
              </DialogDescription>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Order ID</p>
              <p className="text-sm font-mono font-semibold text-foreground">OD_12458</p>
            </div>
          </div>
        </DialogHeader>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-7">
          {/* 1. Date & Time */}
          <section>
            <SectionHeader icon={CalendarIcon} title="Date & Time" step={1} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Order Date" required>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "justify-start text-left font-normal h-10 bg-background",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </Field>
              <Field label="Order Time" required>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger className="h-10 bg-background">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 * 2 }).map((_, i) => {
                      const h = String(Math.floor(i / 2)).padStart(2, "0");
                      const m = i % 2 === 0 ? "00" : "30";
                      const v = `${h}:${m}`;
                      return (
                        <SelectItem key={v} value={v}>
                          {v}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </section>

          {/* 2. Customer */}
          <section>
            <SectionHeader icon={User} title="Customer Details" step={2} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Customer Name" required>
                <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "h-10 w-full justify-between bg-background font-normal",
                        !selectedCustomer && "text-muted-foreground"
                      )}
                    >
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
                            <CommandItem
                              key={c.id}
                              value={c.name}
                              onSelect={() => handleSelectCustomer(c.id)}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  customerId === c.id ? "opacity-100" : "opacity-0"
                                )}
                              />
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
              <Field label="Customer Contact Number" required>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="+94 77 000 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-9 h-10 bg-background"
                  />
                </div>
              </Field>
            </div>
          </section>

          {/* 3. Order Details */}
          <section>
            <SectionHeader icon={Package} title="Order Details" step={3} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Order Type" required>
                <Select value={orderType} onValueChange={setOrderType}>
                  <SelectTrigger className="h-10 bg-background">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="wholesale">Wholesale</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Sand Type" required>
                <Select value={sandType} onValueChange={setSandType}>
                  <SelectTrigger className="h-10 bg-background">
                    <SelectValue placeholder="Select sand type" />
                  </SelectTrigger>
                  <SelectContent>
                    {sandTypes.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {/* Vehicle ownership */}
            <div className="mt-4 rounded-xl border border-border bg-secondary/30 p-4">
              <Label className="text-xs font-medium text-foreground/80 mb-3 block">
                Vehicle Ownership <span className="text-primary">*</span>
              </Label>
              <RadioGroup
                value={vehicleOwner}
                onValueChange={(v) => setVehicleOwner(v as any)}
                className="grid grid-cols-2 gap-3"
              >
                {[
                  { v: "own", label: "Own Vehicle", desc: "Use company fleet" },
                  { v: "customer", label: "Customer Vehicle", desc: "Customer arranges transport" },
                ].map((opt) => (
                  <label
                    key={opt.v}
                    className={cn(
                      "flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-smooth",
                      vehicleOwner === opt.v
                        ? "border-primary bg-card shadow-sm ring-1 ring-primary/20"
                        : "border-border bg-card hover:border-primary/40"
                    )}
                  >
                    <RadioGroupItem value={opt.v} className="mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">{opt.label}</p>
                      <p className="text-xs text-muted-foreground">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </RadioGroup>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                <Field label="Vehicle Number">
                  <div className="relative">
                    <Truck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="e.g. GH-5423"
                      value={vehicle}
                      onChange={(e) => setVehicle(e.target.value)}
                      className="pl-9 h-10 bg-background"
                    />
                  </div>
                </Field>
                <Field label="Vehicle Capacity">
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="0"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      className="h-10 bg-background"
                    />
                    <Select value={capacityUnit} onValueChange={setCapacityUnit}>
                      <SelectTrigger className="w-24 h-10 bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sqft">sqft</SelectItem>
                        <SelectItem value="cube">cube</SelectItem>
                        <SelectItem value="ton">ton</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </Field>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-3">
              <Field label="Delivery Address" required>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    placeholder="Building, street, city..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="pl-9 min-h-[72px] bg-background resize-none"
                  />
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <Field label="Driver Name">
                <Select value={driverId} onValueChange={handleSelectDriver}>
                  <SelectTrigger className="h-10 bg-background">
                    <SelectValue placeholder="Select driver" />
                  </SelectTrigger>
                  <SelectContent>
                    {drivers.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Driver Contact Number">
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="+94 77 000 0000"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    className="pl-9 h-10 bg-background"
                  />
                </div>
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <Field label="Order Quantity" required>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="0"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="h-10 bg-background"
                  />
                  <Select value={qtyUnit} onValueChange={setQtyUnit}>
                    <SelectTrigger className="w-24 h-10 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sqft">sqft</SelectItem>
                      <SelectItem value="cube">cube</SelectItem>
                      <SelectItem value="ton">ton</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Field>
              <Field label="Unit Price (auto)">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                    LKR
                  </span>
                  <Input
                    value={unitPrice ? unitPrice.toLocaleString() : ""}
                    placeholder="Select sand type"
                    disabled
                    className="pl-12 h-10 bg-muted/60 font-medium"
                  />
                </div>
              </Field>
            </div>
          </section>

          {/* 4. Payment */}
          <section>
            <SectionHeader icon={Wallet} title="Payment Details" step={4} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Discount">
                <div className="flex gap-2">
                  <Select value={discountCurrency} onValueChange={setDiscountCurrency}>
                    <SelectTrigger className="w-24 h-10 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LKR">LKR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="%">%</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="0"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="h-10 bg-background"
                  />
                </div>
              </Field>
              <Field label="Payment Method">
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="h-10 bg-background">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
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

            {/* Total summary bar */}
            <div className="mt-4 rounded-xl gradient-dark p-4 text-sidebar-foreground shadow-elevated">
              <div className="flex items-center justify-between text-xs mb-2 opacity-80">
                <span>
                  Subtotal: {fmt(subtotal)}{discountVal > 0 && ` − ${fmt(discountVal)} discount`}
                </span>
                <span>Charges: {fmt(totalCharges)}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-xs uppercase tracking-wider opacity-70">Total Order Price</span>
                <span className="text-2xl font-display font-bold text-primary-glow">
                  {fmt(grandTotal)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <Field label="Payment Amount">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                    LKR
                  </span>
                  <Input
                    type="number"
                    placeholder="0"
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="pl-12 h-10 bg-background"
                  />
                </div>
              </Field>
              <Field label="Payment Note">
                <Input
                  placeholder="Reference, cheque #, etc."
                  value={paymentNote}
                  onChange={(e) => setPaymentNote(e.target.value)}
                  className="h-10 bg-background"
                />
              </Field>
            </div>
          </section>

          {/* 5. Additional Charges */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <SectionHeader icon={Receipt} title="Additional Charges" step={5} />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addCharge}
                className="gap-1.5 border-dashed border-primary/40 text-primary hover:bg-primary/5"
              >
                <Plus className="h-3.5 w-3.5" /> Add Charge
              </Button>
            </div>

            {charges.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-secondary/20 p-6 text-center">
                <Receipt className="h-8 w-8 text-muted-foreground/60 mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">No additional charges</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Click "Add Charge" to include fuel, tolls, or other expenses.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {charges.map((c, idx) => (
                  <div
                    key={c.id}
                    className="rounded-xl border border-border bg-card p-4 shadow-sm relative group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-muted-foreground">
                        Charge #{idx + 1}
                      </span>
                      <button
                        onClick={() => removeCharge(c.id)}
                        className="h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-smooth"
                        aria-label="Remove charge"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <Field label="Expense Type">
                        <Select
                          value={c.type}
                          onValueChange={(v) => updateCharge(c.id, { type: v })}
                        >
                          <SelectTrigger className="h-10 bg-background">
                            <SelectValue placeholder="Select expense" />
                          </SelectTrigger>
                          <SelectContent>
                            {expenseTypes.map((t) => (
                              <SelectItem key={t} value={t}>
                                {t}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="Amount">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground">
                            LKR
                          </span>
                          <Input
                            type="number"
                            placeholder="0"
                            value={c.amount}
                            onChange={(e) => updateCharge(c.id, { amount: e.target.value })}
                            className="pl-12 h-10 bg-background"
                          />
                        </div>
                      </Field>
                    </div>
                    <Field label="Comments" className="mt-3">
                      <Input
                        placeholder="Optional note..."
                        value={c.comment}
                        onChange={(e) => updateCharge(c.id, { comment: e.target.value })}
                        className="h-10 bg-background"
                      />
                    </Field>
                  </div>
                ))}

                {/* Total expenses bar */}
                <div className="sticky bottom-0 rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-3 flex items-center justify-between backdrop-blur">
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground/80">
                    Total Expenses
                  </span>
                  <span className="text-lg font-display font-bold text-primary">
                    {fmt(totalCharges)}
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* 6. Final Comments */}
          <section>
            <SectionHeader icon={StickyNote} title="Final Comments" step={6} />
            <Textarea
              placeholder="Special instructions, internal notes, or anything else..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[110px] bg-background resize-none"
            />
          </section>
        </div>

        {/* Footer actions */}
        <Separator />
        <div className="px-6 py-4 bg-card flex items-center justify-between gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={saveDraft}
              className="border-primary/40 text-primary hover:bg-primary/5 hover:text-primary"
            >
              Save as Draft
            </Button>
            <Button
              onClick={submit}
              className="gap-2 gradient-primary border-0 shadow-glow hover:shadow-elevated transition-smooth"
            >
              <Plus className="h-4 w-4" /> Add Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
