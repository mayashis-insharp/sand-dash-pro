import { useState } from "react";
import { PageShell, TabBar, Pagination } from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Search, Eye, Edit, Download, Trash2, Receipt as ReceiptIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const tabs = ["Employees", "Job Role", "Salary Payment", "Drafts"] as const;
const salarySubs = ["Fixed Salary", "Trip-Based", "ETF/EPF"] as const;

const employees = [
  { id: "EM_101", name: "Sunil Bandara", contact: "+94770001111", nic: "851234567V", role: "Driver", salaryType: "Basic Salary", salary: 65000, status: "working" },
  { id: "EM_102", name: "Kamal Silva", contact: "+94770002222", nic: "881111111V", role: "Driver", salaryType: "Trip-Based", salary: 1200, status: "working" },
  { id: "EM_103", name: "Nimal Perera", contact: "+94770003333", nic: "902222222V", role: "Loader", salaryType: "Basic Salary", salary: 48000, status: "working" },
  { id: "EM_104", name: "Anura Fernando", contact: "+94770004444", nic: "751111222V", role: "Driver", salaryType: "Basic Salary", salary: 70000, status: "not-working" },
];

const roles = [
  { role: "Driver", per: "Monthly", basic: 65000 },
  { role: "Loader", per: "Daily", basic: 2500 },
  { role: "Site Manager", per: "Monthly", basic: 95000 },
];

const fixedPayments = [
  { date: "01/02/2026", emp: "Sunil Bandara", etf: "EPF_8821", basic: 65000, advance: 10000, total: 55000, method: "Bank Transfer", comments: "Feb" },
  { date: "01/02/2026", emp: "Nimal Perera", etf: "EPF_8822", basic: 48000, advance: 0, total: 48000, method: "Cash", comments: "" },
];

const tripPayments = [
  { date: "10/02/2026", emp: "Kamal Silva", trips: 18, total: 21600, paid: 18000, due: 3600, method: "Cash", comments: "" },
];

const epfRows = [
  { etf: "EPF_8821", emp: "Sunil Bandara", basic: 65000, epf8: 5200, epf12: 7800, etf3: 1950, comments: "Feb" },
  { etf: "EPF_8822", emp: "Nimal Perera", basic: 48000, epf8: 3840, epf12: 5760, etf3: 1440, comments: "Feb" },
];

const drafts = [
  { no: "DR_EMP1", type: "Employee", created: "06/02/2026 09:11", edited: "07/02/2026 14:05" },
];

