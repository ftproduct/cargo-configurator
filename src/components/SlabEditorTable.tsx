import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, AlertTriangle } from "lucide-react";

export interface SlabRow {
  id: string;
  from: string;
  to: string;
  mode: "Flat" | "Per-unit";
  valueMode: "Fixed" | "Formula";
  value: string;
}

interface SlabEditorTableProps {
  slabs: SlabRow[];
  onChange: (slabs: SlabRow[]) => void;
  showOverflow?: boolean;
}

export function SlabEditorTable({ slabs, onChange, showOverflow }: SlabEditorTableProps) {
  const addRow = () => {
    const lastTo = slabs.length > 0 ? slabs[slabs.length - 1].to : "0";
    onChange([
      ...slabs,
      { id: `slab-${Date.now()}`, from: lastTo, to: "", mode: "Flat", valueMode: "Fixed", value: "" },
    ]);
  };

  const removeRow = (id: string) => {
    onChange(slabs.filter((s) => s.id !== id));
  };

  const updateRow = (id: string, field: keyof SlabRow, val: string) => {
    onChange(slabs.map((s) => (s.id === id ? { ...s, [field]: val } : s)));
  };

  const hasContinuityError = (index: number) => {
    if (index === 0) return false;
    const prev = slabs[index - 1];
    const curr = slabs[index];
    return prev.to !== "" && curr.from !== "" && prev.to !== curr.from;
  };

  return (
    <div className="space-y-3">
      <div className="enterprise-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40 hover:bg-muted/40">
              <TableHead className="text-xs font-semibold uppercase w-24">From</TableHead>
              <TableHead className="text-xs font-semibold uppercase w-24">To</TableHead>
              <TableHead className="text-xs font-semibold uppercase w-32">Mode</TableHead>
              <TableHead className="text-xs font-semibold uppercase w-32">Value Type</TableHead>
              <TableHead className="text-xs font-semibold uppercase">Value / Formula</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slabs.map((slab, i) => (
              <TableRow key={slab.id}>
                <TableCell className="p-2">
                  <div className="flex items-center gap-1">
                    {hasContinuityError(i) && (
                      <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0" />
                    )}
                    <Input
                      value={slab.from}
                      onChange={(e) => updateRow(slab.id, "from", e.target.value)}
                      className="h-8 text-sm"
                      placeholder="0"
                    />
                  </div>
                </TableCell>
                <TableCell className="p-2">
                  <Input
                    value={slab.to}
                    onChange={(e) => updateRow(slab.id, "to", e.target.value)}
                    className="h-8 text-sm"
                    placeholder="∞"
                  />
                </TableCell>
                <TableCell className="p-2">
                  <Select value={slab.mode} onValueChange={(v) => updateRow(slab.id, "mode", v)}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flat">Flat</SelectItem>
                      <SelectItem value="Per-unit">Per-unit</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="p-2">
                  <Select value={slab.valueMode} onValueChange={(v) => updateRow(slab.id, "valueMode", v)}>
                    <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fixed">Fixed Value</SelectItem>
                      <SelectItem value="Formula">Formula</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="p-2">
                  <Input
                    value={slab.value}
                    onChange={(e) => updateRow(slab.id, "value", e.target.value)}
                    className="h-8 text-sm font-mono"
                    placeholder={slab.valueMode === "Formula" ? "base_freight * 0.1" : "500"}
                  />
                </TableCell>
                <TableCell className="p-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeRow(slab.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {showOverflow && slabs.length > 0 && (
        <div className="p-3 rounded-md border bg-muted/30">
          <p className="text-xs font-medium text-muted-foreground mb-2">Overflow (beyond last slab)</p>
          <div className="flex items-center gap-3">
            <Select defaultValue="Per-unit">
              <SelectTrigger className="h-8 text-sm w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Flat">Flat</SelectItem>
                <SelectItem value="Per-unit">Per-unit</SelectItem>
              </SelectContent>
            </Select>
            <Input className="h-8 text-sm font-mono max-w-[200px]" placeholder="Rate per unit" />
          </div>
        </div>
      )}

      <Button variant="outline" size="sm" onClick={addRow} className="gap-1.5">
        <Plus className="h-3.5 w-3.5" /> Add Slab
      </Button>
    </div>
  );
}
