import type {
  RuleDefinition,
  RuleEvalResult,
  Hazard,
  Severity,
  RuleClause,
  RuleClauseCondition,
  WxDaily,
  SignalDaily,
} from "@shared/schema";

let rulesCache: RuleDefinition[] | null = null;

export async function loadRules(): Promise<RuleDefinition[]> {
  if (rulesCache) return rulesCache;

  try {
    const response = await fetch("/api/rules");
    if (!response.ok) {
      throw new Error(`Failed to fetch rules: ${response.statusText}`);
    }
    const rules = await response.json();
    rulesCache = rules;
    return rules;
  } catch (error) {
    console.error("Failed to load rules:", error);
    return [];
  }
}

function evaluateCondition(
  condition: RuleClauseCondition,
  weather: WxDaily,
  signals?: SignalDaily
): boolean {
  const { metric, op, value, tol } = condition;

  let actualValue: number | boolean | undefined;

  if (metric === "tmean_c") {
    actualValue = (weather.tmin_c + weather.tmax_c) / 2;
  } else if (metric === "rain_mm") {
    actualValue = weather.rain_mm;
  } else if (metric === "rh_pct") {
    actualValue = weather.rh_pct;
  } else if (metric === "wind_ms") {
    actualValue = weather.wind_ms;
  } else if (metric === "vpd") {
    actualValue = signals?.vpd;
  } else if (metric === "gdd") {
    actualValue = signals?.gdd;
  } else if (metric === "leaf_wet_proxy") {
    actualValue = weather.rh_pct > 90 && weather.rain_mm > 0 ? 5 : 0;
  } else if (metric === "dew_morning") {
    actualValue = weather.rh_pct > 85 && weather.tmin_c < 25;
  } else if (metric === "is_delta") {
    actualValue = true;
  } else if (metric === "barrage_warning") {
    actualValue = false;
  }

  if (actualValue === undefined) return false;

  switch (op) {
    case ">=":
      return typeof actualValue === "number" &&
        typeof value === "number" &&
        actualValue >= value;
    case "<=":
      return typeof actualValue === "number" &&
        typeof value === "number" &&
        actualValue <= value;
    case ">":
      return typeof actualValue === "number" &&
        typeof value === "number" &&
        actualValue > value;
    case "<":
      return typeof actualValue === "number" &&
        typeof value === "number" &&
        actualValue < value;
    case "==":
      return actualValue === value;
    case "!=":
      return actualValue !== value;
    case "between":
      return typeof actualValue === "number" &&
        Array.isArray(value) &&
        actualValue >= value[0] &&
        actualValue <= value[1];
    case "near":
      return typeof actualValue === "number" &&
        typeof value === "number" &&
        tol !== undefined &&
        Math.abs(actualValue - value) <= tol;
    default:
      return false;
  }
}

function evaluateClause(
  clause: RuleClause,
  weather: WxDaily,
  signals?: SignalDaily
): { satisfied: boolean; explain: string[] } {
  const explain: string[] = [];

  if (clause.all) {
    const allSatisfied = clause.all.every((cond) => {
      const result = evaluateCondition(cond, weather, signals);
      if (result) {
        explain.push(
          `${cond.metric} ${cond.op} ${
            Array.isArray(cond.value) ? cond.value.join("-") : cond.value
          }`
        );
      }
      return result;
    });
    return { satisfied: allSatisfied, explain: allSatisfied ? explain : [] };
  }

  if (clause.any) {
    for (const cond of clause.any) {
      const result = evaluateCondition(cond, weather, signals);
      if (result) {
        explain.push(
          `${cond.metric} ${cond.op} ${
            Array.isArray(cond.value) ? cond.value.join("-") : cond.value
          }`
        );
        return { satisfied: true, explain };
      }
    }
    return { satisfied: false, explain: [] };
  }

  return { satisfied: false, explain: [] };
}

export function evaluateRule(
  rule: RuleDefinition,
  weather: WxDaily,
  signals?: SignalDaily
): RuleEvalResult {
  let totalScore = 0;
  const allExplain: string[] = [];

  for (const clause of rule.clauses) {
    const { satisfied, explain } = evaluateClause(clause, weather, signals);
    if (satisfied) {
      totalScore += clause.weight;
      allExplain.push(...explain);
    }
  }

  let severity: Severity = "green";
  if (totalScore >= rule.severity_thresholds.red) {
    severity = "red";
  } else if (totalScore >= rule.severity_thresholds.orange) {
    severity = "orange";
  }

  return {
    hazard: rule.id,
    score: totalScore,
    severity,
    messageKey: rule.messageKey,
    explain: allExplain,
  };
}

export async function evaluateAllRules(
  weather: WxDaily,
  signals?: SignalDaily
): Promise<RuleEvalResult[]> {
  const rules = await loadRules();
  return rules.map((rule) => evaluateRule(rule, weather, signals));
}
