// utils/api.ts

// ==================================
// TYPE DEFINITIONS
// ==================================
// These types should match the data structures your backend sends.

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Todo {
  id: string;
  task: string;
  completed: boolean;
  date: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  userId: string;
}

// ==================================
// API HELPER
// ==================================
// A helper function to streamline fetch requests.

async function apiFetch<T = void>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('authToken');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // ✅ Correctly prefix with the full backend URL
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? '';
  let response;
  try {
    response = await fetch(`${baseUrl}${endpoint}`, { ...options, headers });
  } catch (networkError) {
    console.error('Network error:', networkError);
    throw new Error('Network error: Could not reach the server.');
  }

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText || 'An unknown error occurred' };
    }
    console.error('API Error:', {
      endpoint,
      status: response.status,
      statusText: response.statusText,
      errorData,
    });
    throw new Error(errorData.message || `API request failed: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as unknown as T;
  }

  return response.json();
}


// ==================================
// AUTH API
// ==================================
// Backend should return: { user: User, token: string }
export const login = (email: string, password: string): Promise<{ user: User; token: string }> => apiFetch('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});

// Backend should return: { user: User, token: string }
export const register = (name: string, email: string, password: string): Promise<{ user: User; token: string }> => apiFetch('/auth/register', {
  method: 'POST',
  body: JSON.stringify({ name, email, password }),
});

// Backend should return: User
export const getMe = (): Promise<User> => apiFetch('/auth/me');

export const logout = async (): Promise<void> => {
  await apiFetch('/auth/logout', { method: 'POST' });
  localStorage.removeItem('authToken');
};


// ==================================
// TODOS API
// ==================================
// Backend should return: Todo[]
export const getTodos = (): Promise<Todo[]> => apiFetch('/todos');

// Backend should return: Todo (the newly created one)
export const createTodo = (task: string, date: string): Promise<Todo> => apiFetch('/todos', {
  method: 'POST',
  body: JSON.stringify({ task, date }),
});

// Backend should return: Todo (the updated one)
export const updateTodo = (id: string, updates: { task?: string; completed?: boolean; date?: string }): Promise<Todo> => apiFetch(`/todos/${id}`, {
  method: 'PUT',
  body: JSON.stringify(updates),
});

// Backend should return: 204 No Content
export const deleteTodo = (id: string): Promise<null> => apiFetch(`/todos/${id}`, {
  method: 'DELETE',
});


// ==================================
// JOURNAL API
// ==================================
// Backend should return: Omit<JournalEntry, 'content'>[] (a list without the full content)
export const getJournalEntries = (): Promise<Omit<JournalEntry, 'content'>[]> => apiFetch('/journal');

// Backend should return: JournalEntry (with full content)
export const getJournalEntry = (id: string): Promise<JournalEntry> => apiFetch(`/journal/${id}`);

// Backend should return: JournalEntry (the newly created one)
export const createJournalEntry = (title: string, content: string): Promise<JournalEntry> => apiFetch('/journal', {
  method: 'POST',
  body: JSON.stringify({ title, content }),
});

// Backend should return: JournalEntry (the updated one)
export const updateJournalEntry = (id: string, updates: Partial<Pick<JournalEntry, 'title' | 'content'>>): Promise<JournalEntry> => apiFetch(`/journal/${id}`, {
  method: 'PUT',
  body: JSON.stringify(updates),
});

// Backend should return: 204 No Content
export const deleteJournalEntry = (id: string): Promise<null> => apiFetch(`/journal/${id}`, {
  method: 'DELETE',
});

// ==================================
// SPECIAL DOWNLOAD API
// ==================================
// These are special and don't use apiFetch because they don't return JSON.

// Backend should return a file stream with 'Content-Disposition' header
export const downloadJournalEntryAsFile = async (id: string) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`/api/journal/download/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) throw new Error('Failed to download file.');

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  // The backend should ideally set the filename in the Content-Disposition header
  a.download = response.headers.get('x-filename') || 'entry.md';
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

// Backend should return a file stream with 'Content-Disposition' header
export const downloadJournalAsBookFile = async () => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`/api/journal/download/book`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });

  if (!response.ok) throw new Error('Failed to download file.');

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = response.headers.get('x-filename') || 'journal_book.md';
  document.body.appendChild(a);
a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};