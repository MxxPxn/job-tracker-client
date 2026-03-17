import axios from 'axios';

// In-memory access token — lives here so the interceptor can read it
// without needing React context. AuthContext calls setAccessToken on login/logout/refresh.
let accessToken = null;

export const setAccessToken = (token) => { accessToken = token; };

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // sends the httpOnly refreshToken cookie on every request
});

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// Queue of requests that arrived while a token refresh was in flight
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

apiClient.interceptors.response.use(null, async (error) => {
  const originalRequest = error.config;

  // Auth routes handle their own 401s (login/register error messages)
  if (originalRequest.url?.includes('/auth/')) {
    return Promise.reject(error);
  }

  if (error.response?.status === 401 && !originalRequest._retry) {
    // If a refresh is already in flight, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return apiClient(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await apiClient.post('/auth/refresh');
      const newToken = res.data.accessToken;
      setAccessToken(newToken);
      processQueue(null, newToken);
      originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      setAccessToken(null);
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }

  return Promise.reject(error);
});

export default apiClient;
