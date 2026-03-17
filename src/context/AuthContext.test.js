import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import apiClient, { setAccessToken } from '../api/client';

jest.mock('../api/client', () => ({
  __esModule: true,
  default: { post: jest.fn() },
  setAccessToken: jest.fn(),
}));

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

beforeEach(() => {
  jest.clearAllMocks();
});

test('restores session when refresh cookie is valid', async () => {
  apiClient.post.mockResolvedValueOnce({ data: { accessToken: 'refreshed-token' } });

  const { result } = renderHook(() => useAuth(), { wrapper });

  await waitFor(() => {
    expect(result.current.token).toBe('refreshed-token');
  });

  expect(setAccessToken).toHaveBeenCalledWith('refreshed-token');
});

test('starts with null token when no refresh cookie', async () => {
  apiClient.post.mockRejectedValueOnce(new Error('No cookie'));

  const { result } = renderHook(() => useAuth(), { wrapper });

  await waitFor(() => expect(result.current).not.toBeNull());

  expect(result.current.token).toBeNull();
});

test('login() sets token in state', async () => {
  apiClient.post.mockRejectedValueOnce(new Error('No cookie'));

  const { result } = renderHook(() => useAuth(), { wrapper });

  await waitFor(() => expect(result.current).not.toBeNull());

  act(() => {
    result.current.login('new-token');
  });

  expect(result.current.token).toBe('new-token');
  expect(setAccessToken).toHaveBeenCalledWith('new-token');
});

test('logout() clears token and calls /auth/logout', async () => {
  apiClient.post
    .mockResolvedValueOnce({ data: { accessToken: 'refreshed-token' } }) // mount refresh
    .mockResolvedValueOnce({}); // logout

  const { result } = renderHook(() => useAuth(), { wrapper });

  await waitFor(() => expect(result.current.token).toBe('refreshed-token'));

  await act(async () => {
    await result.current.logout();
  });

  expect(result.current.token).toBeNull();
  expect(setAccessToken).toHaveBeenCalledWith(null);
  expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
});