const Employees = () => {
  const [tab, setTab] = useState<typeof tabs[number]>("Employees");
  const [salSub, setSalSub] = useState<typeof salarySubs[number]>("Fixed Salary");
  const [addEmp, setAddEmp] = useState(false);
  const [addRole, setAddRole] = useState(false);
  const [editRole, setEditRole] = useState<any>(null);
  const [delRole, setDelRole] = useState<any>(null);
  const [viewEmp, setViewEmp] = useState<any>(null);
  const [editEmp, setEditEmp] = useState<any>(null);
  const [delEmp, setDelEmp] = useState<any>(null);
  const [salaryReceipt, setSalaryReceipt] = useState<any>(null);
  const [addPayment, setAddPayment] = useState(false);
  const [payEpf, setPayEpf] = useState<any>(null);
  const [paymentType, setPaymentType] = useState("monthly");
  const [salaryType, setSalaryType] = useState("basic");
  const [epf, setEpf] = useState(false);

  const renderEmpTable = (status: "working" | "not-working") => (
    <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden mb-5">
      <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
        <h4 className="text-sm font-display font-bold">{status === "working" ? "Working" : "Not Working"}</h4>
        <span className="text-xs text-muted-foreground">{employees.filter(e => e.status === status).length} employees</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-muted/50 border-b border-border">{["ID", "Full Name", "Contact", "NIC", "Job Role", "Salary Type", "Salary", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold whitespace-nowrap">{h}</th>)}</tr></thead>
          <tbody>
            {employees.filter(e => e.status === status).map(e => (
              <tr key={e.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                <td className="px-4 py-4 font-mono text-xs font-semibold">{e.id}</td>
                <td className="px-4 py-4 font-medium">{e.name}</td>
                <td className="px-4 py-4 font-mono text-xs">{e.contact}</td>
                <td className="px-4 py-4 font-mono text-xs">{e.nic}</td>
                <td className="px-4 py-4">{e.role}</td>
                <td className="px-4 py-4"><span className="inline-flex rounded-md border border-info/20 bg-info/10 text-info px-2 py-0.5 text-[11px] font-medium">{e.salaryType}</span></td>
                <td className="px-4 py-4 font-mono">{e.salary.toLocaleString()}</td>
                <td className="px-4 py-4"><div className="flex gap-1"><button onClick={() => setViewEmp(e)} className="rounded-md px-2 py-1 hover:bg-muted"><Eye className="h-3.5 w-3.5" /></button><button onClick={() => setEditEmp(e)} className="rounded-md px-2 py-1 hover:bg-muted"><Edit className="h-3.5 w-3.5" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <PageShell title="Employees" description="Manage your team, roles, and salary payments.">
      <TabBar
        tabs={tabs}
        active={tab}
        onChange={setTab}
        right={
          <>
            <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
            {tab === "Employees" && <Button size="sm" className="gap-2 gradient-primary border-0 shadow-glow" onClick={() => setAddEmp(true)}><Plus className="h-4 w-4" /> Add Employee</Button>}
            {tab === "Job Role" && <Button size="sm" className="gap-2 gradient-primary border-0 shadow-glow" onClick={() => setAddRole(true)}><Plus className="h-4 w-4" /> Add Job Role</Button>}
            {tab === "Salary Payment" && salSub !== "ETF/EPF" && <Button size="sm" className="gap-2 gradient-primary border-0 shadow-glow" onClick={() => setAddPayment(true)}><Plus className="h-4 w-4" /> Add Salary Payment</Button>}
          </>
        }
      />

      {tab === "Employees" && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search employees…" className="pl-9 h-10 bg-card" />
            </div>
          </div>
          {renderEmpTable("working")}{renderEmpTable("not-working")}
        </>
      )}

      {tab === "Job Role" && (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-muted/50 border-b border-border">{["Job Role", "Salary Per", "Basic Salary", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>)}</tr></thead>
            <tbody>
              {roles.map(r => (
                <tr key={r.role} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-4 font-medium">{r.role}</td>
                  <td className="px-4 py-4">{r.per}</td>
                  <td className="px-4 py-4 font-mono">{r.basic.toLocaleString()}</td>
                  <td className="px-4 py-4"><div className="flex gap-1"><button onClick={() => setEditRole(r)} className="rounded-md px-2 py-1 hover:bg-muted"><Edit className="h-3.5 w-3.5" /></button><button onClick={() => setDelRole(r)} className="rounded-md px-2 py-1 hover:bg-muted text-destructive"><Trash2 className="h-3.5 w-3.5" /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Salary Payment" && (
        <>
          <div className="flex items-center gap-1 mb-4 border-b border-border">
            {salarySubs.map(s => (
              <button key={s} onClick={() => setSalSub(s)} className={`relative px-4 py-2 text-sm font-medium transition-smooth ${salSub === s ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {s}{salSub === s && <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full gradient-primary" />}
              </button>
            ))}
          </div>
          <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              {salSub === "Fixed Salary" && (
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/50 border-b border-border">{["Date", "Employee", "ETF/EPF", "Basic", "Advance", "Total Earned", "Method", "Comments", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold whitespace-nowrap">{h}</th>)}</tr></thead>
                  <tbody>
                    {fixedPayments.map((p, i) => (
                      <tr key={i} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-4 text-muted-foreground">{p.date}</td>
                        <td className="px-4 py-4 font-medium">{p.emp}</td>
                        <td className="px-4 py-4 font-mono text-xs">{p.etf}</td>
                        <td className="px-4 py-4 font-mono">{p.basic.toLocaleString()}</td>
                        <td className="px-4 py-4 font-mono">{p.advance.toLocaleString()}</td>
                        <td className="px-4 py-4 font-mono font-semibold">{p.total.toLocaleString()}</td>
                        <td className="px-4 py-4">{p.method}</td>
                        <td className="px-4 py-4 text-muted-foreground text-xs">{p.comments || "—"}</td>
                        <td className="px-4 py-4"><div className="flex gap-1"><Button size="sm" variant="outline" onClick={() => toast.success("Settled")}>Settle</Button><button className="rounded-md px-2 py-1 hover:bg-muted"><Eye className="h-3.5 w-3.5" /></button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {salSub === "Trip-Based" && (
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/50 border-b border-border">{["Date", "Employee", "Trips", "Total Trip", "Paid", "Outstanding", "Method", "Comments", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold whitespace-nowrap">{h}</th>)}</tr></thead>
                  <tbody>
                    {tripPayments.map((p, i) => (
                      <tr key={i} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-4 text-muted-foreground">{p.date}</td>
                        <td className="px-4 py-4 font-medium">{p.emp}</td>
                        <td className="px-4 py-4">{p.trips}</td>
                        <td className="px-4 py-4 font-mono">{p.total.toLocaleString()}</td>
                        <td className="px-4 py-4 font-mono text-success">{p.paid.toLocaleString()}</td>
                        <td className="px-4 py-4 font-mono text-destructive">{p.due.toLocaleString()}</td>
                        <td className="px-4 py-4">{p.method}</td>
                        <td className="px-4 py-4 text-muted-foreground text-xs">{p.comments || "—"}</td>
                        <td className="px-4 py-4"><div className="flex gap-1"><Button size="sm" variant="outline" onClick={() => toast.success("Outstanding settled")}>Settle</Button><button className="rounded-md px-2 py-1 hover:bg-muted"><Eye className="h-3.5 w-3.5" /></button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {salSub === "ETF/EPF" && (
                <table className="w-full text-sm">
                  <thead><tr className="bg-muted/50 border-b border-border">{["ETF/EPF No", "Employee", "Basic", "EPF 8%", "EPF 12%", "ETF 3%", "Comments", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold whitespace-nowrap">{h}</th>)}</tr></thead>
                  <tbody>
                    {epfRows.map(r => (
                      <tr key={r.etf} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                        <td className="px-4 py-4 font-mono text-xs font-semibold">{r.etf}</td>
                        <td className="px-4 py-4 font-medium">{r.emp}</td>
                        <td className="px-4 py-4 font-mono">{r.basic.toLocaleString()}</td>
                        <td className="px-4 py-4 font-mono">{r.epf8.toLocaleString()}</td>
                        <td className="px-4 py-4 font-mono">{r.epf12.toLocaleString()}</td>
                        <td className="px-4 py-4 font-mono">{r.etf3.toLocaleString()}</td>
                        <td className="px-4 py-4 text-muted-foreground text-xs">{r.comments}</td>
                        <td className="px-4 py-4"><div className="flex gap-1"><Button size="sm" className="gradient-primary border-0" onClick={() => setPayEpf(r)}>Pay</Button><button className="rounded-md px-2 py-1 hover:bg-muted"><ReceiptIcon className="h-3.5 w-3.5" /></button></div></td>
                      </tr>
                    ))}
                    <tr className="bg-muted/30 font-semibold">
                      <td className="px-4 py-3" colSpan={2}>Totals</td>
                      <td className="px-4 py-3 font-mono">{epfRows.reduce((s, r) => s + r.basic, 0).toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono">{epfRows.reduce((s, r) => s + r.epf8, 0).toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono">{epfRows.reduce((s, r) => s + r.epf12, 0).toLocaleString()}</td>
                      <td className="px-4 py-3 font-mono">{epfRows.reduce((s, r) => s + r.etf3, 0).toLocaleString()}</td>
                      <td colSpan={2}></td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}

      {tab === "Drafts" && (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="bg-muted/50 border-b border-border">{["Draft No", "Type", "Created", "Last Edited", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>)}</tr></thead>
            <tbody>
              {drafts.map(d => (
                <tr key={d.no} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-4 font-mono text-xs font-semibold">{d.no}</td>
                  <td className="px-4 py-4">{d.type}</td>
                  <td className="px-4 py-4 text-muted-foreground text-xs">{d.created}</td>
                  <td className="px-4 py-4 text-muted-foreground text-xs">{d.edited}</td>
                  <td className="px-4 py-4"><Button size="sm" variant="outline" className="gap-1" onClick={() => setEditEmp(d)}><Edit className="h-3.5 w-3.5" /> Edit</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination from={1} to={4} total={32} />

      {/* Add Employee */}
      <Dialog open={addEmp} onOpenChange={setAddEmp}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add Employee</DialogTitle></DialogHeader>
          <div className="space-y-5">
            <section>
              <h4 className="text-sm font-display font-bold mb-3">Employee Details</h4>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Full Name</Label><Input className="mt-1.5" /></div>
                <div><Label>NIC</Label><Input className="mt-1.5" /></div>
                <div><Label>Contact No</Label><Input className="mt-1.5" /></div>
                <div className="col-span-2"><Label>Address</Label><Textarea className="mt-1.5" /></div>
              </div>
            </section>
            <section>
              <h4 className="text-sm font-display font-bold mb-3">Job Details</h4>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Joined Date</Label><Input type="date" className="mt-1.5" /></div>
                <div><Label>Job Role</Label><Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="d">Driver</SelectItem><SelectItem value="l">Loader</SelectItem></SelectContent></Select></div>
                <div className="col-span-2"><Label>Salary Type</Label>
                  <Select value={salaryType} onValueChange={setSalaryType}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Salary</SelectItem>
                      <SelectItem value="trip">Trip-Based</SelectItem>
                      <SelectItem value="both">Basic & Trip-Based</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(salaryType === "basic" || salaryType === "both") && <div className="col-span-2"><Label>Basic Salary</Label><Input className="mt-1.5" /></div>}
                <div className="col-span-2 flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2.5">
                  <Checkbox checked={epf} onCheckedChange={(v) => setEpf(!!v)} id="epf" />
                  <Label htmlFor="epf" className="cursor-pointer">EPF / ETF Applicable</Label>
                </div>
                {epf && <div className="col-span-2"><Label>ETF / EPF Number</Label><Input className="mt-1.5" /></div>}
                <div className="col-span-2"><Label>Status</Label>
                  <RadioGroup defaultValue="working" className="mt-1.5 grid grid-cols-2 gap-3">
                    {[{ v: "working", l: "Working" }, { v: "not-working", l: "Not Working" }].map(o => (
                      <label key={o.v} className="flex items-center gap-2 rounded-xl border border-border p-2.5 cursor-pointer hover:bg-muted/30"><RadioGroupItem value={o.v} /> {o.l}</label>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </section>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddEmp(false)}>Cancel</Button>
            <Button variant="outline" onClick={() => { toast.success("Saved as draft"); setAddEmp(false); }}>Save as Draft</Button>
            <Button className="gradient-primary border-0" onClick={() => { toast.success("Employee added"); setAddEmp(false); }}>Add Employee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Employee */}
      <Dialog open={!!viewEmp} onOpenChange={(o) => !o && setViewEmp(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Employee Details</DialogTitle></DialogHeader>
          {viewEmp && (
            <div className="space-y-5">
              <section>
                <h4 className="text-sm font-display font-bold mb-3">Employee Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-xs text-muted-foreground">Name</p><p className="font-medium">{viewEmp.name}</p></div>
                  <div><p className="text-xs text-muted-foreground">NIC</p><p className="font-mono">{viewEmp.nic}</p></div>
                  <div><p className="text-xs text-muted-foreground">Contact</p><p className="font-mono">{viewEmp.contact}</p></div>
                  <div><p className="text-xs text-muted-foreground">Status</p><p className="capitalize">{viewEmp.status}</p></div>
                </div>
              </section>
              <section>
                <h4 className="text-sm font-display font-bold mb-3">Job Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-xs text-muted-foreground">Role</p><p>{viewEmp.role}</p></div>
                  <div><p className="text-xs text-muted-foreground">Salary Type</p><p>{viewEmp.salaryType}</p></div>
                  <div><p className="text-xs text-muted-foreground">Salary</p><p className="font-mono">{viewEmp.salary?.toLocaleString()}</p></div>
                </div>
              </section>
              <section>
                <h4 className="text-sm font-display font-bold mb-3">Salary Transactions</h4>
                <div className="rounded-xl border border-border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/50"><tr>{["Date", "Type", "Amount"].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground">{h}</th>)}</tr></thead>
                    <tbody>
                      <tr className="border-t border-border"><td className="px-3 py-2">01/02/2026</td><td className="px-3 py-2">Monthly</td><td className="px-3 py-2 font-medium">{viewEmp.salary?.toLocaleString()}</td></tr>
                      <tr className="border-t border-border"><td className="px-3 py-2">01/01/2026</td><td className="px-3 py-2">Monthly</td><td className="px-3 py-2 font-medium">{viewEmp.salary?.toLocaleString()}</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" className="text-destructive border-destructive/30" onClick={() => { setDelEmp(viewEmp); setViewEmp(null); }}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
            <Button variant="outline" onClick={() => { setSalaryReceipt(viewEmp); setViewEmp(null); }}><ReceiptIcon className="h-4 w-4 mr-1" /> Generate Salary Receipt</Button>
            <Button className="gradient-primary border-0" onClick={() => { setEditEmp(viewEmp); setViewEmp(null); }}>Edit Employee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Employee */}
      <Dialog open={!!editEmp} onOpenChange={(o) => !o && setEditEmp(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle>Edit Employee</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Editing form prefilled with existing values.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditEmp(null)}>Cancel</Button>
            <Button className="gradient-primary border-0" onClick={() => { toast.success("Changes saved"); setEditEmp(null); }}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!delEmp} onOpenChange={(o) => !o && setDelEmp(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete employee?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => { toast.success("Deleted"); setDelEmp(null); }}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Salary Receipt */}
      <Dialog open={!!salaryReceipt} onOpenChange={(o) => !o && setSalaryReceipt(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Generate Salary Receipt</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Month</Label><Select defaultValue="feb"><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="feb">February 2026</SelectItem><SelectItem value="jan">January 2026</SelectItem></SelectContent></Select></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSalaryReceipt(null)}>Cancel</Button>
            <Button className="gradient-primary border-0" onClick={() => { toast.success("Receipt downloaded"); setSalaryReceipt(null); }}><Download className="h-4 w-4 mr-1" /> Download</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Job Role */}
      <Dialog open={addRole} onOpenChange={setAddRole}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Job Role</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Job Role</Label><Input className="mt-1.5" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Salary Per</Label><Select defaultValue="monthly"><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="daily">Daily</SelectItem></SelectContent></Select></div>
              <div><Label>Basic Salary</Label><Input className="mt-1.5" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddRole(false)}>Cancel</Button>
            <Button className="gradient-primary border-0" onClick={() => { toast.success("Role added"); setAddRole(false); }}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editRole} onOpenChange={(o) => !o && setEditRole(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Job Role</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Job Role</Label><Input className="mt-1.5" defaultValue={editRole?.role} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Salary Per</Label><Select defaultValue={editRole?.per?.toLowerCase()}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="daily">Daily</SelectItem></SelectContent></Select></div>
              <div><Label>Basic Salary</Label><Input className="mt-1.5" defaultValue={editRole?.basic} /></div>
            </div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setEditRole(null)}>Cancel</Button><Button className="gradient-primary border-0" onClick={() => { toast.success("Role updated"); setEditRole(null); }}>Save Changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!delRole} onOpenChange={(o) => !o && setDelRole(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete job role?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => { toast.success("Deleted"); setDelRole(null); }}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Salary Payment */}
      <Dialog open={addPayment} onOpenChange={setAddPayment}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add Salary Payment</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Payment Date</Label><Input type="date" className="mt-1.5" /></div>
              <div><Label>Employee</Label><Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{employees.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent></Select></div>
            </div>
            {salSub === "Fixed Salary" && (
              <>
                <div><Label>Job Role</Label><Input className="mt-1.5" disabled value="Driver" /></div>
                <div><Label>Payment Type</Label>
                  <Select value={paymentType} onValueChange={setPaymentType}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="monthly">Monthly Salary Payment</SelectItem><SelectItem value="advance">Advance Payment</SelectItem></SelectContent>
                  </Select>
                </div>
                {paymentType === "monthly" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Month</Label><Input type="month" className="mt-1.5" /></div>
                    <div><Label>Basic Salary</Label><Input className="mt-1.5" disabled value="65000" /></div>
                    <div><Label>Deductions</Label><Input className="mt-1.5" /></div>
                    <div><Label>ETF/EPF (8%)</Label><Input className="mt-1.5" disabled value="5200" /></div>
                    <div className="col-span-2"><Label>Total Earned</Label><Input className="mt-1.5" disabled value="59800" /></div>
                    <div className="col-span-2"><Label>Payment Method</Label><Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="bank">Bank Transfer</SelectItem></SelectContent></Select></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>Amount</Label><Input className="mt-1.5" /></div>
                    <div><Label>Payment Method</Label><Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="bank">Bank Transfer</SelectItem></SelectContent></Select></div>
                  </div>
                )}
              </>
            )}
            {salSub === "Trip-Based" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs">Auto-loaded: 18 trips · LKR 21,600 total</div>
                <div><Label>Per Trip Rate</Label><Input className="mt-1.5" defaultValue="1200" /></div>
                <div><Label>Total Trip Earnings</Label><Input className="mt-1.5" disabled defaultValue="21600" /></div>
                <div><Label>Payment Type</Label><Select defaultValue="full"><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="full">Full Payment</SelectItem><SelectItem value="partial">Partial Payment</SelectItem></SelectContent></Select></div>
                <div><Label>Amount</Label><Input className="mt-1.5" /></div>
                <div className="col-span-2"><Label>Payment Method</Label><Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem></SelectContent></Select></div>
              </div>
            )}
            <div><Label>Comments</Label><Textarea className="mt-1.5" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddPayment(false)}>Cancel</Button>
            <Button className="gradient-primary border-0" onClick={() => { toast.success("Payment added"); setAddPayment(false); }}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pay ETF/EPF */}
      <Dialog open={!!payEpf} onOpenChange={(o) => !o && setPayEpf(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Pay ETF / EPF</DialogTitle></DialogHeader>
          {payEpf && (
            <div className="space-y-3 text-sm">
              <div className={cn("grid grid-cols-2 gap-3 rounded-xl border border-border bg-muted/30 p-3")}>
                <div><p className="text-xs text-muted-foreground">Employee</p><p className="font-medium">{payEpf.emp}</p></div>
                <div><p className="text-xs text-muted-foreground">ETF/EPF No</p><p className="font-mono">{payEpf.etf}</p></div>
                <div><p className="text-xs text-muted-foreground">EPF 8%</p><p className="font-mono">{payEpf.epf8.toLocaleString()}</p></div>
                <div><p className="text-xs text-muted-foreground">EPF 12%</p><p className="font-mono">{payEpf.epf12.toLocaleString()}</p></div>
                <div><p className="text-xs text-muted-foreground">ETF 3%</p><p className="font-mono">{payEpf.etf3.toLocaleString()}</p></div>
              </div>
              <div><Label>Pay Receipt</Label><button className="mt-1.5 w-full rounded-xl border-2 border-dashed border-border p-4 text-center"><span className="text-xs text-muted-foreground">Upload receipt</span></button></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPayEpf(null)}>Cancel</Button>
            <Button className="gradient-primary border-0" onClick={() => { toast.success("Paid"); setPayEpf(null); }}>Pay</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
};

export default Employees;
