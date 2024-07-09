import { Database } from "bun:sqlite";
import { initDatabase } from "./initDatabase";

class DatabaseManager {
  private db: Database;

  constructor() {
    this.db = initDatabase();
  }

  public getDatabase(): Database {
    return this.db;
  }
}

export const databaseManager = new DatabaseManager();
