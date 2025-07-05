import { Forecaster } from "@/components/pages/forecasting/forecaster";

export default function ForecastingPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Financial Forecasting</h2>
        <p className="text-muted-foreground">
          Use AI to forecast future financial performance based on historical data.
        </p>
      </div>
      <Forecaster />
    </div>
  );
}
