import { configManager } from "../config/configManager";
import { promptInputs } from "../utils/promptUtils";
import { CONFIG_DIR, DEFAULT_DB_PATH } from "../config/constants";
import { existsSync, mkdirSync } from "fs";
import chalk from "chalk";

export async function init() {
  const response = await promptInputs([
    {
      type: "text",
      name: "dbPath",
      message: "Enter the path for the SQLite database:",
      initial: DEFAULT_DB_PATH,
    },
    {
      type: "password",
      name: "password",
      message: "Enter a password for encryption:",
    },
    {
      type: "number",
      name: "passwordCheckInterval",
      message: "Enter password check interval in minutes:",
      initial: 10,
    },
  ]);

  // https://bun.sh/docs/api/hashing
  const passwordHash = await Bun.password.hash(response.password);

  configManager.updateConfig({
    dbPath: response.dbPath,
    passwordHash,
    passwordCheckInterval: response.passwordCheckInterval * 60000,
    lastPasswordCheck: Date.now(),
  });

  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }

  console.log(chalk.green("Initialization complete"));
}
