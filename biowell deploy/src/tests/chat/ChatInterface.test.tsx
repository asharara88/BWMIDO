import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, expect, test, describe, beforeEach } from 'vitest';
import ChatInterface from '../../components/chat/ChatInterface';
import { AuthContext } from '../../contexts/AuthContext';

// Mock the auth context
const mockAuthContext = {
  user: {
    id: 'test-user-id',
    email: 'test@example.com',
  },
  loading: false,
  isDemo: false,
};

// Mock the OpenAI utility
vi.mock('../../utils/openai', () => ({
  sendChatMessage: vi.fn().mockImplementation((message) => 
    Promise.resolve({
      role: 'assistant',
      content: `Response to: ${message}`,
      timestamp: new Date(),
    })
  ),
}));

describe('ChatInterface Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithAuth = (component: React.ReactNode) => {
    return render(
      <AuthContext.Provider value={mockAuthContext}>
        {component}
      </AuthContext.Provider>
    );
  };

  test('renders chat interface correctly', () => {
    renderWithAuth(<ChatInterface />);
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
  });

  test('handles message submission', async () => {
    const onMessageSent = vi.fn();
    
    renderWithAuth(<ChatInterface onMessageSent={onMessageSent} />);

    const input = screen.getByPlaceholderText('Type your message...');
    const submitButton = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Hello AI' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Hello AI')).toBeInTheDocument();
      expect(screen.getByText('Response to: Hello AI')).toBeInTheDocument();
      expect(onMessageSent).toHaveBeenCalled();
    });
  });

  test('displays loading state while waiting for response', async () => {
    renderWithAuth(<ChatInterface />);

    const input = screen.getByPlaceholderText('Type your message...');
    const submitButton = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(submitButton);

    expect(screen.getByRole('status')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  test('handles errors gracefully', async () => {
    vi.mocked(sendChatMessage).mockRejectedValueOnce(new Error('API Error'));

    renderWithAuth(<ChatInterface />);

    const input = screen.getByPlaceholderText('Type your message...');
    const submitButton = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to send message')).toBeInTheDocument();
    });
  });

  test('prevents empty message submission', () => {
    renderWithAuth(<ChatInterface />);

    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();

    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: '   ' } });
    expect(submitButton).toBeDisabled();
  });

  test('displays timestamps for messages', async () => {
    renderWithAuth(<ChatInterface />);

    const input = screen.getByPlaceholderText('Type your message...');
    const submitButton = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'Test message' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const timestamps = screen.getAllByText(/\d{1,2}:\d{2}:\d{2}/);
      expect(timestamps.length).toBe(2);
    });
  });
});