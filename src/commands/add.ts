import { databaseManager } from "../database/databaseManager";
import { checkPassword } from "../utils/passwordChecker";
import { promptInputs } from "../utils/promptUtils";
import chalk from "chalk";

export async function add(key?: string, value?: string, project?: string) {
  if (!(await checkPassword())) return;

  if (!key || !value || !project) {
    const response = await promptInputs([
      {
        type: "text",
        name: "key",
        message: "Enter the environment variable key:",
        initial: key,
      },
      {
        type: "text",
        name: "value",
        message: "Enter the environment variable value:",
        initial: value,
      },
      {
        type: "text",
        name: "project",
        message: "Enter the project name (default if empty):",
        initial: project || "default",
      },
    ]);
    key = response.key;
    value = response.value;
    project = response.project;
  }

  if (!key || !value || !project) {
    console.log(chalk.red("Key, value, and project must all be provided."));
    return;
  }

  const db = databaseManager.getDatabase();
  db.run("INSERT OR REPLACE INTO envs (key, value, project) VALUES (?, ?, ?)", [
    key,
    value,
    project,
  ]);

  console.log(chalk.green(`Added ${key} to the ${project} project.`));
}
