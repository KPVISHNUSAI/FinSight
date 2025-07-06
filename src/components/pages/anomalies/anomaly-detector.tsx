
"use client";

import { useState, useTransition, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { handleDetectAnomalies } from "@/lib/actions";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type { DetectFinancialAnomaliesOutput } from "@/ai/flows/detect-financial-anomalies";
import { AnomalyCard } from "./anomaly-card";
import { AnomalyCardSkeleton } from "./anomaly-card-skeleton";
import { DataInputOptions } from "./data-input-options";
import { useToast } from "@/hooks/use-toast";

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

type AnomalyStatus = 'New' | 'Investigating' | 'Approved' | 'Dismissed';
type Anomaly = {
    id: string;
    description: string;
    severity: "Low" | "Medium" | "High" | "Critical";
    recommendation: string;
    score: number;
    amount: number;
    department: string;
    confidence: number;
    timestamp: Date;
    category: string;
    status: AnomalyStatus;
};

// Helper function to create mock data to match the detailed card UI
const addMockData = (anomaly: any, index: number): Anomaly => {
    const severities = { Low: 2, Medium: 5, High: 8, Critical: 9.5 };
    return {
        ...anomaly,
        id: `anomaly-${index}-${Date.now()}`,
        status: 'New',
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
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const { toast } = useToast();

  const handleAnalyze = (dataToAnalyze: string) => {
    setError(null);
    setResult(null);
    setAnomalies([]);

    startTransition(async () => {
      const { anomalies, error } = await handleDetectAnomalies(dataToAnalyze);
      if (error) {
        setError(error);
      } else {
        setResult(anomalies);
      }
    });
  };
  
  useEffect(() => {
    if (!result) return;
    
    const sections = [
        ...result.transactionalAnomalies.map(a => ({ ...a, category: "Transactional" })),
        ...result.accessAnomalies.map(a => ({ ...a, category: "Access & Permission" })),
        ...result.securityAnomalies.map(a => ({ ...a, category: "Security & Compliance" })),
        ...result.reportingAnomalies.map(a => ({ ...a, category: "Reporting Irregularities" })),
    ];
    
    setAnomalies(sections.map(addMockData));
  }, [result]);

  const handleAction = (id: string, action: AnomalyStatus) => {
      setAnomalies(currentAnomalies =>
        currentAnomalies.map(a => (a.id === id ? { ...a, status: action } : a))
      );
      toast({
          title: `Anomaly ${action}`,
          description: `The selected anomaly has been marked as ${action.toLowerCase()}.`,
          variant: action === "Dismissed" ? "destructive" : "default",
      });
  };

  return (
    <div className="space-y-6">
      <DataInputOptions 
        onAnalyze={handleAnalyze}
        isPending={isPending}
        placeholderData={placeholderData}
      />

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
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{result.summary}</p>
                    {anomalies.length > 0 && (
                        <div className="text-sm mt-4 p-4 bg-muted/50 rounded-lg">
                           <h4 className="font-semibold mb-2">Anomaly Statistics:</h4>
                           <ul className="list-disc list-inside space-y-1">
                                <li><span className="font-medium">{result.transactionalAnomalies.length}</span> Transactional</li>
                                <li><span className="font-medium">{result.accessAnomalies.length}</span> Access & Permission</li>
                                <li><span className="font-medium">{result.securityAnomalies.length}</span> Security & Compliance</li>
                                <li><span className="font-medium">{result.reportingAnomalies.length}</span> Reporting Irregularities</li>
                           </ul>
                        </div>
                    )}
                 </CardContent>
                 {anomalies.length === 0 && (
                    <CardFooter>
                        <Alert className="w-full">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertTitle>System Scan Complete</AlertTitle>
                            <AlertDescription>No anomalies were detected in the provided data.</AlertDescription>
                        </Alert>
                    </CardFooter>
                 )}
            </Card>

            {anomalies.length > 0 && (
                 <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start">
                    {anomalies.map((anomaly) => (
                        <AnomalyCard 
                          key={anomaly.id} 
                          anomaly={anomaly} 
                          onAction={handleAction as any} 
                        />
                    ))}
                </div>
            )}
        </div>
      )}
    </div>
  );
}
