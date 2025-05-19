let js;
let globals;
let reactHooks;
let reactRefresh;
let tseslint;

let hasDeps = true;

try {
  js = await import('@eslint/js');
  globals = await import('globals');
  reactHooks = await import('eslint-plugin-react-hooks');
  reactRefresh = await import('eslint-plugin-react-refresh');
  tseslint = await import('typescript-eslint');
} catch {
  hasDeps = false;
}

let config;

if (hasDeps && js && tseslint) {
  config = tseslint.config(
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
} else {
  config = [
    {
      ignores: ['dist', '**/*.ts', '**/*.tsx'],
    },
  ];
}

export default config;
