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

## AdvancedGitDirectoryManager

`AdvancedGitDirectoryManager` ist bewusst eine bequeme Kombi-Variante fuer den konkreten Git-Directory-Anwendungsfall. Sie erweitert den aus `@frxnklyn/file-manager` exportierten `DirectoryManager` und benoetigt im Konstruktor nur einen Pfad.

Intern erstellt sie selbst einen `NodeCommandRunner` und umschliesst ihn mit einem `PathAwareCommandRunner`. Vor jedem Git-Command wird dessen CWD mit dem aktuellen Directory-Pfad synchronisiert. Dadurch verwenden auch Commands nach `setPath()` oder `moveTo()` automatisch den neuen Pfad.

```ts
import { AdvancedGitDirectoryManager } from "@frxnklyn/git-manager/advanced";

const directory = new AdvancedGitDirectoryManager("C:/dev/my-repo");

await directory.status();

directory.moveTo("packages/example");
await directory.status();
```

`Command-Runner` bleibt trotzdem unabhaengig vom `DirectoryManager`: Prozessausfuehrung ist wiederverwendbare Infrastruktur. Nur dieses Git-spezifische Package kombiniert Directory- und Git-Funktionalitaet.

Die Advanced-Variante liegt in einem eigenen Export-Subpath, damit der normale `GitManager` nicht zur Laufzeit den vollstaendigen `@frxnklyn/file-manager` laden muss. Der aktuelle Build des bestehenden File-Manager-Repositories wirft beim Root-Import einen Fehler in einer zirkulaeren Editor-Abhaengigkeit. Sobald dieser Upstream-Fehler behoben ist, ist die Advanced-Variante ohne weitere Anpassung nutzbar.

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
