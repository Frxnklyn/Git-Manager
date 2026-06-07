import type {
  CommandResultInterface,
  CommandRunnerInterface,
  CommandSuggestionInterface,
} from "@frxnklyn/command-contracts";
import { DirectoryManager } from "@frxnklyn/file-manager";
import type { AdvancedGitDirectoryManagerInterface } from "./interfaces/AdvancedGitDirectoryManagerInterface.js";

export class AdvancedGitDirectoryManager
  extends DirectoryManager
  implements AdvancedGitDirectoryManagerInterface
{
  constructor(
    path: string,
    private readonly commandRunner: CommandRunnerInterface,
  ) {
    super(path);
  }

  status(): Promise<CommandResultInterface> {
    return this.commandRunner.run({
      command: "git",
      args: ["status"],
      cwd: this.getPath(),
    });
  }

  pull(): Promise<CommandResultInterface> {
    return this.commandRunner.run({
      command: "git",
      args: ["pull"],
      cwd: this.getPath(),
    });
  }

  getSuggestedActions(): CommandSuggestionInterface[] {
    return [
      {
        id: "git-status",
        label: "Git status",
        description: "Show the current working tree status.",
        command: {
          command: "git",
          args: ["status"],
          cwd: this.getPath(),
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
          cwd: this.getPath(),
        },
        safeToRunAutomatically: false,
      },
    ];
  }
}
