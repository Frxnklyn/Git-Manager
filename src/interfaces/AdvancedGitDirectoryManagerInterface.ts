import type {
  CommandResultInterface,
  CommandSuggestionInterface,
} from "@frxnklyn/command-contracts";
import type {
  GitDirectoryInterface,
  GitignoreFileInterface,
  GitSubmoduleInterface,
} from "@frxnklyn/directory-contracts";
import type {
  GitHubForkInterface,
  GitHubRepositoryInterface,
  GitHubUserInterface,
  GitUserInterface,
} from "./GitMetadataInterfaces.js";

/**
 * Kombiniert Directory-Funktionalitaet mit Git-Operationen fuer einen
 * Git-spezifischen Directory-Manager.
 *
 * @author Frxnklyn
 */
export interface AdvancedGitDirectoryManagerInterface extends GitDirectoryInterface {
  status(): Promise<CommandResultInterface>;
  pull(): Promise<CommandResultInterface>;
  getGitIgnore(fileName?: string): GitignoreFileInterface;
  getSubmodules(): GitSubmoduleInterface[];
  getGitUser(): Promise<GitUserInterface>;
  getGitHubUser(): Promise<GitHubUserInterface>;
  getRepository(): Promise<GitHubRepositoryInterface>;
  getForks(): Promise<GitHubForkInterface[]>;
  getSuggestedActions(): CommandSuggestionInterface[];
}
