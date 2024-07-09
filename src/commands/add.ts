import { databaseManager } from "../database/databaseManager";
import { checkPassword } from "../utils/passwordChecker";
import { promptInputs } from "../utils/promptUtils";
import chalk from "chalk";

export async function add() {
  if (!(await checkPassword())) return;

  const response = await promptInputs([
    {
      type: "text",
      name: "key",
      message: "Enter the environment variable key:",
    },
    {
      type: "text",
      name: "value",
      message: "Enter the environment variable value:",
    },
    {
      type: "text",
      name: "project",
      message: "Enter the project name (default if empty):",
      initial: "default",
    },
  ]);

  const db = databaseManager.getDatabase();
  db.run("INSERT OR REPLACE INTO envs (key, value, project) VALUES (?, ?, ?)", [
    response.key,
    response.value,
    response.project,
  ]);

  console.log(
    chalk.green(`Added ${response.key} to the ${response.project} project.`),
  );
}
