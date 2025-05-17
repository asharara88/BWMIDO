import { useState, useEffect } from 'react';
import { runDiagnostics } from '../utils/diagnostics';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

const DiagnosticsPage = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiagnostics = async () => {
      try {
        setLoading(true);
        const diagnosticResults = await runDiagnostics();
        setResults(diagnosticResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Diagnostics error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnostics();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">System Diagnostics</h1>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-3 text-lg">Running diagnostics...</span>
        </div>
      ) : error ? (
        <div className="rounded-lg bg-error/10 p-4 text-error">
          <h2 className="mb-2 font-semibold">Error Running Diagnostics</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result, index) => (
            <div 
              key={index} 
              className={`rounded-lg border p-4 ${
                result.status === 'ok' 
                  ? 'border-success/20 bg-success/5' 
                  : 'border-error/20 bg-error/5'
              }`}
            >
              <div className="flex items-center">
                {result.status === 'ok' ? (
                  <CheckCircle className="mr-3 h-6 w-6 text-success" />
                ) : (
                  <XCircle className="mr-3 h-6 w-6 text-error" />
                )}
                <div>
                  <h3 className={`font-semibold ${
                    result.status === 'ok' ? 'text-success' : 'text-error'
                  }`}>
                    {result.service}
                  </h3>
                  <p className="text-text-light">{result.message}</p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="mt-8 rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-4">
            <h2 className="mb-4 font-semibold">Environment Variables</h2>
            <pre className="overflow-x-auto rounded-lg bg-[hsl(var(--color-surface-1))] p-4 text-sm">
              <code>
                VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL ? '✓ Set' : '✗ Missing'}{'\n'}
                VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing'}
              </code>
            </pre>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-text-light">
              If you're experiencing issues, please ensure your .env file is properly configured and that the Supabase Edge Functions are deployed.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticsPage;