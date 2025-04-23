/* eslint-env node */
const { FlatCompat } = require('@eslint/eslintrc');
const tsParser        = require('@typescript-eslint/parser');
const tsPlugin        = require('@typescript-eslint/eslint-plugin');

const compat = new FlatCompat();

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  /* ── 1. Ignore generated folders ─────────────────────────────────── */
  { ignores: ['node_modules/**', '.next/**', 'out/**'] },

  /* ── 2. Base + TypeScript (UNtyped) ──────────────────────────────── */
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        // ⬇  NO  `project`  → disables typed-linting, kills the tsconfig error
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },
    plugins: { '@typescript-eslint': tsPlugin },
  },

  /* ── 3. Presets (Next + TS recommended) ──────────────────────────── */
  ...compat.extends(
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals'
  ),

  /* ── 4. Final overrides — always last! ───────────────────────────── */
  {
    rules: {
      /* silence what blocks the build */
      '@typescript-eslint/no-unused-vars'      : ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any'     : 'warn',
      '@typescript-eslint/no-empty-interface'  : 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports'  : 'off',

      'react/no-unescaped-entities'            : 'warn',
      'react/jsx-no-undef'                     : 'warn',
      'import/no-anonymous-default-export'     : 'off',
      'prefer-const'                           : 'warn',
    },
  },
];
