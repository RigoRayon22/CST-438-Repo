import * as SQLite from "expo-sqlite";

export async function openDb() {
  return await SQLite.openDatabaseAsync("app.db");
}

export async function initDb() {
  const db = await openDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      event_date TEXT NOT NULL,  -- store as ISO-like string YYYY-MM-DD
      radius INTEGER NOT NULL
    );
  `);
  return db;
}

export type EventRow = {
  id: number;
  name: string;
  location: string;
  event_date: string;
  radius: number;
};

/** Create table*/
export async function addEvent(input: Omit<EventRow, "id">) {
  const db = await openDb();
  const res: any = await db.runAsync(
    "INSERT INTO events (name, location, event_date, radius) VALUES (?, ?, ?, ?)",
    input.name,
    input.location,
    input.event_date,
    input.radius
  );
  return res?.lastInsertRowId ?? res?.insertId ?? null;
}

export async function getEvents(): Promise<EventRow[]> {
  const db = await openDb();
  return await db.getAllAsync<EventRow>(
    "SELECT id, name, location, event_date, radius FROM events ORDER BY id DESC"
  );
}

export async function getEvent(id: number): Promise<EventRow | undefined> {
  const db = await openDb();
  return await db.getFirstAsync<EventRow>(
    "SELECT id, name, location, event_date, radius FROM events WHERE id = ?",
    id
  );
}

/** update table */
export async function updateEvent(id: number, input: Omit<EventRow, "id">) {
  const db = await openDb();
  await db.runAsync(
    "UPDATE events SET name = ?, location = ?, event_date = ?, radius = ? WHERE id = ?",
    input.name,
    input.location,
    input.event_date,
    input.radius,
    id
  );
}

/** Delete table */
export async function deleteEvent(id: number) {
  const db = await openDb();
  await db.runAsync("DELETE FROM events WHERE id = ?", id);
}

/** clears table so it's handy for testing) */
export async function clearEvents() {
  const db = await openDb();
  await db.execAsync("DELETE FROM events; VACUUM;");
}

export async function logEvents(tag = "DB Snapshot") {
  const rows = await getEvents();
  console.log(`[${tag}]`, rows);
}
