import { Command } from "commander";
import { init } from "./commands/init";
import { add } from "./commands/add";
import { apply } from "./commands/apply";
import { remove } from "./commands/remove";
import { list } from "./commands/list";
import { get } from "./commands/get";
import { listProjects } from "./commands/listProjects";
import { renameProject } from "./commands/renameProject";
import { search } from "./commands/search";
import { update } from "./commands/update";
import { backup } from "./commands/backup";
import { restore } from "./commands/restore";
import { share } from "./commands/share";
import { receive } from "./commands/receive";
import { configManager } from "./config/configManager";

const program = new Command();
const config = configManager.getConfig();

program
  .name("wayenv")
  .description("CLI for managing environment variables")
  .version("1.0.3");

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
  .command("apply")
  .description("Apply environment variables to the current session")
  .option("--project <project>", "Project name")
  .option("--key <key>", "Environment variable key")
  .action((options) => apply(options.project, options.key));

program
  .command("remove")
  .description("Remove an environment variable")
  .option("--key <key>", "Environment variable key")
  .option("--project <project>", "Project name", "default")
  .action((options) => remove(options.key, options.project));

program
  .command("list")
  .option("--project <project>", "Project name", "")
  .option("--mask", "Mask the values")
  .description("List environment variables")
  .action((options) => list(options.format, options.mask));

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

program
  .command("update")
  .description("Update an environment variable value")
  .option("--key <key>", "Environment variable key")
  .option("--value <value>", "New environment variable value")
  .option("--project <project>", "Project name", "default")
  .action((options) => update(options.key, options.value, options.project));

program
  .command("search")
  .description("Search for environment variables by key")
  .option("--key <key>", "Partial key to search for")
  .option("--project <project>", "Project name", "default")
  .option("--mask", "Mask the values")
  .action((options) => search(options.key, options.project, options.mask));

program
  .command("backup")
  .description("Backup environment variables to a file")
  .option("--project <project>", "Project name")
  .option("--output <output>", "Output file path")
  .action((options) => backup(options.project, options.output));

program
  .command("restore")
  .description("Restore environment variables from a file")
  .option("--project <project>", "Project name")
  .option("--input <input>", "Input file path")
  .action((options) => restore(options.project, options.input));

program
  .command("share")
  .description("Share environment variables through a server")
  .action(share);

program
  .command("receive")
  .description("Receive environment variables from a server")
  .action(receive);

// Parse arguments
program.parse(process.argv);
