type AuthUser = {
  id: string;
  name: string;
  email: string;
};

type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type ManagedUserResponse = {
  _id: string;
  ownerId: string;
  name: string;
  houseNumber: string;
  phoneNumber: string;
  expiryDate: string;
  createdAt?: string;
  updatedAt?: string;
};

const DEFAULT_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? DEFAULT_BASE_URL;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = data?.message ?? 'Request failed';
    throw new Error(message);
  }

  return data as T;
}

export async function signup(payload: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function login(payload: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function getMe(token: string): Promise<AuthUser> {
  return request<AuthUser>('/auth/me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getUsers(token: string): Promise<ManagedUserResponse[]> {
  return request<ManagedUserResponse[]>('/users', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createUser(
  token: string,
  payload: {
    name: string;
    houseNumber: string;
    phoneNumber: string;
    expiryDate: string;
  }
): Promise<ManagedUserResponse> {
  return request<ManagedUserResponse>('/users', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function updateUser(
  token: string,
  id: string,
  payload: Partial<{
    name: string;
    houseNumber: string;
    phoneNumber: string;
    expiryDate: string;
  }>
): Promise<ManagedUserResponse> {
  return request<ManagedUserResponse>(`/users/${id}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteUser(
  token: string,
  id: string
): Promise<{ message: string }> {
  return request<{ message: string }>(`/users/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
