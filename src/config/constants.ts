import { join } from "path";
import { homedir } from "os";

export const CONFIG_DIR = join(homedir(), ".wayenv");
export const CONFIG_FILE = join(CONFIG_DIR, "config.json");
export const DEFAULT_DB_PATH = join(CONFIG_DIR, "wayenv.sqlite");
