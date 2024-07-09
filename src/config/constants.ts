import { join } from "path";
import { homedir } from "os";
import { existsSync, mkdirSync } from "fs";

export const CONFIG_DIR = join(homedir(), ".wayenv");
export const CONFIG_FILE = join(CONFIG_DIR, "config.json");
export const DEFAULT_DB_PATH = join(CONFIG_DIR, "wayenv.sqlite");

function ensureConfigDirExists() {
  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

ensureConfigDirExists();
