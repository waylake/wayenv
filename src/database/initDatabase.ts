import { Database } from "bun:sqlite";
import { configManager } from "../config/configManager";

export function initDatabase(): Database {
  const db = new Database(configManager.getConfig().dbPath);

  db.run(`
    CREATE TABLE IF NOT EXISTS envs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL,
      value TEXT NOT NULL,
      project TEXT NOT NULL DEFAULT 'default',
      encrypted BOOLEAN NOT NULL DEFAULT 1,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(key, project)
    )
  `);

  return db;
}
