import { LayoutGrid, List } from "lucide-react";

export type ViewMode = "table" | "card";

export function ViewToggle({ value, onChange, className = "" }: { value: ViewMode; onChange: (v: ViewMode) => void; className?: string }) {
  return (
    <div className={`inline-flex items-center rounded-lg border border-border bg-card p-0.5 ${className}`}>
      <button
        onClick={() => onChange("table")}
        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-smooth ${
          value === "table" ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <List className="h-3.5 w-3.5" /> Table
      </button>
      <button
        onClick={() => onChange("card")}
        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-smooth ${
          value === "card" ? "bg-muted text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        <LayoutGrid className="h-3.5 w-3.5" /> Cards
      </button>
    </div>
  );
}
