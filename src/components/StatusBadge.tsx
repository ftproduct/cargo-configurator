import { Badge } from "@/components/ui/badge";

type StatusType = "Active" | "Inactive" | "Draft" | "Expired" | "Success" | "Error" | "Warning";

const statusStyles: Record<StatusType, string> = {
  Active: "bg-success/10 text-success border-success/20",
  Inactive: "bg-muted text-muted-foreground border-muted",
  Draft: "bg-warning/10 text-warning border-warning/20",
  Expired: "bg-muted text-muted-foreground border-muted",
  Success: "bg-success/10 text-success border-success/20",
  Error: "bg-destructive/10 text-destructive border-destructive/20",
  Warning: "bg-warning/10 text-warning border-warning/20",
};

export function StatusBadge({ status }: { status: StatusType }) {
  return (
    <Badge variant="outline" className={`text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </Badge>
  );
}
