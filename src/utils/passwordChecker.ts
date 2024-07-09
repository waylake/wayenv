import prompts from "prompts";
import { configManager } from "../config/configManager";
import chalk from "chalk";

export async function checkPassword(): Promise<boolean> {
  const now = Date.now();
  const config = configManager.getConfig();

  if (now - config.lastPasswordCheck < config.passwordCheckInterval) {
    return true;
  }

  const response = await prompts({
    type: "password",
    name: "password",
    message: "Enter your password:",
  });

  const isValid = await Bun.password.verify(
    response.password,
    config.passwordHash,
  );
  if (isValid) {
    configManager.updateConfig({ lastPasswordCheck: now });
    return true;
  }

  console.log(chalk.red("Invalid password"));
  return false;
}
