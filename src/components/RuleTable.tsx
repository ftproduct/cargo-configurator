import { useNavigate } from "react-router-dom";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { RuleConfig } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

interface RuleTableProps {
  rules: RuleConfig[];
  chargeCode: string;
}

export function RuleTable({ rules, chargeCode }: RuleTableProps) {
  const navigate = useNavigate();

  return (
    <div className="enterprise-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="font-semibold text-xs uppercase tracking-wider w-20">Priority</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Alias</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Validity</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Dimensions</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Rate Type</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Compute On</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-center">MGT</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-center">Approval</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell>
                {rule.priority === 0 ? (
                  <Badge variant="secondary" className="text-xs">Default</Badge>
                ) : (
                  <span className="font-mono text-sm font-medium">P{rule.priority}</span>
                )}
              </TableCell>
              <TableCell className="font-medium text-sm">{rule.alias}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {rule.validityStart} → {rule.validityEnd}
              </TableCell>
              <TableCell className="text-sm max-w-[200px] truncate">{rule.dimensions}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">{rule.rateType}</Badge>
              </TableCell>
              <TableCell className="text-sm">{rule.computeOn}</TableCell>
              <TableCell className="text-center">
                {rule.mgtGate ? (
                  <span className="text-success text-sm">✓</span>
                ) : (
                  <span className="text-muted-foreground text-sm">—</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                {rule.approvalEnabled ? (
                  <span className="text-primary text-sm font-medium">On</span>
                ) : (
                  <span className="text-muted-foreground text-sm">Off</span>
                )}
              </TableCell>
              <TableCell>
                <StatusBadge status={rule.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
