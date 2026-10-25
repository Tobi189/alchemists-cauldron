import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import unicorn from 'eslint-plugin-unicorn';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['dist/', 'node_modules/'],
  },
  js.configs.recommended,
  ...tseslint.configs.strict,
  ...tseslint.configs.stylistic,
  unicorn.configs.recommended,
  eslintConfigPrettier,
  {
    rules: {
      'unicorn/prevent-abbreviations': 'off',
    },
  },
  {
    files: ['eslint.config.js'],
    rules: {
      'unicorn/no-top-level-side-effects': 'off',
    },
  },
);
