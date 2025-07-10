module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {jsx: true},
  },
  plugins: [
    'react',
    'react-native',
    '@typescript-eslint',
    'prettier',
    'import',
    'nativewind',
  ],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  rules: {
    'prettier/prettier': ['error'],
    'react/react-in-jsx-scope': 'off',
    'react-native/no-inline-styles': 'off',
    'import/order': ['warn', {'newlines-between': 'always'}],
  },
  settings: {
    react: {version: 'detect'},
  },
};
