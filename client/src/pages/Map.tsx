import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function MapPage() {
  const { t } = useTranslation();
  const [layers, setLayers] = useState({
    districts: true,
    mandals: true,
    villages: false,
    plots: true,
    alerts: true,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{t("map.title")}</h1>

      <div className="grid md:grid-cols-[280px_1fr] gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("map.layers")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="layer-districts">{t("map.districts")}</Label>
              <Switch
                id="layer-districts"
                checked={layers.districts}
                onCheckedChange={(checked) =>
                  setLayers((prev) => ({ ...prev, districts: checked }))
                }
                data-testid="switch-layer-districts"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="layer-mandals">{t("map.mandals")}</Label>
              <Switch
                id="layer-mandals"
                checked={layers.mandals}
                onCheckedChange={(checked) =>
                  setLayers((prev) => ({ ...prev, mandals: checked }))
                }
                data-testid="switch-layer-mandals"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="layer-villages">{t("map.villages")}</Label>
              <Switch
                id="layer-villages"
                checked={layers.villages}
                onCheckedChange={(checked) =>
                  setLayers((prev) => ({ ...prev, villages: checked }))
                }
                data-testid="switch-layer-villages"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="layer-plots">{t("map.plots")}</Label>
              <Switch
                id="layer-plots"
                checked={layers.plots}
                onCheckedChange={(checked) =>
                  setLayers((prev) => ({ ...prev, plots: checked }))
                }
                data-testid="switch-layer-plots"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="layer-alerts">{t("map.alerts")}</Label>
              <Switch
                id="layer-alerts"
                checked={layers.alerts}
                onCheckedChange={(checked) =>
                  setLayers((prev) => ({ ...prev, alerts: checked }))
                }
                data-testid="switch-layer-alerts"
              />
            </div>
          </CardContent>

          <CardHeader>
            <CardTitle>{t("map.legend")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-green-500"></div>
              <span>{t("label.severity.green")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-orange-500"></div>
              <span>{t("label.severity.orange")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-red-500"></div>
              <span>{t("label.severity.red")}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="h-[600px] bg-muted rounded-md flex items-center justify-center">
              <p className="text-muted-foreground">{t("loading.map")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
