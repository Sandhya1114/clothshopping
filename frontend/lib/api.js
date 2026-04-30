const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

function buildUrl(path, params = {}) {
  const url = new URL(`${API_BASE_URL}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
}

function getAuthHeaders() {
  if (typeof window === 'undefined') {
    return {};
  }

  const token = window.localStorage.getItem('northstitch-auth-token');

  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchJson(path, options = {}, params) {
  const response = await fetch(buildUrl(path, params), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...(options.headers || {})
    },
    cache: 'no-store'
  });

  const data = await response.json().catch(() => ({
    success: false,
    message: 'Unable to parse server response'
  }));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export function getProducts(params = {}) {
  return fetchJson('/products', {}, params);
}

export function getProduct(id) {
  return fetchJson(`/products/${id}`);
}

export function getCategories() {
  return fetchJson('/categories');
}

export function createOrder(payload) {
  return fetchJson('/orders', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function signup(payload) {
  return fetchJson('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function login(payload) {
  return fetchJson('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function getCurrentUser() {
  return fetchJson('/auth/me');
}
