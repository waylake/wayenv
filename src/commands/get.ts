import { databaseManager } from "../database/databaseManager";
import { checkPassword } from "../utils/passwordChecker";
import { promptInputs } from "../utils/promptUtils";
import chalk from "chalk";
import { Env } from "../config/types";

export async function get(key?: string, project?: string) {
  if (!(await checkPassword())) return;

  if (!key || !project) {
    const response = await promptInputs([
      {
        type: "text",
        name: "key",
        message: "Enter the key of the environment variable to get:",
        initial: key,
      },
      {
        type: "text",
        name: "project",
        message: "Enter the project name (default if empty):",
        initial: project || "default",
      },
    ]);
    key = response.key;
    project = response.project;
  }

  if (!key || !project) {
    console.log(chalk.red("Key and project must both be provided."));
    return;
  }

  const db = databaseManager.getDatabase();
  const env = db
    .query("SELECT value FROM envs WHERE key = ? AND project = ?")
    .get(key, project) as Env;

  if (env && typeof env === "object" && "value" in env) {
    console.log(chalk.green(`${key} (${project}): ${env.value}`));
  } else {
    console.log(
      chalk.red(`Environment variable ${key} not found in project ${project}.`),
    );
  }
}
