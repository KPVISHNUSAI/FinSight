import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Check, Search, ShieldCheck, X } from "lucide-react";

type Anomaly = {
  description: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  recommendation: string;
  // The following fields are mocked for UI purposes as they are not in the AI response
  score: number;
  amount: number;
  department: string;
  confidence: number;
  timestamp: Date;
  category: string;
};

type AnomalyCardProps = {
  anomaly: Anomaly;
};

const severityConfig = {
  Low: {
    icon: ShieldCheck,
    colorClass: "text-risk-low",
    borderClass: "border-l-risk-low",
    buttonClass: "bg-risk-low",
  },
  Medium: {
    icon: AlertTriangle,
    colorClass: "text-risk-medium",
    borderClass: "border-l-risk-medium",
    buttonClass: "bg-risk-medium",
  },
  High: {
    icon: AlertTriangle,
    colorClass: "text-risk-high",
    borderClass: "border-l-risk-high",
    buttonClass: "bg-risk-high",
  },
  Critical: {
    icon: AlertTriangle,
    colorClass: "text-risk-critical",
    borderClass: "border-l-risk-critical",
    buttonClass: "bg-risk-critical",
  },
};

export function AnomalyCard({ anomaly }: AnomalyCardProps) {
  const config = severityConfig[anomaly.severity];
  const Icon = config.icon;

  return (
    <Card className={cn("flex flex-col transition-shadow duration-200 hover:shadow-xl border-l-4", config.borderClass)}>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className={cn("flex items-center gap-2 font-bold", config.colorClass)}>
                <Icon className="h-5 w-5" />
                <span>{anomaly.severity.toUpperCase()} RISK</span>
            </div>
          <span className="text-sm font-bold">{anomaly.score.toFixed(1)}/10</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div>
            <div className="text-2xl font-bold">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(anomaly.amount)}
            </div>
            <div className="text-sm text-muted-foreground">{anomaly.department}</div>
        </div>
        <p className="text-sm line-clamp-2">{anomaly.description}</p>
        <div className="space-y-1">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Confidence: {anomaly.confidence}%</span>
                <span>{formatDistanceToNow(anomaly.timestamp, { addSuffix: true })}</span>
            </div>
          <Progress value={anomaly.confidence} className="h-1" />
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-2">
        <Button size="sm" variant="outline" className="bg-info/10 text-info hover:bg-info/20 hover:text-info border-info/20">
            <Search />
            <span className="hidden sm:inline">Investigate</span>
        </Button>
        <Button size="sm" variant="outline" className="bg-risk-low/10 text-risk-low hover:bg-risk-low/20 hover:text-risk-low border-risk-low/20">
            <Check />
            <span className="hidden sm:inline">Approve</span>
        </Button>
        <Button size="sm" variant="outline" className="bg-risk-high/10 text-risk-high hover:bg-risk-high/20 hover:text-risk-high border-risk-high/20">
            <X />
            <span className="hidden sm:inline">Dismiss</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
