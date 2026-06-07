import type {
  CommandResultInterface,
  CommandSuggestionInterface,
} from "@frxnklyn/command-contracts";
import type {
  DirectoryInterface,
  GitDirectoryInterface,
  GitignoreFileInterface,
  GitmodulesFileInterface,
  GitSubmoduleInterface,
} from "@frxnklyn/directory-contracts";
import type {
  GitHubForkInterface,
  GitHubRepositoryInterface,
  GitHubUserInterface,
  GitUserInterface,
} from "./GitMetadataInterfaces.js";

/**
 * Definiert Git-Operationen, die ueber einen CommandRunnerInterface ausgefuehrt
 * und optional auf ein DirectoryInterface angewendet werden.
 *
 * @author Frxnklyn
 */
export interface GitManagerInterface {
  status(directory?: DirectoryInterface): Promise<CommandResultInterface>;
  pull(directory?: DirectoryInterface): Promise<CommandResultInterface>;
  clone(repoUrl: string, targetPath: string): Promise<CommandResultInterface>;
  getGitignore(
    directory?: GitDirectoryInterface,
    fileName?: string,
  ): GitignoreFileInterface;
  getGitIgnore(
    directory?: GitDirectoryInterface,
    fileName?: string,
  ): GitignoreFileInterface;
  getGitmodules(
    directory?: GitDirectoryInterface,
    fileName?: string,
  ): GitmodulesFileInterface;
  getSubmodules(directory?: GitDirectoryInterface): GitSubmoduleInterface[];
  getGitUser(directory?: DirectoryInterface): Promise<GitUserInterface>;
  getGitHubUser(directory?: DirectoryInterface): Promise<GitHubUserInterface>;
  getRepository(directory?: DirectoryInterface): Promise<GitHubRepositoryInterface>;
  getForks(directory?: DirectoryInterface): Promise<GitHubForkInterface[]>;
  getSuggestedActions(directory?: DirectoryInterface): CommandSuggestionInterface[];
}
