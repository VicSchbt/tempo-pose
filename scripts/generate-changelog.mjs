import { execSync } from 'node:child_process';

function run(cmd) {
  return execSync(cmd, { encoding: 'utf-8' }).trim();
}

let lastTag = '';
try {
  lastTag = run('git describe --tags --abbrev=0');
} catch {
  lastTag = '';
}

// Get log since last tag or full log
const range = lastTag ? `${lastTag}..HEAD` : '';
const log = run(`git log ${range} --pretty=format:"- %s (%h)"`);

const newSection = `\n\n## ${new Date().toISOString().slice(0, 10)}\n${log}\n`;

const file = 'CHANGELOG.md';
let current = existsSync(file) ? readFileSync(file, 'utf8') : '# Changelog\n';

writeFileSync(file, current + newSection);
console.log('CHANGELOG updated.');
