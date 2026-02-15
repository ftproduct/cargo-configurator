import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { RuleTable } from "@/components/RuleTable";
import { EmptyState } from "@/components/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, Upload, AlertTriangle } from "lucide-react";
import { mockCharges, mockRules, roles } from "@/data/mockData";
import { toast } from "sonner";

export default function ChargeDetail() {
  const { chargeCode } = useParams<{ chargeCode: string }>();
  const navigate = useNavigate();

  const charge = mockCharges.find((c) => c.chargeCode === chargeCode);
  const rules = chargeCode ? mockRules[chargeCode] || [] : [];

  const hasNoPriorities = rules.length > 1 && rules.some((r) => r.priority === 0 && rules.filter((x) => x.priority === 0).length > 1);
  const noDefaultRule = rules.length > 0 && !rules.some((r) => r.priority === 0);

  if (!charge) {
    return (
      <Layout>
        <EmptyState
          title="Charge not found"
          description={`No configuration found for charge code "${chargeCode}".`}
          actionLabel="Back to Charges"
          onAction={() => navigate("/charges")}
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page-header">
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight">{charge.chargeName}</h2>
              <Badge variant="outline" className="font-mono text-xs">{charge.chargeCode}</Badge>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">{charge.scope}{charge.branchName ? ` · ${charge.branchName}` : ""}</Badge>
              <StatusBadge status={charge.status} />
              <span className="text-xs text-muted-foreground">{charge.granularity} granularity</span>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Rules ({rules.length})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          {(noDefaultRule || hasNoPriorities) && (
            <Alert variant="destructive" className="bg-warning/5 border-warning/30 text-warning-foreground">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <AlertDescription className="text-sm">
                {noDefaultRule && "No default rule found. A default rule (priority 0) acts as a fallback. "}
                {hasNoPriorities && "Multiple rules may conflict without unique priorities."}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-2">
            <Button onClick={() => navigate(`/charges/${chargeCode}/rules/new`)} className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Rule
            </Button>
            <Button variant="outline" onClick={() => navigate(`/charges/${chargeCode}/bulk-upload`)} className="gap-1.5">
              <Upload className="h-4 w-4" /> Bulk Upload
            </Button>
          </div>

          {rules.length === 0 ? (
            <EmptyState
              title="No rules configured"
              description="Add your first pricing rule to define how this charge is calculated."
              actionLabel="Add Rule"
              onAction={() => navigate(`/charges/${chargeCode}/rules/new`)}
            />
          ) : (
            <RuleTable rules={rules} chargeCode={chargeCode!} />
          )}
        </TabsContent>

        <TabsContent value="settings">
          <Card className="max-w-lg">
            <CardHeader>
              <CardTitle className="text-lg">Charge Type Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Who Can Add</Label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {charge.whoCanAdd.map((r) => (
                    <Badge key={r} variant="secondary" className="text-xs">{r}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Provisional Allowed", value: charge.provisionalAllowed },
                  { label: "Remarks Mandatory", value: charge.remarksMandatory },
                  { label: "Attachments Mandatory", value: charge.attachmentsMandatory },
                  { label: "Approval Enabled", value: charge.approvalEnabled },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between py-1">
                    <Label className="text-sm">{label}</Label>
                    <Switch checked={value} onCheckedChange={() => toast.info("Mock: setting updated")} />
                  </div>
                ))}
              </div>
              <Button onClick={() => toast.success("Settings saved")} className="w-full mt-2">
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
