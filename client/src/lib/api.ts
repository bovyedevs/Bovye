const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:2000/api';

function getToken(): string | null {
  return localStorage.getItem('bovye-token');
}

function setToken(token: string): void {
  localStorage.setItem('bovye-token', token);
}

function clearToken(): void {
  localStorage.removeItem('bovye-token');
}

interface ApiOptions extends RequestInit {
  requireAuth?: boolean;
}

async function api<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { requireAuth = true, headers = {}, ...rest } = options;

  const init: RequestInit = {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(requireAuth && getToken() ? { Authorization: `Bearer ${getToken()}` } : {}),
      ...headers,
    },
  };

  let lastError: Error | null = null;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const response = await fetch(`${API_BASE}${endpoint}`, init);

      if (response.status === 401) {
        clearToken();
        window.dispatchEvent(new CustomEvent('auth:logout'));
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      if (response.status === 204) return {} as T;
      return response.json();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Network error');
      if (attempt === 1) {
        await new Promise((r) => setTimeout(r, 500));
      }
    }
  }

  throw lastError ?? new Error('Network error');
}

export const apiClient = {
  get: <T>(endpoint: string) => api<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body: unknown) => api<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: unknown) => api<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: unknown) => api<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  del: <T>(endpoint: string) => api<T>(endpoint, { method: 'DELETE' }),
  getToken,
  setToken,
  clearToken,
};
