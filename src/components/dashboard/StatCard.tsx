import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
  accent?: "primary" | "success" | "info" | "warning";
}

const accentMap = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  info: "bg-info/10 text-info",
  warning: "bg-warning/15 text-warning",
};

export function StatCard({ label, value, delta, trend = "up", icon: Icon, accent = "primary" }: StatCardProps) {
  return (
    <div className="group relative rounded-2xl border border-border bg-card p-5 shadow-soft hover:shadow-elevated transition-smooth overflow-hidden">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/[0.04] group-hover:bg-primary/[0.08] transition-smooth" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
          <p className="mt-2 text-2xl font-display font-bold text-foreground">{value}</p>
          {delta && (
            <div className="mt-2 flex items-center gap-1 text-xs">
              {trend === "up" ? (
                <TrendingUp className="h-3 w-3 text-success" />
              ) : (
                <TrendingDown className="h-3 w-3 text-destructive" />
              )}
              <span className={trend === "up" ? "text-success font-medium" : "text-destructive font-medium"}>{delta}</span>
              <span className="text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className={cn("grid h-11 w-11 place-items-center rounded-xl", accentMap[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
