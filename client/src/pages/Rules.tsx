import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { SeverityBadge } from "@/components/SeverityBadge";
import { Play } from "lucide-react";
import type { RuleDefinition, RuleEvalResult } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function Rules() {
  const { t } = useTranslation();
  const [weatherInputs, setWeatherInputs] = useState({
    rain_mm: 10,
    tmax_c: 32,
    tmin_c: 24,
    rh_pct: 85,
    wind_ms: 5,
  });

  const { data: rules } = useQuery<RuleDefinition[]>({
    queryKey: ["/api/rules"],
  });

  const testMutation = useMutation({
    mutationFn: async (inputs: typeof weatherInputs) => {
      return apiRequest<RuleEvalResult[]>("POST", "/api/rules/test", inputs);
    },
  });

  const handleTest = () => {
    testMutation.mutate(weatherInputs);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{t("rules.title")}</h1>

      <Tabs defaultValue="view" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="view" data-testid="tab-view-rules">
            {t("rules.tabs.view")}
          </TabsTrigger>
          <TabsTrigger value="test" data-testid="tab-test-rules">
            {t("rules.tabs.test")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="view" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>YAML Rule Definitions</CardTitle>
            </CardHeader>
            <CardContent>
              {rules ? (
                <div className="space-y-6">
                  {rules.map((rule) => (
                    <div key={rule.id} className="border-l-4 border-primary pl-4 space-y-2">
                      <h3 className="font-semibold text-lg">{t(`hazard.${rule.id}`)}</h3>
                      <p className="text-sm text-muted-foreground">
                        Severity Thresholds: Green &lt; {rule.severity_thresholds.orange},
                        Orange {rule.severity_thresholds.orange}-
                        {rule.severity_thresholds.red - 1}, Red ≥{" "}
                        {rule.severity_thresholds.red}
                      </p>
                      <div className="bg-muted p-3 rounded-md">
                        <code className="text-xs">{JSON.stringify(rule.clauses, null, 2)}</code>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  {t("loading.data")}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>{t("rules.test.inputs")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Rainfall (mm): {weatherInputs.rain_mm}</Label>
                  <Slider
                    value={[weatherInputs.rain_mm]}
                    onValueChange={([val]) =>
                      setWeatherInputs((prev) => ({ ...prev, rain_mm: val }))
                    }
                    max={100}
                    step={1}
                    data-testid="slider-rain"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Temp (°C): {weatherInputs.tmax_c}</Label>
                  <Slider
                    value={[weatherInputs.tmax_c]}
                    onValueChange={([val]) =>
                      setWeatherInputs((prev) => ({ ...prev, tmax_c: val }))
                    }
                    min={20}
                    max={45}
                    step={1}
                    data-testid="slider-tmax"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Min Temp (°C): {weatherInputs.tmin_c}</Label>
                  <Slider
                    value={[weatherInputs.tmin_c]}
                    onValueChange={([val]) =>
                      setWeatherInputs((prev) => ({ ...prev, tmin_c: val }))
                    }
                    min={15}
                    max={35}
                    step={1}
                    data-testid="slider-tmin"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Humidity (%): {weatherInputs.rh_pct}</Label>
                  <Slider
                    value={[weatherInputs.rh_pct]}
                    onValueChange={([val]) =>
                      setWeatherInputs((prev) => ({ ...prev, rh_pct: val }))
                    }
                    max={100}
                    step={1}
                    data-testid="slider-rh"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Wind Speed (m/s): {weatherInputs.wind_ms}</Label>
                  <Slider
                    value={[weatherInputs.wind_ms]}
                    onValueChange={([val]) =>
                      setWeatherInputs((prev) => ({ ...prev, wind_ms: val }))
                    }
                    max={20}
                    step={0.5}
                    data-testid="slider-wind"
                  />
                </div>

                <Button onClick={handleTest} className="w-full" data-testid="button-run-test">
                  <Play className="h-4 w-4 mr-2" />
                  {t("rules.test.run")}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("rules.test.result")}</CardTitle>
              </CardHeader>
              <CardContent>
                {testMutation.data ? (
                  <div className="space-y-4">
                    {testMutation.data.map((result) => (
                      <div
                        key={result.hazard}
                        className="border rounded-md p-4 space-y-3"
                        data-testid={`test-result-${result.hazard}`}
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{t(`hazard.${result.hazard}`)}</h4>
                          <SeverityBadge severity={result.severity} />
                        </div>
                        <div className="text-2xl font-bold">Score: {result.score}</div>
                        {result.explain && result.explain.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium">{t("rules.test.explain")}:</p>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {result.explain.map((exp, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-primary">•</span>
                                  <span>{exp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    {testMutation.isPending
                      ? t("loading.data")
                      : "Run test to see results"}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
