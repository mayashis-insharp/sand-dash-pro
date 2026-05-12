import { useState, useEffect, useMemo } from "react";
import { FormShell, FormSection } from "./FormShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, FileSpreadsheet, ListChecks, Filter, Download } from "lucide-react";
import { toast } from "sonner";

export interface ExportFilterDef {
  key: string;
  label: string;
  type: "date" | "select";
  options?: { value: string; label: string }[];
  placeholder?: string;
}

interface ExportReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleName: string;
  columns: string[];
  filters?: ExportFilterDef[];
}

export function ExportReportDialog({
  open,
  onOpenChange,
  moduleName,
  columns,
  filters = [],
}: ExportReportDialogProps) {
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (open) {
      const init: Record<string, boolean> = {};
      columns.forEach((c) => (init[c] = true));
      setSelected(init);
    }
  }, [open, columns]);

  const allChecked = useMemo(
    () => columns.length > 0 && columns.every((c) => selected[c]),
    [columns, selected],
  );

  const toggleAll = (v: boolean) => {
    const next: Record<string, boolean> = {};
    columns.forEach((c) => (next[c] = v));
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

  return (
    <FormShell
      open={open}
      onOpenChange={onOpenChange}
      title={`Export Report - ${moduleName}`}
      subtitle="Choose columns and filters, then export as PDF or Excel."
      icon={<Download className="h-5 w-5" />}
      size="lg"
      footer={
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 px-6 py-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="outline"
            className="gap-2"
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
        icon={<ListChecks className="h-4 w-4" />}
        title="Columns"
        description="Select the columns to include in the report."
      >
        <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
          <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
            <Checkbox
              checked={allChecked}
              onCheckedChange={(v) => toggleAll(!!v)}
            />
            Select all
          </label>
          <span className="text-xs text-muted-foreground">
            {Object.values(selected).filter(Boolean).length} of {columns.length} selected
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {columns.map((col) => (
            <label
              key={col}
              className="flex items-center gap-2 text-sm cursor-pointer select-none rounded-md hover:bg-muted/40 px-1.5 py-1 -mx-1.5"
            >
              <Checkbox
                checked={!!selected[col]}
                onCheckedChange={(v) =>
                  setSelected((s) => ({ ...s, [col]: !!v }))
                }
              />
              <span className="text-foreground">{col}</span>
            </label>
          ))}
        </div>
      </FormSection>

      {filters.length > 0 && (
        <FormSection
          icon={<Filter className="h-4 w-4" />}
          title="Filters"
          description="Narrow down the data to export."
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filters.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  {f.label}
                </Label>
                {f.type === "date" ? (
                  <Input type="date" className="h-10 bg-background" />
                ) : (
                  <Select>
                    <SelectTrigger className="h-10 bg-background">
                      <SelectValue placeholder={f.placeholder ?? "All"} />
                    </SelectTrigger>
                    <SelectContent>
                      {f.options?.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>
        </FormSection>
      )}
    </FormShell>
  );
}
