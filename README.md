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

Mit einem `DirectoryCommandRunner` speichert der Runner das Directory selbst. Dann benoetigen die Git-Methoden kein Directory-Argument:

```ts
import { DirectoryCommandRunner } from "@frxnklyn/command-runner";
import { GitManager } from "@frxnklyn/git-manager";

const git = new GitManager(new DirectoryCommandRunner(directory));

await git.status();
await git.pull();
```

## AdvancedGitDirectoryManager

`AdvancedGitDirectoryManager` ist bewusst eine bequeme Kombi-Variante fuer den konkreten Git-Directory-Anwendungsfall. Sie erweitert den aus `@frxnklyn/file-manager` exportierten `DirectoryManager` und benoetigt im Konstruktor nur einen Pfad.

Intern erstellt sie einen `GitManager`. Dieser verwendet einen `DirectoryCommandRunner`, der das `AdvancedGitDirectoryManager`-Objekt selbst als `DirectoryInterface` speichert. `status()`, `pull()` und `getSuggestedActions()` delegieren an den internen `GitManager`. Dadurch verwenden auch Commands nach `setPath()` oder `moveTo()` automatisch den aktuellen Directory-Pfad.

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
