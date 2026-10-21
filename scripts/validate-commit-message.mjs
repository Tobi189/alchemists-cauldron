import { readFile } from 'node:fs/promises';
import process from 'node:process';

const commitMessagePath = process.argv[2];

if (commitMessagePath) {
  const commitMessage = await readFile(commitMessagePath, 'utf8');
  const [subject = ''] = commitMessage.trim().split(/\r?\n/, 1);
  const commitMessagePattern =
    /^(?:build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(?:\([a-z0-9]+(?:-[a-z0-9]+)*\))?: [a-z0-9].+$/;

  if (!commitMessagePattern.test(subject)) {
    const errorMessage = [
      `Invalid commit message: "${subject}"`,
      'Expected: <type>(optional-scope): <description>',
      'Allowed types: build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test',
      'Example: feat(game): add ingredient shelf',
      '',
    ].join('\n');

    process.stderr.write(errorMessage);
    process.exitCode = 1;
  }
} else {
  process.stderr.write('Commit message file path is required.\n');
  process.exitCode = 1;
}
