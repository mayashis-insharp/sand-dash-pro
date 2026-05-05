import { ReactNode } from "react";
import { DashboardLayout } from "./DashboardLayout";

interface PageShellProps {
  breadcrumb?: string[];
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function PageShell({ breadcrumb = [], title, description, actions, children }: PageShellProps) {
  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          {breadcrumb.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
              {breadcrumb.map((b, i) => (
                <span key={i} className={i === breadcrumb.length - 1 ? "text-foreground font-medium" : ""}>
                  {b}
                  {i < breadcrumb.length - 1 && <span className="ml-2">/</span>}
                </span>
              ))}
            </div>
          )}
          <h1 className="text-3xl font-display font-bold tracking-tight">{title}</h1>
          {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </div>
      {children}
    </DashboardLayout>
  );
}

interface TabBarProps<T extends string> {
  tabs: readonly T[];
  active: T;
  onChange: (t: T) => void;
  right?: ReactNode;
}

export function TabBar<T extends string>({ tabs, active, onChange, right }: TabBarProps<T>) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-soft mb-6">
      <div className="flex items-end justify-between gap-4 px-4 sm:px-6 pt-2 flex-wrap">
        <div className="flex items-center gap-1 flex-wrap">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => onChange(t)}
              className={`relative px-4 py-3 text-sm font-medium transition-smooth ${
                active === t ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
              {active === t && <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full gradient-primary" />}
            </button>
          ))}
        </div>
        {right && <div className="flex items-center gap-2 pb-2 flex-wrap">{right}</div>}
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
