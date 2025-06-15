codex/fix-onboarding-index-and-protectedroute-import-path
export default [
  {
    files: ['**/*.js'],
    languageOptions: { ecmaVersion: 2020, globals: {} },
  },
];
=======
let globals;
let reactHooks;
let reactRefresh;
let js;
let tseslint;

try {
  globals = (await import('globals')).default;
  reactHooks = await import('eslint-plugin-react-hooks');
  reactRefresh = await import('eslint-plugin-react-refresh');
  js = await import('@eslint/js');
  tseslint = await import('typescript-eslint');
} catch {
  // Optional dependencies weren't installed. Fallback to minimal config.
}

const baseConfig = [
  {
    ignores: ['dist', 'biowell deploy/**', '*.zip', 'tmp/**'],
  },
  ...(
    tseslint && reactHooks && reactRefresh && globals
      ? tseslint.config(
          {
            files: ['**/*.{ts,tsx}'],
            languageOptions: {
              ecmaVersion: 2020,
              globals: globals.browser,
            },
          },
          {
            extends: [js.configs.recommended, ...tseslint.configs.recommended],
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
        )
      : [
          {
            files: ['**/*.{ts,tsx}'],
            languageOptions: {
              ecmaVersion: 2020,
            },
          },
        ]
  ),
];

export default baseConfig;

main
