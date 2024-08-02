import { databaseManager } from "../database/databaseManager";
import { checkPassword } from "../utils/passwordChecker";
import { promptInputs } from "../utils/promptUtils";
import chalk from "chalk";

export async function apply(project?: string, key?: string) {
  if (!(await checkPassword())) return;

  if (!project) {
    const response = await promptInputs([
      {
        type: "text",
        name: "project",
        message: "Enter the project name to apply environment variables:",
        initial: project,
      },
    ]);
    project = response.project;
  }
  if (!project) {
    console.log(chalk.red("Project name is required."));
    return;
  }


  const envKeyResponse = await promptInputs([
    {
      type: "text",
      name: "envKey",
      message: "Enter the environment variable key to export (leave blank for all):",
      initial: "",
    },
  ]);
  const envKey = envKeyResponse.envKey;

  const db = databaseManager.getDatabase();
  const envs = db.query("SELECT * FROM envs WHERE project = ?").all(project) as { key: string; value: string }[];

  const filteredEnvs = envKey ? envs.filter(env => env.key === envKey) : envs;

  if (filteredEnvs.length === 0) {
    console.log(chalk.red(`No environment variables found for project ${project} with key ${envKey}.`));
    return;
  }

  filteredEnvs.forEach((env) => {
    const safeKey = env.key.replace(/-/g, '_');
    console.log(`export ${safeKey}="${env.value}"`); 
  });

  console.log(chalk.green(`Environment variables for project ${project} applied to the current session.`));
}