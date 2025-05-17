import { motion } from 'framer-motion';
import DiagnosticsPanel from '../../components/diagnostics/DiagnosticsPanel';
import { Activity, MessageCircle, Database, Zap } from 'lucide-react';

const SystemDiagnosticsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold md:text-3xl">System Diagnostics</h1>
          <p className="text-text-light">
            Check the status of various system components and APIs
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <DiagnosticsPanel />
          </div>

          <div className="rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold">Chat System</h2>
            </div>
            <p className="mb-4 text-text-light">
              The chat system relies on Supabase Edge Functions to proxy requests to OpenAI's API. 
              This architecture keeps your API keys secure and allows for custom processing of messages.
            </p>
            <div className="rounded-lg bg-[hsl(var(--color-surface-1))] p-4">
              <h3 className="mb-2 text-sm font-medium">Troubleshooting Steps</h3>
              <ul className="space-y-2 text-sm text-text-light">
                <li>• Verify that the OpenAI Edge Function is deployed</li>
                <li>• Check that the OPENAI_API_KEY is set in Supabase</li>
                <li>• Ensure proper CORS configuration in the Edge Function</li>
                <li>• Verify authentication is working correctly</li>
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Database className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold">Database System</h2>
            </div>
            <p className="mb-4 text-text-light">
              Biowell uses Supabase for data storage, authentication, and real-time features. 
              The database contains tables for user profiles, health metrics, supplements, and more.
            </p>
            <div className="rounded-lg bg-[hsl(var(--color-surface-1))] p-4">
              <h3 className="mb-2 text-sm font-medium">Troubleshooting Steps</h3>
              <ul className="space-y-2 text-sm text-text-light">
                <li>• Verify Supabase URL and API key in environment variables</li>
                <li>• Check Row Level Security (RLS) policies</li>
                <li>• Ensure tables have proper foreign key relationships</li>
                <li>• Verify that triggers and functions are working</li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-xl bg-primary/10 p-3 text-primary">
                  <Activity className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-bold">System Health</h2>
              </div>
              <p className="mb-6 text-text-light">
                The overall system health depends on the proper functioning of all components. 
                If you're experiencing issues, check the diagnostics panel above for specific errors.
              </p>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-1))] p-4">
                  <h3 className="mb-2 text-sm font-medium">Frontend</h3>
                  <p className="text-sm text-text-light">
                    React application with TypeScript, TailwindCSS, and Framer Motion.
                    Deployed on Netlify.
                  </p>
                </div>
                
                <div className="rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-1))] p-4">
                  <h3 className="mb-2 text-sm font-medium">Backend</h3>
                  <p className="text-sm text-text-light">
                    Supabase provides authentication, database, storage, and serverless functions.
                  </p>
                </div>
                
                <div className="rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-1))] p-4">
                  <h3 className="mb-2 text-sm font-medium">AI Services</h3>
                  <p className="text-sm text-text-light">
                    OpenAI API for chat functionality, proxied through Supabase Edge Functions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SystemDiagnosticsPage;