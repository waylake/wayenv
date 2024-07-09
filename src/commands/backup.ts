import { databaseManager } from "../database/databaseManager";
import { checkPassword } from "../utils/passwordChecker";
import { promptInputs } from "../utils/promptUtils";
import { encrypt } from "../utils/cryptoUtils";
import { writeFileSync, existsSync, mkdirSync } from "fs";
import { BACKUP_DIR } from "../config/constants";
import chalk from "chalk";
import { join, resolve } from "path";

export async function backup(project?: string, output?: string) {
  let secretKey: string;

  if (!(await checkPassword())) return;

  const response = await promptInputs([
    {
      type: "text",
      name: "project",
      message:
        "Enter the project name to backup (leave empty for all projects):",
      initial: project || "",
    },
    {
      type: "text",
      name: "output",
      message: `Enter the output file path (default: ${BACKUP_DIR}/backup.wayenvbak):`,
      initial: output || "",
    },
    {
      type: "password",
      name: "secretKey",
      message: "Enter the secret key for encryption:",
    },
  ]);
  project = response.project;
  output = response.output;
  secretKey = response.secretKey;

  if (!output) {
    output = join(BACKUP_DIR, "backup.wayenvbak");
  }

  output = resolve(output);

  if (!output.endsWith(".wayenvbak")) {
    output += ".wayenvbak";
  }

  if (!existsSync(BACKUP_DIR)) {
    mkdirSync(BACKUP_DIR, { recursive: true });
  }

  const db = databaseManager.getDatabase();
  const envs = project
    ? db.query("SELECT * FROM envs WHERE project = ?").all(project)
    : db.query("SELECT * FROM envs").all();

  const encryptedData = encrypt(JSON.stringify(envs), secretKey);
  writeFileSync(output, encryptedData, "utf-8");

  console.log(
    chalk.green(`Backup complete. Encrypted data saved to ${output}.`),
  );
}
