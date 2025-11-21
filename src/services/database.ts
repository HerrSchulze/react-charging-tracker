import * as SQLite from 'expo-sqlite';

const DB_NAME = 'charging_tracker.db';
const DB_VERSION = 1;

let db: SQLite.SQLiteDatabase | null = null;

export const initializeDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (db) return db;

  db = await SQLite.openDatabaseAsync(DB_NAME);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS travel_events (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      startDate INTEGER NOT NULL,
      initialCosts REAL NOT NULL DEFAULT 0,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS charging_sessions (
      id TEXT PRIMARY KEY,
      date INTEGER NOT NULL,
      stationProvider TEXT NOT NULL,
      location TEXT NOT NULL,
      energyCharged REAL NOT NULL,
      totalCost REAL NOT NULL,
      chargeCardProvider TEXT NOT NULL,
      travelEventId TEXT,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY (travelEventId) REFERENCES travel_events(id)
    );

    CREATE INDEX IF NOT EXISTS idx_travel_events_startDate ON travel_events(startDate DESC);
    CREATE INDEX IF NOT EXISTS idx_charging_sessions_date ON charging_sessions(date DESC);
    CREATE INDEX IF NOT EXISTS idx_charging_sessions_travelEventId ON charging_sessions(travelEventId);
  `);

  return db;
};

export const getDatabase = (): SQLite.SQLiteDatabase => {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase first.');
  }
  return db;
};
