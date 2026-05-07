import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CardField {
  label: string;
  value: ReactNode;
  mono?: boolean;
  full?: boolean;
}

export interface DataCard {
  id: string;
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  fields: CardField[];
  actions?: ReactNode;
}

export function DataCards({ items, className }: { items: DataCard[]; className?: string }) {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4", className)}>
      {items.map((c) => (
        <div key={c.id} className="rounded-2xl border border-border bg-card shadow-soft hover:shadow-elevated transition-smooth p-5 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-display font-bold text-foreground truncate">{c.title}</p>
              {c.subtitle && <p className="text-xs text-muted-foreground mt-0.5 truncate">{c.subtitle}</p>}
            </div>
            {c.badge}
          </div>
          {c.fields.length > 0 && (
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-muted/30 p-3">
              {c.fields.map((f, i) => (
                <div key={i} className={cn(f.full && "col-span-2")}>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{f.label}</p>
                  <p className={cn("mt-0.5 text-sm text-foreground", f.mono && "font-mono text-xs")}>{f.value}</p>
                </div>
              ))}
            </div>
          )}
          {c.actions && <div className="flex items-center gap-2 pt-1">{c.actions}</div>}
        </div>
      ))}
    </div>
  );
}
