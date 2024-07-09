import { databaseManager } from "../database/databaseManager";
import { checkPassword } from "../utils/passwordChecker";
import { promptInputs } from "../utils/promptUtils";
import { configManager } from "../config/configManager";
import chalk from "chalk";
import { Env } from "../config/types";
import Table from "cli-table3";

export async function list(format?: string, project?: string) {
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

  const outputFormat: "list" | "table" = format === "table" ? "table" : "list";

  const db = databaseManager.getDatabase();
  const envs = (
    project
      ? db.query("SELECT * FROM envs WHERE project = ?").all(project)
      : db.query("SELECT * FROM envs").all()
  ) as Env[];

  if (outputFormat === "table") {
    const table = new Table({
      head: ["Key", "Value", "Project"],
      colWidths: [30, 50, 20], // Adjust the widths to fit your content
      wordWrap: true,
      style: {
        head: ["green"],
        border: ["gray"],
      },
    });

    envs.forEach((env) => {
      table.push([env.key, env.value, env.project]);
    });

    console.log(table.toString());
  } else {
    console.log(chalk.blue("Environment Variables:"));
    envs.forEach((env) => {
      console.log(
        `${chalk.cyan(env.key)} (${chalk.yellow(env.project)}): ${env.value}`,
      );
    });
  }

  // Save the selected output format to config
  configManager.updateConfig({ outputFormat });
}
