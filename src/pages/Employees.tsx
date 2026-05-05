import { useState } from "react";
import { PageShell, TabBar, Pagination } from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, Eye, Edit, Download } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const mainTabs = ["Employees", "Salary Payment", "Drafts"] as const;
const empSubTabs = ["Employee Register", "Job Role"] as const;
const salarySubTabs = ["Fixed Salary", "Trip-Based", "ETF/EPF"] as const;

const employees = [
  { id: "EM_101", name: "Sunil Bandara", contact: "+94770001111", nic: "851234567V", role: "Driver", salaryType: "Fixed", salary: 65000, status: "working" },
  { id: "EM_102", name: "Kamal Silva", contact: "+94770002222", nic: "881111111V", role: "Driver", salaryType: "Trip-Based", salary: 1200, status: "working" },
  { id: "EM_103", name: "Nimal Perera", contact: "+94770003333", nic: "902222222V", role: "Loader", salaryType: "Fixed", salary: 48000, status: "working" },
  { id: "EM_104", name: "Anura Fernando", contact: "+94770004444", nic: "751111222V", role: "Driver", salaryType: "Fixed", salary: 70000, status: "not-working" },
];

const jobRoles = [
  { id: "JR_01", title: "Driver", count: 8 },
  { id: "JR_02", title: "Loader", count: 5 },
  { id: "JR_03", title: "Site Manager", count: 2 },
];

