import { expect, test, describe, beforeEach, vi } from 'vitest';
import { sendChatMessage } from '../../utils/openai';

// Mock fetch
global.fetch = vi.fn();

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
  createClient: () => ({
    from: () => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    }),
  }),
}));

describe('OpenAI Chat Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('successfully sends message and receives response', async () => {
    const mockResponse = {
      choices: [
        {
          message: {
            content: 'AI response',
          },
        },
      ],
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const response = await sendChatMessage('Hello', 'test-user-id');

    expect(response).toEqual({
      role: 'assistant',
      content: 'AI response',
      timestamp: expect.any(Date),
    });
  });

  test('handles network errors correctly', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network Error'));

    await expect(sendChatMessage('Hello', 'test-user-id'))
      .rejects
      .toThrow('Failed to send message after retries');
  });

  test('validates response format', async () => {
    const invalidResponse = {
      choices: [], // Empty choices array
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(invalidResponse),
    });

    await expect(sendChatMessage('Hello', 'test-user-id'))
      .rejects
      .toThrow('Invalid response format from AI');
  });

  test('handles rate limiting', async () => {
    // Mock rate limit response followed by successful response
    (global.fetch as any)
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: () => Promise.resolve({ error: 'rate limit exceeded' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          choices: [{ message: { content: 'Success after retry' } }],
        }),
      });

    const response = await sendChatMessage('Hello', 'test-user-id');
    expect(response.content).toBe('Success after retry');
  });

  test('sends correct request payload', async () => {
    const mockResponse = {
      choices: [{ message: { content: 'Response' } }],
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    await sendChatMessage('Test message', 'test-user-id');

    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/functions/v1/openai-proxy'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': expect.stringContaining('Bearer'),
        }),
        body: expect.stringContaining('Test message'),
      })
    );
  });
});