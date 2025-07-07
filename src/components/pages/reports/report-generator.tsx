"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { handleGenerateReport } from "@/lib/actions";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const availableData = `
- transactions: { id: string, date: string, amount: number, description: string, category: 'revenue' | 'expense', department: string }
- budgets: { id:string, department: string, month: string, allocated: number, spent: number }
- employees: { id: string, name: string, department: string, role: string }
`;

export function ReportGenerator() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    startTransition(async () => {
      const { report, error } = await handleGenerateReport(prompt, availableData);
      if (error) {
        setError(error);
      } else {
        setResult(report);
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-headline">Report Prompt</CardTitle>
            <CardDescription>
              For example: "Generate a quarterly expense report for the Marketing department, broken down by category."
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describe the report you want to generate..."
              className="min-h-[120px] resize-none"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isPending}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending || !prompt}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Report"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error Generating Report</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Generated Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
