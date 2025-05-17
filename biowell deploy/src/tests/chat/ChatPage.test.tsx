import { render, screen } from '@testing-library/react';
import { vi, expect, test, describe } from 'vitest';
import ChatPage from '../../pages/chat/ChatPage';
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

// Mock the ChatInterface component
vi.mock('../../components/chat/ChatInterface', () => ({
  default: () => <div data-testid="chat-interface">Chat Interface Mock</div>,
}));

describe('ChatPage Component', () => {
  test('renders chat page correctly', () => {
    render(
      <AuthContext.Provider value={mockAuthContext}>
        <ChatPage />
      </AuthContext.Provider>
    );

    expect(screen.getByText('AI Health Coach')).toBeInTheDocument();
    expect(screen.getByTestId('chat-interface')).toBeInTheDocument();
    expect(screen.getByText(/Always consult with healthcare professionals/)).toBeInTheDocument();
  });
});