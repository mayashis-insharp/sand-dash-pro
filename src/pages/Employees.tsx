import { useState, ReactNode } from "react";
import { PageShell, TabBar, Pagination } from "@/components/dashboard/PageShell";
import { ViewToggle, type ViewMode } from "@/components/dashboard/ViewToggle";
import { DataCards } from "@/components/dashboard/DataCards";
import { FormShell, FormSection } from "@/components/dashboard/FormShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Search, Eye, Edit, Download, Trash2, Receipt as ReceiptIcon, UsersRound, Briefcase, Wallet, Calendar as CalendarIcon, FileText, Building2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ExportReportDialog } from "@/components/dashboard/ExportReportDialog";

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

const Fld = ({ label, children, full, hint }: { label: string; children: ReactNode; full?: boolean; hint?: string }) => (
  <div className={full ? "col-span-2" : ""}>
    <div className="flex items-center justify-between">
      <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
      {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
    </div>
    <div className="mt-1.5">{children}</div>
  </div>
);

const FooterBtns = ({
  onCancel, onDraft, onSave, saveLabel = "Save", saveIcon,
}: { onCancel: () => void; onDraft?: () => void; onSave: () => void; saveLabel?: string; saveIcon?: ReactNode }) => (
  <div className="px-5 md:px-8 py-3 flex items-center justify-between gap-3">
    <Button variant="ghost" className="text-muted-foreground" onClick={onCancel}>Cancel</Button>
    <div className="flex items-center gap-2">
      {onDraft && <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5 hover:text-primary" onClick={onDraft}>Save as Draft</Button>}
      <Button className="gap-2 gradient-primary border-0 shadow-glow px-6" onClick={onSave}>
        {saveIcon}{saveLabel}
      </Button>
    </div>
  </div>
);

const Employees = () => {
  const [tab, setTab] = useState<typeof tabs[number]>("Employees");
  const [view, setView] = useState<ViewMode>("table");
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
  const [exportOpen, setExportOpen] = useState(false);

  const exportConfig = (() => {
    if (tab === "Job Role") return {
      name: "Employees - Job Role",
      cols: [
        { name: "Job Role", filter: { kind: "multiSelect" as const, options: ["Driver", "Loader", "Site Manager", "Cashier"], allLabel: "All Roles" } },
        { name: "Salary Per", filter: { kind: "multiSelect" as const, options: ["Month", "Day", "Trip"], allLabel: "All" } },
        { name: "Basic Salary", filter: { kind: "numberRange" as const, unit: "LKR" } },
      ],
    };
    if (tab === "Salary Payment") {
      return {
        name: "Employees - Salary Payment",
        cols: [
          { name: "Date Range", filter: { kind: "dateRange" as const } },
          { name: "Employee", filter: { kind: "multiSelect" as const, options: ["Nimal", "Sunil", "Kamal", "Ranjith"], allLabel: "All Employees" } },
          { name: "Salary Type", filter: { kind: "multiSelect" as const, options: ["Basic Salary", "Trip-Based"], allLabel: "All Salary Types" } },
          { name: "Payment Type", filter: { kind: "multiSelect" as const, options: ["Monthly", "Weekly", "Advance"], allLabel: "All Payment Types" } },
          { name: "Payment Method", filter: { kind: "multiSelect" as const, options: ["Cash", "Bank Transfer", "Cheque"], allLabel: "All Payment Methods" } },
          { name: "Payment Amount", filter: { kind: "numberRange" as const, unit: "LKR" } },
          { name: "Outstanding Amount", filter: { kind: "numberRange" as const, unit: "LKR" } },
        ],
      };
    }
    return {
      name: "Employees - Register",
      cols: [
        { name: "Employee Name", filter: { kind: "text" as const } },
        { name: "Contact No", filter: { kind: "text" as const } },
        { name: "NIC No", filter: { kind: "text" as const } },
        { name: "Address", filter: { kind: "text" as const } },
        { name: "Joined Date", filter: { kind: "dateRange" as const } },
        { name: "Job Role", filter: { kind: "multiSelect" as const, options: ["Driver", "Loader", "Site Manager", "Cashier"], allLabel: "All Roles" } },
        { name: "Salary Type", filter: { kind: "multiSelect" as const, options: ["Basic Salary", "Trip-Based"], allLabel: "All Salary Types" } },
        { name: "Basic Salary", filter: { kind: "numberRange" as const, unit: "LKR" } },
        { name: "EPF/ETF Number", filter: { kind: "text" as const } },
        { name: "Status", filter: { kind: "multiSelect" as const, options: ["Working", "Not Working"], allLabel: "All Statuses" } },
      ],
    };
  })();

  const renderEmpTable = (status: "working" | "not-working") => {
    const list = employees.filter(e => e.status === status);
    return (
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-display font-bold">{status === "working" ? "Working" : "Not Working"}</h4>
          <span className="text-xs text-muted-foreground">{list.length} employees</span>
        </div>
        {view === "table" ? (
          <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="bg-muted/50 border-b border-border">{["ID", "Full Name", "Contact", "NIC", "Job Role", "Salary Type", "Salary", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold whitespace-nowrap">{h}</th>)}</tr></thead>
                <tbody>
                  {list.map(e => (
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
        ) : (
          <DataCards
            items={list.map(e => ({
              id: e.id,
              title: e.name,
              subtitle: <span className="font-mono">{e.id}</span>,
              badge: <span className="inline-flex rounded-md border border-info/20 bg-info/10 text-info px-2 py-0.5 text-[11px] font-medium">{e.salaryType}</span>,
              fields: [
                { label: "Role", value: e.role },
                { label: "Salary", value: e.salary.toLocaleString(), mono: true },
                { label: "Contact", value: e.contact, mono: true },
                { label: "NIC", value: e.nic, mono: true },
              ],
              actions: (
                <>
                  <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => setViewEmp(e)}><Eye className="h-3.5 w-3.5" /> View</Button>
                  <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => setEditEmp(e)}><Edit className="h-3.5 w-3.5" /> Edit</Button>
                </>
              ),
            }))}
          />
        )}
      </div>
    );
  };

  return (
    <PageShell icon={UsersRound} title="Employees" description="Manage your team, roles, and salary payments.">
      <TabBar
        tabs={tabs}
        active={tab}
        onChange={setTab}
        right={
          <>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setExportOpen(true)}><Download className="h-4 w-4" /> Export</Button>
            {tab === "Employees" && <Button size="sm" className="gap-2 gradient-primary border-0 shadow-glow" onClick={() => setAddEmp(true)}><Plus className="h-4 w-4" /> Add Employee</Button>}
            {tab === "Job Role" && <Button size="sm" className="gap-2 gradient-primary border-0 shadow-glow" onClick={() => setAddRole(true)}><Plus className="h-4 w-4" /> Add Job Role</Button>}
            {tab === "Salary Payment" && salSub !== "ETF/EPF" && <Button size="sm" className="gap-2 gradient-primary border-0 shadow-glow" onClick={() => setAddPayment(true)}><Plus className="h-4 w-4" /> Add Salary Payment</Button>}
          </>
        }
      />

      {tab === "Employees" && (
        <>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search employees…" className="pl-9 h-10 bg-card" />
            </div>
            <ViewToggle value={view} onChange={setView} className="ml-auto" />
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
      <FormShell
        open={addEmp}
        onOpenChange={setAddEmp}
        title="Add Employee"
        subtitle="Register a new team member."
        icon={<UsersRound className="h-5 w-5" />}
        size="lg"
        footer={
          <FooterBtns
            onCancel={() => setAddEmp(false)}
            onDraft={() => { toast.success("Saved as draft"); setAddEmp(false); }}
            onSave={() => { toast.success("Employee added"); setAddEmp(false); }}
            saveLabel="Add Employee"
            saveIcon={<Plus className="h-4 w-4" />}
          />
        }
      >
        <FormSection icon={<UsersRound className="h-4 w-4" />} title="Employee Details" description="Basic identification & contact.">
          <div className="grid grid-cols-2 gap-4">
            <Fld label="Full Name"><Input className="h-11 bg-background" /></Fld>
            <Fld label="NIC"><Input className="h-11 bg-background" /></Fld>
            <Fld label="Contact No"><Input className="h-11 bg-background" /></Fld>
            <Fld label="Address" full><Textarea className="bg-background" /></Fld>
          </div>
        </FormSection>

        <FormSection icon={<Briefcase className="h-4 w-4" />} title="Job Details" description="Role and compensation setup.">
          <div className="grid grid-cols-2 gap-4">
            <Fld label="Joined Date"><Input type="date" className="h-11 bg-background" /></Fld>
            <Fld label="Job Role"><Select><SelectTrigger className="h-11 bg-background"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="d">Driver</SelectItem><SelectItem value="l">Loader</SelectItem></SelectContent></Select></Fld>
            <Fld label="Salary Type" full>
              <Select value={salaryType} onValueChange={setSalaryType}>
                <SelectTrigger className="h-11 bg-background"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Salary</SelectItem>
                  <SelectItem value="trip">Trip-Based</SelectItem>
                  <SelectItem value="both">Basic & Trip-Based</SelectItem>
                </SelectContent>
              </Select>
            </Fld>
            {(salaryType === "basic" || salaryType === "both") && <Fld label="Basic Salary" full><Input className="h-11 bg-background" /></Fld>}
            <div className="col-span-2 flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2.5">
              <Checkbox checked={epf} onCheckedChange={(v) => setEpf(!!v)} id="epf" />
              <Label htmlFor="epf" className="cursor-pointer">EPF / ETF Applicable</Label>
            </div>
            {epf && <Fld label="ETF / EPF Number" full><Input className="h-11 bg-background" /></Fld>}
            <div className="col-span-2">
              <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</Label>
              <RadioGroup defaultValue="working" className="mt-1.5 grid grid-cols-2 gap-3">
                {[{ v: "working", l: "Working" }, { v: "not-working", l: "Not Working" }].map(o => (
                  <label key={o.v} className="flex items-center gap-2 rounded-xl border border-border bg-background p-3 cursor-pointer hover:bg-muted/30"><RadioGroupItem value={o.v} /> {o.l}</label>
                ))}
              </RadioGroup>
            </div>
          </div>
        </FormSection>
      </FormShell>

      {/* View Employee */}
      <FormShell
        open={!!viewEmp}
        onOpenChange={(o) => !o && setViewEmp(null)}
        title="Employee Details"
        subtitle={viewEmp?.id}
        icon={<UsersRound className="h-5 w-5" />}
        size="lg"
        footer={
          <div className="px-5 md:px-8 py-3 flex items-center justify-between gap-3">
            <Button variant="outline" className="text-destructive border-destructive/30" onClick={() => { setDelEmp(viewEmp); setViewEmp(null); }}><Trash2 className="h-4 w-4 mr-1" /> Delete</Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => { setSalaryReceipt(viewEmp); setViewEmp(null); }}><ReceiptIcon className="h-4 w-4 mr-1" /> Salary Receipt</Button>
              <Button className="gradient-primary border-0 shadow-glow px-5" onClick={() => { setEditEmp(viewEmp); setViewEmp(null); }}>Edit Employee</Button>
            </div>
          </div>
        }
      >
        {viewEmp && (
          <>
            <FormSection icon={<UsersRound className="h-4 w-4" />} title="Employee Details">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-xs text-muted-foreground">Name</p><p className="font-medium">{viewEmp.name}</p></div>
                <div><p className="text-xs text-muted-foreground">NIC</p><p className="font-mono">{viewEmp.nic}</p></div>
                <div><p className="text-xs text-muted-foreground">Contact</p><p className="font-mono">{viewEmp.contact}</p></div>
                <div><p className="text-xs text-muted-foreground">Status</p><p className="capitalize">{viewEmp.status}</p></div>
              </div>
            </FormSection>
            <FormSection icon={<Briefcase className="h-4 w-4" />} title="Job Details">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-xs text-muted-foreground">Role</p><p>{viewEmp.role}</p></div>
                <div><p className="text-xs text-muted-foreground">Salary Type</p><p>{viewEmp.salaryType}</p></div>
                <div><p className="text-xs text-muted-foreground">Salary</p><p className="font-mono">{viewEmp.salary?.toLocaleString()}</p></div>
              </div>
            </FormSection>
            <FormSection icon={<Wallet className="h-4 w-4" />} title="Salary Transactions">
              <div className="rounded-xl border border-border overflow-hidden bg-background">
                <table className="w-full text-xs">
                  <thead className="bg-muted/50"><tr>{["Date", "Type", "Amount"].map(h => <th key={h} className="px-3 py-2 text-left font-semibold text-muted-foreground">{h}</th>)}</tr></thead>
                  <tbody>
                    <tr className="border-t border-border"><td className="px-3 py-2">01/02/2026</td><td className="px-3 py-2">Monthly</td><td className="px-3 py-2 font-medium">{viewEmp.salary?.toLocaleString()}</td></tr>
                    <tr className="border-t border-border"><td className="px-3 py-2">01/01/2026</td><td className="px-3 py-2">Monthly</td><td className="px-3 py-2 font-medium">{viewEmp.salary?.toLocaleString()}</td></tr>
                  </tbody>
                </table>
              </div>
            </FormSection>
          </>
        )}
      </FormShell>

      {/* Edit Employee */}
      <FormShell
        open={!!editEmp}
        onOpenChange={(o) => !o && setEditEmp(null)}
        title="Edit Employee"
        icon={<Edit className="h-5 w-5" />}
        size="lg"
        footer={<FooterBtns onCancel={() => setEditEmp(null)} onSave={() => { toast.success("Changes saved"); setEditEmp(null); }} saveLabel="Save Changes" />}
      >
        <FormSection icon={<UsersRound className="h-4 w-4" />} title="Employee Details" description="Editing form prefilled with existing values.">
          <div className="grid grid-cols-2 gap-4">
            <Fld label="Full Name"><Input className="h-11 bg-background" defaultValue={editEmp?.name} /></Fld>
            <Fld label="Contact"><Input className="h-11 bg-background" defaultValue={editEmp?.contact} /></Fld>
            <Fld label="NIC"><Input className="h-11 bg-background" defaultValue={editEmp?.nic} /></Fld>
            <Fld label="Salary"><Input className="h-11 bg-background" defaultValue={editEmp?.salary} /></Fld>
          </div>
        </FormSection>
      </FormShell>

      <AlertDialog open={!!delEmp} onOpenChange={(o) => !o && setDelEmp(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete employee?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => { toast.success("Deleted"); setDelEmp(null); }}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Salary Receipt */}
      <FormShell
        open={!!salaryReceipt}
        onOpenChange={(o) => !o && setSalaryReceipt(null)}
        title="Generate Salary Receipt"
        icon={<ReceiptIcon className="h-5 w-5" />}
        size="md"
        footer={
          <div className="px-5 md:px-8 py-3 flex items-center justify-between gap-3">
            <Button variant="ghost" className="text-muted-foreground" onClick={() => setSalaryReceipt(null)}>Cancel</Button>
            <Button className="gradient-primary border-0 shadow-glow px-5 gap-2" onClick={() => { toast.success("Receipt downloaded"); setSalaryReceipt(null); }}><Download className="h-4 w-4" /> Download</Button>
          </div>
        }
      >
        <FormSection icon={<CalendarIcon className="h-4 w-4" />} title="Period">
          <Fld label="Month">
            <Select defaultValue="feb"><SelectTrigger className="h-11 bg-background"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="feb">February 2026</SelectItem><SelectItem value="jan">January 2026</SelectItem></SelectContent></Select>
          </Fld>
        </FormSection>
      </FormShell>

      {/* Add Job Role */}
      <FormShell
        open={addRole}
        onOpenChange={setAddRole}
        title="Add Job Role"
        icon={<Briefcase className="h-5 w-5" />}
        size="md"
        footer={<FooterBtns onCancel={() => setAddRole(false)} onSave={() => { toast.success("Role added"); setAddRole(false); }} saveLabel="Add Role" saveIcon={<Plus className="h-4 w-4" />} />}
      >
        <FormSection icon={<Briefcase className="h-4 w-4" />} title="Role Details">
          <div className="grid grid-cols-2 gap-4">
            <Fld label="Job Role" full><Input className="h-11 bg-background" /></Fld>
            <Fld label="Salary Per"><Select defaultValue="monthly"><SelectTrigger className="h-11 bg-background"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="daily">Daily</SelectItem></SelectContent></Select></Fld>
            <Fld label="Basic Salary"><Input className="h-11 bg-background" /></Fld>
          </div>
        </FormSection>
      </FormShell>

      {/* Edit Job Role */}
      <FormShell
        open={!!editRole}
        onOpenChange={(o) => !o && setEditRole(null)}
        title="Edit Job Role"
        icon={<Edit className="h-5 w-5" />}
        size="md"
        footer={<FooterBtns onCancel={() => setEditRole(null)} onSave={() => { toast.success("Role updated"); setEditRole(null); }} saveLabel="Save Changes" />}
      >
        <FormSection icon={<Briefcase className="h-4 w-4" />} title="Role Details">
          <div className="grid grid-cols-2 gap-4">
            <Fld label="Job Role" full><Input className="h-11 bg-background" defaultValue={editRole?.role} /></Fld>
            <Fld label="Salary Per"><Select defaultValue={editRole?.per?.toLowerCase()}><SelectTrigger className="h-11 bg-background"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="monthly">Monthly</SelectItem><SelectItem value="daily">Daily</SelectItem></SelectContent></Select></Fld>
            <Fld label="Basic Salary"><Input className="h-11 bg-background" defaultValue={editRole?.basic} /></Fld>
          </div>
        </FormSection>
      </FormShell>

      <AlertDialog open={!!delRole} onOpenChange={(o) => !o && setDelRole(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete job role?</AlertDialogTitle><AlertDialogDescription>This cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => { toast.success("Deleted"); setDelRole(null); }}>Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Salary Payment */}
      <FormShell
        open={addPayment}
        onOpenChange={setAddPayment}
        title="Add Salary Payment"
        icon={<Wallet className="h-5 w-5" />}
        size="lg"
        footer={<FooterBtns onCancel={() => setAddPayment(false)} onSave={() => { toast.success("Payment added"); setAddPayment(false); }} saveLabel="Save Payment" saveIcon={<Plus className="h-4 w-4" />} />}
      >
        <FormSection icon={<CalendarIcon className="h-4 w-4" />} title="Payment Info">
          <div className="grid grid-cols-2 gap-4">
            <Fld label="Payment Date"><Input type="date" className="h-11 bg-background" /></Fld>
            <Fld label="Employee"><Select><SelectTrigger className="h-11 bg-background"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{employees.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)}</SelectContent></Select></Fld>
          </div>
        </FormSection>

        {salSub === "Fixed Salary" && (
          <FormSection icon={<Wallet className="h-4 w-4" />} title="Fixed Salary">
            <div className="grid grid-cols-2 gap-4">
              <Fld label="Job Role" full><Input className="h-11 bg-background" disabled value="Driver" /></Fld>
              <Fld label="Payment Type" full>
                <Select value={paymentType} onValueChange={setPaymentType}><SelectTrigger className="h-11 bg-background"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="monthly">Monthly Salary Payment</SelectItem><SelectItem value="advance">Advance Payment</SelectItem></SelectContent>
                </Select>
              </Fld>
              {paymentType === "monthly" ? (
                <>
                  <Fld label="Month"><Input type="month" className="h-11 bg-background" /></Fld>
                  <Fld label="Basic Salary"><Input className="h-11 bg-background" disabled value="65000" /></Fld>
                  <Fld label="Deductions"><Input className="h-11 bg-background" /></Fld>
                  <Fld label="ETF/EPF (8%)"><Input className="h-11 bg-background" disabled value="5200" /></Fld>
                  <Fld label="Total Earned" full><Input className="h-11 bg-background" disabled value="59800" /></Fld>
                  <Fld label="Payment Method" full><Select><SelectTrigger className="h-11 bg-background"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="bank">Bank Transfer</SelectItem></SelectContent></Select></Fld>
                </>
              ) : (
                <>
                  <Fld label="Amount"><Input className="h-11 bg-background" /></Fld>
                  <Fld label="Payment Method"><Select><SelectTrigger className="h-11 bg-background"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem><SelectItem value="bank">Bank Transfer</SelectItem></SelectContent></Select></Fld>
                </>
              )}
            </div>
          </FormSection>
        )}

        {salSub === "Trip-Based" && (
          <FormSection icon={<Wallet className="h-4 w-4" />} title="Trip-Based Payment">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 rounded-xl border border-border bg-muted/30 px-3 py-2 text-xs">Auto-loaded: 18 trips · LKR 21,600 total</div>
              <Fld label="Per Trip Rate"><Input className="h-11 bg-background" defaultValue="1200" /></Fld>
              <Fld label="Total Trip Earnings"><Input className="h-11 bg-background" disabled defaultValue="21600" /></Fld>
              <Fld label="Payment Type"><Select defaultValue="full"><SelectTrigger className="h-11 bg-background"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="full">Full Payment</SelectItem><SelectItem value="partial">Partial Payment</SelectItem></SelectContent></Select></Fld>
              <Fld label="Amount"><Input className="h-11 bg-background" /></Fld>
              <Fld label="Payment Method" full><Select><SelectTrigger className="h-11 bg-background"><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="cash">Cash</SelectItem></SelectContent></Select></Fld>
            </div>
          </FormSection>
        )}

        <FormSection icon={<FileText className="h-4 w-4" />} title="Comments">
          <Textarea className="bg-background" placeholder="Optional notes..." />
        </FormSection>
      </FormShell>

      {/* Pay ETF/EPF */}
      <FormShell
        open={!!payEpf}
        onOpenChange={(o) => !o && setPayEpf(null)}
        title="Pay ETF / EPF"
        icon={<Building2 className="h-5 w-5" />}
        size="md"
        footer={<FooterBtns onCancel={() => setPayEpf(null)} onSave={() => { toast.success("Paid"); setPayEpf(null); }} saveLabel="Pay" />}
      >
        {payEpf && (
          <>
            <FormSection icon={<UsersRound className="h-4 w-4" />} title="Employee Summary">
              <div className={cn("grid grid-cols-2 gap-4 text-sm")}>
                <div><p className="text-xs text-muted-foreground">Employee</p><p className="font-medium">{payEpf.emp}</p></div>
                <div><p className="text-xs text-muted-foreground">ETF/EPF No</p><p className="font-mono">{payEpf.etf}</p></div>
                <div><p className="text-xs text-muted-foreground">EPF 8%</p><p className="font-mono">{payEpf.epf8.toLocaleString()}</p></div>
                <div><p className="text-xs text-muted-foreground">EPF 12%</p><p className="font-mono">{payEpf.epf12.toLocaleString()}</p></div>
                <div><p className="text-xs text-muted-foreground">ETF 3%</p><p className="font-mono">{payEpf.etf3.toLocaleString()}</p></div>
              </div>
            </FormSection>
            <FormSection icon={<ReceiptIcon className="h-4 w-4" />} title="Pay Receipt">
              <button className="w-full rounded-xl border-2 border-dashed border-border bg-background p-5 text-center hover:bg-muted/30 transition-smooth"><span className="text-xs text-muted-foreground">Upload receipt</span></button>
            </FormSection>
          </>
        )}
      </FormShell>
      <ExportReportDialog
        open={exportOpen}
        onOpenChange={setExportOpen}
        moduleName={exportConfig.name}
        columns={exportConfig.cols}
        filters={[
          { key: "role", label: "Job Role", type: "select", placeholder: "All Roles", options: [
            { value: "driver", label: "Driver" },
            { value: "loader", label: "Loader" },
            { value: "manager", label: "Site Manager" },
          ]},
          { key: "salaryType", label: "Salary Type", type: "select", placeholder: "All Types", options: [
            { value: "basic", label: "Basic Salary" },
            { value: "trip", label: "Trip-Based" },
          ]},
        ]}
      />
    </PageShell>
  );
};

export default Employees;
