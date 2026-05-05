import { useState } from "react";
import { PageShell } from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const modules = ["Dashboard", "Orders", "Payments", "Inventory", "Suppliers", "Expenses", "Employees", "Customers", "Users", "Settings"];
const palette = ["#E48444", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899", "#0EA5E9", "#EF4444", "#14B8A6", "#64748B"];

const Settings = () => {
  const [colors, setColors] = useState<Record<string, string>>(Object.fromEntries(modules.map(m => [m, "#E48444"])));
  const [custom, setCustom] = useState("#E48444");
  const [active, setActive] = useState<string | null>(null);

  return (
    <PageShell
      title="Page Color Themes"
      description="Customize the accent color for each module."
      actions={
        <>
          <Button variant="outline" size="sm" onClick={() => { setColors(Object.fromEntries(modules.map(m => [m, "#E48444"]))); toast.success("Reset to default"); }}>Reset All</Button>
          <Button size="sm" className="gradient-primary border-0 shadow-glow" onClick={() => toast.success("Theme colors saved")}>Save Colors</Button>
        </>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-muted/30">
            <h4 className="text-sm font-display font-bold">Modules</h4>
          </div>
          <div className="divide-y divide-border">
            {modules.map(m => (
              <div key={m} className={cn("flex items-center justify-between px-5 py-3 cursor-pointer hover:bg-muted/30", active === m && "bg-primary/5")} onClick={() => setActive(m)}>
                <span className="text-sm font-medium">{m}</span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">{colors[m]}</span>
                  <span className="h-7 w-7 rounded-lg border border-border" style={{ background: colors[m] }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card shadow-soft p-5 h-fit">
          <h4 className="text-sm font-display font-bold mb-3">Curated Palette</h4>
          <div className="grid grid-cols-5 gap-2 mb-5">
            {palette.map(c => (
              <button key={c} onClick={() => active && setColors(s => ({ ...s, [active]: c }))} className="h-10 rounded-lg ring-2 ring-transparent hover:ring-foreground/20 transition-smooth" style={{ background: c }} />
            ))}
          </div>
          <h4 className="text-sm font-display font-bold mb-2">Custom Color</h4>
          <div className="flex items-center gap-2">
            <input type="color" value={custom} onChange={(e) => setCustom(e.target.value)} className="h-10 w-10 rounded-lg border border-border cursor-pointer" />
            <Input value={custom} onChange={(e) => setCustom(e.target.value)} className="flex-1 font-mono text-xs" />
            <Button size="sm" variant="outline" onClick={() => active && setColors(s => ({ ...s, [active]: custom }))}>Apply</Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{active ? `Selecting color for: ${active}` : "Select a module on the left to apply colors."}</p>
        </div>
      </div>
    </PageShell>
  );
};

export default Settings;
