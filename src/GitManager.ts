import type {
  CommandResultInterface,
  CommandRunnerInterface,
  CommandSuggestionInterface,
  PathAwareCommandRunnerInterface,
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
} from "./interfaces/GitMetadataInterfaces.js";
import type { GitManagerInterface } from "./interfaces/GitManagerInterface.js";

interface GitHubUserPayload {
  login: string;
  name?: string | null;
  email?: string | null;
  html_url: string;
  company?: string | null;
  location?: string | null;
  public_repos?: number;
  followers?: number;
  following?: number;
}

interface GitHubRepositoryPayload {
  name: string;
  full_name: string;
  html_url: string;
  description?: string | null;
  default_branch: string;
  private: boolean;
  fork: boolean;
  owner: {
    login: string;
    html_url: string;
  };
}

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

  private isGitDirectory(value: unknown): value is GitDirectoryInterface {
    const candidate = value as Partial<GitDirectoryInterface> | undefined;
    return (
      typeof candidate?.getPath === "function" &&
      typeof candidate.getGitignore === "function" &&
      typeof candidate.getGitmodules === "function"
    );
  }

  private getGitDirectory(directory?: GitDirectoryInterface): GitDirectoryInterface {
    if (directory) return directory;
    if (this.isGitDirectory(this.commandRunner)) return this.commandRunner;

    throw new Error(
      "A GitDirectoryInterface is required for Git file operations.",
    );
  }

  private async runJson<T>(
    executable: string,
    args: string[],
    directory?: DirectoryInterface,
  ): Promise<T> {
    const cwd = this.getPath(directory);
    const result = await this.commandRunner.run({
      command: executable,
      args,
      ...(cwd ? { cwd } : {}),
    });

    if (!result.success) {
      throw new Error(
        `${executable} ${args.join(" ")} failed: ${result.stderr || String(result.error)}`,
      );
    }

    try {
      return JSON.parse(result.stdout) as T;
    } catch (error) {
      throw new Error(
        `${executable} ${args.join(" ")} returned invalid JSON: ${String(error)}`,
      );
    }
  }

  private mapGitHubUser(payload: GitHubUserPayload): GitHubUserInterface {
    return {
      login: payload.login,
      ...(payload.name ? { name: payload.name } : {}),
      ...(payload.email ? { email: payload.email } : {}),
      url: payload.html_url,
      ...(payload.company ? { company: payload.company } : {}),
      ...(payload.location ? { location: payload.location } : {}),
      publicRepositoryCount: payload.public_repos ?? 0,
      followerCount: payload.followers ?? 0,
      followingCount: payload.following ?? 0,
    };
  }

  private mapGitHubRepository(
    payload: GitHubRepositoryPayload,
  ): GitHubRepositoryInterface {
    return {
      name: payload.name,
      fullName: payload.full_name,
      url: payload.html_url,
      ...(payload.description ? { description: payload.description } : {}),
      defaultBranch: payload.default_branch,
      private: payload.private,
      fork: payload.fork,
      owner: {
        login: payload.owner.login,
        url: payload.owner.html_url,
      },
    };
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

  getGitignore(
    directory?: GitDirectoryInterface,
    fileName?: string,
  ): GitignoreFileInterface {
    return this.getGitDirectory(directory).getGitignore(fileName);
  }

  getGitIgnore(
    directory?: GitDirectoryInterface,
    fileName?: string,
  ): GitignoreFileInterface {
    return this.getGitignore(directory, fileName);
  }

  getGitmodules(
    directory?: GitDirectoryInterface,
    fileName?: string,
  ): GitmodulesFileInterface {
    return this.getGitDirectory(directory).getGitmodules(fileName);
  }

  getSubmodules(directory?: GitDirectoryInterface): GitSubmoduleInterface[] {
    return this.getGitmodules(directory).getSubmodules();
  }

  async getGitUser(directory?: DirectoryInterface): Promise<GitUserInterface> {
    const cwd = this.getPath(directory);
    const getConfig = async (key: string): Promise<string | undefined> => {
      const result = await this.commandRunner.run({
        command: "git",
        args: ["config", "--get", key],
        ...(cwd ? { cwd } : {}),
      });
      const value = result.stdout.trim();
      return result.success && value ? value : undefined;
    };

    const name = await getConfig("user.name");
    const email = await getConfig("user.email");

    return {
      ...(name ? { name } : {}),
      ...(email ? { email } : {}),
    };
  }

  async getGitHubUser(directory?: DirectoryInterface): Promise<GitHubUserInterface> {
    const payload = await this.runJson<GitHubUserPayload>(
      "gh",
      ["api", "user"],
      directory,
    );
    return this.mapGitHubUser(payload);
  }

  async getRepository(
    directory?: DirectoryInterface,
  ): Promise<GitHubRepositoryInterface> {
    const payload = await this.runJson<GitHubRepositoryPayload>(
      "gh",
      ["api", "repos/{owner}/{repo}"],
      directory,
    );
    return this.mapGitHubRepository(payload);
  }

  async getForks(directory?: DirectoryInterface): Promise<GitHubForkInterface[]> {
    const pages = await this.runJson<GitHubRepositoryPayload[][]>(
      "gh",
      [
        "api",
        "repos/{owner}/{repo}/forks",
        "--paginate",
        "--slurp",
        "--method",
        "GET",
        "-F",
        "per_page=100",
      ],
      directory,
    );
    return pages.flat().map((fork) => this.mapGitHubRepository(fork));
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
