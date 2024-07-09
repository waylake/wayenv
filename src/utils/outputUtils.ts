import chalk from "chalk";
import Table from "cli-table3";
import { Env } from "../config/types";
import { configManager } from "../config/configManager";

export function printEnvs(envs: Env[], mask: boolean = false) {
  const outputFormat = configManager.getConfig().outputFormat;

  console.log(mask);

  const maskValue = (value: string) =>
    mask ? value.replace(/./g, "*") : value;

  if (outputFormat === "table") {
    const table = new Table({
      head: ["Key", "Value", "Project"],
      colWidths: [30, 50, 20],
      wordWrap: true,
      style: {
        head: ["green"],
        border: ["gray"],
      },
    });

    envs.forEach((env) => {
      table.push([env.key, maskValue(env.value), env.project]);
    });

    console.log(table.toString());
  } else {
    console.log(chalk.blue("Environment Variables:"));
    envs.forEach((env) => {
      console.log(
        `${chalk.cyan(env.key)} (${chalk.yellow(env.project)}): ${maskValue(env.value)}`,
      );
    });
  }
}
