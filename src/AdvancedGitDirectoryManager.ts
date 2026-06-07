import type {
  CommandResultInterface,
  CommandSuggestionInterface,
} from "@frxnklyn/command-contracts";
import { DirectoryCommandRunner } from "@frxnklyn/command-runner";
import { GitManager } from "./GitManager.js";
import type { AdvancedGitDirectoryManagerInterface } from "./interfaces/AdvancedGitDirectoryManagerInterface.js";

/**
 * Erweitert den DirectoryCommandRunner um einen internen GitManager. Dieselbe
 * Instanz verwaltet Directory, Command-Ausfuehrung und Git-Arbeitsverzeichnis.
 *
 * @author Frxnklyn
 */
export class AdvancedGitDirectoryManager
  extends DirectoryCommandRunner
  implements AdvancedGitDirectoryManagerInterface
{
  private readonly gitManager: GitManager;

  constructor(path: string) {
    super(path);
    this.gitManager = new GitManager(this);
  }

  status(): Promise<CommandResultInterface> {
    return this.gitManager.status();
  }

  pull(): Promise<CommandResultInterface> {
    return this.gitManager.pull();
  }

  getSuggestedActions(): CommandSuggestionInterface[] {
    return this.gitManager.getSuggestedActions();
  }
}
