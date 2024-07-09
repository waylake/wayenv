import { Command } from "commander";
import { init } from "./commands/init";
import { add } from "./commands/add";
import { remove } from "./commands/remove";
import { list } from "./commands/list";
import { get } from "./commands/get";
import { listProjects } from "./commands/listProjects";
import { renameProject } from "./commands/renameProject";
import { configManager } from "./config/configManager";

const program = new Command();
const config = configManager.getConfig();

program
  .name("wayenv")
  .description("CLI for managing environment variables")
  .version("1.0.0");

program
  .command("init")
  .description("Initialize the configuration")
  .action(init);

program
  .command("add")
  .description("Add a new environment variable")
  .option("--key <key>", "Environment variable key")
  .option("--value <value>", "Environment variable value")
  .option("--project <project>", "Project name", "default")
  .action((options) => add(options.key, options.value, options.project));

program
  .command("remove")
  .description("Remove an environment variable")
  .option("--key <key>", "Environment variable key")
  .option("--project <project>", "Project name", "default")
  .action((options) => remove(options.key, options.project));

program
  .command("list")
  .option(
    "--format <format>",
    "Output format (table or list)",
    config.outputFormat,
  )
  .option("--project <project>", "Project name", "")
  .description("List environment variables")
  .action((options) => list(options.format, options.project));

program
  .command("get")
  .description("Get the value of an environment variable")
  .option("--key <key>", "Environment variable key")
  .option("--project <project>", "Project name", "default")
  .action((options) => get(options.key, options.project));

program
  .command("list-projects")
  .description("List all projects")
  .action(listProjects);

program
  .command("rename-project")
  .description("Rename a project")
  .option("--old-name <oldName>", "Current project name")
  .option("--new-name <newName>", "New project name")
  .action((options) => renameProject(options.oldName, options.newName));

// Parse arguments
program.parse(process.argv);
