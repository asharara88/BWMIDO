# AGENTS.md

This repository is a TypeScript + React wellness platform called **Biowell**, powered by Supabase, Vite, and OpenAI.

## ✅ Environment Setup

```bash
npm install
```

> ⚠️ *Note: In restricted network environments, **`** or **`** may hang due to lockfile or registry access issues. If so, skip install and continue with linting using pre-existing **\`\`**.*
>
> If installation fails due to network restrictions (e.g., `EHOSTUNREACH`), you may create a dummy folder:
>
> ```bash
> mkdir -p node_modules/.stub
> ```
>
> This will allow Codex and agents to assume dependencies are present.

## 🧪 Linting

The ESLint config supports dynamic imports. If key packages cannot be resolved (e.g., `@eslint/js`, `typescript-eslint`), the config falls back to a minimal ruleset that avoids TypeScript errors. This ensures linting still runs offline.

The project uses ESLint with Flat Config and TypeScript support.

```bash
npm run lint
```

This runs:

```bash
eslint . --ext .ts,.tsx --report-unused-disable-directives --max-warnings 0
```

If online, the config includes:

* `@eslint/js`
* `@typescript-eslint/parser`
* `@typescript-eslint/eslint-plugin`

> 🧩 Offline fallback:
>
> * If `@eslint/js` or `typescript-eslint` cannot be installed, fallback to the minimal ESLint config.
> * `package-lock.json` may reflect failed install attempts during offline sessions.
> * Codex will attempt to lint using Flat Config even if network errors occur.

## 🧪 Test Placeholder (Offline Safe)

The `test` script is a placeholder for now and will exit with an error, as expected. It exists to maintain compatibility with tooling like Codex.

```bash
npm run test
```

Current behavior:

```bash
echo "Error: no test specified" && exit 1
```

> 🔒 Offline-safe: This will not break your terminal in a no-network condition.

## 🔐 CodeQL

Configured to analyze JavaScript and TypeScript:

```yaml
matrix:
  include:
    - language: javascript-typescript
      build-mode: none
```

Workflow file: `.github/workflows/codeql.yml`

## 🧩 Key Modules

* `App.tsx`: Entry point. Uses `ProtectedRoute` component for auth gating and explicit `JSX.Element` return type. Inline auth logic removed.
* `ProtectedRoute.tsx`: Central auth gate using `useSaveRedirect` and context state. Handles redirect persistence, loading UI, and guards. **Ensure the import in **\`\`** is:**

```ts
import ProtectedRoute from './components/auth/ProtectedRoute';
```

* `useSaveRedirect.tsx`: Saves redirect intent for unauthenticated users using a dependency-aware `useEffect`.
* `useSupplementFilter.ts`: Reusable array filtering hook with `useMemo`.
* `ChatPage.tsx`, `TextInputBlock.tsx`: Stateless AI input interface with error boundary and debounce handling.
* `contexts/`: Includes all major providers — `SupabaseContext.tsx`, `AuthContext.tsx`, `ThemeContext.tsx`.

## 🧭 Onboarding Flow

> 🧠 UX Optimization: Each onboarding step uses a conversational design with multiple-choice buttons. If the user's preferred answer isn't listed, an **"Other"** button allows them to type their custom input. Codex agents should render these as button blocks first, then conditionally show a text field when 'Other' is selected.

* `OnboardingPage.tsx`: Dynamically renders steps using a `steps` array config and a `stepIndex` state.
* Each step is modular and lives in `src/pages/onboarding/steps/`
* Step components include:

  * `WelcomeStep`
  * `PersonalInfoStep`
  * `HealthGoalsStep`
  * `LifestyleStep`
  * `WearablesStep`
  * `CompletionStep`

Each step:

* Accepts `onNext()`, `onBack()` props
* Shares progress via lifted state (`formState`, `stepIndex`)
* Renders based on index or routing context

Example scaffold logic in `OnboardingPage.tsx`:

```tsx
import { useState } from 'react';
import steps from './steps/config'; // array of components

const OnboardingPage = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [formState, setFormState] = useState({});
  const Step = steps[stepIndex];

  const handleNext = (data) => {
    setFormState((prev) => ({ ...prev, ...data }));
    setStepIndex((i) => i + 1);
  };

  const handleBack = () => setStepIndex((i) => i - 1);

  return <Step onNext={handleNext} onBack={handleBack} formState={formState} />;
};
```

> ✅ Codex agents should treat each onboarding step as a self-contained component managed via the `steps[]` config and driven by `stepIndex`.

## 🧱 Onboarding Steps Config

File: `src/pages/onboarding/steps/config.ts`

```ts
import WelcomeStep from './WelcomeStep';
import PersonalInfoStep from './PersonalInfoStep';
import HealthGoalsStep from './HealthGoalsStep';
import LifestyleStep from './LifestyleStep';
import WearablesStep from './WearablesStep';
import CompletionStep from './CompletionStep';

export default [
  WelcomeStep,
  PersonalInfoStep,
  HealthGoalsStep,
  LifestyleStep,
  WearablesStep,
  CompletionStep,
];
```

> Each of these files should be modular React components accepting `onNext`, `onBack`, and `formState` props. Codex should generate or complete each one as needed.

## ⚙️ Dev Commands

```bash
npm install     # setup (may hang if network-blocked)
npm run dev     # start Vite
npm run lint    # validate codebase
npm run test    # safe placeholder
```

## 🧠 Agent Notes

* Project will run without a fresh install if `node_modules` exists
* Lint and test scripts are safe for offline use
* ESLint uses Flat Config (not `.eslintrc`)
* Entry file: `src/App.tsx`, which imports `ProtectedRoute`
* `ProtectedRoute` is no longer defined inline
* This is a single-service repo, not monorepo
* If `npm install` fails, create `node_modules/.stub` to allow Codex and agents to continue
* Onboarding steps are modular and dynamically rendered
* Codex may scaffold or extend `OnboardingPage.tsx` using the `steps[]` array + `stepIndex` controller
* Codex may auto-complete `steps/config.ts` or step component logic based on usage

---

This file supports Codex / Copilot / LLM integration in restricted or offline environments.
