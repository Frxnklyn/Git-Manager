import type {
  CommandResultInterface,
  CommandSuggestionInterface,
} from "@frxnklyn/command-contracts";
import type { DirectoryInterface } from "@frxnklyn/directory-contracts";

export interface AdvancedGitDirectoryManagerInterface extends DirectoryInterface {
  status(): Promise<CommandResultInterface>;
  pull(): Promise<CommandResultInterface>;
  getSuggestedActions(): CommandSuggestionInterface[];
}
