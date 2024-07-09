import { databaseManager } from "../database/databaseManager";
import { checkPassword } from "../utils/passwordChecker";
import { promptInputs } from "../utils/promptUtils";
import chalk from "chalk";

export async function remove() {
  if (!(await checkPassword())) return;

  const response = await promptInputs([
    {
      type: "text",
      name: "key",
      message: "Enter the key of the environment variable to remove:",
    },
    {
      type: "text",
      name: "project",
      message: "Enter the project name (default if empty):",
      initial: "default",
    },
  ]);

  const db = databaseManager.getDatabase();
  db.run("DELETE FROM envs WHERE key = ? AND project = ?", [
    response.key,
    response.project,
  ]);

  console.log(
    chalk.yellow(
      `Removed ${response.key} from the ${response.project} project.`,
    ),
  );
}
