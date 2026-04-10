const BASE = 'http://localhost:8000'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (res.status === 204) return null
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || 'Request failed')
  }
  return res.json()
}

export const api = {
  // Todos
  getTodos: (params) =>
    request('/todos' + (params ? '?' + new URLSearchParams(params) : '')),
  getTodo: (id) => request(`/todos/${id}`),
  createTodo: (data) =>
    request('/todos', { method: 'POST', body: JSON.stringify(data) }),
  updateTodo: (id, data) =>
    request(`/todos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTodo: (id) => request(`/todos/${id}`, { method: 'DELETE' }),

  // Tags
  getTags: () => request('/tags'),
  createTag: (data) =>
    request('/tags', { method: 'POST', body: JSON.stringify(data) }),
  deleteTag: (id) => request(`/tags/${id}`, { method: 'DELETE' }),

  // Dashboard
  getDashboardMetrics: () => request('/dashboard/metrics'),

  // Reminders
  getReminders: (todoId) => request(`/todos/${todoId}/reminders`),
  createReminder: (todoId, data) =>
    request(`/todos/${todoId}/reminders`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateReminder: (todoId, reminderId, data) =>
    request(`/todos/${todoId}/reminders/${reminderId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteReminder: (todoId, reminderId) =>
    request(`/todos/${todoId}/reminders/${reminderId}`, { method: 'DELETE' }),
}
