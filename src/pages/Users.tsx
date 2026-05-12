import { useState } from "react";
import { PageShell, TabBar, Pagination } from "@/components/dashboard/PageShell";
import { ViewToggle, type ViewMode } from "@/components/dashboard/ViewToggle";
import { DataCards } from "@/components/dashboard/DataCards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Search, Edit, Trash2, Eye, ShieldCheck, Download } from "lucide-react";
import { toast } from "sonner";
import { UserFormDialog, type UserMode, type UserFormValue } from "@/components/dashboard/UserFormDialog";
import { ExportReportDialog } from "@/components/dashboard/ExportReportDialog";

const tabs = ["Users", "Drafts"] as const;

const initialUsers = [
  { id: "U_01", name: "Admin 123", email: "admin@sandsupply.lk", role: "Super Admin" },
  { id: "U_02", name: "Nadeesha", email: "nadeesha@sandsupply.lk", role: "Manager" },
  { id: "U_03", name: "Roshan", email: "roshan@sandsupply.lk", role: "Cashier" },
];

const Users = () => {
  const [tab, setTab] = useState<typeof tabs[number]>("Users");
  const [view, setView] = useState<ViewMode>("table");
  const [mode, setMode] = useState<UserMode | null>(null);
  const [target, setTarget] = useState<Partial<UserFormValue> | undefined>();
  const [delTarget, setDelTarget] = useState<typeof initialUsers[number] | null>(null);

  const open = (m: UserMode, u?: typeof initialUsers[number]) => {
    setMode(m);
    setTarget(u ? { id: u.id, name: u.name, email: u.email, role: u.role } : undefined);
  };

  return (
    <PageShell icon={ShieldCheck} breadcrumb={["Settings", "Users"]} title="Users" description="Manage staff access and module permissions.">
      <TabBar
        tabs={tabs}
        active={tab}
        onChange={setTab}
        right={<Button size="sm" className="gap-2 gradient-primary border-0 shadow-glow" onClick={() => open("add")}><Plus className="h-4 w-4" /> Add User</Button>}
      />

      {tab === "Users" && (
        <>
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search users…" className="pl-9 h-10 bg-card" />
            </div>
            <ViewToggle value={view} onChange={setView} className="ml-auto" />
          </div>
          {view === "table" ? (
            <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="bg-muted/50 border-b border-border">{["Name", "Email", "Role", "Actions"].map(h => <th key={h} className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>)}</tr></thead>
                <tbody>
                  {initialUsers.map(u => (
                    <tr key={u.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-4 font-medium">{u.name}</td>
                      <td className="px-4 py-4 text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-4"><span className="inline-flex rounded-md border border-primary/20 bg-primary/10 text-primary px-2 py-0.5 text-[11px] font-medium">{u.role}</span></td>
                      <td className="px-4 py-4">
                        <div className="flex gap-1">
                          <button className="rounded-md px-2 py-1 hover:bg-muted" onClick={() => open("view", u)}><Eye className="h-3.5 w-3.5" /></button>
                          <button className="rounded-md px-2 py-1 hover:bg-muted" onClick={() => open("edit", u)}><Edit className="h-3.5 w-3.5" /></button>
                          <button className="rounded-md px-2 py-1 hover:bg-muted text-destructive" onClick={() => setDelTarget(u)}><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <DataCards
              items={initialUsers.map(u => ({
                id: u.id,
                title: u.name,
                subtitle: u.email,
                badge: <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">{u.role}</span>,
                fields: [],
                actions: (
                  <>
                    <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => open("view", u)}><Eye className="h-3.5 w-3.5" /> View</Button>
                    <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => open("edit", u)}><Edit className="h-3.5 w-3.5" /> Edit</Button>
                    <Button size="sm" variant="outline" className="gap-1 text-destructive border-destructive/30" onClick={() => setDelTarget(u)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </>
                ),
              }))}
            />
          )}
          <Pagination from={1} to={3} total={3} />
        </>
      )}

      {tab === "Drafts" && <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 text-center text-sm text-muted-foreground">No user drafts.</div>}

      <UserFormDialog
        open={mode !== null}
        onOpenChange={(o) => !o && setMode(null)}
        mode={mode ?? "add"}
        initial={target}
      />

      <AlertDialog open={!!delTarget} onOpenChange={(o) => !o && setDelTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this user?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={() => { toast.success("User deleted"); setDelTarget(null); }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
  );
};

export default Users;
