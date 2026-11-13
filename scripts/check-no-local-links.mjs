// Refuses to publish while any @verdocs/* dependency is a symlink (scripts/local-js-sdk.sh link, npm link, ...), so a
// build compiled against unreleased local code can't reach npm. Runs as `prepublishOnly` from the package being published.
import {join} from 'node:path';
import {lstatSync, readdirSync, realpathSync} from 'node:fs';

const scope = join(process.cwd(), 'node_modules', '@verdocs');

let names = [];
try {
  names = readdirSync(scope);
} catch {
  // Nothing installed under @verdocs, so nothing can be linked.
}

const linked = names.filter(name => lstatSync(join(scope, name)).isSymbolicLink());

if (linked.length) {
  console.error('\nRefusing to publish: these dependencies are linked to local checkouts instead of npm releases:\n');
  for (const name of linked) {
    console.error(`  @verdocs/${name} -> ${realpathSync(join(scope, name))}`);
  }
  console.error('\nRun `scripts/local-js-sdk.sh unlink` from the web-sdk root, rebuild, then publish again.\n');
  process.exitCode = 1;
}
