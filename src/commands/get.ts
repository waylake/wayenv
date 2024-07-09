import { databaseManager } from "../database/databaseManager";
import { checkPassword } from "../utils/passwordChecker";
import { promptInputs } from "../utils/promptUtils";
import chalk from "chalk";
import { Env } from "../config/types";

export async function get() {
  if (!(await checkPassword())) return;

  const response = await promptInputs([
    {
      type: "text",
      name: "key",
      message: "Enter the key of the environment variable to get:",
    },
    {
      type: "text",
      name: "project",
      message: "Enter the project name (default if empty):",
      initial: "default",
    },
  ]);

  const db = databaseManager.getDatabase();
  const env = db
    .query("SELECT value FROM envs WHERE key = ? AND project = ?")
    .get(response.key, response.project) as Env;

  if (env) {
    console.log(
      chalk.green(`${response.key} (${response.project}): ${env.value}`),
    );
  } else {
    console.log(
      chalk.red(
        `Environment variable ${response.key} not found in project ${response.project}.`,
      ),
    );
  }
}
