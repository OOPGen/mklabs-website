import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'

export default [
  { ignores: ['dist', 'dist-server', '.wrangler'] },

  // the React app
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      // JSX identifiers count as used; capitalised names are components
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
    },
  },

  // Cloudflare Pages Functions (Workers runtime)
  {
    files: ['functions/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.serviceworker, ...globals.es2024 },
    },
    rules: js.configs.recommended.rules,
  },

  // build scripts, config and tests run in Node
  {
    files: ['scripts/**/*.js', 'tests/**/*.js', '*.config.js'],
    languageOptions: { ecmaVersion: 'latest', sourceType: 'module', globals: globals.node },
    rules: js.configs.recommended.rules,
  },

  // runs as a classic script before the app loads
  {
    files: ['public/theme.js'],
    languageOptions: { ecmaVersion: 2015, sourceType: 'script', globals: globals.browser },
    // ES2015 has no bare `catch {}`, so the unused binding is unavoidable
    rules: { ...js.configs.recommended.rules, 'no-unused-vars': ['error', { caughtErrors: 'none' }] },
  },
]
