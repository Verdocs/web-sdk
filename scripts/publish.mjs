// Publishes @verdocs/web-sdk and @verdocs/web-sdk-react at their committed versions when npm doesn't have them yet.
// Safe to rerun: versions already on npm are skipped, and "already published" counts as success. With --dry-run it
// builds everything but only runs `npm publish --dry-run`, so nothing is uploaded.
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import {appendFileSync, readFileSync} from 'node:fs';
import {execFileSync, spawn, spawnSync} from 'node:child_process';

const ROOT = resolve(import.meta.dirname, '..');
const CORE = join(ROOT, 'verdocs-web-sdk');
const REACT = join(ROOT, 'verdocs-web-sdk-react');
const WAIT_MS = 30 * 60 * 1000;
const DRY_RUN = process.argv.includes('--dry-run');

const readPackage = dir => JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
const npm = (cwd, ...args) => execFileSync('npm', args, {cwd, stdio: 'inherit'});
const onNpm = ({name, version}) => spawnSync('npm', ['view', `${name}@${version}`, 'version', '--prefer-online'], {encoding: 'utf8'}).stdout.trim() === version;
const summary = line => {
  console.log(line);
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${line}\n`);
  }
};

// We stream npm's output rather than capturing it, so its error at the end always reaches the log.
const publish = cwd =>
  new Promise((done, fail) => {
    let output = '';
    const child = spawn('npm', ['publish', ...(DRY_RUN ? ['--dry-run'] : [])], {cwd, stdio: ['ignore', 'inherit', 'pipe']});
    child.stderr.on('data', chunk => {
      process.stderr.write(chunk);
      output += chunk;
    });
    child.on('error', fail);
    child.on('close', code => {
      if (code === 0 || /previously published/i.test(output)) {
        done();
      } else {
        const errors = output.split('\n').filter(line => line.startsWith('npm error'));
        fail(new Error(`npm publish failed in ${cwd}\n${errors.join('\n')}`));
      }
    });
  });

const main = async () => {
  // Trusted publishing needs npm 11.5.1 or later.
  const [major, minor, patch] = execFileSync('npm', ['--version'], {encoding: 'utf8'}).trim().split('.').map(Number);
  if (major < 11 || (major === 11 && (minor < 5 || (minor === 5 && patch < 1)))) {
    throw new Error('Trusted publishing needs npm 11.5.1 or later.');
  }

  const core = readPackage(CORE);
  const react = readPackage(REACT);
  if (react.version !== core.version || react.dependencies['@verdocs/web-sdk'] !== `^${core.version}`) {
    throw new Error('The React wrapper must match the core version. Run scripts/bump.sh rather than editing versions by hand.');
  }

  const pending = [core, react].filter(pkg => !onNpm(pkg));
  if (pending.length === 0) {
    summary(`Nothing to publish: ${core.name} and ${react.name} ${core.version} are already on npm.`);
    return;
  }

  npm(CORE, 'ci');
  npm(CORE, 'run', 'build');
  if (!onNpm(core)) {
    await publish(CORE);
  }

  // The wrapper builds against the core we just built, so it doesn't wait out npm's publish-time scan.
  const tarball = execFileSync('npm', ['pack', '--pack-destination', tmpdir(), '--silent'], {cwd: CORE, encoding: 'utf8'}).trim().split('\n').pop();
  npm(REACT, 'install', '--no-save', join(tmpdir(), tarball));
  npm(REACT, 'run', 'build');
  if (!onNpm(react)) {
    await publish(REACT);
  }

  if (DRY_RUN) {
    summary(`Dry run passed for ${core.name} and ${react.name} ${core.version}. Nothing was uploaded.`);
    return;
  }

  // npm scans every new version before it can be installed, so we wait until both are, and web-app can bump.
  const started = Date.now();
  while (![core, react].every(onNpm)) {
    if (Date.now() - started > WAIT_MS) {
      throw new Error(`Published, but ${core.version} still isn't installable after 30 minutes. Check npmjs.com before rerunning.`);
    }
    await new Promise(next => setTimeout(next, 20000));
  }

  summary(`Published ${core.name} and ${react.name} ${core.version}, installable after ${Math.round((Date.now() - started) / 60000)} minutes.`);
};

// Setting the exit code instead of throwing lets Node finish writing the log before it exits.
main().catch(e => {
  console.error(e.message);
  process.exitCode = 1;
});
