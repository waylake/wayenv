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
      validate: (value) => {
        return value ? true : "Password is required."; // 비밀번호가 입력되지 않으면 오류 메시지
      },
    },
    {
      type: "number",
      name: "passwordCheckInterval",
      message: "Enter password check interval in minutes:",
      initial: 10,
    },
    {
      type: "text",
      name: "outputFormat",
      message: "Enter default output format for env (list or table):",
      initial: "table",
      validate: (value) => {
        const validFormats = ["list", "table"];
        return validFormats.includes(value) || "Please enter 'list' or 'table'.";
      },
    },
  ]);

  if (!response.password) {
    console.log(chalk.red("Password cannot be empty."));
    return; // 비밀번호가 비어있으면 초기화 중단
  }

  // https://bun.sh/docs/api/hashing
  const passwordHash = await Bun.password.hash(response.password);

  configManager.updateConfig({
    dbPath: response.dbPath,
    passwordHash,
    passwordCheckInterval: response.passwordCheckInterval * 60000,
    lastPasswordCheck: Date.now(),
    outputFormat: response.outputFormat,
  });

  if (!existsSync(CONFIG_DIR)) {
    mkdirSync(CONFIG_DIR, { recursive: true });
  }

  console.log(chalk.green("Initialization complete"));
}