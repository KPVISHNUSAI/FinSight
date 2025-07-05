import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type KpiCardProps = {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  isNegative?: boolean;
};

export function KpiCard({ title, value, change, icon, isNegative = false }: KpiCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={cn(
          "text-xs text-muted-foreground",
          isNegative ? "text-destructive" : "text-primary"
        )}>
          {change}
        </p>
      </CardContent>
    </Card>
  );
}
