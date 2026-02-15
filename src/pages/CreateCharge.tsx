import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, Building2, GitBranch } from "lucide-react";
import { branches, predefinedChargeTypes, roles } from "@/data/mockData";
import { toast } from "sonner";

type Step = "scope" | "chargeType" | "settings";

export default function CreateCharge() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("scope");

  // Step A
  const [scope, setScope] = useState<"Company" | "Branch">("Company");
  const [branchId, setBranchId] = useState("");

  // Step B
  const [chargeMode, setChargeMode] = useState<"predefined" | "custom">("predefined");
  const [selectedCharge, setSelectedCharge] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [customName, setCustomName] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  // Settings
  const [whoCanAdd, setWhoCanAdd] = useState<string[]>(["Admin"]);
  const [provisional, setProvisional] = useState(false);
  const [remarksMandatory, setRemarksMandatory] = useState(false);
  const [attachmentsMandatory, setAttachmentsMandatory] = useState(false);
  const [approvalEnabled, setApprovalEnabled] = useState(false);
  const [granularity, setGranularity] = useState<"Journey" | "Load">("Journey");

  const chargeCode = chargeMode === "predefined" ? selectedCharge : customCode;

  const toggleRole = (role: string) => {
    setWhoCanAdd((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  };

  const steps = [
    { key: "scope", label: "Scope" },
    { key: "chargeType", label: "Charge Type" },
    { key: "settings", label: "Settings" },
  ];

  const handleSaveContinue = () => {
    toast.success("Charge type configured");
    navigate(`/charges/${chargeCode}/rules/new`);
  };

  return (
    <Layout>
      <div className="page-header">
        <h2 className="text-2xl font-bold tracking-tight">Configure New Charge</h2>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                step === s.key
                  ? "bg-primary text-primary-foreground font-medium"
                  : steps.findIndex((x) => x.key === step) > i
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <span className="h-5 w-5 rounded-full bg-current/20 flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              {s.label}
            </div>
            {i < steps.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
          </div>
        ))}
      </div>

      {/* Step A: Scope */}
      {step === "scope" && (
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle className="text-lg">Choose Scope</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={scope} onValueChange={(v) => setScope(v as "Company" | "Branch")} className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-md border cursor-pointer hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="Company" />
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Company-level</p>
                  <p className="text-xs text-muted-foreground">Applies to all branches unless overridden</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-md border cursor-pointer hover:bg-muted/50 transition-colors">
                <RadioGroupItem value="Branch" />
                <GitBranch className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Branch-level</p>
                  <p className="text-xs text-muted-foreground">Overrides company-level rules for this branch</p>
                </div>
              </label>
            </RadioGroup>

            {scope === "Branch" && (
              <div>
                <Label className="text-sm">Select Branch</Label>
                <Select value={branchId} onValueChange={setBranchId}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Choose a branch" /></SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button
              onClick={() => setStep("chargeType")}
              disabled={scope === "Branch" && !branchId}
              className="w-full"
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step B: Charge Type */}
      {step === "chargeType" && (
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle className="text-lg">Select Charge Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={chargeMode === "predefined" ? "default" : "outline"}
                size="sm"
                onClick={() => setChargeMode("predefined")}
              >
                Predefined
              </Button>
              <Button
                variant={chargeMode === "custom" ? "default" : "outline"}
                size="sm"
                onClick={() => setChargeMode("custom")}
              >
                Custom
              </Button>
            </div>

            {chargeMode === "predefined" ? (
              <Select value={selectedCharge} onValueChange={setSelectedCharge}>
                <SelectTrigger><SelectValue placeholder="Select a charge type" /></SelectTrigger>
                <SelectContent>
                  {predefinedChargeTypes.map((ct) => (
                    <SelectItem key={ct.code} value={ct.code}>
                      {ct.name} ({ct.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="space-y-3">
                <div>
                  <Label className="text-sm">Charge Code</Label>
                  <Input value={customCode} onChange={(e) => setCustomCode(e.target.value.toUpperCase())} placeholder="e.g. HANDLING" className="mt-1 font-mono" />
                </div>
                <div>
                  <Label className="text-sm">Display Name</Label>
                  <Input value={customName} onChange={(e) => setCustomName(e.target.value)} placeholder="e.g. Handling Charges" className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm">Category</Label>
                  <Input value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} placeholder="e.g. Handling" className="mt-1" />
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("scope")}>Back</Button>
              <Button
                onClick={() => setStep("settings")}
                disabled={chargeMode === "predefined" ? !selectedCharge : !customCode}
                className="flex-1"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step C: Settings */}
      {step === "settings" && (
        <Card className="max-w-lg">
          <CardHeader>
            <CardTitle className="text-lg">Charge Type Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label className="text-sm font-medium">Who Can Add</Label>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {roles.map((role) => (
                  <Badge
                    key={role}
                    variant={whoCanAdd.includes(role) ? "default" : "outline"}
                    className="cursor-pointer text-xs"
                    onClick={() => toggleRole(role)}
                  >
                    {role}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium">Granularity</Label>
              <RadioGroup value={granularity} onValueChange={(v) => setGranularity(v as "Journey" | "Load")} className="flex gap-4 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="Journey" /> <span className="text-sm">Journey</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <RadioGroupItem value="Load" /> <span className="text-sm">Load</span>
                </label>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              {[
                { label: "Provisional Allowed", value: provisional, setter: setProvisional },
                { label: "Remarks Mandatory", value: remarksMandatory, setter: setRemarksMandatory },
                { label: "Attachments Mandatory", value: attachmentsMandatory, setter: setAttachmentsMandatory },
                { label: "Approval Enabled", value: approvalEnabled, setter: setApprovalEnabled },
              ].map(({ label, value, setter }) => (
                <div key={label} className="flex items-center justify-between py-1">
                  <Label className="text-sm">{label}</Label>
                  <Switch checked={value} onCheckedChange={setter} />
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setStep("chargeType")}>Back</Button>
              <Button onClick={handleSaveContinue} className="flex-1">
                Save & Create First Rule
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </Layout>
  );
}
