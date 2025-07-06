import { ReportGenerator } from "@/components/pages/reports/report-generator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Custom Report Generation</h2>
        <p className="text-muted-foreground">
            Generate detailed financial reports using natural language. Describe the report you need, and our AI will create it for you.
        </p>
      </div>
      <ReportGenerator />
    </div>
  );
}
