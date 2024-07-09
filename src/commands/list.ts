import { databaseManager } from "../database/databaseManager";
import { checkPassword } from "../utils/passwordChecker";
import { promptInputs } from "../utils/promptUtils";
import { printEnvs } from "../utils/outputUtils";
import { Env } from "../config/types";

export async function list(project?: string, mask: boolean = false) {
  if (!(await checkPassword())) return;

  if (!project) {
    const response = await promptInputs([
      {
        type: "text",
        name: "project",
        message:
          "Enter the project name to list (leave empty for all projects):",
        initial: "",
      },
    ]);
    project = response.project;
  }

  const db = databaseManager.getDatabase();
  const envs = (
    project
      ? db.query("SELECT * FROM envs WHERE project = ?").all(project)
      : db.query("SELECT * FROM envs").all()
  ) as Env[];

  printEnvs(envs, mask);
}
