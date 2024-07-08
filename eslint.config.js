import globals from 'globals'
import js from '@eslint/js'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-plugin-prettier/recommended'
// import babelParser from '@babel/eslint-parser'

export default [
  js.configs.recommended,
  prettierConfig,
  {
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
    },
    plugins: {
      prettier: prettierPlugin
    },
    languageOptions: {
      // parser: babelParser,
      sourceType: 'module',
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.mocha
      }
    },
    ignores: [
      'node_modules/*',
      'dist/*',
    ]
  }
]
