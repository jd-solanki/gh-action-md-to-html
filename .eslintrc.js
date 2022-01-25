module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 13,
    sourceType: 'module',
  },
  rules: {
    semi: ['error', 'never'],
    'max-len': 'off',
    'arrow-parens': ['error', 'as-needed'],
  },
}