import { handleRequest } from '../metrics-advice/index';
import { describe, it, expect, beforeEach, vi } from 'vitest';

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

  vi.stubGlobal('fetch', async (input: RequestInfo) => {
    const url = typeof input === 'string' ? input : input instanceof Request ? input.url : '';
    if (url.includes('openai.com')) {
      return new Response(
        JSON.stringify({ choices: [{ message: { content: 'ok' } }] }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    // supabase response
    return new Response(
      JSON.stringify({ data: { sleep_hours: 7, deep_sleep_minutes: 90, daily_steps: 10000, calories_burned: 2000, bmi: 23, activity_goal: 'Lose weight' }, error: null }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  });
});

describe('metrics-advice', () => {
  it('returns 200 with a reply', async () => {
    const req = new Request('http://localhost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: '1', userQuestion: 'Hi?' }),
    });

    const res = await handleRequest(req);
    expect(res.status).toBe(200);
  });
});
