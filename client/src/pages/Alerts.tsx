import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { SeverityBadge } from "@/components/SeverityBadge";
import { Download, Check } from "lucide-react";
import type { RiskEvent } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Alerts() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [severityFilter, setSeverityFilter] = useState<string>("all");

  const { data: alerts, isLoading } = useQuery<RiskEvent[]>({
    queryKey: ["/api/alerts"],
  });

  const acknowledgeMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      return apiRequest("POST", "/api/alerts/acknowledge", { ids });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/alerts"] });
      setSelectedIds([]);
      toast({
        title: t("action.acknowledge"),
        description: `${selectedIds.length} alerts acknowledged`,
      });
    },
  });

  const filteredAlerts =
    alerts?.filter((alert) => severityFilter === "all" || alert.severity === severityFilter) ||
    [];

  const handleExportCSV = () => {
    if (!filteredAlerts.length) return;

    const headers = ["Date", "Hazard", "Severity", "Score", "Plot ID", "Status"];
    const rows = filteredAlerts.map((alert) => [
      alert.date,
      alert.hazard,
      alert.severity,
      alert.score.toString(),
      alert.plotId,
      alert.ack ? "Acknowledged" : "Pending",
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `alerts-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("alerts.title")}</h1>
        <div className="flex gap-2">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            disabled={!filteredAlerts.length}
            data-testid="button-export-csv"
          >
            <Download className="h-4 w-4 mr-2" />
            {t("alerts.export")}
          </Button>
          {selectedIds.length > 0 && (
            <Button
              onClick={() => acknowledgeMutation.mutate(selectedIds)}
              disabled={acknowledgeMutation.isPending}
              data-testid="button-bulk-acknowledge"
            >
              <Check className="h-4 w-4 mr-2" />
              {t("alerts.bulkAcknowledge")} ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        {["all", "red", "orange", "green"].map((severity) => (
          <Button
            key={severity}
            variant={severityFilter === severity ? "default" : "outline"}
            size="sm"
            onClick={() => setSeverityFilter(severity)}
            data-testid={`button-filter-${severity}`}
          >
            {t(`alerts.filter.${severity}`)}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {filteredAlerts.length} {t("alerts.title")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t("empty.noAlerts.desc")}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center gap-4 p-4 border rounded-md hover-elevate"
                  data-testid={`alert-item-${alert.id}`}
                >
                  <Checkbox
                    checked={selectedIds.includes(alert.id)}
                    onCheckedChange={(checked) => {
                      setSelectedIds((prev) =>
                        checked
                          ? [...prev, alert.id]
                          : prev.filter((id) => id !== alert.id)
                      );
                    }}
                    data-testid={`checkbox-alert-${alert.id}`}
                  />
                  <div className="flex-1 grid grid-cols-5 gap-4 items-center">
                    <SeverityBadge severity={alert.severity} />
                    <span className="font-medium">{t(`hazard.${alert.hazard}`)}</span>
                    <span className="text-sm text-muted-foreground">
                      Score: {alert.score}
                    </span>
                    <span className="text-sm text-muted-foreground">{alert.date}</span>
                    <span className="text-sm">
                      {alert.ack
                        ? t("alerts.status.acknowledged")
                        : t("alerts.status.pending")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
