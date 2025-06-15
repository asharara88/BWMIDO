# Biowell AI - Personal Digital Health Coach

[![Netlify Status](https://api.netlify.com/api/v1/badges/5239b3f1-f78c-4857-ad9d-ad1bb351d322/deploy-status)](https://app.netlify.com/projects/biowellai/deploys)

Biowell AI is a comprehensive digital health platform that connects your wearable devices, provides personalized health insights, and offers evidence-based supplement recommendations through an AI coach.

## Features

- **Personal Health Dashboard**: View your health score and metrics from connected wearable devices
- **AI Health Coach**: Chat with an AI powered by OpenAI to get personalized health advice
- **Supplement Recommendations**: Receive custom supplement suggestions based on your health data
- **Onboarding Quiz**: Detailed health assessment to personalize your experience
- **Wearable Integration**: Connect with Apple Health, Oura Ring, Garmin, and more
- **Subscription Management**: Subscribe to recommended supplements for monthly delivery

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Framer Motion
- **Backend**: Supabase (Authentication, Database, Realtime)
- **Serverless**: Supabase Edge Functions for OpenAI proxy
- **Payments**: Stripe integration (stub for subscription handling)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account
- OpenAI API key (for AI coach functionality)
- Stripe account (for payment processing)

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/yourusername/biowell-ai.git
cd biowell-ai
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example` and fill in your API keys:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
VITE_SUPABASE_SERVICE_ROLE_SECRET=your-service-role-secret
OPENAI_API_KEY=your-openai-api-key
VITE_OPENAI_KEY=your-openai-key
VITE_ELEVENLABS_API_KEY=your-elevenlabs-key
VITE_GITHUB_TOKEN=your-github-token
VITE_STACKBLITZ_API_KEY=your-stackblitz-key
VITE_CAPTCHA_SECRET_KEY=your-captcha-secret
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
SENTRY_DSN=your-sentry-dsn
```

4. Start the development server:

```bash
npm run dev
```

### Supabase Setup

1. Create a new Supabase project
2. Run the SQL migrations from the `supabase/migrations` folder
3. Set up authentication with email/password
4. Deploy the Edge Function for OpenAI proxy:

```bash
supabase functions deploy openai-proxy
```

5. Set the OpenAI API key as a secret:

```bash
supabase secrets set OPENAI_API_KEY=your-openai-api-key

7. Configure Sentry for error monitoring:

```bash
supabase secrets set SENTRY_DSN=your-sentry-dsn
```
```

6. If you see `service not healthy` errors when starting Supabase, run `supabase start` to launch a local Supabase stack.

### Health Check

Deploy the `health-check` function to enable uptime monitoring:

```bash
supabase functions deploy health-check
```

You can then query `/functions/v1/health-check` to verify the API status.

## Project Structure

```
/components      // UI components 
/contexts        // React context providers
/hooks          // Custom React hooks
/pages          // Application pages
/supabase       // Supabase-related files
  /functions    // Edge Functions 
  /migrations   // SQL migration files
/utils          // Utility functions
```
## Deployment

This project is continuously deployed to [Netlify](https://www.netlify.com/) using the configuration in `netlify.toml`. Every push to `main` triggers a Netlify build and deploy. There is no Vercel integration.


### Linting, Type Checking and Testing

Run ESLint to check the codebase:

```bash
npm run lint
```

Run TypeScript for type checking:

```bash
npx tsc --noEmit
```

Run the test suite using Vitest:

```bash
npm run test -- --run
```

The CI workflow runs these checks automatically on every push and pull request.

## Testing

The project currently does not include automated tests. Running `npm run test` will
output a placeholder message and exit with status code `1`:

```bash
npm run test
# => "Error: no test specified"
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
Automatic dependency updates are handled by Dependabot.
