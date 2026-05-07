import { useMemo, useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormShell, FormSection } from "@/components/dashboard/FormShell";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type UserMode = "add" | "view" | "edit";

export interface UserFormValue {
  id?: string;
  name: string;
  email: string;
  role: string;
  permissions: Record<string, { enabled: boolean; tabs: string[]; actions: string[] }>;
}

interface ModuleDef {
  name: string;
  tabs: string[];
  actions: string[];
}

export const PERMISSION_MODULES: ModuleDef[] = [
  { name: "Dashboard", tabs: [], actions: ["View"] },
  { name: "Orders", tabs: ["Orders", "Pre-Orders", "Drafts"], actions: ["Add", "View", "Edit", "Delete"] },
  { name: "Payments", tabs: ["All Payments", "Cash", "Bank Transfer", "Cheque", "Credits", "Other"], actions: ["View"] },
  { name: "Inventory", tabs: ["Sand Stock", "Set Alert", "Received", "Drafts"], actions: ["Add", "View", "Edit", "Delete"] },
  { name: "Suppliers", tabs: ["Suppliers", "Drafts"], actions: ["Add", "View", "Edit"] },
  { name: "Expenses", tabs: ["Bill Payments", "Transport", "Petty Cash", "Drafts"], actions: ["Add", "View", "Edit", "Delete"] },
  { name: "Employees", tabs: ["Employees", "Job Role", "Salary Payment", "Drafts"], actions: ["Add", "View", "Edit", "Delete"] },
  { name: "Customers", tabs: ["Customers"], actions: ["View"] },
  { name: "Users", tabs: ["Users", "Drafts"], actions: ["Add", "View", "Edit", "Delete"] },
  { name: "Settings", tabs: ["Page Color Themes"], actions: ["View", "Edit"] },
];

const ROLES = ["Super Admin", "Admin", "Manager", "Cashier", "Viewer"];

const emptyValue = (): UserFormValue => ({
  name: "",
  email: "",
  role: "",
  permissions: Object.fromEntries(
    PERMISSION_MODULES.map((m) => [m.name, { enabled: false, tabs: [], actions: [] }])
  ),
});

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  mode: UserMode;
  initial?: Partial<UserFormValue>;
  onSubmit?: (v: UserFormValue) => void;
  onSaveDraft?: (v: UserFormValue) => void;
}

export function UserFormDialog({ open, onOpenChange, mode, initial, onSubmit, onSaveDraft }: Props) {
  const [v, setV] = useState<UserFormValue>(() => ({ ...emptyValue(), ...initial }));
  const readOnly = mode === "view";

  useEffect(() => {
    if (open) setV({ ...emptyValue(), ...initial });
  }, [open, initial]);

  const setField = <K extends keyof UserFormValue>(k: K, val: UserFormValue[K]) =>
    setV((s) => ({ ...s, [k]: val }));

  const setPerm = (mod: string, patch: Partial<UserFormValue["permissions"][string]>) =>
    setV((s) => ({
      ...s,
      permissions: {
        ...s.permissions,
        [mod]: { ...s.permissions[mod], ...patch },
      },
    }));

  const toggleArr = (arr: string[], item: string) =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  const canSubmit = useMemo(
    () => !!v.name.trim() && !!v.email.trim() && !!v.role,
    [v]
  );

  const titleByMode = mode === "add" ? "Add User" : mode === "edit" ? "Edit User" : "View User";

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit?.(v);
    toast.success(mode === "edit" ? "User updated" : "User added");
    onOpenChange(false);
  };

  return (
    <FormShell
      open={open}
      onOpenChange={onOpenChange}
      title={titleByMode}
      subtitle="Manage staff access and module permissions."
      icon={<ShieldCheck className="h-5 w-5" />}
      size="xl"
      footer={
        <div className="px-5 md:px-8 py-3 flex items-center justify-between gap-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-muted-foreground">
            {readOnly ? "Close" : "Cancel"}
          </Button>
          {!readOnly && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/5 hover:text-primary"
                onClick={() => {
                  onSaveDraft?.(v);
                  toast("Saved as draft");
                  onOpenChange(false);
                }}
              >
                Save as Draft
              </Button>
              <Button
                disabled={!canSubmit}
                onClick={handleSubmit}
                className="gradient-primary border-0 shadow-glow px-6"
              >
                {mode === "edit" ? "Save Changes" : "Add User"}
              </Button>
            </div>
          )}
        </div>
      }
    >
      <FormSection title="User Details" description="Basic identity & role.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Name <span className="text-primary">*</span>
            </Label>
            <Input
              className="mt-1.5 h-11 bg-background"
              value={v.name}
              disabled={readOnly}
              onChange={(e) => setField("name", e.target.value)}
              placeholder="Full name"
            />
          </div>
          <div>
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Email <span className="text-primary">*</span>
            </Label>
            <Input
              type="email"
              className="mt-1.5 h-11 bg-background"
              value={v.email}
              disabled={readOnly}
              onChange={(e) => setField("email", e.target.value)}
              placeholder="name@company.com"
            />
          </div>
          <div>
            <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              User Role <span className="text-primary">*</span>
            </Label>
            <Select value={v.role} onValueChange={(val) => setField("role", val)} disabled={readOnly}>
              <SelectTrigger className="mt-1.5 h-11 bg-background">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormSection>

      <FormSection title="Access Permissions" description="Choose which modules, tabs, and actions are accessible.">
        <div className="space-y-3">
          {PERMISSION_MODULES.map((m) => {
            const p = v.permissions[m.name] ?? { enabled: false, tabs: [], actions: [] };
            return (
              <div
                key={m.name}
                className={cn(
                  "rounded-xl border bg-muted/30 overflow-hidden transition-smooth",
                  p.enabled ? "border-primary/30" : "border-border"
                )}
              >
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <Checkbox
                      checked={p.enabled}
                      disabled={readOnly}
                      onCheckedChange={(c) => setPerm(m.name, { enabled: !!c })}
                    />
                    <span className="text-sm font-medium">{m.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                        p.enabled
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-muted text-muted-foreground border-border"
                      )}
                    >
                      {p.enabled ? "Enabled" : "Disabled"}
                    </span>
                    <Switch
                      checked={p.enabled}
                      disabled={readOnly}
                      onCheckedChange={(c) => setPerm(m.name, { enabled: c })}
                    />
                  </div>
                </div>
                {p.enabled && (
                  <div className="px-4 pb-4 pt-1 border-t border-border/60 bg-card space-y-3">
                    {m.tabs.length > 0 && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                          Tabs
                        </p>
                        <div className="flex flex-wrap gap-x-5 gap-y-2">
                          {m.tabs.map((t) => (
                            <label key={t} className="flex items-center gap-1.5 text-xs cursor-pointer">
                              <Checkbox
                                checked={p.tabs.includes(t)}
                                disabled={readOnly}
                                onCheckedChange={() => setPerm(m.name, { tabs: toggleArr(p.tabs, t) })}
                              />
                              {t}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                        Actions
                      </p>
                      <div className="flex flex-wrap gap-x-5 gap-y-2">
                        {m.actions.map((a) => (
                          <label key={a} className="flex items-center gap-1.5 text-xs cursor-pointer">
                            <Checkbox
                              checked={p.actions.includes(a)}
                              disabled={readOnly}
                              onCheckedChange={() => setPerm(m.name, { actions: toggleArr(p.actions, a) })}
                            />
                            {a}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </FormSection>
    </FormShell>
  );
}
