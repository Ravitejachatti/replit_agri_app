import type { WxDaily } from "@shared/schema";
import { openDB } from "idb";

const POWER_API_URL = "https://power.larc.nasa.gov/api/temporal/daily/point";

interface PowerCache {
  key: string;
  data: any;
  timestamp: number;
}

async function getCacheDB() {
  return openDB("nasa-power-cache", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("cache")) {
        db.createObjectStore("cache", { keyPath: "key" });
      }
    },
  });
}

function getCacheKey(lat: number, lon: number, date: string): string {
  return `${lat.toFixed(2)}_${lon.toFixed(2)}_${date}`;
}

export async function fetchPowerData(
  lat: number,
  lon: number,
  startDate: string,
  endDate: string
): Promise<WxDaily[] | null> {
  try {
    const db = await getCacheDB();

    const url = new URL(POWER_API_URL);
    url.searchParams.append("parameters", "T2M_MIN,T2M_MAX,RH2M,WS10M,PRECTOTCORR,ALLSKY_SFC_SW_DWN");
    url.searchParams.append("community", "AG");
    url.searchParams.append("longitude", lon.toString());
    url.searchParams.append("latitude", lat.toString());
    url.searchParams.append("start", startDate.replace(/-/g, ""));
    url.searchParams.append("end", endDate.replace(/-/g, ""));
    url.searchParams.append("format", "JSON");

    const cacheKey = getCacheKey(lat, lon, `${startDate}_${endDate}`);
    const cached = await db.get("cache", cacheKey);

    if (cached && Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
      return cached.data;
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
      console.error("NASA POWER API error:", response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (!data.properties || !data.properties.parameter) {
      return null;
    }

    const params = data.properties.parameter;
    const dates = Object.keys(params.T2M_MIN || {});

    const weatherData: WxDaily[] = dates.map((dateStr) => {
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      const isoDate = `${year}-${month}-${day}`;

      return {
        id: `power_${lat}_${lon}_${isoDate}`,
        gridId: `grid_${lat.toFixed(2)}_${lon.toFixed(2)}`,
        date: isoDate,
        rain_mm: params.PRECTOTCORR?.[dateStr] || 0,
        tmin_c: params.T2M_MIN?.[dateStr] || 20,
        tmax_c: params.T2M_MAX?.[dateStr] || 30,
        rh_pct: params.RH2M?.[dateStr] || 70,
        wind_ms: params.WS10M?.[dateStr] || 5,
        radiation: params.ALLSKY_SFC_SW_DWN?.[dateStr],
      };
    });

    await db.put("cache", {
      key: cacheKey,
      data: weatherData,
      timestamp: Date.now(),
    });

    return weatherData;
  } catch (error) {
    console.error("Error fetching NASA POWER data:", error);
    return null;
  }
}
