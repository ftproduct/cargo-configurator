import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { ChargesTable } from "@/components/ChargesTable";
import { EmptyState } from "@/components/EmptyState";
import { mockCharges } from "@/data/mockData";

const filterOptions = ["Active", "Draft", "Inactive", "Journey", "Load", "Approval On"];

export default function ChargesLanding() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const toggleFilter = (f: string) =>
    setActiveFilters((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));

  const filtered = mockCharges.filter((c) => {
    const matchSearch =
      !search ||
      c.chargeCode.toLowerCase().includes(search.toLowerCase()) ||
      c.chargeName.toLowerCase().includes(search.toLowerCase());

    const matchFilters =
      activeFilters.length === 0 ||
      activeFilters.some(
        (f) =>
          f === c.status ||
          f === c.granularity ||
          (f === "Approval On" && c.approvalEnabled)
      );

    return matchSearch && matchFilters;
  });

  return (
    <Layout>
      <div className="page-header">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Charge Configurations</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage freight charge types and their pricing rules
          </p>
        </div>
        <Button onClick={() => navigate("/charges/new")} className="gap-1.5">
          <Plus className="h-4 w-4" /> Configure New Charge
        </Button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search charges…"
            className="pl-9 h-9"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {filterOptions.map((f) => (
            <Badge
              key={f}
              variant={activeFilters.includes(f) ? "default" : "outline"}
              className="cursor-pointer text-xs"
              onClick={() => toggleFilter(f)}
            >
              {f}
            </Badge>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No charge configurations found"
          description="Get started by configuring your first freight charge type with pricing rules and approval workflows."
          actionLabel="Configure New Charge"
          onAction={() => navigate("/charges/new")}
        />
      ) : (
        <ChargesTable charges={filtered} />
      )}
    </Layout>
  );
}
