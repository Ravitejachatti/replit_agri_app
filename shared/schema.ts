import { z } from "zod";

// ===== AUTH & USERS =====
export type UserRole = "FARMER" | "FIELD_OFFICER" | "OPERATOR" | "ADMIN" | "DATA_SCIENTIST";

export interface User {
  username: string;
  role: UserRole;
}

export const userRoleMap: Record<string, UserRole> = {
  "farmer_krishna": "FARMER",
  "farmer_guntur": "FARMER",
  "officer_krishna": "FIELD_OFFICER",
  "officer_guntur": "FIELD_OFFICER",
  "operator": "OPERATOR",
  "admin": "ADMIN",
  "datasci": "DATA_SCIENTIST",
};

// ===== GEO =====
export type District = "Krishna" | "Guntur";

export interface Mandal {
  id: string;
  name: string;
  district: District;
}

export interface Village {
  id: string;
  name: string;
  mandalId: string;
}

export interface GeoJSONFeature {
  type: "Feature";
  properties: {
    id: string;
    name: string;
    type: "district" | "mandal" | "village";
  };
  geometry: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
}

export interface GeoJSONCollection {
  type: "FeatureCollection";
  features: GeoJSONFeature[];
}

// ===== PLOTS & CROPS =====
export type Crop = "Paddy" | "Chilli";
export type Stage =
  | "Nursery"
  | "Transplanting"
  | "Tillering"
  | "Panicle"
  | "Harvest"
  | "Vegetative"
  | "Flowering"
  | "FruitSet";

export interface Plot {
  id: string;
  farmerId: string;
  name: string;
  district: District;
  mandalId: string;
  villageId: string;
  centroid: { lat: number; lon: number };
  boundary?: Array<{ lat: number; lon: number }>;
  cropCycleId?: string;
}

export interface CropCycle {
  id: string;
  plotId: string;
  crop: Crop;
  variety?: string;
  sowingDate: string; // ISO
  stage: Stage;
  kcCurve?: Array<{ dayFromSowing: number; kc: number }>;
}

export const insertPlotSchema = z.object({
  farmerId: z.string(),
  name: z.string().min(1),
  district: z.enum(["Krishna", "Guntur"]),
  mandalId: z.string(),
  villageId: z.string(),
  centroid: z.object({
    lat: z.number(),
    lon: z.number(),
  }),
  boundary: z
    .array(
      z.object({
        lat: z.number(),
        lon: z.number(),
      })
    )
    .optional(),
});

export type InsertPlot = z.infer<typeof insertPlotSchema>;

export const insertCropCycleSchema = z.object({
  plotId: z.string(),
  crop: z.enum(["Paddy", "Chilli"]),
  variety: z.string().optional(),
  sowingDate: z.string(),
  stage: z.enum([
    "Nursery",
    "Transplanting",
    "Tillering",
    "Panicle",
    "Harvest",
    "Vegetative",
    "Flowering",
    "FruitSet",
  ]),
});

export type InsertCropCycle = z.infer<typeof insertCropCycleSchema>;

// ===== WEATHER & SIGNALS =====
export interface WxDaily {
  id: string;
  gridId: string;
  date: string; // ISO
  rain_mm: number;
  tmin_c: number;
  tmax_c: number;
  rh_pct: number;
  wind_ms: number;
  radiation?: number;
}

export interface SignalDaily {
  id: string;
  plotId: string;
  date: string; // ISO
  eto: number;
  etc: number;
  vpd: number;
  gdd: number;
  ndvi?: number;
  ndwi?: number;
}

// ===== HAZARDS & ALERTS =====
export type Hazard =
  | "PADDY_BLAST"
  | "PADDY_BLB"
  | "CHILLI_ANTHRACNOSE"
  | "CHILLI_THRIPS"
  | "FLOOD";

export type Severity = "green" | "orange" | "red";

export interface RiskEvent {
  id: string;
  plotId: string;
  date: string; // ISO
  hazard: Hazard;
  score: number; // 0-100
  severity: Severity;
  messageKey: string; // i18n key
  explain?: string[];
  ack?: boolean;
}

export const insertRiskEventSchema = z.object({
  plotId: z.string(),
  date: z.string(),
  hazard: z.enum([
    "PADDY_BLAST",
    "PADDY_BLB",
    "CHILLI_ANTHRACNOSE",
    "CHILLI_THRIPS",
    "FLOOD",
  ]),
  score: z.number().min(0).max(100),
  severity: z.enum(["green", "orange", "red"]),
  messageKey: z.string(),
  explain: z.array(z.string()).optional(),
  ack: z.boolean().optional(),
});

export type InsertRiskEvent = z.infer<typeof insertRiskEventSchema>;

// ===== ADVISORIES =====
export type Channel = "IN_APP" | "WHATSAPP" | "SMS" | "IVR";

export interface AdvisoryTemplate {
  id: string;
  hazard: Hazard | "GENERIC";
  messageKey: string; // i18n
  channels: Channel[];
  placeholders?: string[]; // e.g., ["plotName","mm","date"]
}

export interface Message {
  id: string;
  farmerId: string;
  plotId?: string;
  templateId: string;
  content: string;
  channels: Channel[];
  sentAt: string; // ISO
  status: "sent" | "delivered" | "failed";
}

export const insertMessageSchema = z.object({
  farmerId: z.string(),
  plotId: z.string().optional(),
  templateId: z.string(),
  content: z.string(),
  channels: z.array(z.enum(["IN_APP", "WHATSAPP", "SMS", "IVR"])),
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;

// ===== SETTINGS =====
export interface AppSettings {
  language: "te" | "en";
  onlineMode: boolean;
  theme: "light" | "dark";
}

// ===== RULE ENGINE =====
export interface RuleClauseCondition {
  metric: string;
  op: ">=" | "<=" | ">" | "<" | "==" | "!=" | "between" | "near";
  value: number | boolean | [number, number];
  tol?: number; // for "near" op
  window?: "today" | "prev24h" | "rolling_3d";
}

export interface RuleClause {
  all?: RuleClauseCondition[];
  any?: RuleClauseCondition[];
  weight: number;
}

export interface RuleDefinition {
  id: Hazard;
  severity_thresholds: {
    green: number;
    orange: number;
    red: number;
  };
  clauses: RuleClause[];
  messageKey: string;
}

export interface RuleEvalResult {
  hazard: Hazard;
  score: number;
  severity: Severity;
  messageKey: string;
  explain: string[];
}

// ===== FARMER DATA =====
export interface Farmer {
  id: string;
  username: string;
  name: string;
  phone?: string;
  district: District;
}

export const insertFarmerSchema = z.object({
  username: z.string(),
  name: z.string(),
  phone: z.string().optional(),
  district: z.enum(["Krishna", "Guntur"]),
});

export type InsertFarmer = z.infer<typeof insertFarmerSchema>;
