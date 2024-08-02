import { databaseManager } from "../database/databaseManager";
import { checkPassword } from "../utils/passwordChecker";
import { promptInputs } from "../utils/promptUtils";
import chalk from "chalk";
import { writeFileSync } from "fs";
import { join } from "path";
import { Env } from "../config/types";

export async function exportEnv(format?: string, project?: string) {
  if (!(await checkPassword())) return;

  if (!project) {
    const response = await promptInputs([
      {
        type: "text",
        name: "project",
        message: "Enter the project name to export (default if empty):",
        initial: project || "default",
      },
    ]);
    project = response.project;
  }

  const db = databaseManager.getDatabase();
  const envs: Env[] = db.query("SELECT * FROM envs WHERE project = ?").all(project || null) as Env[];

  if (envs.length === 0) {
    console.log(chalk.red(`No environment variables found for project ${project}.`));
    return;
  }

  if (!format) {
    const response = await promptInputs([
      {
        type: "select",
        name: "format",
        message: "Select export format:",
        choices: [
          { title: ".env", value: "env" },
          { title: "JSON", value: "json" },
          { title: "YAML", value: "yaml" },
        ],
      },
    ]);
    format = response.format;
  }

  let output: string;
  if (format === "env") {
    output = envs.map(env => `${env.key}=${env.value}`).join("\n");
  } else if (format === "json") {
    output = JSON.stringify(envs, null, 2);
  } else if (format === "yaml") {
    output = envs.map(env => `${env.key}: ${env.value}`).join("\n");
  } else {
    console.log(chalk.red("Invalid format selected."));
    return;
  }

  var outputPath = join(process.cwd(), `.${format}.wayenv`); // 기본 파일 이름 설정

  const response = await promptInputs([
    {
      type: "text",
      name: "filename",
      message: "Enter the filename for export (default: wayenv):",
      initial: `wayenv.${format}`, // 기본값 설정
    },
  ]);
  const filename = response.filename || `wayenv.${format}`; // 사용자 입력이 없을 경우 기본값 사용
  var outputPath = join(process.cwd(), filename); // 파일 경로 업데이트

  writeFileSync(outputPath, output);
  console.log(chalk.green(`Exported environment variables to ${outputPath}.`));
}