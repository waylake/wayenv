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
  .action(add);

program
  .command("remove")
  .description("Remove an environment variable")
  .action(remove);

program
  .command("list")
  .option(
    "--format <format>",
    "Output format (table or list)",
    config.outputFormat,
  )
  .description("List environment variables")
  .action((options) => list(options.format));

program
  .command("get")
  .description("Get the value of an environment variable")
  .action(get);

program
  .command("list-projects")
  .description("List all projects")
  .action(listProjects);

program
  .command("rename-project")
  .description("Rename a project")
  .action(renameProject);

// Parse arguments
program.parse(process.argv);
