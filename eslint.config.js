export default (async () => {
  try {
    const { default: js } = await import('@eslint/js');
    const globalsMod = await import('globals');
    const globals = globalsMod.default ?? globalsMod;
    const { default: reactHooks } = await import('eslint-plugin-react-hooks');
    const { default: reactRefresh } = await import('eslint-plugin-react-refresh');
    const tseslintMod = await import('typescript-eslint');
    const tseslint = tseslintMod.default ?? tseslintMod;

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
  } catch (err) {
    console.warn('Falling back to minimal ESLint config:', err.message);
    return [
      {
        ignores: ['dist', '**/*.ts', '**/*.tsx'],
      },
      {
        files: ['**/*.js', '**/*.jsx'],
        languageOptions: {
          ecmaVersion: 2020,
        },
      },
    ];
  }
})();
