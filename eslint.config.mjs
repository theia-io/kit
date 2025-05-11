import { FlatCompat } from '@eslint/eslintrc';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import js from '@eslint/js';
import nxEslintPlugin from '@nx/eslint-plugin';

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
});

export default [
  {
    ignores: ['**/dist'],
  },
  { plugins: { '@nx': nxEslintPlugin } },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: 'scope:shared',
              onlyDependOnLibsWithTags: ['scope:shared'],
            },
            {
              sourceTag: 'scope:api-shared',
              onlyDependOnLibsWithTags: ['scope:shared', 'scope:api-shared'],
            },
            {
              sourceTag: 'scope:api',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'scope:api-shared',
                'scope:api',
              ],
            },
            {
              sourceTag: 'scope:ui',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'scope:ui',
                'scope:ui-shared',
                'components',
                'feature',
                'pages',
              ],
            },
            {
              sourceTag: 'components',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'scope:ui-services',
                'components',
              ],
            },
            {
              sourceTag: 'scope:ui-shared',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'scope:ui-shared',
                'components',
              ],
            },
            {
              sourceTag: 'feature',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'scope:ui-shared',
                'components',
                'feature',
              ],
            },
            {
              sourceTag: 'pages',
              onlyDependOnLibsWithTags: [
                'scope:shared',
                'scope:ui-shared',
                'components',
                'feature',
                'pages',
              ],
            },
          ],
        },
      ],
    },
  },
  ...compat
    .config({
      extends: ['plugin:@nx/typescript'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx', '**/*.cts', '**/*.mts'],
      rules: {
        ...config.rules,
      },
    })),
  ...compat
    .config({
      extends: ['plugin:@nx/javascript'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.js', '**/*.jsx', '**/*.cjs', '**/*.mjs'],
      rules: {
        ...config.rules,
      },
    })),
  ...compat
    .config({
      env: {
        jest: true,
      },
    })
    .map((config) => ({
      ...config,
      files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
      rules: {
        ...config.rules,
      },
    })),
  {
    ignores: ['node_modules\r'],
  },
];
