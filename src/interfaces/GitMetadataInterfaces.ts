/**
 * Beschreibt den lokal fuer Git konfigurierten Nutzer.
 *
 * @author Frxnklyn
 */
export interface GitUserInterface {
  name?: string;
  email?: string;
}

/**
 * Beschreibt einen GitHub-Nutzer.
 *
 * @author Frxnklyn
 */
export interface GitHubUserInterface {
  login: string;
  name?: string;
  email?: string;
  url: string;
  company?: string;
  location?: string;
  publicRepositoryCount: number;
  followerCount: number;
  followingCount: number;
}

/**
 * Beschreibt den Besitzer eines GitHub-Repositories.
 *
 * @author Frxnklyn
 */
export interface GitHubRepositoryOwnerInterface {
  login: string;
  url: string;
}

/**
 * Beschreibt Metadaten eines GitHub-Repositories.
 *
 * @author Frxnklyn
 */
export interface GitHubRepositoryInterface {
  name: string;
  fullName: string;
  url: string;
  description?: string;
  defaultBranch: string;
  private: boolean;
  fork: boolean;
  owner: GitHubRepositoryOwnerInterface;
}

/**
 * Beschreibt ein Fork-Repository.
 *
 * @author Frxnklyn
 */
export interface GitHubForkInterface extends GitHubRepositoryInterface {}
