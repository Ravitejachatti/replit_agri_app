import type { Express } from "express";
import { createServer, type Server } from "http";
import { nanoid } from "nanoid";
import type {
  Farmer,
  Plot,
  RiskEvent,
  SignalDaily,
  WxDaily,
  AdvisoryTemplate,
  Mandal,
  Village,
  Message,
  RuleDefinition,
} from "@shared/schema";

import farmersData from "@shared/mockdb/farmers.json";
import plotsData from "@shared/mockdb/plots.json";
import weatherData from "@shared/mockdb/weather.json";
import signalsData from "@shared/mockdb/signals.json";
import riskEventsData from "@shared/mockdb/riskEvents.json";
import advisoryTemplatesData from "@shared/mockdb/advisoryTemplates.json";
import mandalsData from "@shared/mockdb/mandals.json";
import villagesData from "@shared/mockdb/villages.json";
import districtsData from "@shared/mockdb/districts.json";

let farmers: Farmer[] = [...farmersData];
let plots: Plot[] = [...plotsData];
let weather: WxDaily[] = [...weatherData];
let signals: SignalDaily[] = [...signalsData];
let riskEvents: RiskEvent[] = [...riskEventsData];
let advisoryTemplates: AdvisoryTemplate[] = [...advisoryTemplatesData];
let mandals: Mandal[] = [...mandalsData];
let villages: Village[] = [...villagesData];
let districts = [...districtsData];
let messages: Message[] = [];

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/stats", (req, res) => {
    const stats = {
      activeFarmers: farmers.length,
      totalPlots: plots.length,
      redAlerts: riskEvents.filter((r) => r.severity === "red").length,
      orangeAlerts: riskEvents.filter((r) => r.severity === "orange").length,
    };
    res.json(stats);
  });

  app.get("/api/farmers", (req, res) => {
    const { district } = req.query;
    const filtered = district
      ? farmers.filter((f) => f.district === district)
      : farmers;
    res.json(filtered);
  });

  app.get("/api/plots", (req, res) => {
    const { farmerId } = req.query;
    const filtered = farmerId
      ? plots.filter((p) => p.farmerId === farmerId)
      : plots;
    res.json(filtered);
  });

  app.get("/api/alerts", (req, res) => {
    res.json(riskEvents);
  });

  app.post("/api/alerts/acknowledge", (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ error: "ids must be an array" });
    }

    riskEvents = riskEvents.map((event) =>
      ids.includes(event.id) ? { ...event, ack: true } : event
    );

    res.json({ success: true, count: ids.length });
  });

  app.get("/api/signals/:plotId", (req, res) => {
    const { plotId } = req.params;
    const plotSignals = signals.filter((s) => s.plotId === plotId);
    res.json(plotSignals);
  });

  app.get("/api/geo/districts", (req, res) => {
    res.json(districts);
  });

  app.get("/api/geo/mandals", (req, res) => {
    const { district } = req.query;
    const filtered = district
      ? mandals.filter((m) => m.district === district)
      : mandals;
    res.json(filtered);
  });

  app.get("/api/geo/villages", (req, res) => {
    const { mandalId } = req.query;
    const filtered = mandalId
      ? villages.filter((v) => v.mandalId === mandalId)
      : villages;
    res.json(filtered);
  });

  app.get("/api/mandals/:district", (req, res) => {
    const { district } = req.params;
    const filtered = mandals.filter((m) => m.district === district);
    res.json(filtered);
  });

  app.get("/api/villages/:mandalId", (req, res) => {
    const { mandalId } = req.params;
    const filtered = villages.filter((v) => v.mandalId === mandalId);
    res.json(filtered);
  });

  app.get("/api/advisory-templates", (req, res) => {
    res.json(advisoryTemplates);
  });

  app.post("/api/messages", (req, res) => {
    const { farmerId, plotId, templateId, content, channels } = req.body;

    const message: Message = {
      id: nanoid(),
      farmerId,
      plotId,
      templateId,
      content,
      channels,
      sentAt: new Date().toISOString(),
      status: "sent",
    };

    messages.push(message);
    res.json(message);
  });

  app.get("/api/rules", async (req, res) => {
    try {
      const fs = await import("fs/promises");
      const path = await import("path");
      const yaml = await import("js-yaml");
      
      const rulesPath = path.join(process.cwd(), "shared", "rules.yaml");
      const fileContent = await fs.readFile(rulesPath, "utf-8");
      const rules = yaml.load(fileContent) as RuleDefinition[];
      
      res.json(rules);
    } catch (error) {
      console.error("Error loading rules:", error);
      res.status(500).json({ error: "Failed to load rules" });
    }
  });

  app.post("/api/rules/test", async (req, res) => {
    try {
      const { rain_mm, tmax_c, tmin_c, rh_pct, wind_ms } = req.body;

      const fs = await import("fs/promises");
      const path = await import("path");
      const yaml = await import("js-yaml");
      
      const rulesPath = path.join(process.cwd(), "shared", "rules.yaml");
      const fileContent = await fs.readFile(rulesPath, "utf-8");
      const rulesData = yaml.load(fileContent) as RuleDefinition[];

      const mockWeather: WxDaily = {
        id: "test",
        gridId: "test_grid",
        date: new Date().toISOString(),
        rain_mm: rain_mm || 0,
        tmin_c: tmin_c || 20,
        tmax_c: tmax_c || 30,
        rh_pct: rh_pct || 70,
        wind_ms: wind_ms || 5,
      };

      const mockSignals: SignalDaily = {
        id: "test",
        plotId: "test",
        date: new Date().toISOString(),
        eto: 4.5,
        etc: 3.6,
        vpd: ((tmax_c || 30) - (tmin_c || 20)) * 0.15,
        gdd: Math.max(0, ((tmax_c || 30) + (tmin_c || 20)) / 2 - 10),
      };

      const { evaluateRule } = await import("@shared/services/rules");
      const results = rulesData.map((rule) => evaluateRule(rule, mockWeather, mockSignals));
      res.json(results);
    } catch (error) {
      console.error("Error evaluating rules:", error);
      res.status(500).json({ error: "Failed to evaluate rules" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
