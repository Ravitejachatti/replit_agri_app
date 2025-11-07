import { openDB, DBSchema, IDBPDatabase } from "idb";

interface APAgriGuardDB extends DBSchema {
  farmers: {
    key: string;
    value: any;
  };
  plots: {
    key: string;
    value: any;
  };
  cropCycles: {
    key: string;
    value: any;
  };
  weather: {
    key: string;
    value: any;
  };
  signals: {
    key: string;
    value: any;
  };
  riskEvents: {
    key: string;
    value: any;
  };
  messages: {
    key: string;
    value: any;
  };
  settings: {
    key: string;
    value: any;
  };
}

let db: IDBPDatabase<APAgriGuardDB> | null = null;

export async function initDB() {
  if (db) return db;

  db = await openDB<APAgriGuardDB>("ap-agri-guard-db", 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("farmers")) {
        db.createObjectStore("farmers", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("plots")) {
        db.createObjectStore("plots", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("cropCycles")) {
        db.createObjectStore("cropCycles", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("weather")) {
        db.createObjectStore("weather", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("signals")) {
        db.createObjectStore("signals", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("riskEvents")) {
        db.createObjectStore("riskEvents", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("messages")) {
        db.createObjectStore("messages", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "key" });
      }
    },
  });

  return db;
}

export async function loadSeedData() {
  const db = await initDB();

  const stores = [
    "farmers",
    "plots",
    "cropCycles",
    "weather",
    "signals",
    "riskEvents",
  ] as const;

  for (const store of stores) {
    const count = await db.count(store);
    if (count === 0) {
      const seedModule = await import(`@shared/mockdb/${store}.json`);
      const seedData = seedModule.default;
      const tx = db.transaction(store, "readwrite");
      for (const item of seedData) {
        await tx.store.add(item);
      }
      await tx.done;
    }
  }
}

export async function getAll<T>(storeName: keyof APAgriGuardDB): Promise<T[]> {
  const db = await initDB();
  return (await db.getAll(storeName)) as T[];
}

export async function getById<T>(
  storeName: keyof APAgriGuardDB,
  id: string
): Promise<T | undefined> {
  const db = await initDB();
  return (await db.get(storeName, id)) as T | undefined;
}

export async function add<T>(
  storeName: keyof APAgriGuardDB,
  item: T
): Promise<void> {
  const db = await initDB();
  await db.add(storeName, item as any);
}

export async function update<T>(
  storeName: keyof APAgriGuardDB,
  item: T & { id: string }
): Promise<void> {
  const db = await initDB();
  await db.put(storeName, item as any);
}

export async function remove(
  storeName: keyof APAgriGuardDB,
  id: string
): Promise<void> {
  const db = await initDB();
  await db.delete(storeName, id);
}
