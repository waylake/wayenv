import { databaseManager } from "../database/databaseManager";
import { checkPassword } from "../utils/passwordChecker";
import { encrypt } from "../utils/cryptoUtils";
import { promptInputs } from "../utils/promptUtils";
import { serve } from "bun";
import chalk from "chalk";
import { printEnvs } from "../utils/outputUtils";
import { Env } from "../config/types";

export async function share() {
  if (!(await checkPassword())) return;

  const response = await promptInputs([
    {
      type: "text",
      name: "project",
      message: "Enter the project name to share:",
    },
    {
      type: "password",
      name: "secretKey",
      message: "Enter the secret key for encryption:",
    },
    {
      type: "number",
      name: "port",
      message: "Enter the port to run the server on:",
      initial: 3000,
    },
  ]);

  const { project, secretKey, port } = response;

  const db = databaseManager.getDatabase();
  const envs = db
    .query("SELECT * FROM envs WHERE project = ?")
    .all(project) as Env[];
  printEnvs(envs);
  const encryptedData = encrypt(JSON.stringify(envs), secretKey);
  const confirmResponse = await promptInputs([
    {
      type: "confirm",
      name: "confirm",
      message: "Do you want to share this data?",
      initial: true,
    },
  ]);

  if (!confirmResponse.confirm) {
    console.log(chalk.red("Sharing cancelled"));
    return;
  }

  serve({
    port: port,
    hostname: "0.0.0.0",
    fetch(req) {
      console.log(chalk.blue(`Received request: ${req.method} ${req.url}`));

      return new Response(encryptedData, {
        headers: { "Content-Type": "application/octet-stream" },
      });
    },
  });

  console.log(chalk.green(`Server is running at http://0.0.0.0:${port}`));
}
