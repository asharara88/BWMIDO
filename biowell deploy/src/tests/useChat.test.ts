import { renderHook, act } from '@testing-library/react';
import { vi, expect, test, describe, beforeEach } from 'vitest';
import { useChat } from '../hooks/useChat';
import { sendChatMessage } from '../utils/openai';

// Mock the contexts
vi.mock('../contexts/SupabaseContext', () => ({
  useSupabase: () => ({
    supabase: {
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: null }),
      }),
    },
  }),
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' },
    isDemo: false,
  }),
}));

// Mock the OpenAI utility
vi.mock('../utils/openai', () => ({
  sendChatMessage: vi.fn().mockImplementation((message) => 
    Promise.resolve({
      role: 'assistant',
      content: `Response to: ${message}`,
      timestamp: new Date(),
    })
  ),
}));

describe('useChat hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should initialize with empty messages', () => {
    const { result } = renderHook(() => useChat());
    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test('should add user message when sending', async () => {
    const { result } = renderHook(() => useChat());
    const message = 'Hello AI';

    await act(async () => {
      await result.current.sendMessage(message);
    });

    expect(result.current.messages[0]).toEqual({
      role: 'user',
      content: message,
      timestamp: expect.any(Date),
    });

    expect(result.current.messages[1]).toEqual({
      role: 'assistant',
      content: `Response to: ${message}`,
      timestamp: expect.any(Date),
    });
  });

  test('should handle API errors', async () => {
    vi.mocked(sendChatMessage).mockRejectedValueOnce(new Error('API error'));

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage('Hello AI');
    });

    expect(result.current.error).toBe('API error');
    expect(result.current.messages).toHaveLength(1); // Only user message
  });

  test('should clear messages', async () => {
    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage('Hello AI');
    });

    expect(result.current.messages).toHaveLength(2);

    act(() => {
      result.current.clearMessages();
    });

    expect(result.current.messages).toHaveLength(0);
  });

  test('should prevent sending empty messages', async () => {
    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage('');
    });

    expect(result.current.messages).toHaveLength(0);
  });
});