const Employees = () => {
  const [tab, setTab] = useState<typeof mainTabs[number]>("Employees");
  const [empSub, setEmpSub] = useState<typeof empSubTabs[number]>("Employee Register");
  const [salSub, setSalSub] = useState<typeof salarySubTabs[number]>("Fixed Salary");
  const [addOpen, setAddOpen] = useState(false);
  const [addRole, setAddRole] = useState(false);
  const [salaryType, setSalaryType] = useState("fixed");
  const [epf, setEpf] = useState(false);

  const renderEmpTable = (status: "working" | "not-working") => (
    <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden mb-5">
      <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
        <h4 className="text-sm font-display font-bold capitalize">{status === "working" ? "Working" : "Not Working"}</h4>
        <span className="text-xs text-muted-foreground">{employees.filter(e => e.status === status).length} employees</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-muted/50 border-b border-border">
            {["ID", "Full Name", "Contact", "NIC", "Job Role", "Salary Type", "Salary", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold whitespace-nowrap">{h}</th>)}
          </tr></thead>
          <tbody>
            {employees.filter(e => e.status === status).map(e => (
              <tr key={e.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                <td className="px-4 py-4 font-mono text-xs font-semibold">{e.id}</td>
                <td className="px-4 py-4 font-medium">{e.name}</td>
                <td className="px-4 py-4 font-mono text-xs">{e.contact}</td>
                <td className="px-4 py-4 font-mono text-xs">{e.nic}</td>
                <td className="px-4 py-4">{e.role}</td>
                <td className="px-4 py-4">
                  <span className={cn("inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium",
                    e.salaryType === "Fixed" ? "bg-info/10 text-info border-info/20" : "bg-warning/15 text-warning border-warning/30")}>
                    {e.salaryType}
                  </span>
                </td>
                <td className="px-4 py-4 font-mono">{e.salary.toLocaleString()}</td>
                <td className="px-4 py-4"><div className="flex gap-1"><button className="rounded-md px-2 py-1 hover:bg-muted"><Eye className="h-3.5 w-3.5" /></button><button className="rounded-md px-2 py-1 hover:bg-muted"><Edit className="h-3.5 w-3.5" /></button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <PageShell breadcrumb={["People", "Employees"]} title="Employees" description="Manage your team, roles, and salary payments.">
      <TabBar
        tabs={mainTabs}
        active={tab}
        onChange={setTab}
        right={
          <>
            <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> Export</Button>
            {tab === "Employees" && empSub === "Employee Register" && <Button size="sm" className="gap-2 gradient-primary border-0 shadow-glow" onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> Add Employee</Button>}
            {tab === "Employees" && empSub === "Job Role" && <Button size="sm" className="gap-2 gradient-primary border-0 shadow-glow" onClick={() => setAddRole(true)}><Plus className="h-4 w-4" /> Add Job Role</Button>}
          </>
        }
      />

      {tab === "Employees" && (
        <>
          <div className="flex items-center gap-1 mb-4 border-b border-border">
            {empSubTabs.map(s => (
              <button key={s} onClick={() => setEmpSub(s)} className={`relative px-4 py-2 text-sm font-medium transition-smooth ${empSub === s ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {s}{empSub === s && <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full gradient-primary" />}
              </button>
            ))}
          </div>

          {empSub === "Employee Register" && (<>{renderEmpTable("working")}{renderEmpTable("not-working")}</>)}

          {empSub === "Job Role" && (
            <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-muted/50 border-b border-border">{["Role ID", "Job Title", "Employees", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>)}</tr></thead>
                <tbody>
                  {jobRoles.map(r => (
                    <tr key={r.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-4 font-mono text-xs font-semibold">{r.id}</td>
                      <td className="px-4 py-4 font-medium">{r.title}</td>
                      <td className="px-4 py-4">{r.count}</td>
                      <td className="px-4 py-4"><button className="rounded-md px-2 py-1 hover:bg-muted"><Edit className="h-3.5 w-3.5" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {tab === "Salary Payment" && (
        <>
          <div className="flex items-center gap-1 mb-4 border-b border-border">
            {salarySubTabs.map(s => (
              <button key={s} onClick={() => setSalSub(s)} className={`relative px-4 py-2 text-sm font-medium transition-smooth ${salSub === s ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                {s}{salSub === s && <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full gradient-primary" />}
              </button>
            ))}
          </div>
          <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-muted/50 border-b border-border">{["Employee", "Period", "Base", "Allowances", "Deductions", "Net Pay", "Status"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>)}</tr></thead>
              <tbody>
                {employees.slice(0, 3).map(e => (
                  <tr key={e.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-4 font-medium">{e.name}</td>
                    <td className="px-4 py-4 text-muted-foreground">Feb 2026</td>
                    <td className="px-4 py-4 font-mono">{e.salary.toLocaleString()}</td>
                    <td className="px-4 py-4 font-mono text-success">+ 5,000</td>
                    <td className="px-4 py-4 font-mono text-destructive">- 2,400</td>
                    <td className="px-4 py-4 font-mono font-semibold">{(e.salary + 2600).toLocaleString()}</td>
                    <td className="px-4 py-4"><span className="inline-flex rounded-md border px-2 py-0.5 text-[11px] bg-success/10 text-success border-success/20">Paid</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === "Drafts" && <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center text-sm text-muted-foreground">No employee drafts.</div>}

      <Pagination from={1} to={4} total={32} />

      {/* Add Employee */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add Employee</DialogTitle></DialogHeader>
          <div className="space-y-5">
            <section>
              <h4 className="text-sm font-display font-bold mb-3">Employee Details</h4>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Full Name</Label><Input className="mt-1.5" /></div>
                <div><Label>NIC</Label><Input className="mt-1.5" /></div>
                <div><Label>Contact No</Label><Input className="mt-1.5" /></div>
                <div><Label>Address</Label><Input className="mt-1.5" /></div>
              </div>
            </section>
            <section>
              <h4 className="text-sm font-display font-bold mb-3">Job Details</h4>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Job Role</Label><Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="d">Driver</SelectItem><SelectItem value="l">Loader</SelectItem></SelectContent></Select></div>
                <div><Label>Salary Type</Label><Select value={salaryType} onValueChange={setSalaryType}><SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="fixed">Fixed</SelectItem><SelectItem value="trip">Trip-Based</SelectItem></SelectContent></Select></div>
                {salaryType === "fixed" ? (
                  <div className="col-span-2"><Label>Monthly Salary</Label><Input className="mt-1.5" /></div>
                ) : (
                  <>
                    <div><Label>Per Trip Rate</Label><Input className="mt-1.5" /></div>
                    <div><Label>Estimated Monthly Trips</Label><Input className="mt-1.5" /></div>
                  </>
                )}
                <div className="col-span-2 flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2.5">
                  <Checkbox checked={epf} onCheckedChange={(v) => setEpf(!!v)} id="epf" />
                  <Label htmlFor="epf" className="cursor-pointer">Enable EPF / ETF deductions</Label>
                </div>
                {epf && (
                  <>
                    <div><Label>EPF %</Label><Input className="mt-1.5" defaultValue="8" /></div>
                    <div><Label>ETF %</Label><Input className="mt-1.5" defaultValue="3" /></div>
                  </>
                )}
              </div>
            </section>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button className="gradient-primary border-0" onClick={() => { toast.success("Employee added"); setAddOpen(false); }}>Add Employee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addRole} onOpenChange={setAddRole}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add Job Role</DialogTitle></DialogHeader>
          <div><Label>Job Title</Label><Input className="mt-1.5" /></div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddRole(false)}>Cancel</Button>
            <Button className="gradient-primary border-0" onClick={() => { toast.success("Role added"); setAddRole(false); }}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
};

export default Employees;
