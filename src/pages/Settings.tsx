import { PageShell } from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, Palette, Building2, FileText, CreditCard, Layers, SlidersHorizontal } from "lucide-react";

const themes = ["Dashboard", "Orders", "Payments", "Inventory", "Suppliers", "Expenses"];
const colors = ["#EF7F3C", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"];

const Section = ({ icon: Icon, title, description, children }: any) => (
  <div className="rounded-2xl border border-border bg-card shadow-soft p-6">
    <div className="flex items-center gap-3 mb-5">
      <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center"><Icon className="h-5 w-5" /></div>
      <div>
        <h3 className="font-display font-bold">{title}</h3>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
    {children}
  </div>
);

const Settings = () => {
  return (
    <PageShell breadcrumb={["Settings"]} title="Settings" description="Configure your business preferences.">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Section icon={Palette} title="Page Color Themes" description="Customize the accent color per module.">
          <div className="space-y-2">
            {themes.map(t => (
              <div key={t} className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-3 py-2">
                <span className="text-sm font-medium">{t}</span>
                <div className="flex items-center gap-1.5">
                  {colors.map(c => (
                    <button key={c} className="h-6 w-6 rounded-full ring-2 ring-transparent hover:ring-foreground/20 transition-smooth" style={{ background: c }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={Building2} title="Business Profile" description="Public business information.">
          <div className="space-y-3">
            <div><Label>Business Name</Label><Input className="mt-1.5" defaultValue="Sand Supply (Pvt) Ltd" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Phone</Label><Input className="mt-1.5" defaultValue="+94 11 4567890" /></div>
              <div><Label>Email</Label><Input className="mt-1.5" defaultValue="hello@sandsupply.lk" /></div>
            </div>
            <div><Label>Address</Label><Textarea className="mt-1.5" defaultValue="No. 25, Colombo Rd, Kaduwela" /></div>
          </div>
        </Section>

        <Section icon={FileText} title="Invoice Settings" description="Defaults for invoices and receipts.">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Invoice Prefix</Label><Input className="mt-1.5" defaultValue="INV-" /></div>
              <div><Label>Tax %</Label><Input className="mt-1.5" defaultValue="0" /></div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-3 py-2.5">
              <span className="text-sm">Show business logo on invoice</span>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-3 py-2.5">
              <span className="text-sm">Auto-email invoice on order</span>
              <Switch />
            </div>
          </div>
        </Section>

        <Section icon={CreditCard} title="Payment Methods" description="Toggle accepted payment methods.">
          <div className="space-y-2">
            {["Cash", "Bank Transfer", "Cheque", "Credit", "Card", "Other"].map((m, i) => (
              <div key={m} className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-3 py-2.5">
                <span className="text-sm font-medium">{m}</span>
                <Switch defaultChecked={i < 4} />
              </div>
            ))}
          </div>
        </Section>

        <Section icon={Layers} title="Sand Type Settings" description="Configure available sand types.">
          <div className="space-y-2">
            {["River Sand – Soft", "River Sand – Coarse", "Sea Sand", "Quarry Dust", "M-Sand"].map(s => (
              <div key={s} className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-3 py-2.5">
                <span className="text-sm">{s}</span>
                <button className="text-muted-foreground hover:text-destructive"><X className="h-4 w-4" /></button>
              </div>
            ))}
            <Button variant="outline" size="sm" className="gap-1 mt-1"><Plus className="h-3.5 w-3.5" /> Add Sand Type</Button>
          </div>
        </Section>

        <Section icon={SlidersHorizontal} title="General Preferences" description="Behavior and display.">
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-3 py-2.5"><span className="text-sm">Dark mode</span><Switch /></div>
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-3 py-2.5"><span className="text-sm">Compact tables</span><Switch /></div>
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-3 py-2.5"><span className="text-sm">Email daily summary</span><Switch defaultChecked /></div>
            <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 px-3 py-2.5"><span className="text-sm">Low-stock browser alerts</span><Switch defaultChecked /></div>
          </div>
        </Section>
      </div>
    </PageShell>
  );
};

export default Settings;
