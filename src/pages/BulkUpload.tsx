import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { Download, Upload, FileUp, CheckCircle2 } from "lucide-react";
import { bulkUploadResults } from "@/data/mockData";
import { toast } from "sonner";

export default function BulkUpload() {
  const { chargeCode } = useParams<{ chargeCode: string }>();
  const navigate = useNavigate();
  const [uploaded, setUploaded] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const successCount = bulkUploadResults.filter((r) => r.status === "Success").length;
  const errorCount = bulkUploadResults.filter((r) => r.status === "Error").length;

  return (
    <Layout>
      <div className="page-header">
        <h2 className="text-2xl font-bold tracking-tight">Bulk Upload — {chargeCode}</h2>
      </div>

      <div className="grid gap-6 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">1. Download Template</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Download the Excel template pre-configured with the correct columns and validation rules for {chargeCode}.
            </p>
            <Button variant="outline" className="gap-1.5" onClick={() => toast.success("Template downloaded")}>
              <Download className="h-4 w-4" /> Download Template (.xlsx)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. Upload File</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); setUploaded(true); }}
              onClick={() => setUploaded(true)}
              className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                dragOver ? "border-primary bg-primary/5" : uploaded ? "border-success bg-success/5" : "border-border hover:border-primary/50"
              }`}
            >
              {uploaded ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                  <p className="text-sm font-medium">rules_upload_feb2026.xlsx</p>
                  <p className="text-xs text-muted-foreground">8 rows • 12 KB</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <FileUp className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">Drop your file here or click to browse</p>
                  <p className="text-xs text-muted-foreground">Supports .xlsx, .csv (max 5 MB)</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {uploaded && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">3. Validation Results</CardTitle>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-success font-medium">{successCount} valid</span>
                  <span className="text-destructive font-medium">{errorCount} errors</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="enterprise-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="text-xs font-semibold uppercase w-16">Row</TableHead>
                      <TableHead className="text-xs font-semibold uppercase w-24">Status</TableHead>
                      <TableHead className="text-xs font-semibold uppercase">Message</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bulkUploadResults.map((row) => (
                      <TableRow key={row.row}>
                        <TableCell className="font-mono text-sm">{row.row}</TableCell>
                        <TableCell><StatusBadge status={row.status} /></TableCell>
                        <TableCell className="text-sm text-muted-foreground">{row.error || "—"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="gap-1.5" onClick={() => toast.success("Error sheet downloaded")}>
                  <Download className="h-4 w-4" /> Download Error Sheet
                </Button>
                <Button className="gap-1.5" onClick={() => { toast.success(`${successCount} rules applied successfully`); navigate(`/charges/${chargeCode}`); }}>
                  <Upload className="h-4 w-4" /> Apply {successCount} Valid Rows
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
