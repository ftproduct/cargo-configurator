import { useNavigate } from "react-router-dom";
import { MoreHorizontal, Settings, Copy, Power } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "./StatusBadge";
import { ChargeConfig } from "@/data/mockData";
import { toast } from "sonner";

interface ChargesTableProps {
  charges: ChargeConfig[];
}

export function ChargesTable({ charges }: ChargesTableProps) {
  const navigate = useNavigate();

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="enterprise-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 hover:bg-muted/40">
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Charge Code</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Charge Name</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Scope</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Granularity</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-center">Rules</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-center">Default Rule</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider text-center">Approval</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Last Updated</TableHead>
            <TableHead className="font-semibold text-xs uppercase tracking-wider">Status</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {charges.map((charge) => (
            <TableRow
              key={charge.chargeCode}
              className="cursor-pointer"
              onClick={() => navigate(`/charges/${charge.chargeCode}`)}
            >
              <TableCell className="font-mono text-sm font-medium">{charge.chargeCode}</TableCell>
              <TableCell className="font-medium">{charge.chargeName}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs font-normal">
                  {charge.scope}
                  {charge.branchName && ` · ${charge.branchName}`}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{charge.granularity}</TableCell>
              <TableCell className="text-center text-sm">{charge.rulesCount}</TableCell>
              <TableCell className="text-center">
                {charge.defaultRulePresent ? (
                  <span className="text-success text-sm">Yes</span>
                ) : (
                  <span className="text-muted-foreground text-sm">No</span>
                )}
              </TableCell>
              <TableCell className="text-center">
                {charge.approvalEnabled ? (
                  <span className="text-primary text-sm font-medium">On</span>
                ) : (
                  <span className="text-muted-foreground text-sm">Off</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{formatDate(charge.lastUpdated)}</TableCell>
              <TableCell>
                <StatusBadge status={charge.status} />
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/charges/${charge.chargeCode}`); }}>
                      <Settings className="h-4 w-4 mr-2" /> Configure
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.success("Charge duplicated"); }}>
                      <Copy className="h-4 w-4 mr-2" /> Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); toast.success(`Charge ${charge.status === "Active" ? "disabled" : "enabled"}`); }}>
                      <Power className="h-4 w-4 mr-2" /> {charge.status === "Active" ? "Disable" : "Enable"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
