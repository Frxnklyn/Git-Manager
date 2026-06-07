# @frxnklyn/git-manager

Git-spezifische Manager auf Basis von `CommandRunnerInterface` und `DirectoryInterface`.

## GitManager

`GitManager` ist die Composition-Variante. Er erbt nicht vom `DirectoryManager`, sondern erhaelt einen `CommandRunnerInterface` im Konstruktor und verwendet `directory.getPath()` als `cwd`.

```ts
import { NodeCommandRunner } from "@frxnklyn/command-runner";
import { DirectoryManager } from "@frxnklyn/file-manager";
import { GitManager } from "@frxnklyn/git-manager";

const git = new GitManager(new NodeCommandRunner());
const directory = new DirectoryManager("C:/dev/my-repo");

await git.status(directory);
await git.pull(directory);
```

Ein `DirectoryCommandRunner` ist selbst ein DirectoryManager. Dann benoetigen die Git-Methoden kein Directory-Argument:

```ts
import { DirectoryCommandRunner } from "@frxnklyn/command-runner";
import { GitManager } from "@frxnklyn/git-manager";

const git = new GitManager(new DirectoryCommandRunner("C:/dev/my-repo"));

await git.status();
await git.pull();
```

## Git-Dateien

Wenn der GitManager einen `DirectoryCommandRunner` oder ein explizites
`GitDirectoryInterface` verwendet, stehen die vorhandenen spezialisierten
Datei-Editoren zur Verfuegung:

```ts
const git = new GitManager(new DirectoryCommandRunner("C:/dev/my-repo"));

git.getGitIgnore().addIgnore("dist");
git.getGitmodules().addSubmodule({
  name: "shared",
  path: "packages/shared",
  url: "https://github.com/example/shared.git",
});

const submodules = git.getSubmodules();
```

`getGitIgnore()` ist ein Alias fuer das im File-Manager bestehende
`getGitignore()`.

## Nutzer und GitHub

```ts
const localUser = await git.getGitUser();
const githubUser = await git.getGitHubUser();
const repository = await git.getRepository();
const forks = await git.getForks();
```

`getGitUser()` liest `user.name` und `user.email` aus der lokalen
Git-Konfiguration. Die GitHub-Methoden verwenden `gh api` und benoetigen eine
authentifizierte GitHub CLI.

## AdvancedGitDirectoryManager

`AdvancedGitDirectoryManager` ist bewusst eine bequeme Kombi-Variante fuer den konkreten Git-Directory-Anwendungsfall. Sie erweitert `DirectoryCommandRunner` und benoetigt im Konstruktor nur einen Pfad.

Intern erstellt sie einen `GitManager` mit sich selbst als CommandRunner. `status()`, `pull()` und `getSuggestedActions()` delegieren an diesen GitManager. Dadurch verwenden auch Commands nach `setPath()` oder `moveTo()` automatisch den aktuellen Directory-Pfad.

```ts
import { AdvancedGitDirectoryManager } from "@frxnklyn/git-manager/advanced";

const directory = new AdvancedGitDirectoryManager("C:/dev/my-repo");

await directory.status();

directory.moveTo("packages/example");
await directory.status();
```

`NodeCommandRunner` und `PathAwareCommandRunner` bleiben unabhaengig vom `DirectoryManager`. `DirectoryCommandRunner` kombiniert Directory- und Command-Funktionalitaet bewusst; die Advanced-Variante ergaenzt darauf Git-Funktionalitaet.

Die Advanced-Variante liegt in einem eigenen Export-Subpath. `DirectoryCommandRunner` verwendet den isolierten `@frxnklyn/file-manager/directory-manager`-Export und muss dadurch nicht den vollstaendigen File-Manager-Root-Export laden.

## Interne Dependencies

Fuer lokale Entwicklung verweisen die `devDependencies` auf die benachbarten Repositories:

- `../npm-command-contracts`
- `../Command-Runner`
- `../npm-directory-contracts`
- `../File-Manager`

Konsumenten muessen die entsprechenden `@frxnklyn/*` Peer Dependencies bereitstellen. Die Peer Dependencies verweisen auf die GitHub-Repositories.

## Build

```bash
npm install
npm run build
```
