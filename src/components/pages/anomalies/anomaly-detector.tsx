"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { handleDetectAnomalies } from "@/lib/actions";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const placeholderData = JSON.stringify(
    [
      { "transaction_id": "txn_123", "date": "2023-10-01", "amount": 1200.00, "description": "Vendor Payment - Acme Corp" },
      { "transaction_id": "txn_124", "date": "2023-10-02", "amount": 75.50, "description": "Office Supplies" },
      { "transaction_id": "txn_125", "date": "2023-10-02", "amount": 15000.00, "description": "Unusual Large Transfer" },
      { "transaction_id": "txn_126", "date": "2023-10-03", "amount": 250.00, "description": "Client Dinner" }
    ],
    null,
    2
);

export function AnomalyDetector() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);
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

  return (
    <div className="space-y-6">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-headline">Financial Data Input</CardTitle>
            <CardDescription>
              Paste your financial data in JSON format below to scan for anomalies.
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
          </CardHeader>
          <CardContent>
            <Alert variant={result.toLowerCase().includes("no anomalies") ? "default" : "destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {result.toLowerCase().includes("no anomalies") ? "No Anomalies Found" : "Anomalies Detected!"}
              </AlertTitle>
              <AlertDescription className="whitespace-pre-wrap">{result}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
