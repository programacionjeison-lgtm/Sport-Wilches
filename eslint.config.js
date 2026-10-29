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
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  // El backend corre en Node, no en el navegador: allí existen `process`
  // y otras variables globales de Node que el lint del browser no conoce.
  {
    files: ['backend/**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      // Parámetros que empiezan con "_" son "reservados por convención"
      // (Express exige la firma completa en los manejadores de errores,
      // aunque dentro no se use el parámetro)
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
])
