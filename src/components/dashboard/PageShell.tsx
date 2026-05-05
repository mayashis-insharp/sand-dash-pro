import { ReactNode } from "react";
import { DashboardLayout } from "./DashboardLayout";

interface PageShellProps {
  breadcrumb?: string[];
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function PageShell({ breadcrumb: _b = [], title, description, actions, children }: PageShellProps) {
  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </div>
      {children}
    </DashboardLayout>
  );
}

interface TabBarProps {
  tabs: readonly string[];
  active: string;
  onChange: (t: any) => void;
  right?: ReactNode;
}

export function TabBar({ tabs, active, onChange, right }: TabBarProps) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-soft mb-6 p-2 sm:p-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => onChange(t)}
              className={`rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition-smooth ${
                active === t
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {right && <div className="flex items-center gap-2 flex-wrap">{right}</div>}
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }: { icon: any; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 py-16 px-6 text-center">
      <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/10 text-primary grid place-items-center mb-4">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-display font-bold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm mx-auto">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Pagination({ from = 1, to = 5, total = 100 }: { from?: number; to?: number; total?: number }) {
  return (
    <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
      <span>
        Showing <span className="font-medium text-foreground">{from}–{to}</span> of{" "}
        <span className="font-medium text-foreground">{total.toLocaleString()}</span>
      </span>
      <div className="flex items-center gap-1">
        <button className="rounded-md border border-border bg-card px-3 h-8 text-xs disabled:opacity-50" disabled>
          Previous
        </button>
        <button className="rounded-md border border-border bg-card px-3 h-8 text-xs hover:bg-muted">Next</button>
      </div>
    </div>
  );
}
