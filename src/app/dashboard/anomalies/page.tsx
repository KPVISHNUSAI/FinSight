import { AnomalyDetector } from "@/components/pages/anomalies/anomaly-detector";

export default function AnomaliesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Anomaly Detection</h2>
        <p className="text-muted-foreground">
          Use our AI-powered tool to identify anomalies and potential risks, such as unexpected budget deviations or suspicious transactions.
        </p>
      </div>
      <AnomalyDetector />
    </div>
  );
}
