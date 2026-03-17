import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './Login';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/client';

jest.mock('../api/client');

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

beforeEach(() => {
  const mockLogin = jest.fn();
  useAuth.mockReturnValue({ login: mockLogin, token: null });
});

test('renders login form', () => {
  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});

test('successful login calls login() with token', async () => {
  const mockLogin = jest.fn();
  useAuth.mockReturnValue({ login: mockLogin, token: null });
  apiClient.post.mockResolvedValue({ data: { accessToken: 'fake-token' } });

  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(mockLogin).toHaveBeenCalledWith('fake-token');
  });
});

test('failed login displays error message', async () => {
  apiClient.post.mockRejectedValue({
    response: { data: { message: 'Invalid email or password' } },
  });

  render(
    <MemoryRouter>
      <LoginPage />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
  fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
  fireEvent.click(screen.getByRole('button', { name: /login/i }));

  await waitFor(() => {
    expect(screen.getByText('Invalid email or password')).toBeInTheDocument();
  });
});
