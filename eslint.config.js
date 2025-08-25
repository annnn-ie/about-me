import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    files: ['**/*.css'],
    languageOptions: {
      parser: null, // Disable parser for CSS files
    },
    rules: {
      // Disable CSS linting rules that conflict with Tailwind
      'no-invalid-position-at-import-rule': 'off',
      'no-unknown-animations': 'off',
      'no-unknown-custom-media-queries': 'off',
      'no-unknown-custom-properties': 'off',
      'no-unknown-pseudo-class-selectors': 'off',
      'no-unknown-pseudo-element-selectors': 'off',
      'no-unknown-units': 'off',
      'no-unknown-vendored-properties': 'off',
      'no-unknown-vendored-pseudo-elements': 'off',
      'no-unknown-vendored-pseudo-classes': 'off',
      'no-unknown-vendored-property-values': 'off',
      'no-unknown-vendored-units': 'off',
      'no-unknown-vendored-functions': 'off',
      'no-unknown-vendored-at-rules': 'off',
      'no-unknown-at-rules': 'off',
    },
  },
])
