import type {
  CommandResultInterface,
  CommandSuggestionInterface,
} from "@frxnklyn/command-contracts";
import { DirectoryCommandRunner } from "@frxnklyn/command-runner";
import type {
  GitignoreFileInterface,
  GitSubmoduleInterface,
} from "@frxnklyn/directory-contracts";
import { GitManager } from "./GitManager.js";
import type { AdvancedGitDirectoryManagerInterface } from "./interfaces/AdvancedGitDirectoryManagerInterface.js";
import type {
  GitHubForkInterface,
  GitHubRepositoryInterface,
  GitHubUserInterface,
  GitUserInterface,
} from "./interfaces/GitMetadataInterfaces.js";

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

  getGitIgnore(fileName?: string): GitignoreFileInterface {
    return this.gitManager.getGitIgnore(undefined, fileName);
  }

  getSubmodules(): GitSubmoduleInterface[] {
    return this.gitManager.getSubmodules();
  }

  getGitUser(): Promise<GitUserInterface> {
    return this.gitManager.getGitUser();
  }

  getGitHubUser(): Promise<GitHubUserInterface> {
    return this.gitManager.getGitHubUser();
  }

  getRepository(): Promise<GitHubRepositoryInterface> {
    return this.gitManager.getRepository();
  }

  getForks(): Promise<GitHubForkInterface[]> {
    return this.gitManager.getForks();
  }

  getSuggestedActions(): CommandSuggestionInterface[] {
    return this.gitManager.getSuggestedActions();
  }
}
