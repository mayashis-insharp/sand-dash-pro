import { useState, useEffect, useMemo } from "react";
import { FormShell, FormSection } from "./FormShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  FileText,
  FileSpreadsheet,
  Filter,
  Download,
  ChevronDown,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export type ExportFilter =
  | { kind: "dateRange" }
  | { kind: "multiSelect"; options: string[]; allLabel?: string }
  | { kind: "numberRange"; unit?: string }
  | { kind: "text"; placeholder?: string };

export interface ExportColumn {
  name: string;
  filter?: ExportFilter;
}

interface ExportReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleName: string;
  columns: ExportColumn[];
}

/* --- Multi-select dropdown with All option --- */
function MultiSelect({
  options,
  allLabel = "All",
  value,
  onChange,
}: {
  options: string[];
  allLabel?: string;
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const allSelected = value.length === 0 || value.length === options.length;
  const label = allSelected
    ? allLabel
    : value.length === 1
      ? value[0]
      : `${value.length} selected`;

  const toggle = (opt: string) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  };

  const toggleAll = () => {
    if (allSelected) onChange([]);
    else onChange([]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <span className={cn("truncate", allSelected && "text-muted-foreground")}>
            {label}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
        <div className="max-h-64 overflow-y-auto py-1">
          <button
            type="button"
            onClick={toggleAll}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50 border-b border-border"
          >
            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                allSelected && "bg-primary text-primary-foreground",
              )}
            >
              {allSelected && <Check className="h-3 w-3" />}
            </span>
            <span className="font-medium">{allLabel}</span>
          </button>
          {options.map((opt) => {
            const checked = !allSelected && value.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-muted/50"
              >
                <span
                  className={cn(
                    "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    checked && "bg-primary text-primary-foreground",
                  )}
                >
                  {checked && <Check className="h-3 w-3" />}
                </span>
                <span className="truncate text-foreground">{opt}</span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* --- Per-column filter input --- */
function ColumnFilter({ col }: { col: ExportColumn }) {
  const [multi, setMulti] = useState<string[]>([]);
  const f = col.filter;
  if (!f) return null;

  if (f.kind === "dateRange") {
    return (
      <div className="grid grid-cols-2 gap-2">
        <Input type="date" className="h-10 bg-background" />
        <Input type="date" className="h-10 bg-background" />
      </div>
    );
  }
  if (f.kind === "numberRange") {
    return (
      <div className="grid grid-cols-2 gap-2">
        <Input type="number" placeholder={`Min${f.unit ? ` (${f.unit})` : ""}`} className="h-10 bg-background" />
        <Input type="number" placeholder={`Max${f.unit ? ` (${f.unit})` : ""}`} className="h-10 bg-background" />
      </div>
    );
  }
  if (f.kind === "multiSelect") {
    return (
      <MultiSelect
        options={f.options}
        allLabel={f.allLabel ?? `All ${col.name}`}
        value={multi}
        onChange={setMulti}
      />
    );
  }
  return <Input placeholder={f.placeholder ?? `Filter by ${col.name}`} className="h-10 bg-background" />;
}

export function ExportReportDialog({
  open,
  onOpenChange,
  moduleName,
  columns,
}: ExportReportDialogProps) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (open) {
      const init: Record<string, boolean> = {};
      columns.forEach((c) => (init[c.name] = true));
      setSelected(init);
    }
  }, [open, columns]);

  const allChecked = useMemo(
    () => columns.length > 0 && columns.every((c) => selected[c.name]),
    [columns, selected],
  );

  const toggleAll = (v: boolean) => {
    const next: Record<string, boolean> = {};
    columns.forEach((c) => (next[c.name] = v));
    setSelected(next);
  };

  const handleExport = (format: "PDF" | "Excel") => {
    const count = Object.values(selected).filter(Boolean).length;
    if (count === 0) {
      toast.error("Select at least one column to export");
      return;
    }
    toast.success(`${moduleName} report exported as ${format}`, {
      description: `${count} column${count === 1 ? "" : "s"} included.`,
    });
    onOpenChange(false);
  };

  const activeColumns = columns.filter((c) => selected[c.name] && c.filter);

  return (
    <FormShell
      open={open}
      onOpenChange={onOpenChange}
      title={`Export Report - ${moduleName}`}
      subtitle="Choose columns, refine filters, then export as PDF or Excel."
      icon={<Download className="h-5 w-5" />}
      size="lg"
      footer={
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 px-6 py-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="gap-2 gradient-primary border-0 shadow-glow text-primary-foreground"
            onClick={() => handleExport("PDF")}
          >
            <FileText className="h-4 w-4" /> Export as PDF
          </Button>
          <Button
            className="gap-2 gradient-primary border-0 shadow-glow text-primary-foreground"
            onClick={() => handleExport("Excel")}
          >
            <FileSpreadsheet className="h-4 w-4" /> Export as Excel
          </Button>
        </div>
      }
    >
      <FormSection
        icon={<Filter className="h-4 w-4" />}
        title="Filters"
        description="Select the columns to include. Filters appear below each selected column."
      >
        {/* Columns header */}
        <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
            <Checkbox
              checked={allChecked}
              onCheckedChange={(v) => toggleAll(!!v)}
            />
            Select all columns
          </label>
          <span className="text-xs text-muted-foreground">
            {Object.values(selected).filter(Boolean).length} of {columns.length} selected
          </span>
        </div>

        {/* Columns checkboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-5">
          {columns.map((col) => (
            <label
              key={col.name}
              className="flex items-center gap-2 text-sm cursor-pointer select-none rounded-md hover:bg-muted/40 px-1.5 py-1 -mx-1.5"
            >
              <Checkbox
                checked={!!selected[col.name]}
                onCheckedChange={(v) =>
                  setSelected((s) => ({ ...s, [col.name]: !!v }))
                }
              />
              <span className="text-foreground">{col.name}</span>
            </label>
          ))}
        </div>

        {/* Per-column filter inputs */}
        {activeColumns.length > 0 && (
          <div className="border-t border-border pt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {activeColumns.map((col) => (
                <div key={col.name} className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    {col.name}
                  </Label>
                  <ColumnFilter col={col} />
                </div>
              ))}
            </div>
          </div>
        )}
      </FormSection>
    </FormShell>
  );
}
