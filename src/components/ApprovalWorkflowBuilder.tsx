import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2 } from "lucide-react";
import { roles } from "@/data/mockData";

interface ApprovalLevel {
  id: string;
  level: number;
  roles: string[];
}

interface RoutingRule {
  id: string;
  conditionField: string;
  operator: string;
  value: string;
  requiredLevels: string[];
}

export function ApprovalWorkflowBuilder() {
  const [levels, setLevels] = useState<ApprovalLevel[]>([
    { id: "l1", level: 1, roles: ["Finance Manager"] },
    { id: "l2", level: 2, roles: ["Operations Head"] },
  ]);

  const [routingRules, setRoutingRules] = useState<RoutingRule[]>([
    {
      id: "rr1",
      conditionField: "computed_charge_amount",
      operator: ">",
      value: "50000",
      requiredLevels: ["L1", "L2"],
    },
  ]);

  const addLevel = () => {
    setLevels([
      ...levels,
      { id: `l${Date.now()}`, level: levels.length + 1, roles: [] },
    ]);
  };

  const removeLevel = (id: string) => {
    setLevels(levels.filter((l) => l.id !== id));
  };

  const toggleRole = (levelId: string, role: string) => {
    setLevels(
      levels.map((l) => {
        if (l.id !== levelId) return l;
        return {
          ...l,
          roles: l.roles.includes(role) ? l.roles.filter((r) => r !== role) : [...l.roles, role],
        };
      })
    );
  };

  const addRoutingRule = () => {
    setRoutingRules([
      ...routingRules,
      { id: `rr${Date.now()}`, conditionField: "computed_charge_amount", operator: ">", value: "", requiredLevels: [] },
    ]);
  };

  const removeRoutingRule = (id: string) => {
    setRoutingRules(routingRules.filter((r) => r.id !== id));
  };

  const previewJson = {
    levels: levels.map((l) => ({ level: `L${l.level}`, roles: l.roles })),
    routing_rules: routingRules.map((r) => ({
      condition: `${r.conditionField} ${r.operator} ${r.value}`,
      required_levels: r.requiredLevels,
    })),
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold mb-3">Approval Levels</h4>
        <div className="space-y-3">
          {levels.map((level) => (
            <div key={level.id} className="p-3 rounded-md border bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Level {level.level} (L{level.level})</span>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeLevel(level.id)}>
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {roles.map((role) => (
                  <Badge
                    key={role}
                    variant={level.roles.includes(role) ? "default" : "outline"}
                    className="cursor-pointer text-xs"
                    onClick={() => toggleRole(level.id, role)}
                  >
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addLevel} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add Level
          </Button>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-3">Routing Rules</h4>
        <div className="space-y-3">
          {routingRules.map((rule) => (
            <div key={rule.id} className="p-3 rounded-md border bg-card flex flex-wrap items-center gap-2">
              <Select
                value={rule.conditionField}
                onValueChange={(v) =>
                  setRoutingRules(routingRules.map((r) => (r.id === rule.id ? { ...r, conditionField: v } : r)))
                }
              >
                <SelectTrigger className="h-8 w-52 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="computed_charge_amount">Computed Charge Amount</SelectItem>
                  <SelectItem value="base_freight_override_pct">Base Freight Override %</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={rule.operator}
                onValueChange={(v) =>
                  setRoutingRules(routingRules.map((r) => (r.id === rule.id ? { ...r, operator: v } : r)))
                }
              >
                <SelectTrigger className="h-8 w-20 text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value=">">{">"}</SelectItem>
                  <SelectItem value=">=">{"≥"}</SelectItem>
                  <SelectItem value="<">{"<"}</SelectItem>
                  <SelectItem value="<=">{"≤"}</SelectItem>
                  <SelectItem value="=">{"="}</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={rule.value}
                onChange={(e) =>
                  setRoutingRules(routingRules.map((r) => (r.id === rule.id ? { ...r, value: e.target.value } : r)))
                }
                className="h-8 w-28 text-sm"
                placeholder="Value"
              />
              <span className="text-xs text-muted-foreground">→ Require:</span>
              <div className="flex gap-1">
                {levels.map((l) => (
                  <Badge
                    key={l.id}
                    variant={rule.requiredLevels.includes(`L${l.level}`) ? "default" : "outline"}
                    className="cursor-pointer text-xs"
                    onClick={() => {
                      const label = `L${l.level}`;
                      setRoutingRules(
                        routingRules.map((r) =>
                          r.id === rule.id
                            ? {
                                ...r,
                                requiredLevels: r.requiredLevels.includes(label)
                                  ? r.requiredLevels.filter((x) => x !== label)
                                  : [...r.requiredLevels, label],
                              }
                            : r
                        )
                      );
                    }}
                  >
                    L{l.level}
                  </Badge>
                ))}
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto" onClick={() => removeRoutingRule(rule.id)}>
                <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addRoutingRule} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add Routing Rule
          </Button>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Preview (JSON)</h4>
        <pre className="p-3 rounded-md bg-muted text-xs font-mono overflow-auto max-h-48">
          {JSON.stringify(previewJson, null, 2)}
        </pre>
      </div>
    </div>
  );
}
