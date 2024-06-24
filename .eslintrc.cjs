/**
 * This is intended to be a basic starting point for linting in your app.
 * It relies on recommended configs out of the box for simplicity, but you can
 * and should modify this configuration to best suit your team's needs.
 */

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      impliedStrict: true,
    },
  },

  plugins: [
    '@typescript-eslint',
    'unicorn', 
    'sonarjs',
    'prettier',
    'promise',
    'security',
    'security-node',
    'prefer-arrow',
    'regexp',
    '@stylistic',
    'react', 
    'jsx-a11y',
    'import',
  ],

  extends: [
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:@typescript-eslint/recommended',
    'eslint:recommended',
    'plugin:unicorn/recommended',
    'plugin:prettier/recommended',
    'plugin:sonarjs/recommended',
    'plugin:n/recommended',
    'plugin:promise/recommended',
    'plugin:security/recommended-legacy',
    'plugin:security-node/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:@eslint-community/eslint-comments/recommended',
    'plugin:regexp/recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],

  rules: {
    'unicorn/naming-convention': 'off',
  },

  overrides: [
    {
      files: ['**/*.{js,jsx,ts,tsx}'],
      settings: {
        react: {
          version: 'detect',
        },
        formComponents: ['Form'],
        linkComponents: [
          { name: 'Link', linkAttribute: 'to' },
          { name: 'NavLink', linkAttribute: 'to' },
        ],
        'import/resolver': {
          typescript: {},
        },
      },
    },

    {
    files: ['**/*.{ts,tsx}'],
    parser: '@typescript-eslint/parser',
    settings: {
      'import/internal-regex': '^~/',
      'import/resolver': {
        node: {
          extensions: ['.ts', '.tsx'],
        },
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },

  {
    files: ['.eslintrc.cjs'],
    env: {
      node: true,
    },
  },
  ],

  ignorePatterns: [
    '!**/.server',
    '!**/.client',
    'node_modules',
    'dist',
    'build',
    '__generated__',
    '.eslintrc.cjs',
    'scripts/*',
  ],
}
