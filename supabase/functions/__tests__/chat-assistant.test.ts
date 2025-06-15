import { handleRequest } from '../chat-assistant/index';
import { describe, it, expect, beforeEach } from 'vitest';

beforeEach(() => {
  // @ts-ignore
  globalThis.Deno = {
    env: {
      get: (key: string) => {
        if (key === 'SUPABASE_URL') return 'http://localhost';
        if (key === 'SUPABASE_SERVICE_ROLE_KEY') return 'key';
        return '';
      },
    },
  } as any;
});

describe('chat-assistant', () => {
  it('returns 200 with echo response', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: [{ content: 'hello' }] }),
    });
    const res = await handleRequest(req);
    expect(res.status).toBe(200);
  });
});
