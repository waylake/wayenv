import { databaseManager } from "../database/databaseManager";
import { checkPassword } from "../utils/passwordChecker";
import { decrypt } from "../utils/cryptoUtils";
import { promptInputs } from "../utils/promptUtils";
import chalk from "chalk";

export async function receive() {
  if (!(await checkPassword())) return;

  const response = await promptInputs([
    {
      type: "text",
      name: "url",
      message: "Enter the URL to receive data from:",
    },
    {
      type: "password",
      name: "secretKey",
      message: "Enter the secret key for decryption:",
    },
    {
      type: "text",
      name: "project",
      message: "Enter the project name to store the received data:",
    },
  ]);

  const { url, secretKey, project } = response;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch data from ${url}`);
    }

    const encryptedDataArrayBuffer = await res.arrayBuffer();
    const encryptedDataBuffer = Buffer.from(
      new Uint8Array(encryptedDataArrayBuffer),
    );

    try {
      const decryptedData = decrypt(encryptedDataBuffer, secretKey);
      const envs = JSON.parse(decryptedData);

      const db = databaseManager.getDatabase();
      envs.forEach((env: any) => {
        db.run(
          "INSERT OR REPLACE INTO envs (key, value, project) VALUES (?, ?, ?)",
          [env.key, env.value, project],
        );
      });

      console.log(
        chalk.green(`Data received and stored in project ${project}`),
      );
    } catch (error) {
      console.log(chalk.red("Failed to decrypt or parse data."));
    }
  } catch (error: any) {
    console.log(chalk.red(`Error: ${error.message}`));
  }
}
