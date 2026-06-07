import type {
  CommandResultInterface,
  CommandSuggestionInterface,
} from "@frxnklyn/command-contracts";
import type { DirectoryInterface } from "@frxnklyn/directory-contracts";

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
  getSuggestedActions(directory?: DirectoryInterface): CommandSuggestionInterface[];
}
