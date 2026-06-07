import type {
  CommandResultInterface,
  CommandSuggestionInterface,
} from "@frxnklyn/command-contracts";
import type { DirectoryInterface } from "@frxnklyn/directory-contracts";

/**
 * Kombiniert Directory-Funktionalitaet mit Git-Operationen fuer einen
 * Git-spezifischen Directory-Manager.
 *
 * @author Frxnklyn
 */
export interface AdvancedGitDirectoryManagerInterface extends DirectoryInterface {
  status(): Promise<CommandResultInterface>;
  pull(): Promise<CommandResultInterface>;
  getSuggestedActions(): CommandSuggestionInterface[];
}
