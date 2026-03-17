import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

beforeEach(() => {
  localStorage.clear();
});

test('login stores token', () => {
  const { result } = renderHook(() => useAuth(), { wrapper });
  
  act(() => {
    result.current.login('test-token');
  });

  expect(result.current.token).toBe('test-token');
  expect(localStorage.getItem('token')).toBe('test-token');
});

test('logout clears token', () => {
  const { result } = renderHook(() => useAuth(), { wrapper });
  
  act(() => {
    result.current.login('test-token');
    result.current.logout();
  });

  expect(result.current.token).toBeNull();
  expect(localStorage.getItem('token')).toBeNull();
});

test('initializes with token from localStorage', () => {
  localStorage.setItem('token', 'stored-token');
  const { result } = renderHook(() => useAuth(), { wrapper });
  
  expect(result.current.token).toBe('stored-token');
});
