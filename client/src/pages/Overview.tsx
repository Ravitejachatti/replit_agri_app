import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Users, Map as MapIcon, AlertTriangle, AlertCircle } from "lucide-react";
import { useSettingsStore } from "@/stores/settingsStore";
import { Skeleton } from "@/components/ui/skeleton";

export default function Overview() {
  const { t } = useTranslation();
  const { onlineMode, setOnlineMode } = useSettingsStore();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const kpiCards = [
    {
      title: t("overview.kpi.activeFarmers"),
      value: stats?.activeFarmers || 0,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: t("overview.kpi.totalPlots"),
      value: stats?.totalPlots || 0,
      icon: MapIcon,
      color: "text-green-600 dark:text-green-400",
    },
    {
      title: t("overview.kpi.redAlerts"),
      value: stats?.redAlerts || 0,
      icon: AlertTriangle,
      color: "text-red-600 dark:text-red-400",
    },
    {
      title: t("overview.kpi.orangeAlerts"),
      value: stats?.orangeAlerts || 0,
      icon: AlertCircle,
      color: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{t("overview.title")}</h1>
        <div className="flex items-center gap-3">
          <Label htmlFor="online-mode" className="text-sm">
            {t("overview.onlineMode")}
          </Label>
          <Switch
            id="online-mode"
            checked={onlineMode}
            onCheckedChange={setOnlineMode}
            data-testid="switch-online-mode"
          />
        </div>
      </div>

      {onlineMode && (
        <div className="rounded-md bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-3">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            {t("overview.onlineMode.desc")}
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <Icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{kpi.value}</div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("map.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">{t("loading.map")}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("alerts.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <p className="text-muted-foreground">{t("empty.noAlerts.desc")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
