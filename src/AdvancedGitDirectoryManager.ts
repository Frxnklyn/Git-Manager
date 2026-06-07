import type {
  CommandResultInterface,
  CommandSuggestionInterface,
  PathAwareCommandRunnerInterface,
} from "@frxnklyn/command-contracts";
import {
  NodeCommandRunner,
  PathAwareCommandRunner,
} from "@frxnklyn/command-runner";
import { DirectoryManager } from "@frxnklyn/file-manager";
import type { AdvancedGitDirectoryManagerInterface } from "./interfaces/AdvancedGitDirectoryManagerInterface.js";

export class AdvancedGitDirectoryManager
  extends DirectoryManager
  implements AdvancedGitDirectoryManagerInterface
{
  private readonly commandRunner: PathAwareCommandRunnerInterface;

  constructor(path: string) {
    super(path);
    this.commandRunner = new PathAwareCommandRunner(
      new NodeCommandRunner(),
      this.getPath(),
    );
  }

  private getCommandRunner(): PathAwareCommandRunnerInterface {
    return this.commandRunner.setCwd(this.getPath());
  }

  status(): Promise<CommandResultInterface> {
    return this.getCommandRunner().run({
      command: "git",
      args: ["status"],
    });
  }

  pull(): Promise<CommandResultInterface> {
    return this.getCommandRunner().run({
      command: "git",
      args: ["pull"],
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
