import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { SlabEditorTable, SlabRow } from "@/components/SlabEditorTable";
import { FormulaBuilder } from "@/components/FormulaBuilder";
import { ApprovalWorkflowBuilder } from "@/components/ApprovalWorkflowBuilder";
import { ArrowRight, ArrowLeft, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { dimensionOptions, computeOnOptions, roles } from "@/data/mockData";
import { toast } from "sonner";

const STEPS = ["Basics", "Dimensions", "Pricing", "Eligibility", "Governance", "Review"];

export default function CreateRuleWizard() {
  const { chargeCode } = useParams<{ chargeCode: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  // Step 1
  const [alias, setAlias] = useState("");
  const [validityStart, setValidityStart] = useState("");
  const [validityEnd, setValidityEnd] = useState("");
  const [status, setStatus] = useState<"Draft" | "Active">("Draft");
  const [priority, setPriority] = useState("");

  // Step 2
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>([]);
  const [dimensionValues, setDimensionValues] = useState<Record<string, string[]>>({});

  // Step 3
  const [rateType, setRateType] = useState<"Fixed" | "Per-unit" | "Slabbed" | "Slab+Overflow">("Fixed");
  const [computeOn, setComputeOn] = useState("");
  const [valueMode, setValueMode] = useState<"Fixed" | "Formula">("Fixed");
  const [fixedValue, setFixedValue] = useState("");
  const [formula, setFormula] = useState("");
  const [slabs, setSlabs] = useState<SlabRow[]>([
    { id: "s1", from: "0", to: "100", mode: "Flat", valueMode: "Fixed", value: "500" },
    { id: "s2", from: "100", to: "500", mode: "Per-unit", valueMode: "Fixed", value: "4.5" },
  ]);

  // Step 4
  const [mgtEnabled, setMgtEnabled] = useState(false);

  // Step 5
  const [overrideSettings, setOverrideSettings] = useState(false);
  const [approvalEnabled, setApprovalEnabled] = useState(false);

  const dimensionKeys = Object.keys(dimensionOptions) as (keyof typeof dimensionOptions)[];
  const dimensionLabels: Record<string, string> = {
    route: "Route",
    origin: "Origin",
    destination: "Destination",
    vehicleType: "Vehicle Type",
    material: "Material",
    movementType: "Movement Type",
  };

  const toggleDimension = (dim: string) => {
    setSelectedDimensions((prev) =>
      prev.includes(dim) ? prev.filter((d) => d !== dim) : [...prev, dim]
    );
  };

  const toggleDimensionValue = (dim: string, val: string) => {
    setDimensionValues((prev) => {
      const current = prev[dim] || [];
      return {
        ...prev,
        [dim]: current.includes(val) ? current.filter((v) => v !== val) : [...current, val],
      };
    });
  };

  const handlePublish = () => {
    const errors: string[] = [];
    if (!alias) errors.push("Rule alias is required");
    if (!computeOn) errors.push("Compute On field is required");
    if (rateType === "Slabbed" || rateType === "Slab+Overflow") {
      for (let i = 1; i < slabs.length; i++) {
        if (slabs[i].from !== slabs[i - 1].to) {
          errors.push(`Slab continuity error between row ${i} and ${i + 1}`);
        }
      }
    }

    if (errors.length > 0) {
      toast.error(`Validation failed: ${errors.join("; ")}`);
      return;
    }

    toast.success("Rule published successfully");
    navigate(`/charges/${chargeCode}`);
  };

  const handleSaveDraft = () => {
    toast.success("Rule saved as draft");
    navigate(`/charges/${chargeCode}`);
  };

  return (
    <Layout>
      <div className="page-header">
        <h2 className="text-2xl font-bold tracking-tight">Create Rule — {chargeCode}</h2>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-1">
            <button
              onClick={() => setCurrentStep(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                i === currentStep
                  ? "bg-primary text-primary-foreground"
                  : i < currentStep
                  ? "bg-success/10 text-success"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i < currentStep ? <CheckCircle2 className="h-3.5 w-3.5" /> : <span>{i + 1}</span>}
              {s}
            </button>
            {i < STEPS.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />}
          </div>
        ))}
      </div>

      {/* Step 1: Basics */}
      {currentStep === 0 && (
        <Card className="max-w-lg">
          <CardHeader><CardTitle>Basics</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Rule Alias *</Label>
              <Input value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="e.g. Metro Unloading Premium" className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Validity Start</Label>
                <Input type="date" value={validityStart} onChange={(e) => setValidityStart(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Validity End</Label>
                <Input type="date" value={validityEnd} onChange={(e) => setValidityEnd(e.target.value)} className="mt-1" />
              </div>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as "Draft" | "Active")}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Input value={priority} onChange={(e) => setPriority(e.target.value)} placeholder="0 = default, 1 = highest" className="mt-1" type="number" />
              <p className="text-xs text-muted-foreground mt-1">If multiple active rules overlap in validity, higher priority wins.</p>
            </div>
            <Button onClick={() => setCurrentStep(1)} className="w-full">Next: Dimensions</Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Dimensions */}
      {currentStep === 1 && (
        <Card className="max-w-2xl">
          <CardHeader><CardTitle>Applicability Dimensions</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label className="text-sm font-medium">Select Dimensions</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {dimensionKeys.map((dim) => (
                  <Badge
                    key={dim}
                    variant={selectedDimensions.includes(dim) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleDimension(dim)}
                  >
                    {dimensionLabels[dim]}
                  </Badge>
                ))}
              </div>
            </div>

            {selectedDimensions.map((dim) => (
              <div key={dim} className="p-3 rounded-md border">
                <Label className="text-sm font-medium">{dimensionLabels[dim]} Values</Label>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {dimensionOptions[dim as keyof typeof dimensionOptions].map((val) => (
                    <Badge
                      key={val}
                      variant={(dimensionValues[dim] || []).includes(val) ? "default" : "outline"}
                      className="cursor-pointer text-xs"
                      onClick={() => toggleDimensionValue(dim, val)}
                    >
                      {val}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}

            {selectedDimensions.length > 0 && (
              <Alert className="bg-warning/5 border-warning/30">
                <Info className="h-4 w-4 text-warning" />
                <AlertDescription className="text-xs">
                  Overlap Risk: This combination may overlap with existing rule "Metro City Unloading" (P1). Review priorities to ensure correct evaluation order.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(0)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
              <Button onClick={() => setCurrentStep(2)} className="flex-1">Next: Pricing</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Pricing */}
      {currentStep === 2 && (
        <Card className="max-w-2xl">
          <CardHeader><CardTitle>Pricing Logic</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label className="text-sm font-medium">Rate Type</Label>
              <RadioGroup value={rateType} onValueChange={(v) => setRateType(v as typeof rateType)} className="grid grid-cols-2 gap-2 mt-2">
                {(["Fixed", "Per-unit", "Slabbed", "Slab+Overflow"] as const).map((rt) => (
                  <label key={rt} className={`flex items-center gap-2 p-3 rounded-md border cursor-pointer transition-colors ${rateType === rt ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`}>
                    <RadioGroupItem value={rt} />
                    <span className="text-sm">{rt}</span>
                  </label>
                ))}
              </RadioGroup>
            </div>

            <div>
              <Label className="text-sm font-medium">Compute On</Label>
              <Select value={computeOn} onValueChange={setComputeOn}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select metric" /></SelectTrigger>
                <SelectContent>
                  {computeOnOptions.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(rateType === "Fixed" || rateType === "Per-unit") && (
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Value Mode</Label>
                  <RadioGroup value={valueMode} onValueChange={(v) => setValueMode(v as "Fixed" | "Formula")} className="flex gap-4 mt-1">
                    <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="Fixed" /><span className="text-sm">Fixed Value</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><RadioGroupItem value="Formula" /><span className="text-sm">Formula</span></label>
                  </RadioGroup>
                </div>
                {valueMode === "Fixed" ? (
                  <div>
                    <Label>{rateType === "Fixed" ? "Amount" : "Rate per unit"}</Label>
                    <Input value={fixedValue} onChange={(e) => setFixedValue(e.target.value)} placeholder="0.00" className="mt-1" type="number" />
                  </div>
                ) : (
                  <FormulaBuilder value={formula} onChange={setFormula} />
                )}
              </div>
            )}

            {(rateType === "Slabbed" || rateType === "Slab+Overflow") && (
              <div>
                <Label className="text-sm font-medium mb-2 block">Slab Definition</Label>
                <SlabEditorTable slabs={slabs} onChange={setSlabs} showOverflow={rateType === "Slab+Overflow"} />
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(1)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
              <Button onClick={() => setCurrentStep(3)} className="flex-1">Next: Eligibility</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Eligibility */}
      {currentStep === 3 && (
        <Card className="max-w-lg">
          <CardHeader><CardTitle>Eligibility</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-md border">
              <div>
                <Label className="text-sm font-medium">Apply only if MGT met</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  MGT evaluated on actual dispatched tonnage at Journey/Load granularity.
                </p>
              </div>
              <Switch checked={mgtEnabled} onCheckedChange={setMgtEnabled} />
            </div>

            <div className="p-3 rounded-md border border-dashed bg-muted/30">
              <p className="text-xs text-muted-foreground italic">
                Future eligibility conditions (e.g., contractual minimums, seasonal overrides) can be added here.
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(2)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
              <Button onClick={() => setCurrentStep(4)} className="flex-1">Next: Governance</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 5: Governance */}
      {currentStep === 4 && (
        <Card className="max-w-2xl">
          <CardHeader><CardTitle>Governance & Approvals</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between p-3 rounded-md border">
              <Label className="text-sm">Override charge-level settings</Label>
              <Switch checked={overrideSettings} onCheckedChange={setOverrideSettings} />
            </div>

            {overrideSettings && (
              <div className="space-y-3 p-3 rounded-md border bg-muted/20">
                {[
                  { label: "Provisional Allowed", default: true },
                  { label: "Remarks Mandatory", default: false },
                  { label: "Attachments Mandatory", default: false },
                ].map(({ label, default: def }) => (
                  <div key={label} className="flex items-center justify-between">
                    <Label className="text-sm">{label}</Label>
                    <Switch defaultChecked={def} />
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between p-3 rounded-md border">
              <Label className="text-sm font-medium">Approval Required</Label>
              <Switch checked={approvalEnabled} onCheckedChange={setApprovalEnabled} />
            </div>

            {approvalEnabled && <ApprovalWorkflowBuilder />}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setCurrentStep(3)}><ArrowLeft className="h-4 w-4 mr-1" /> Back</Button>
              <Button onClick={() => setCurrentStep(5)} className="flex-1">Next: Review</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 6: Review */}
      {currentStep === 5 && (
        <Card className="max-w-2xl">
          <CardHeader><CardTitle>Review & Publish</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 p-4 rounded-md bg-muted/30">
                <div><span className="text-muted-foreground">Alias:</span> <span className="font-medium">{alias || "—"}</span></div>
                <div><span className="text-muted-foreground">Priority:</span> <span className="font-medium">{priority || "0"}</span></div>
                <div><span className="text-muted-foreground">Validity:</span> <span className="font-medium">{validityStart || "—"} → {validityEnd || "—"}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <span className="font-medium">{status}</span></div>
                <div><span className="text-muted-foreground">Rate Type:</span> <span className="font-medium">{rateType}</span></div>
                <div><span className="text-muted-foreground">Compute On:</span> <span className="font-medium">{computeOn || "—"}</span></div>
                <div><span className="text-muted-foreground">MGT Gate:</span> <span className="font-medium">{mgtEnabled ? "Yes" : "No"}</span></div>
                <div><span className="text-muted-foreground">Approval:</span> <span className="font-medium">{approvalEnabled ? "Enabled" : "Disabled"}</span></div>
              </div>

              {selectedDimensions.length > 0 && (
                <div className="p-4 rounded-md bg-muted/30">
                  <p className="text-muted-foreground text-xs font-medium mb-2">Dimensions</p>
                  {selectedDimensions.map((dim) => (
                    <div key={dim} className="flex items-center gap-2 mb-1">
                      <span className="text-muted-foreground">{dimensionLabels[dim]}:</span>
                      <span className="font-medium">{(dimensionValues[dim] || []).join(", ") || "All"}</span>
                    </div>
                  ))}
                </div>
              )}

              {(rateType === "Slabbed" || rateType === "Slab+Overflow") && (
                <div className="p-4 rounded-md bg-muted/30">
                  <p className="text-muted-foreground text-xs font-medium mb-1">Slabs: {slabs.length} defined</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setCurrentStep(4)}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <Button variant="outline" onClick={handleSaveDraft} className="flex-1">
                Save Draft
              </Button>
              <Button onClick={handlePublish} className="flex-1">
                Publish Rule
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </Layout>
  );
}
