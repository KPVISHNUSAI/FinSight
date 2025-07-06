"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { handleDetectAnomalies } from "@/lib/actions";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { DetectFinancialAnomaliesOutput } from "@/ai/flows/detect-financial-anomalies";
import { cn } from "@/lib/utils";

const placeholderData = JSON.stringify(
    {
      "transactions": [
        { "transaction_id": "txn_123", "date": "2023-10-01T10:00:00Z", "amount": 1200.00, "description": "Vendor Payment - Acme Corp" },
        { "transaction_id": "txn_124", "date": "2023-10-02T11:30:00Z", "amount": 75.50, "description": "Office Supplies" },
        { "transaction_id": "txn_125", "date": "2023-10-02T23:50:00Z", "amount": 15000.00, "description": "Urgent After-Hours Server Repair" },
        { "transaction_id": "txn_126", "date": "2023-10-03T09:00:00Z", "amount": 250.00, "description": "Client Dinner" },
        { "transaction_id": "txn_127", "date": "2023-10-03T09:01:00Z", "amount": 250.00, "description": "Client Dinner" }
      ],
      "access_logs": [
        { "user": "admin@finsight.com", "action": "role_change", "target_user": "analyst@finsight.com", "details": "Promoted to 'Admin'", "timestamp": "2023-10-03T18:05:00Z" },
        { "user": "guest@external.com", "action": "bulk_download", "details": "Downloaded 5,000 transaction records", "timestamp": "2023-10-03T19:20:00Z" }
      ],
      "security_events": [
        { "type": "failed_login", "user": "hacker@evil.com", "count": 150, "timestamp_start": "2023-10-04T01:00:00Z", "timestamp_end": "2023-10-04T01:05:00Z" }
      ],
      "reporting_activity": [
        { "user": "ceo@finsight.com", "action": "edit_report", "report_id": "Q3-Board-Meeting", "details": "Updated revenue figures", "timestamp": "2023-10-04T08:55:00Z", "deadline": "2023-10-04T09:00:00Z" }
      ]
    },
    null,
    2
);

const severityVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    "Low": "secondary",
    "Medium": "default",
    "High": "outline",
    "Critical": "destructive",
};


export function AnomalyDetector() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<DetectFinancialAnomaliesOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    startTransition(async () => {
      const { anomalies, error } = await handleDetectAnomalies(data);
      if (error) {
        setError(error);
      } else {
        setResult(anomalies);
      }
    });
  };
  
  const anomalySections = result ? [
    { title: "Transactional Anomalies", data: result.transactionalAnomalies },
    { title: "Access & Permission Anomalies", data: result.accessAnomalies },
    { title: "Security & Compliance Anomalies", data: result.securityAnomalies },
    { title: "Reporting Irregularities", data: result.reportingAnomalies },
  ] : [];

  const totalAnomalies = anomalySections.reduce((acc, section) => acc + section.data.length, 0);

  return (
    <div className="space-y-6">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-headline">Financial Data Input</CardTitle>
            <CardDescription>
              Paste your financial and operational data in JSON format below to scan for a wide range of anomalies.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={placeholderData}
              className="min-h-[200px] resize-y font-code text-xs"
              value={data}
              onChange={(e) => setData(e.target.value)}
              disabled={isPending}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending || !data}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Detect Anomalies"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Detecting Anomalies</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Analysis Result</CardTitle>
            <CardDescription>
                {totalAnomalies > 0 
                    ? `Found ${totalAnomalies} potential anomal${totalAnomalies === 1 ? 'y' : 'ies'} across several categories.`
                    : "No anomalies detected. Everything looks normal."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {totalAnomalies > 0 ? (
                <Accordion type="multiple" defaultValue={anomalySections.filter(s => s.data.length > 0).map(s => s.title)} className="w-full">
                {anomalySections.map((section) => (
                    section.data.length > 0 && (
                    <AccordionItem value={section.title} key={section.title}>
                        <AccordionTrigger className="text-lg">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="h-5 w-5 text-destructive" />
                                {section.title}
                                <Badge variant="destructive">{section.data.length}</Badge>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                        <Table>
                            <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Severity</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Recommendation</TableHead>
                            </TableRow>
                            </TableHeader>
                            <TableBody>
                            {section.data.map((item, index) => (
                                <TableRow key={index}>
                                <TableCell>
                                    <Badge variant={severityVariantMap[item.severity]}>{item.severity}</Badge>
                                </TableCell>
                                <TableCell>{item.description}</TableCell>
                                <TableCell>{item.recommendation}</TableCell>
                                </TableRow>
                            ))}
                            </TableBody>
                        </Table>
                        </AccordionContent>
                    </AccordionItem>
                    )
                ))}
                </Accordion>
            ) : (
                <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle>System Scan Complete</AlertTitle>
                    <AlertDescription>No anomalies were found in the provided data. All systems appear to be operating within normal parameters.</AlertDescription>
                </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
