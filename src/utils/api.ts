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
  title: string;
  isDone: boolean;
  createdAt: string;
  userId: string;
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

async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('authToken'); // We assume the token is stored in localStorage after login
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`/api${endpoint}`, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
    throw new Error(errorData.message || 'API request failed');
  }

  // Handle responses that don't have content (e.g., DELETE requests)
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// ==================================
// AUTH API
// ==================================
// Backend should return: { user: User, token: string }
export const login = (email, password) => apiFetch('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password }),
});

// Backend should return: { user: User, token: string }
export const register = (name, email, password) => apiFetch('/auth/register', {
  method: 'POST',
  body: JSON.stringify({ name, email, password }),
});

// Backend should return: User
export const getMe = () => apiFetch('/auth/me');


// ==================================
// TODOS API
// ==================================
// Backend should return: Todo[]
export const getTodos = (): Promise<Todo[]> => apiFetch('/todos');

// Backend should return: Todo (the newly created one)
export const createTodo = (title: string): Promise<Todo> => apiFetch('/todos', {
  method: 'POST',
  body: JSON.stringify({ title }),
});

// Backend should return: Todo (the updated one)
export const updateTodo = (id: string, updates: Partial<Pick<Todo, 'title' | 'isDone'>>): Promise<Todo> => apiFetch(`/todos/${id}`, {
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