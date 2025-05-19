let js, globals, reactHooks, reactRefresh, tseslint;
try {
  js = (await import('@eslint/js')).default;
  globals = (await import('globals')).default;
  reactHooks = (await import('eslint-plugin-react-hooks')).default;
  reactRefresh = (await import('eslint-plugin-react-refresh')).default;
  tseslint = (await import('typescript-eslint')).default;
} catch {
  console.warn('ESLint dependencies missing, using minimal config');
  export default [
    {
      ignores: ['dist'],
      files: ['**/*.{js,jsx,ts,tsx}'],
      languageOptions: { ecmaVersion: 2020 },
      rules: {},
    },
  ];
}

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
);
