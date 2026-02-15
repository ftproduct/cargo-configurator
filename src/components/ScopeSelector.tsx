import { useState } from "react";
import { Building2, GitBranch } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { branches } from "@/data/mockData";

export function ScopeSelector() {
  const [scope, setScope] = useState<"Company" | "Branch">("Company");
  const [branch, setBranch] = useState("");

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded-md border overflow-hidden text-sm">
        <button
          onClick={() => setScope("Company")}
          className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
            scope === "Company"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:bg-secondary"
          }`}
        >
          <Building2 className="h-3.5 w-3.5" />
          Company
        </button>
        <button
          onClick={() => setScope("Branch")}
          className={`flex items-center gap-1.5 px-3 py-1.5 transition-colors ${
            scope === "Branch"
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:bg-secondary"
          }`}
        >
          <GitBranch className="h-3.5 w-3.5" />
          Branch
        </button>
      </div>
      {scope === "Branch" && (
        <Select value={branch} onValueChange={setBranch}>
          <SelectTrigger className="w-48 h-8 text-sm">
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            {branches.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {scope === "Company" && (
        <Badge variant="outline" className="text-xs font-normal">All Branches</Badge>
      )}
    </div>
  );
}
