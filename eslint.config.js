import { FlatCompat } from '@eslint/eslintrc';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

const compat = new FlatCompat();

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  /* 1 – ignore generated folders --------------------------------------- */
  {
    ignores: ['node_modules/**/*', '.next/**/*', 'out/**/*'],
  },

  /* 2 – core rules + TypeScript support -------------------------------- */
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
        ecmaVersion: 'latest',
      },
    },

    /* 👇 plugins must be an object in flat-config */
    plugins: {
      '@typescript-eslint': tsPlugin,
    },

    /* your project-specific overrides */
    rules: {
      '@typescript-eslint/no-explicit-any':        'off',
      '@typescript-eslint/no-unused-vars':         'warn',
      '@typescript-eslint/no-empty-interface':     'off',
      '@typescript-eslint/no-require-imports':     'off',

      'react/no-unescaped-entities':               'off',
      'react-hooks/exhaustive-deps':               'warn',
      'react/jsx-no-undef':                        'warn',
      'import/no-anonymous-default-export':        'off',
      'prefer-const':                              'warn',
    },
  },

  /* 3 – preset configs converted via FlatCompat ------------------------ */
  ...compat.extends(
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
  ),
];
