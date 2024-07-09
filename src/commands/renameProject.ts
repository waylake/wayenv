import { databaseManager } from "../database/databaseManager";
import { checkPassword } from "../utils/passwordChecker";
import { promptInputs } from "../utils/promptUtils";
import chalk from "chalk";

export async function renameProject() {
  if (!(await checkPassword())) return;

  const response = await promptInputs([
    {
      type: "text",
      name: "oldName",
      message: "Enter the current project name:",
    },
    {
      type: "text",
      name: "newName",
      message: "Enter the new project name:",
    },
  ]);

  const db = databaseManager.getDatabase();
  db.run("UPDATE envs SET project = ? WHERE project = ?", [
    response.newName,
    response.oldName,
  ]);

  console.log(
    chalk.green(`Renamed project ${response.oldName} to ${response.newName}.`),
  );
}
