const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000/api';

export function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('hiremind_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers });
  
  if (!response.ok) {
    let errorMessage = 'An error occurred during API call';
    try {
      const errData = await response.json();
      if (errData.detail) {
        errorMessage = typeof errData.detail === 'string' ? errData.detail : JSON.stringify(errData.detail);
      }
    } catch {
      // Use fallback error message
    }
    throw new Error(errorMessage);
  }

  return response.json();
}
