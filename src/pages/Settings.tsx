import { useEffect, useState } from "react";
import { PageShell } from "@/components/dashboard/PageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormShell, FormSection } from "@/components/dashboard/FormShell";
import { Palette, RotateCcw, ChevronRight, Settings as SettingsIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Palette, RotateCcw, ChevronRight } from "lucide-react";
import {
  DEFAULT_MODULE_COLORS,
  loadColors,
  saveColors,
  applyAccentForRoute,
} from "@/lib/theme";

// 11 curated default colors used across the system.
const CURATED = [
  "#E48444", // Sand orange
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#8B5CF6", // Violet
  "#EF4444", // Red
  "#0EA5E9", // Sky
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#84CC16", // Lime
  "#64748B", // Slate
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
    persist({ ...colors, [editing]: draft });
    toast.success(`${editing} color saved`);
    setEditing(null);
  };

  const resetAll = () => {
    persist({ ...DEFAULT_MODULE_COLORS });
    toast.success("All module colors reset");
  };

  return (
    <PageShell
      icon={SettingsIcon}
      title="Page Color Themes"
      description="Customize the accent color used by each module across the app."
      actions={
        <Button variant="outline" size="sm" className="gap-2" onClick={resetAll}>
          <RotateCcw className="h-4 w-4" /> Reset All
        </Button>
      }
    >
      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        <ul className="divide-y divide-border">
          {MODULES.map((m) => {
            const c = colors[m];
            const isDefault = c.toLowerCase() === DEFAULT_MODULE_COLORS[m].toLowerCase();
            return (
              <li key={m}>
                <button
                  onClick={() => setEditing(m)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-smooth text-left"
                >
                  <span
                    className="h-9 w-9 rounded-lg ring-1 ring-border shrink-0"
                    style={{ background: c }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-display font-semibold tracking-tight">{m}</p>
                    <p className="text-xs text-muted-foreground font-mono">{c}</p>
                  </div>
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
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <FormShell
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        title={editing ? `${editing} Color` : "Color"}
        subtitle="Pick a curated color or set a custom one."
        icon={<Palette className="h-5 w-5" />}
        size="md"
        footer={
          <div className="px-5 md:px-8 py-3 flex items-center justify-between gap-3">
            <Button
              variant="ghost"
              className="gap-1.5 text-muted-foreground"
              onClick={() => editing && setDraft(DEFAULT_MODULE_COLORS[editing])}
            >
              <RotateCcw className="h-3.5 w-3.5" /> Reset to Default
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button className="gradient-primary border-0 shadow-glow px-5" onClick={saveOne}>
                Save
              </Button>
            </div>
          </div>
        }
      >
        <FormSection title="Curated Palette" description="The 11 default system colors.">
          <div className="grid grid-cols-6 sm:grid-cols-11 gap-2">
            {CURATED.map((c) => (
              <button
                key={c}
                onClick={() => setDraft(c)}
                className={cn(
                  "h-9 rounded-lg ring-2 ring-offset-2 ring-offset-card transition-smooth",
                  draft.toLowerCase() === c.toLowerCase()
                    ? "ring-foreground"
                    : "ring-transparent hover:ring-foreground/20"
                )}
                style={{ background: c }}
                aria-label={c}
              />
            ))}
          </div>
        </FormSection>

        <FormSection title="Custom Color" description="Pick any hex value.">
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="h-11 w-14 rounded-lg border border-border cursor-pointer bg-card"
            />
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="flex-1 font-mono text-sm h-11 bg-background"
            />
          </div>
        </FormSection>
      </FormShell>
    </PageShell>
  );
};

export default Settings;
