module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended', // uses the recommended rules from the @typescript-eslint/eslint-plugin
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  ignorePatterns: [
    'dist',
  ],
  rules: {
    'quotes': ['warn', 'single'],
    'indent': ['warn', 2, { 'SwitchCase': 1 }],
    'linebreak-style': ['warn', 'unix'],
    'semi': ['warn', 'always'],
    'comma-dangle': ['warn', 'always-multiline'],
    'dot-notation': 'warn',
    'eqeqeq': 'warn',
    'curly': ['warn', 'all'],
    'brace-style': ['warn'],
    'prefer-arrow-callback': ['warn'],
    'max-len': ['warn', 140],
    'no-console': ['warn'], // use the provided Homebridge log method instead
    'lines-between-class-members': ['warn', 'always', {'exceptAfterSingleLine': true}],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off'
  },
};