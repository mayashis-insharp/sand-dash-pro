import { useState } from "react";
import { PageShell, TabBar, Pagination } from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

const tabs = ["Users", "Drafts"] as const;

const users = [
  { id: "U_01", name: "Admin 123", email: "admin@sandsupply.lk", role: "Super Admin" },
  { id: "U_02", name: "Nadeesha", email: "nadeesha@sandsupply.lk", role: "Manager" },
  { id: "U_03", name: "Roshan", email: "roshan@sandsupply.lk", role: "Cashier" },
];

const modules = ["Dashboard", "Orders", "Payments", "Inventory", "Suppliers", "Expenses", "Employees", "Customers", "Users", "Settings"];
const actions = ["Add", "View", "Edit", "Delete"];

const Users = () => {
  const [tab, setTab] = useState<typeof tabs[number]>("Users");
  const [addOpen, setAddOpen] = useState(false);
  const [enabled, setEnabled] = useState<Record<string, boolean>>({ Dashboard: true, Orders: true, Payments: true });

  return (
    <PageShell breadcrumb={["Settings", "Users"]} title="Users" description="Manage staff access and module permissions.">
      <TabBar
        tabs={tabs}
        active={tab}
        onChange={setTab}
        right={<Button size="sm" className="gap-2 gradient-primary border-0 shadow-glow" onClick={() => setAddOpen(true)}><Plus className="h-4 w-4" /> Add User</Button>}
      />

      {tab === "Users" && (
        <>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search users…" className="pl-9 h-10 bg-card" />
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-muted/50 border-b border-border">{["Name", "Email", "Role", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>)}</tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-4 font-medium">{u.name}</td>
                    <td className="px-4 py-4 text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-4"><span className="inline-flex rounded-md border border-primary/20 bg-primary/10 text-primary px-2 py-0.5 text-[11px] font-medium">{u.role}</span></td>
                    <td className="px-4 py-4"><div className="flex gap-1"><button className="rounded-md px-2 py-1 hover:bg-muted"><Edit className="h-3.5 w-3.5" /></button><button className="rounded-md px-2 py-1 hover:bg-muted text-destructive"><Trash2 className="h-3.5 w-3.5" /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination from={1} to={3} total={3} />
        </>
      )}

      {tab === "Drafts" && <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center text-sm text-muted-foreground">No user drafts.</div>}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add User</DialogTitle></DialogHeader>
          <div className="space-y-5">
            <section>
              <h4 className="text-sm font-display font-bold mb-3">User Details</h4>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Full Name</Label><Input className="mt-1.5" /></div>
                <div><Label>Email</Label><Input className="mt-1.5" type="email" /></div>
                <div><Label>Password</Label><Input className="mt-1.5" type="password" /></div>
                <div><Label>User Role</Label><Select><SelectTrigger className="mt-1.5"><SelectValue placeholder="Select role" /></SelectTrigger><SelectContent><SelectItem value="a">Admin</SelectItem><SelectItem value="m">Manager</SelectItem><SelectItem value="c">Cashier</SelectItem></SelectContent></Select></div>
              </div>
            </section>
            <section>
              <h4 className="text-sm font-display font-bold mb-3">Access Permissions</h4>
              <div className="space-y-2">
                {modules.map(m => {
                  const isOn = !!enabled[m];
                  return (
                    <div key={m} className="rounded-xl border border-border overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2.5 bg-muted/30">
                        <span className="text-sm font-medium">{m}</span>
                        <Switch checked={isOn} onCheckedChange={(v) => setEnabled(e => ({ ...e, [m]: v }))} />
                      </div>
                      {isOn && (
                        <div className="px-4 py-3 border-t border-border flex flex-wrap items-center gap-x-5 gap-y-2">
                          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Actions:</span>
                          {actions.map(a => (
                            <label key={a} className="flex items-center gap-1.5 text-xs cursor-pointer">
                              <Checkbox defaultChecked={a === "View"} /> {a}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button className="gradient-primary border-0" onClick={() => { toast.success("User added"); setAddOpen(false); }}>Add User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
};

export default Users;
