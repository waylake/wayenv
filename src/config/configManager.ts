import { existsSync, writeFileSync, readFileSync } from "fs";
import { CONFIG_FILE, DEFAULT_DB_PATH } from "./constants";
import { Config } from "./types";

class ConfigManager {
  private config: Config;

  constructor() {
    this.config = {
      dbPath: "",
      passwordHash: "",
      lastPasswordCheck: 0,
      passwordCheckInterval: 0,
      outputFormat: "list",
    };
    this.loadConfig();
  }

  private loadConfig() {
    if (!existsSync(CONFIG_FILE)) {
      this.config = {
        dbPath: DEFAULT_DB_PATH,
        passwordHash: "",
        lastPasswordCheck: 0,
        passwordCheckInterval: 600000,
        outputFormat: "list",
      };
      this.saveConfig();
    } else {
      this.config = JSON.parse(readFileSync(CONFIG_FILE, "utf-8"));
    }
  }

  private saveConfig() {
    writeFileSync(CONFIG_FILE, JSON.stringify(this.config, null, 2));
  }

  public getConfig(): Config {
    return this.config;
  }

  public updateConfig(newConfig: Partial<Config>) {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
  }
}

export const configManager = new ConfigManager();
