import type {
  CommandResultInterface,
  CommandSuggestionInterface,
} from "@frxnklyn/command-contracts";
import { DirectoryCommandRunner } from "@frxnklyn/command-runner";
import { DirectoryManager } from "@frxnklyn/file-manager";
import { GitManager } from "./GitManager.js";
import type { AdvancedGitDirectoryManagerInterface } from "./interfaces/AdvancedGitDirectoryManagerInterface.js";

/**
 * Kombiniert den vorhandenen DirectoryManager mit einem internen GitManager.
 * Der GitManager verwendet einen DirectoryCommandRunner, der diese Instanz als
 * DirectoryInterface speichert und dadurch immer ihren aktuellen Pfad nutzt.
 *
 * @author Frxnklyn
 */
export class AdvancedGitDirectoryManager
  extends DirectoryManager
  implements AdvancedGitDirectoryManagerInterface
{
  private readonly gitManager: GitManager;

  constructor(path: string) {
    super(path);
    this.gitManager = new GitManager(new DirectoryCommandRunner(this));
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
