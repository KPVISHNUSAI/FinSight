import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Check, Search, ShieldCheck, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  status: 'New' | 'Investigating' | 'Approved' | 'Dismissed';
};

type AnomalyCardProps = {
  anomaly: Anomaly;
  onAction: (id: string, action: 'Investigating' | 'Approved' | 'Dismissed') => void;
};

const severityConfig = {
  Low: {
    icon: ShieldCheck,
    colorClass: "text-risk-low",
    borderClass: "border-l-risk-low",
  },
  Medium: {
    icon: AlertTriangle,
    colorClass: "text-risk-medium",
    borderClass: "border-l-risk-medium",
  },
  High: {
    icon: AlertTriangle,
    colorClass: "text-risk-high",
    borderClass: "border-l-risk-high",
  },
  Critical: {
    icon: AlertTriangle,
    colorClass: "text-risk-critical",
    borderClass: "border-l-risk-critical",
  },
};

const statusConfig: Record<Anomaly['status'], string> = {
    New: 'bg-muted text-muted-foreground',
    Investigating: 'bg-info/20 text-info',
    Approved: 'bg-risk-low/20 text-risk-low',
    Dismissed: 'bg-gray-500/20 text-gray-500 dark:text-gray-400',
};

export function AnomalyCard({ anomaly, onAction }: AnomalyCardProps) {
  const config = severityConfig[anomaly.severity];
  const Icon = config.icon;
  const isActionable = anomaly.status === 'New';

  return (
    <Card className={cn(
        "flex flex-col transition-all duration-200 hover:shadow-xl border-l-4", 
        config.borderClass,
        !isActionable && "opacity-60 bg-muted/30"
    )}>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div className={cn("flex items-center gap-2 font-bold", config.colorClass)}>
                <Icon className="h-5 w-5" />
                <span>{anomaly.severity.toUpperCase()} RISK</span>
            </div>
          <Badge className={cn("text-xs font-semibold", statusConfig[anomaly.status])}>{anomaly.status.toUpperCase()}</Badge>
        </div>
        <div className="text-sm text-muted-foreground pt-1">
            Score: <span className="font-bold text-foreground">{anomaly.score.toFixed(1)}/10</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <div>
            <div className="text-xl font-bold md:text-2xl">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(anomaly.amount)}
            </div>
            <div className="text-sm text-muted-foreground">{anomaly.department}</div>
        </div>
        <p className="text-sm">{anomaly.description}</p>
        <div className="space-y-1">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Confidence: {anomaly.confidence}%</span>
                <span>{formatDistanceToNow(anomaly.timestamp, { addSuffix: true })}</span>
            </div>
          <Progress value={anomaly.confidence} className="h-1" />
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-3 gap-2">
        <Button size="sm" variant="outline" className="bg-info/10 text-info hover:bg-info/20 hover:text-info border-info/20" onClick={() => onAction(anomaly.id, 'Investigating')} disabled={!isActionable}>
            <Search />
            <span className="hidden sm:inline">Investigate</span>
        </Button>
        <Button size="sm" variant="outline" className="bg-risk-low/10 text-risk-low hover:bg-risk-low/20 hover:text-risk-low border-risk-low/20" onClick={() => onAction(anomaly.id, 'Approved')} disabled={!isActionable}>
            <Check />
            <span className="hidden sm:inline">Approve</span>
        </Button>
        <Button size="sm" variant="outline" className="bg-risk-high/10 text-risk-high hover:bg-risk-high/20 hover:text-risk-high border-risk-high/20" onClick={() => onAction(anomaly.id, 'Dismissed')} disabled={!isActionable}>
            <X />
            <span className="hidden sm:inline">Dismiss</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
