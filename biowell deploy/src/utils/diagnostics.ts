import { createClient } from '@supabase/supabase-js';

export interface DiagnosticResult {
  service: string;
  status: 'ok' | 'error';
  message: string;
}

export function checkEnvironmentVariables(): { success: boolean; details: Record<string, boolean> } {
  const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
  const details: Record<string, boolean> = {};
  
  for (const varName of requiredVars) {
    details[varName] = !!import.meta.env[varName];
  }
  
  const success = Object.values(details).every(Boolean);
  
  return {
    success,
    details
  };
}

export async function runAllDiagnostics(): Promise<Record<string, any>> {
  const results: Record<string, any> = {};
  
  // Check environment variables
  const envVarCheck = checkEnvironmentVariables();
  if (!envVarCheck.success) {
    return {
      supabase: { success: false, message: 'Missing required environment variables' },
      openai: { success: false, message: 'Missing required environment variables' },
      chatHistory: { success: false, message: 'Missing required environment variables' }
    };
  }
  
  // Check Supabase connection
  try {
    const supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
    
    const { data, error } = await supabase.from('supplements').select('id').limit(1);
    
    results.supabase = {
      success: !error,
      message: error ? `Connection error: ${error.message}` : 'Successfully connected to Supabase',
      details: error ? error : { data }
    };
  } catch (error) {
    results.supabase = {
      success: false,
      message: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
      details: error
    };
  }
  
  // Check OpenAI proxy endpoint
  try {
    const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/openai-proxy`;
    const response = await fetch(functionUrl, {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    results.openai = {
      success: response.ok,
      message: response.ok ? 'OpenAI proxy endpoint is accessible' : `OpenAI proxy endpoint returned status ${response.status}`,
      details: { status: response.status, statusText: response.statusText }
    };
  } catch (error) {
    results.openai = {
      success: false,
      message: `Failed to access OpenAI proxy: ${error instanceof Error ? error.message : String(error)}`,
      details: error
    };
  }
  
  // Check chat history access
  try {
    const supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
    
    const { data, error } = await supabase.from('chat_history').select('id').limit(1);
    
    results.chatHistory = {
      success: !error,
      message: error ? `Chat history access error: ${error.message}` : 'Successfully accessed chat history',
      details: error ? error : { data }
    };
  } catch (error) {
    results.chatHistory = {
      success: false,
      message: `Unexpected error accessing chat history: ${error instanceof Error ? error.message : String(error)}`,
      details: error
    };
  }
  
  return results;
}

export async function runDiagnostics(): Promise<DiagnosticResult[]> {
  const results: DiagnosticResult[] = [];
  
  // Check environment variables
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    results.push({
      service: 'Environment',
      status: 'error',
      message: 'Missing Supabase environment variables. Check .env file.'
    });
  } else {
    results.push({
      service: 'Environment',
      status: 'ok',
      message: 'Supabase environment variables found.'
    });
  }
  
  // Check Supabase connection
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data, error } = await supabase.from('supplements').select('id').limit(1);
    
    if (error) {
      results.push({
        service: 'Supabase',
        status: 'error',
        message: `Connection error: ${error.message}`
      });
    } else {
      results.push({
        service: 'Supabase',
        status: 'ok',
        message: 'Successfully connected to Supabase.'
      });
    }
  } catch (error) {
    results.push({
      service: 'Supabase',
      status: 'error',
      message: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`
    });
  }
  
  // Check OpenAI proxy endpoint
  try {
    const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/openai-proxy`;
    const response = await fetch(functionUrl, {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (response.ok) {
      results.push({
        service: 'OpenAI Proxy',
        status: 'ok',
        message: 'OpenAI proxy endpoint is accessible.'
      });
    } else {
      results.push({
        service: 'OpenAI Proxy',
        status: 'error',
        message: `OpenAI proxy endpoint returned status ${response.status}`
      });
    }
  } catch (error) {
    results.push({
      service: 'OpenAI Proxy',
      status: 'error',
      message: `Failed to access OpenAI proxy: ${error instanceof Error ? error.message : String(error)}`
    });
  }
  
  // Check chat assistant endpoint
  try {
    const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-assistant`;
    const response = await fetch(functionUrl, {
      method: 'OPTIONS',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (response.ok) {
      results.push({
        service: 'Chat Assistant',
        status: 'ok',
        message: 'Chat assistant endpoint is accessible.'
      });
    } else {
      results.push({
        service: 'Chat Assistant',
        status: 'error',
        message: `Chat assistant endpoint returned status ${response.status}`
      });
    }
  } catch (error) {
    results.push({
      service: 'Chat Assistant',
      status: 'error',
      message: `Failed to access chat assistant: ${error instanceof Error ? error.message : String(error)}`
    });
  }
  
  return results;
}