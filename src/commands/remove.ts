import { databaseManager } from "../database/databaseManager";
import { checkPassword } from "../utils/passwordChecker";
import { promptInputs } from "../utils/promptUtils";
import chalk from "chalk";

export async function remove(key?: string, project?: string) {
  if (!(await checkPassword())) return;

  if (!key || !project) {
    const response = await promptInputs([
      {
        type: "text",
        name: "key",
        message: "Enter the environment variable key:",
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
  db.run("DELETE FROM envs WHERE key = ? AND project = ?", [key, project]);

  console.log(chalk.yellow(`Removed ${key} from the ${project} project.`));
}
