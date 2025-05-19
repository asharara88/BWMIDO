export default [
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['dist', 'biowell deploy', 'biowell version 2'],
    languageOptions: {
      parserOptions: { ecmaVersion: 2020, sourceType: 'module' },
    },
    rules: {},
  },
];
