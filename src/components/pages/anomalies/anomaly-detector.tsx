"use client";

import { useState, useTransition, useMemo } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { handleDetectAnomalies } from "@/lib/actions";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { DetectFinancialAnomaliesOutput } from "@/ai/flows/detect-financial-anomalies";
import { AnomalyCard } from "./anomaly-card";
import { AnomalyCardSkeleton } from "./anomaly-card-skeleton";

const placeholderData = JSON.stringify(
    {
      "transactions": [
        { "transaction_id": "txn_123", "date": "2023-10-01T10:00:00Z", "amount": 1200.00, "description": "Vendor Payment - Acme Corp", "department": "Operations" },
        { "transaction_id": "txn_124", "date": "2023-10-02T11:30:00Z", "amount": 75.50, "description": "Office Supplies", "department": "Marketing" },
        { "transaction_id": "txn_125", "date": "2023-10-02T23:50:00Z", "amount": 15000.00, "description": "Urgent After-Hours Server Repair", "department": "IT" },
        { "transaction_id": "txn_126", "date": "2023-10-03T09:00:00Z", "amount": 250.00, "description": "Client Dinner", "department": "Sales" },
        { "transaction_id": "txn_127", "date": "2023-10-03T09:01:00Z", "amount": 250.00, "description": "Client Dinner", "department": "Sales" }
      ],
      "access_logs": [
        { "user": "admin@finsight.com", "action": "role_change", "target_user": "analyst@finsight.com", "details": "Promoted to 'Admin'", "timestamp": "2023-10-03T18:05:00Z", "department": "Security" },
        { "user": "guest@external.com", "action": "bulk_download", "details": "Downloaded 5,000 transaction records", "timestamp": "2023-10-03T19:20:00Z", "department": "Compliance" }
      ],
      "security_events": [
        { "type": "failed_login", "user": "hacker@evil.com", "count": 150, "timestamp_start": "2023-10-04T01:00:00Z", "timestamp_end": "2023-10-04T01:05:00Z", "department": "IT" }
      ],
      "reporting_activity": [
        { "user": "ceo@finsight.com", "action": "edit_report", "report_id": "Q3-Board-Meeting", "details": "Updated revenue figures", "timestamp": "2023-10-04T08:55:00Z", "deadline": "2023-10-04T09:00:00Z", "department": "Executive" }
      ]
    },
    null,
    2
);

// Helper function to create mock data to match the detailed card UI
const addMockData = (anomaly: any) => {
    const severities = { Low: 2, Medium: 5, High: 8, Critical: 9.5 };
    return {
        ...anomaly,
        score: severities[anomaly.severity] + Math.random() * 0.5,
        amount: Math.random() * 20000,
        department: ["Marketing", "Sales", "IT", "Operations", "HR"][Math.floor(Math.random() * 5)],
        confidence: Math.floor(Math.random() * 21) + 79, // 79% - 99%
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 7)), // within last 7 days
    };
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
  
  const allAnomalies = useMemo(() => {
    if (!result) return [];
    
    const sections = [
        ...result.transactionalAnomalies.map(a => ({ ...addMockData(a), category: "Transactional" })),
        ...result.accessAnomalies.map(a => ({ ...addMockData(a), category: "Access & Permission" })),
        ...result.securityAnomalies.map(a => ({ ...addMockData(a), category: "Security & Compliance" })),
        ...result.reportingAnomalies.map(a => ({ ...addMockData(a), category: "Reporting Irregularities" })),
    ];
    
    return sections;
  }, [result]);


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

      {isPending && (
         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start">
            {Array.from({ length: 8 }).map((_, i) => <AnomalyCardSkeleton key={i} />)}
         </div>
      )}

      {result && (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Analysis Summary</CardTitle>
                    <CardDescription>{result.summary}</CardDescription>
                </CardHeader>
                 {allAnomalies.length === 0 && (
                    <CardContent>
                        <Alert>
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertTitle>System Scan Complete</AlertTitle>
                            <AlertDescription>{result.summary}</AlertDescription>
                        </Alert>
                    </CardContent>
                 )}
            </Card>

            {allAnomalies.length > 0 && (
                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start">
                    {allAnomalies.map((anomaly, index) => (
                        <AnomalyCard key={index} anomaly={anomaly} />
                    ))}
                </div>
            )}
        </div>
      )}
    </div>
  );
}
