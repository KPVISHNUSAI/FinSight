import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/pages/dashboard/kpi-card";
import { DollarSign, TrendingDown, TrendingUp, Target } from "lucide-react";
import { RevenueChart } from "@/components/pages/dashboard/revenue-chart";
import { ExpensesChart } from "@/components/pages/dashboard/expenses-chart";
import { RecentTransactions } from "@/components/pages/dashboard/recent-transactions";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Revenue"
          value="$45,231.89"
          change="+20.1% from last month"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
        <KpiCard
          title="Net Profit"
          value="$12,124.50"
          change="+18.3% from last month"
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <KpiCard
          title="Total Expenses"
          value="$33,107.39"
          change="+5.2% from last month"
          icon={<TrendingDown className="h-4 w-4 text-muted-foreground" />}
        />
        <KpiCard
          title="Budget Variance"
          value="-2.5%"
          change="Below target"
          icon={<Target className="h-4 w-4 text-muted-foreground" />}
          isNegative
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle className="font-headline">Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <RevenueChart />
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle className="font-headline">Expenses by Category</CardTitle>
            <CardDescription>
              A breakdown of expenses for the current month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExpensesChart />
          </CardContent>
        </Card>
      </div>
       <Card>
        <CardHeader>
          <CardTitle className="font-headline">Recent Transactions</CardTitle>
          <CardDescription>
            An overview of the most recent financial activities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentTransactions />
        </CardContent>
      </Card>
    </div>
  );
}
