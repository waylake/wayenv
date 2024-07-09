import { databaseManager } from "../database/databaseManager";
import { checkPassword } from "../utils/passwordChecker";
import { promptInputs } from "../utils/promptUtils";
import chalk from "chalk";

export async function renameProject(oldName?: string, newName?: string) {
  if (!(await checkPassword())) return;

  if (!oldName || !newName) {
    const response = await promptInputs([
      {
        type: "text",
        name: "oldName",
        message: "Enter the current project name:",
        initial: oldName,
      },
      {
        type: "text",
        name: "newName",
        message: "Enter the new project name:",
        initial: newName,
      },
    ]);
    oldName = response.oldName;
    newName = response.newName;
  }

  if (!oldName || !newName) {
    console.log(chalk.red("Both old and new project names must be provided."));
    return;
  }

  const db = databaseManager.getDatabase();
  db.run("UPDATE envs SET project = ? WHERE project = ?", [newName, oldName]);

  console.log(chalk.green(`Renamed project ${oldName} to ${newName}.`));
}
