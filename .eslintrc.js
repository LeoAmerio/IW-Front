module.exports = {
  root: true,
  // Specify environments
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  // Specify parser for TypeScript
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  // Extend from recommended configs
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  // Specify plugins
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  // Custom rules
  rules: {
    'react/react-in-jsx-scope': 'off', // Not needed in Next.js
    'react/prop-types': 'off', // Not needed with TypeScript
  },
  // Next.js specific settings
  settings: {
    react: {
      version: 'detect',
    },
    next: {
      rootDir: '.',
    },
  },
  // Ignore patterns
  ignorePatterns: [
    'node_modules/',
    '.next/',
    'out/',
    'public/',
    '**/*.d.ts',
  ],
};

