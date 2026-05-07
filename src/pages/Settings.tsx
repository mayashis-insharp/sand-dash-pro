import { useEffect, useState } from "react";
import { PageShell } from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Palette, RotateCcw } from "lucide-react";
import {
  DEFAULT_MODULE_COLORS,
  loadColors,
  saveColors,
  applyAccentForRoute,
} from "@/lib/theme";

const SUGGESTED = [
  "#E48444", "#F97316", "#EF4444", "#EC4899",
  "#8B5CF6", "#6366F1", "#3B82F6", "#0EA5E9",
  "#14B8A6", "#10B981", "#84CC16", "#F59E0B",
  "#64748B", "#0F172A",
];

const MODULES = Object.keys(DEFAULT_MODULE_COLORS);

const Settings = () => {
  const [colors, setColors] = useState<Record<string, string>>(() => loadColors());
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState<string>("");

  useEffect(() => {
    if (editing) setDraft(colors[editing] ?? DEFAULT_MODULE_COLORS[editing]);
  }, [editing, colors]);

  const persist = (next: Record<string, string>) => {
    setColors(next);
    saveColors(next);
    applyAccentForRoute(window.location.pathname);
  };

  const saveOne = () => {
    if (!editing) return;
    const next = { ...colors, [editing]: draft };
    persist(next);
    toast.success(`${editing} color saved`);
    setEditing(null);
  };

  const resetOne = () => {
    if (!editing) return;
    setDraft(DEFAULT_MODULE_COLORS[editing]);
  };

  const resetAll = () => {
    persist({ ...DEFAULT_MODULE_COLORS });
    toast.success("All module colors reset");
  };

  return (
    <PageShell
      title="Page Color Themes"
      description="Customize the accent color used by each module across the app."
      actions={
        <Button variant="outline" size="sm" className="gap-2" onClick={resetAll}>
          <RotateCcw className="h-4 w-4" /> Reset All
        </Button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {MODULES.map((m) => {
          const c = colors[m];
          const isDefault = c.toLowerCase() === DEFAULT_MODULE_COLORS[m].toLowerCase();
          return (
            <button
              key={m}
              onClick={() => setEditing(m)}
              className="group text-left rounded-2xl border border-border bg-card shadow-soft p-5 hover:shadow-elevated hover:border-primary/30 transition-smooth"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-display font-bold tracking-tight">{m}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 font-mono">{c}</p>
                </div>
                <span
                  className="h-12 w-12 rounded-xl ring-1 ring-border shadow-soft shrink-0"
                  style={{ background: c }}
                />
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span
                  className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                    isDefault
                      ? "bg-muted text-muted-foreground border-border"
                      : "bg-primary/10 text-primary border-primary/20"
                  )}
                >
                  {isDefault ? "Default" : "Custom"}
                </span>
                <span className="text-xs text-muted-foreground group-hover:text-primary transition-smooth">
                  Change →
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="sm:max-w-md p-0 gap-0 bg-card border border-border rounded-2xl overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-border bg-card">
            <DialogTitle className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-primary" /> {editing} Color
            </DialogTitle>
          </DialogHeader>

          <div className="p-6 space-y-5 bg-muted/30">
            <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
              <span
                className="h-14 w-14 rounded-xl ring-1 ring-border shadow-soft"
                style={{ background: draft }}
              />
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Preview</p>
                <p className="font-display font-bold text-lg" style={{ color: draft }}>{editing}</p>
                <p className="text-xs text-muted-foreground font-mono">{draft}</p>
              </div>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                System Default
              </p>
              <button
                onClick={() => editing && setDraft(DEFAULT_MODULE_COLORS[editing])}
                className="w-full flex items-center gap-3 rounded-xl border border-border bg-card hover:border-primary/30 px-3 py-2.5 transition-smooth"
              >
                <span
                  className="h-7 w-7 rounded-lg ring-1 ring-border"
                  style={{ background: editing ? DEFAULT_MODULE_COLORS[editing] : "#E48444" }}
                />
                <span className="text-sm font-medium">Default</span>
                <span className="ml-auto text-[11px] font-mono text-muted-foreground">
                  {editing && DEFAULT_MODULE_COLORS[editing]}
                </span>
              </button>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                Suggested
              </p>
              <div className="grid grid-cols-7 gap-2">
                {SUGGESTED.map((c) => (
                  <button
                    key={c}
                    onClick={() => setDraft(c)}
                    className={cn(
                      "h-9 rounded-lg ring-2 ring-offset-2 ring-offset-background transition-smooth",
                      draft.toLowerCase() === c.toLowerCase() ? "ring-foreground" : "ring-transparent hover:ring-foreground/20"
                    )}
                    style={{ background: c }}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                Custom
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="h-10 w-12 rounded-lg border border-border cursor-pointer bg-card"
                />
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  className="flex-1 font-mono text-xs h-10 bg-card"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="px-6 py-3 border-t border-border bg-card flex-row sm:justify-between">
            <Button variant="ghost" className="gap-1.5" onClick={resetOne}>
              <RotateCcw className="h-3.5 w-3.5" /> Reset to Default
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button className="gradient-primary border-0 shadow-glow px-5" onClick={saveOne}>
                Save Changes
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
};

export default Settings;
