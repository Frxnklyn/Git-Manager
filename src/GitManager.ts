import type {
  CommandResultInterface,
  CommandRunnerInterface,
  CommandSuggestionInterface,
  PathAwareCommandRunnerInterface,
} from "@frxnklyn/command-contracts";
import type { DirectoryInterface } from "@frxnklyn/directory-contracts";
import type { GitManagerInterface } from "./interfaces/GitManagerInterface.js";

/**
 * Erstellt Git-Commands und delegiert deren Ausfuehrung an einen uebergebenen
 * CommandRunnerInterface. Der Runner kann pfadlos oder path-aware sein.
 *
 * @author Frxnklyn
 */
export class GitManager implements GitManagerInterface {
  constructor(private readonly commandRunner: CommandRunnerInterface) {}

  private getPath(directory?: DirectoryInterface): string | undefined {
    if (directory) return directory.getPath();

    const pathAwareRunner = this.commandRunner as Partial<PathAwareCommandRunnerInterface>;
    return typeof pathAwareRunner.getPath === "function"
      ? pathAwareRunner.getPath()
      : undefined;
  }

  status(directory?: DirectoryInterface): Promise<CommandResultInterface> {
    return this.commandRunner.run({
      command: "git",
      args: ["status"],
      ...(directory ? { cwd: directory.getPath() } : {}),
    });
  }

  pull(directory?: DirectoryInterface): Promise<CommandResultInterface> {
    return this.commandRunner.run({
      command: "git",
      args: ["pull"],
      ...(directory ? { cwd: directory.getPath() } : {}),
    });
  }

  clone(repoUrl: string, targetPath: string): Promise<CommandResultInterface> {
    return this.commandRunner.run({
      command: "git",
      args: ["clone", repoUrl, targetPath],
    });
  }

  getSuggestedActions(directory?: DirectoryInterface): CommandSuggestionInterface[] {
    const cwd = this.getPath(directory);

    return [
      {
        id: "git-status",
        label: "Git status",
        description: "Show the current working tree status.",
        command: {
          command: "git",
          args: ["status"],
          ...(cwd ? { cwd } : {}),
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
          ...(cwd ? { cwd } : {}),
        },
        safeToRunAutomatically: false,
      },
    ];
  }
}
