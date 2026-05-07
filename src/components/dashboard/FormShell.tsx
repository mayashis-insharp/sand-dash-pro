import { ReactNode } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface FormShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  subtitle?: string;
  badge?: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  footer: ReactNode;
  size?: "md" | "lg" | "xl";
}

/**
 * Centered modal with sticky header + scrollable body + sticky footer.
 * Use for every Add/View/Edit form so they share the same theme & structure.
 */
export function FormShell({
  open,
  onOpenChange,
  title,
  subtitle,
  badge,
  icon,
  children,
  footer,
  size = "lg",
}: FormShellProps) {
  const widthCls =
    size === "xl" ? "sm:max-w-4xl" : size === "lg" ? "sm:max-w-3xl" : "sm:max-w-xl";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "p-0 gap-0 bg-card border border-border shadow-elevated rounded-2xl overflow-hidden",
          "w-[96vw] max-h-[92vh] flex flex-col",
          widthCls,
        )}
      >
        {/* Sticky header */}
        <div className="px-6 py-4 border-b border-border bg-card flex items-center gap-4 shrink-0">
          {icon && (
            <div className="h-10 w-10 rounded-xl gradient-primary grid place-items-center shadow-glow shrink-0 text-primary-foreground">
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-display font-bold tracking-tight truncate">{title}</h2>
              {badge}
            </div>
            {subtitle && <p className="text-xs text-muted-foreground truncate mt-0.5">{subtitle}</p>}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 md:px-7 py-6 bg-muted/30">
          <div className="space-y-5">{children}</div>
        </div>

        {/* Sticky footer */}
        <div className="border-t border-border bg-card shrink-0">{footer}</div>
      </DialogContent>
    </Dialog>
  );
}

export function FormSection({
  icon,
  title,
  description,
  children,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card shadow-soft p-5 md:p-6">
      <div className="mb-5 flex items-center gap-3">
        {icon && (
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-sm font-display font-bold tracking-tight text-foreground">{title}</h3>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}
