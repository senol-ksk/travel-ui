import prettier from 'eslint-plugin-prettier'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pluginQuery from '@tanstack/eslint-plugin-query'

import { FlatCompat } from '@eslint/eslintrc'
import { Linter } from 'eslint'
import { globalIgnores } from 'eslint/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const configs = [
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
  ...pluginQuery.configs['flat/recommended'],
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'prettier'),
  {
    plugins: {
      prettier,
    },

    rules: {
      'prettier/prettier': 'error',
      'no-debugger': 'error',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
  globalIgnores(['.lintstagedrc.js']),
]

export default configs
