import { databaseManager } from "../database/databaseManager";
import { checkPassword } from "../utils/passwordChecker";
import { promptInputs } from "../utils/promptUtils";
import { decrypt } from "../utils/cryptoUtils";
import { readFileSync, existsSync } from "fs";
import { BACKUP_DIR } from "../config/constants";
import chalk from "chalk";
import { join, resolve } from "path";

export async function restore(project?: string, input?: string) {
  let secretKey: string;

  if (!(await checkPassword())) return;

  const response = await promptInputs([
    {
      type: "text",
      name: "project",
      message: "Enter the project name to restore:",
      initial: project || "",
    },
    {
      type: "text",
      name: "input",
      message: `Enter the input file path (default: ${BACKUP_DIR}/backup.wayenvbak):`,
      initial: input || "",
    },
    {
      type: "password",
      name: "secretKey",
      message: "Enter the secret key for decryption:",
    },
  ]);
  project = response.project;
  input = response.input;
  secretKey = response.secretKey;

  if (!input) {
    input = join(BACKUP_DIR, "backup.wayenvbak");
  }

  input = resolve(input);

  if (!input.endsWith(".wayenvbak")) {
    console.log(chalk.red("Invalid file extension. Expected .wayenvbak file."));
    return;
  }

  if (!existsSync(input)) {
    console.log(chalk.red(`Backup file not found: ${input}`));
    return;
  }

  const db = databaseManager.getDatabase();
  const encryptedData = readFileSync(input);
  const decryptedData = decrypt(encryptedData, secretKey);

  let envs;
  try {
    envs = JSON.parse(decryptedData);
  } catch (error) {
    console.log(chalk.red("Failed to parse decrypted data as JSON."));
    return;
  }

  envs.forEach((env: any) => {
    db.run(
      "INSERT OR REPLACE INTO envs (key, value, project) VALUES (?, ?, ?)",
      [env.key, env.value, project],
    );
  });

  console.log(
    chalk.green(`Restore complete. Data restored to project ${project}.`),
  );
}
