import type {
  CommandResultInterface,
  CommandRunnerInterface,
  CommandSuggestionInterface,
} from "@frxnklyn/command-contracts";
import type { DirectoryInterface } from "@frxnklyn/directory-contracts";
import type { GitManagerInterface } from "./interfaces/GitManagerInterface.js";

export class GitManager implements GitManagerInterface {
  constructor(private readonly commandRunner: CommandRunnerInterface) {}

  status(directory: DirectoryInterface): Promise<CommandResultInterface> {
    return this.commandRunner.run({
      command: "git",
      args: ["status"],
      cwd: directory.getPath(),
    });
  }

  pull(directory: DirectoryInterface): Promise<CommandResultInterface> {
    return this.commandRunner.run({
      command: "git",
      args: ["pull"],
      cwd: directory.getPath(),
    });
  }

  clone(repoUrl: string, targetPath: string): Promise<CommandResultInterface> {
    return this.commandRunner.run({
      command: "git",
      args: ["clone", repoUrl, targetPath],
    });
  }

  getSuggestedActions(directory: DirectoryInterface): CommandSuggestionInterface[] {
    const cwd = directory.getPath();

    return [
      {
        id: "git-status",
        label: "Git status",
        description: "Show the current working tree status.",
        command: {
          command: "git",
          args: ["status"],
          cwd,
        },
        safeToRunAutomatically: true,
      },
      {
        id: "git-pull",
        label: "Git pull",
        description: "Fetch and integrate changes from the configured upstream.",
        command: {
          command: "git",
          args: ["pull"],
          cwd,
        },
        safeToRunAutomatically: false,
      },
    ];
  }
}
