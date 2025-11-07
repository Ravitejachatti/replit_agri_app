import { loadSeedData } from "@shared/services/db";

let initialized = false;

export async function initializeApp() {
  if (initialized) return;

  try {
    await loadSeedData();
    initialized = true;
    console.log("✅ AP Agri Guard initialized with seed data");
  } catch (error) {
    console.error("❌ Failed to initialize app:", error);
  }
}
