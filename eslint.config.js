export default async function () {
  try {
    const js = (await import('@eslint/js')).default;
    const globals = (await import('globals')).default;
    const reactHooks = (await import('eslint-plugin-react-hooks')).default;
    const reactRefresh = (await import('eslint-plugin-react-refresh')).default;
    const tseslint = (await import('typescript-eslint')).default;

    return tseslint.config(
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
  } catch {
    const globals = (await import('globals')).default;
    const reactHooks = (await import('eslint-plugin-react-hooks')).default;
    const reactRefresh = (await import('eslint-plugin-react-refresh')).default;

    return [
      {
        ignores: ['dist'],
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
      },
    ];
  }
}
