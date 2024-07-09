import { databaseManager } from "../database/databaseManager";
import { checkPassword } from "../utils/passwordChecker";
import chalk from "chalk";

export async function listProjects() {
  if (!(await checkPassword())) return;

  const db = databaseManager.getDatabase();
  const projects = db.query("SELECT DISTINCT project FROM envs").all();

  console.log(chalk.blue("Projects:"));
  projects.forEach((project) => {
    if (typeof project === "object" && "project" in project!) {
      console.log(chalk.cyan(project.project));
    }
  });
}
