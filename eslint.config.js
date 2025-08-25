module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
    project: ["tsconfig.json"],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: [
    "/build/**/*", // Ignore built files.
    "/.firebase/**/*",
    "/src/__tests__postman/**/*",
  ],
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier' , 'import'],
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  rules: {
    'prettier/prettier': ['off'],
    'react/react-in-jsx-scope': 'off', // Se usar React 17+
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/no-explicit-any': 'off',
    'react-hooks/exhaustive-deps': 'off',

    // "quotes": ["error", "double"],
    // "max-len": ["error", {"code": 240}],
    // "require-jsdoc": "off",
    // "@typescript-eslint/ban-ts-comment": "off",
    // "camelcase": "off",
    // "no-extend-native": "off",
    // "linebreak-style": ["error", "unix"], // 'unix' = LF, 'windows' = CRLF
  },
};
