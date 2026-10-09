// Publishes the built playground (playground-dist) to the gh-pages branch of the origin remote.
// Usage: npm run deploy:playground
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const BRANCH = 'gh-pages';
const root = resolve(import.meta.dirname, '..');
const dist = join(root, 'playground-dist');

const git = (args, cwd) => execFileSync('git', args, { cwd, stdio: [ 'ignore', 'pipe', 'inherit' ] }).toString().trim();

if (!existsSync(join(dist, 'index.html'))) {
	console.error('playground-dist/index.html not found. Run "npm run build:playground" first.');
	process.exit(1);
}

// DEPLOY_REMOTE overrides the target, e.g. to try the script against a local repository
const remote = process.env.DEPLOY_REMOTE ?? git([ 'remote', 'get-url', 'origin' ], root);
const commit = git([ 'rev-parse', '--short', 'HEAD' ], root);
const workDir = mkdtempSync(join(tmpdir(), 'cdt-playground-'));

try {
	cpSync(dist, workDir, { recursive: true });
	// Serve files as they are, without Jekyll processing
	writeFileSync(join(workDir, '.nojekyll'), '');

	git([ 'init', '--quiet', '--initial-branch', BRANCH ], workDir);
	git([ 'config', 'core.autocrlf', 'false' ], workDir);
	git([ 'add', '--all' ], workDir);
	git([ 'commit', '--quiet', '--message', `Deploy playground from ${commit}` ], workDir);
	git([ 'push', '--force', remote, `${BRANCH}:${BRANCH}` ], workDir);

	console.log(`Deployed the playground from ${commit} to the ${BRANCH} branch of ${remote}`);
} finally {
	rmSync(workDir, { recursive: true, force: true });
}
