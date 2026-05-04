import { useMemo, useRef, useState } from "react";
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
  ChevronRight,
  Sparkles,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { Sheet, SheetContent } from "@/components/ui/sheet";
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

const sections = [
  { id: "schedule", label: "Schedule", icon: CalendarIcon },
  { id: "customer", label: "Customer", icon: User },
  { id: "order", label: "Order", icon: Package },
  { id: "logistics", label: "Logistics", icon: Truck },
  { id: "payment", label: "Payment", icon: Wallet },
  { id: "charges", label: "Charges", icon: Receipt },
  { id: "notes", label: "Notes", icon: StickyNote },
] as const;

type SectionId = typeof sections[number]["id"];

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

const SectionTitle = ({
  id,
  icon: Icon,
  title,
  description,
  refCb,
}: {
  id: string;
  icon: any;
  title: string;
  description: string;
  refCb: (el: HTMLElement | null) => void;
}) => (
  <div ref={refCb as any} id={id} className="scroll-mt-6 mb-5 flex items-center gap-3">
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
      <Icon className="h-4 w-4" />
    </div>
    <div>
      <h3 className="text-sm font-display font-bold tracking-tight text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
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
  const [activeSection, setActiveSection] = useState<SectionId>("schedule");

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const scrollRef = useRef<HTMLDivElement | null>(null);

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
  const paid = parseFloat(paymentAmount || "0");
  const balance = grandTotal - paid;

  // Completion tracking for stepper progress
  const completion: Record<SectionId, boolean> = {
    schedule: !!date && !!time,
    customer: !!customerId && !!phone,
    order: !!orderType && !!sandType && !!qty,
    logistics: !!address,
    payment: !!paymentMethod,
    charges: charges.length === 0 || charges.every((c) => c.type && c.amount),
    notes: true,
  };
  const completedCount = Object.entries(completion).filter(([k, v]) => v && k !== "notes").length;
  const progress = Math.round((completedCount / 6) * 100);

  const addCharge = () =>
    setCharges((c) => [...c, { id: crypto.randomUUID(), type: "", amount: "", comment: "" }]);
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
    new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(n);

  const scrollTo = (id: SectionId) => {
    const el = sectionRefs.current[id];
    if (el && scrollRef.current) {
      scrollRef.current.scrollTo({ top: el.offsetTop - 16, behavior: "smooth" });
      setActiveSection(id);
    }
  };

  const onScroll = () => {
    if (!scrollRef.current) return;
    const top = scrollRef.current.scrollTop;
    let current: SectionId = "schedule";
    for (const s of sections) {
      const el = sectionRefs.current[s.id];
      if (el && el.offsetTop - 80 <= top) current = s.id;
    }
    setActiveSection(current);
  };

  const submit = () => {
    if (!selectedCustomer || !sandType || !qty) {
      toast.error("Missing fields", { description: "Customer, sand type and quantity are required." });
      return;
    }
    toast.success("Order created", {
      description: `${fmt(grandTotal)} • ${selectedCustomer.name}`,
    });
    onOpenChange(false);
  };

  const saveDraft = () => {
    toast("Saved as draft", { description: "Resume from the Drafts tab anytime." });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="p-0 gap-0 w-full sm:max-w-[1100px] sm:w-[95vw] flex flex-col bg-background border-l"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-card/60 backdrop-blur flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-10 w-10 rounded-xl gradient-primary grid place-items-center shadow-glow shrink-0">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-display font-bold tracking-tight truncate">New Order</h2>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border">
                  OD_12458
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">
                Capture customer, logistics, and payment details in one flow.
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Completion</p>
              <p className="text-sm font-semibold text-foreground">{progress}%</p>
            </div>
            <div className="w-32 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full gradient-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Body: stepper sidebar + scrollable form + summary rail */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-[200px_1fr_320px] min-h-0">
          {/* Stepper */}
          <aside className="hidden md:block border-r border-border bg-muted/20 px-3 py-5 overflow-y-auto">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-3 mb-2">
              Sections
            </p>
            <nav className="space-y-0.5">
              {sections.map((s, i) => {
                const Icon = s.icon;
                const done = completion[s.id];
                const active = activeSection === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-smooth group",
                      active
                        ? "bg-card text-foreground shadow-sm border border-border"
                        : "text-muted-foreground hover:text-foreground hover:bg-card/60"
                    )}
                  >
                    <span
                      className={cn(
                        "h-6 w-6 rounded-md grid place-items-center text-[11px] font-semibold shrink-0 transition-smooth",
                        done
                          ? "bg-success/15 text-success"
                          : active
                          ? "gradient-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                    </span>
                    <span className="flex-1 text-left font-medium">{s.label}</span>
                    {active && <ChevronRight className="h-3.5 w-3.5 text-primary" />}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Form */}
          <div ref={scrollRef} onScroll={onScroll} className="overflow-y-auto px-6 py-6">
            <div className="max-w-2xl mx-auto space-y-10">
              {/* Schedule */}
              <section>
                <SectionTitle
                  id="schedule"
                  icon={CalendarIcon}
                  title="Schedule"
                  description="When should this order be fulfilled?"
                  refCb={(el) => (sectionRefs.current.schedule = el)}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Order Date" required>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal h-11 bg-card",
                            !date && "text-muted-foreground"
                          )}
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
                      <SelectTrigger className="h-11 bg-card">
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

              {/* Customer */}
              <section>
                <SectionTitle
                  id="customer"
                  icon={User}
                  title="Customer"
                  description="Who is placing this order?"
                  refCb={(el) => (sectionRefs.current.customer = el)}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Customer" required>
                    <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "h-11 w-full justify-between bg-card font-normal",
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
                      <Input
                        placeholder="+94 77 000 0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-9 h-11 bg-card"
                      />
                    </div>
                  </Field>
                </div>
              </section>

              {/* Order */}
              <section>
                <SectionTitle
                  id="order"
                  icon={Package}
                  title="Order"
                  description="Type, material, and quantity."
                  refCb={(el) => (sectionRefs.current.order = el)}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Order Type" required>
                    <Select value={orderType} onValueChange={setOrderType}>
                      <SelectTrigger className="h-11 bg-card"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="retail">Retail</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="wholesale">Wholesale</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Sand Type" required>
                    <Select value={sandType} onValueChange={setSandType}>
                      <SelectTrigger className="h-11 bg-card"><SelectValue placeholder="Select sand type" /></SelectTrigger>
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
                      <Input
                        type="number"
                        placeholder="0"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                        className="h-11 bg-card"
                      />
                      <Select value={qtyUnit} onValueChange={setQtyUnit}>
                        <SelectTrigger className="w-24 h-11 bg-card"><SelectValue /></SelectTrigger>
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
              </section>

              {/* Logistics */}
              <section>
                <SectionTitle
                  id="logistics"
                  icon={Truck}
                  title="Logistics"
                  description="Vehicle, driver, and delivery."
                  refCb={(el) => (sectionRefs.current.logistics = el)}
                />

                {/* Vehicle ownership segmented */}
                <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted/40 border border-border mb-4">
                  {[
                    { v: "own", label: "Own Vehicle", desc: "Company fleet" },
                    { v: "customer", label: "Customer Vehicle", desc: "Customer transport" },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setVehicleOwner(opt.v as any)}
                      className={cn(
                        "px-4 py-2.5 rounded-lg text-left transition-smooth",
                        vehicleOwner === opt.v
                          ? "bg-card shadow-sm ring-1 ring-primary/30"
                          : "hover:bg-card/60"
                      )}
                    >
                      <p className={cn("text-sm font-semibold", vehicleOwner === opt.v ? "text-foreground" : "text-muted-foreground")}>
                        {opt.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground">{opt.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Vehicle Number">
                    <div className="relative">
                      <Truck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="e.g. GH-5423"
                        value={vehicle}
                        onChange={(e) => setVehicle(e.target.value)}
                        className="pl-9 h-11 bg-card"
                      />
                    </div>
                  </Field>
                  <Field label="Capacity">
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="0"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        className="h-11 bg-card"
                      />
                      <Select value={capacityUnit} onValueChange={setCapacityUnit}>
                        <SelectTrigger className="w-24 h-11 bg-card"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sqft">sqft</SelectItem>
                          <SelectItem value="cube">cube</SelectItem>
                          <SelectItem value="ton">ton</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </Field>
                </div>

                <div className="mt-4">
                  <Field label="Delivery Address" required>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        placeholder="Building, street, city..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="pl-9 min-h-[80px] bg-card resize-none"
                      />
                    </div>
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Field label="Driver">
                    <Select value={driverId} onValueChange={handleSelectDriver}>
                      <SelectTrigger className="h-11 bg-card"><SelectValue placeholder="Select driver" /></SelectTrigger>
                      <SelectContent>
                        {drivers.map((d) => (
                          <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Driver Contact">
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="+94 77 000 0000"
                        value={driverPhone}
                        onChange={(e) => setDriverPhone(e.target.value)}
                        className="pl-9 h-11 bg-card"
                      />
                    </div>
                  </Field>
                </div>
              </section>

              {/* Payment */}
              <section>
                <SectionTitle
                  id="payment"
                  icon={Wallet}
                  title="Payment"
                  description="Discounts, method, and amount paid."
                  refCb={(el) => (sectionRefs.current.payment = el)}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Discount">
                    <div className="flex gap-2">
                      <Select value={discountCurrency} onValueChange={setDiscountCurrency}>
                        <SelectTrigger className="w-24 h-11 bg-card"><SelectValue /></SelectTrigger>
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
                        className="h-11 bg-card"
                      />
                    </div>
                  </Field>
                  <Field label="Payment Method">
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="h-11 bg-card"><SelectValue placeholder="Select method" /></SelectTrigger>
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
                      <Input
                        type="number"
                        placeholder="0"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="pl-12 h-11 bg-card"
                      />
                    </div>
                  </Field>
                  <Field label="Reference / Note">
                    <Input
                      placeholder="Cheque #, Txn ID..."
                      value={paymentNote}
                      onChange={(e) => setPaymentNote(e.target.value)}
                      className="h-11 bg-card"
                    />
                  </Field>
                </div>
              </section>

              {/* Charges */}
              <section>
                <SectionTitle
                  id="charges"
                  icon={Receipt}
                  title="Additional Charges"
                  description="Fuel, tolls, loading or other expenses."
                  refCb={(el) => (sectionRefs.current.charges = el)}
                />

                <div className="space-y-3">
                  {charges.map((c, idx) => (
                    <div
                      key={c.id}
                      className="rounded-xl border border-border bg-card p-4 group hover:border-primary/30 transition-smooth"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          Charge #{idx + 1}
                        </span>
                        <button
                          onClick={() => removeCharge(c.id)}
                          className="opacity-0 group-hover:opacity-100 transition-smooth h-7 w-7 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          aria-label="Remove charge"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Select value={c.type} onValueChange={(v) => updateCharge(c.id, { type: v })}>
                          <SelectTrigger className="h-10 bg-background"><SelectValue placeholder="Expense type" /></SelectTrigger>
                          <SelectContent>
                            {expenseTypes.map((t) => (
                              <SelectItem key={t} value={t}>{t}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">LKR</span>
                          <Input
                            type="number"
                            placeholder="Amount"
                            value={c.amount}
                            onChange={(e) => updateCharge(c.id, { amount: e.target.value })}
                            className="pl-12 h-10 bg-background"
                          />
                        </div>
                      </div>
                      <Input
                        placeholder="Optional note..."
                        value={c.comment}
                        onChange={(e) => updateCharge(c.id, { comment: e.target.value })}
                        className="h-10 bg-background mt-3"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addCharge}
                    className="w-full rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 text-muted-foreground hover:text-primary py-4 text-sm font-medium transition-smooth flex items-center justify-center gap-2"
                  >
                    <Plus className="h-4 w-4" /> Add Charge
                  </button>
                </div>
              </section>

              {/* Notes */}
              <section className="pb-4">
                <SectionTitle
                  id="notes"
                  icon={StickyNote}
                  title="Notes"
                  description="Internal comments or special instructions."
                  refCb={(el) => (sectionRefs.current.notes = el)}
                />
                <Textarea
                  placeholder="Anything the team should know..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="min-h-[110px] bg-card resize-none"
                />
              </section>
            </div>
          </div>

          {/* Live summary rail */}
          <aside className="hidden md:flex flex-col border-l border-border bg-muted/20 overflow-y-auto">
            <div className="p-5 border-b border-border">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Live Summary
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Updates as you type</p>
            </div>

            <div className="p-5 space-y-4 flex-1">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Customer</p>
                <p className="text-sm font-medium text-foreground">
                  {selectedCustomer?.name || <span className="text-muted-foreground italic">Not selected</span>}
                </p>
                {phone && <p className="text-xs text-muted-foreground">{phone}</p>}
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Material</p>
                <p className="text-sm font-medium text-foreground">
                  {selectedSand?.label || <span className="text-muted-foreground italic">Not selected</span>}
                </p>
                {qty && <p className="text-xs text-muted-foreground">{qty} {qtyUnit}</p>}
              </div>

              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Delivery</p>
                <p className="text-sm font-medium text-foreground line-clamp-2">
                  {address || <span className="text-muted-foreground italic">No address</span>}
                </p>
              </div>

              <div className="h-px bg-border" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono text-foreground">{fmt(subtotal)}</span>
                </div>
                {discountVal > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Discount</span>
                    <span className="font-mono text-destructive">−{fmt(discountVal)}</span>
                  </div>
                )}
                {totalCharges > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>Charges</span>
                    <span className="font-mono text-foreground">+{fmt(totalCharges)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Total card */}
            <div className="m-4 rounded-2xl gradient-dark p-5 text-sidebar-foreground shadow-elevated">
              <p className="text-[10px] uppercase tracking-wider opacity-70">Grand Total</p>
              <p className="text-3xl font-display font-bold text-primary-glow mt-1">
                {fmt(grandTotal)}
              </p>
              {paid > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="opacity-70">Balance due</span>
                  <span className={cn("font-semibold font-mono", balance > 0 ? "text-warning" : "text-success")}>
                    {fmt(Math.max(0, balance))}
                  </span>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-border bg-card/60 backdrop-blur flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-muted-foreground">
            Cancel
          </Button>

          <div className="md:hidden text-sm font-display font-bold text-foreground">
            {fmt(grandTotal)}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={saveDraft}
              className="border-primary/30 text-primary hover:bg-primary/5 hover:text-primary"
            >
              Save as Draft
            </Button>
            <Button
              onClick={submit}
              className="gap-2 gradient-primary border-0 shadow-glow hover:shadow-elevated transition-smooth px-6"
            >
              <Plus className="h-4 w-4" /> Add Order
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
