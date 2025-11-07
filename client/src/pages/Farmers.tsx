import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import type { Farmer, Plot, SignalDaily } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Farmers() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>(null);

  const { data: farmers, isLoading: farmersLoading } = useQuery<Farmer[]>({
    queryKey: ["/api/farmers"],
  });

  const { data: plots } = useQuery<Plot[]>({
    queryKey: ["/api/plots", selectedFarmerId],
    enabled: !!selectedFarmerId,
  });

  const { data: signals } = useQuery<SignalDaily[]>({
    queryKey: ["/api/signals", plots?.[0]?.id],
    enabled: !!plots?.[0]?.id,
  });

  const filteredFarmers =
    farmers?.filter(
      (farmer) =>
        farmer.name.toLowerCase().includes(search.toLowerCase()) ||
        farmer.username.toLowerCase().includes(search.toLowerCase())
    ) || [];

  const selectedFarmer = farmers?.find((f) => f.id === selectedFarmerId);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">{t("farmers.title")}</h1>

      <div className="grid md:grid-cols-[400px_1fr] gap-6">
        <Card>
          <CardHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={t("farmers.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                data-testid="input-search-farmers"
              />
            </div>
          </CardHeader>
          <CardContent>
            {farmersLoading ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredFarmers.map((farmer) => (
                  <div
                    key={farmer.id}
                    className={`p-3 border rounded-md cursor-pointer hover-elevate ${
                      selectedFarmerId === farmer.id ? "bg-accent" : ""
                    }`}
                    onClick={() => setSelectedFarmerId(farmer.id)}
                    data-testid={`farmer-item-${farmer.id}`}
                  >
                    <p className="font-medium">{farmer.name}</p>
                    <p className="text-sm text-muted-foreground">{farmer.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {t(`district.${farmer.district}`)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div>
          {selectedFarmer ? (
            <Card>
              <CardHeader>
                <CardTitle>{selectedFarmer.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="signals">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="signals" data-testid="tab-signals">
                      {t("farmers.tabs.signals")}
                    </TabsTrigger>
                    <TabsTrigger value="advisories" data-testid="tab-advisories">
                      {t("farmers.tabs.advisories")}
                    </TabsTrigger>
                    <TabsTrigger value="history" data-testid="tab-history">
                      {t("farmers.tabs.history")}
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="signals" className="space-y-4">
                    {signals && signals.length > 0 ? (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium mb-3">VPD & GDD (14 days)</h4>
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={signals.slice(-14)}>
                              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                              <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12 }}
                                tickFormatter={(val) =>
                                  new Date(val).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })
                                }
                              />
                              <YAxis tick={{ fontSize: 12 }} />
                              <Tooltip />
                              <Legend />
                              <Line
                                type="monotone"
                                dataKey="vpd"
                                stroke="hsl(var(--chart-1))"
                                name="VPD"
                              />
                              <Line
                                type="monotone"
                                dataKey="gdd"
                                stroke="hsl(var(--chart-2))"
                                name="GDD"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-3">ETc & ETo (14 days)</h4>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={signals.slice(-14)}>
                              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                              <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12 }}
                                tickFormatter={(val) =>
                                  new Date(val).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                  })
                                }
                              />
                              <YAxis tick={{ fontSize: 12 }} />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="etc" fill="hsl(var(--chart-3))" name="ETc" />
                              <Bar dataKey="eto" fill="hsl(var(--chart-4))" name="ETo" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center text-muted-foreground">
                        No signal data available
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="advisories">
                    <div className="py-12 text-center text-muted-foreground">
                      No advisories available
                    </div>
                  </TabsContent>

                  <TabsContent value="history">
                    <div className="py-12 text-center text-muted-foreground">
                      No history available
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Select a farmer to view details
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
