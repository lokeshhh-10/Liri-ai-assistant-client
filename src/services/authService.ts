const API_BASE = '/api';

async function apiRequest(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    credentials: 'include', // send cookies automatically
    ...options,
  });
  return res.json();
}

export const loginApi = (username: string, password: string) =>
  apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

export const logoutApi = () =>
  apiRequest('/auth/logout', { method: 'POST' });

export const checkAuthApi = () =>
  apiRequest('/auth/me');
