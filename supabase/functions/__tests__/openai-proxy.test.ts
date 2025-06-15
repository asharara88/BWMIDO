import { handleRequest } from '../openai-proxy/index';
import { describe, it, expect, beforeEach } from 'vitest';

// Mock minimal global Deno
beforeEach(() => {
  // @ts-ignore
  globalThis.Deno = {
    env: {
      get: (key: string) => {
        if (key === 'SUPABASE_URL') return 'http://localhost';
        if (key === 'SUPABASE_SERVICE_ROLE_KEY') return 'key';
        if (key === 'OPENAI_API_KEY') return 'openai';
        return '';
      },
    },
  } as any;
});

describe('openai-proxy', () => {
  it('returns 200 with echo response', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ content: 'hi' }] }),
    });
    const res = await handleRequest(req);
    expect(res.status).toBe(200);
  });
});
