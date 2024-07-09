import { databaseManager } from "../database/databaseManager";
import { checkPassword } from "../utils/passwordChecker";
import { promptInputs } from "../utils/promptUtils";
import { printEnvs } from "../utils/outputUtils";
import { Env } from "../config/types";

export async function search(
  key?: string,
  project?: string,
  mask: boolean = false,
) {
  if (!(await checkPassword())) return;
  console.log(mask);

  if (!key || !project) {
    const response = await promptInputs([
      {
        type: "text",
        name: "key",
        message: "Enter the partial key to search for:",
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
    console.log("Key and project must both be provided.");
    return;
  }

  const db = databaseManager.getDatabase();
  const envs = db
    .query("SELECT * FROM envs WHERE key LIKE ? AND project = ?")
    .all(`%${key}%`, project) as Env[];

  if (envs.length === 0) {
    console.log(
      `No environment variables found matching ${key} in project ${project}.`,
    );
    return;
  }

  printEnvs(envs, mask);
}
