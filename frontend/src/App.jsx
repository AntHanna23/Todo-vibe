import { useCallback, useEffect, useState } from 'react'
import { api } from './api'
import TodoCard from './components/TodoCard'
import TodoModal from './components/TodoModal'
import TagPanel from './components/TagPanel'
import Dashboard from './components/Dashboard'

// --- Reminder notification hook ---
function useReminders(todos) {
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    if (!todos.length) return

    const notifiedKey = 'todo_vibe_notified'
    const notified = new Set(JSON.parse(localStorage.getItem(notifiedKey) || '[]'))

    function check() {
      const now = new Date()
      todos.forEach((todo) => {
        if (todo.status === 'complete') return
        ;(todo.reminders || []).forEach((r) => {
          if (notified.has(r.id)) return
          if (new Date(r.remind_at) <= now) {
            if (Notification.permission === 'granted') {
              new Notification(`Reminder: ${todo.title}`, {
                body: todo.due_at
                  ? `Due: ${new Date(todo.due_at).toLocaleString()}`
                  : '',
                tag: `reminder-${r.id}`,
              })
            }
            notified.add(r.id)
          }
        })
      })
      localStorage.setItem(notifiedKey, JSON.stringify([...notified]))
    }

    check()
    const interval = setInterval(check, 60_000)
    return () => clearInterval(interval)
  }, [todos])
}

export default function App() {
  const [view, setView] = useState('todos') // 'todos' | 'dashboard'
  const [todos, setTodos] = useState([])
  const [tags, setTags] = useState([])
  const [filterTagId, setFilterTagId] = useState(null)
  const [showCompleted, setShowCompleted] = useState(false)
  const [modalTodo, setModalTodo] = useState(undefined) // undefined=closed, null=new, todo=edit
  const [showTagPanel, setShowTagPanel] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useReminders(todos)

  const loadData = useCallback(async () => {
    try {
      const [fetchedTodos, fetchedTags] = await Promise.all([
        api.getTodos(),
        api.getTags(),
      ])
      setTodos(fetchedTodos)
      setTags(fetchedTags)
      setError('')
    } catch {
      setError('Could not reach the API. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  // --- Mutations ---

  async function handleSaveTodo(formData, reminderList) {
    if (modalTodo) {
      // Edit existing
      await api.updateTodo(modalTodo.id, formData)
      // Sync reminders: delete all old, create new
      await Promise.all(
        modalTodo.reminders.map((r) => api.deleteReminder(modalTodo.id, r.id))
      )
      await Promise.all(
        reminderList
          .filter((r) => r.remind_at)
          .map((r) =>
            api.createReminder(modalTodo.id, {
              offset_minutes: r.offset_minutes,
              remind_at: r.remind_at,
            })
          )
      )
    } else {
      // Create new
      const created = await api.createTodo(formData)
      await Promise.all(
        reminderList
          .filter((r) => r.remind_at)
          .map((r) =>
            api.createReminder(created.id, {
              offset_minutes: r.offset_minutes,
              remind_at: r.remind_at,
            })
          )
      )
    }
    setModalTodo(undefined)
    await loadData()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this todo?')) return
    await api.deleteTodo(id)
    await loadData()
  }

  async function handleToggleComplete(todo) {
    await api.updateTodo(todo.id, {
      status: todo.status === 'complete' ? 'incomplete' : 'complete',
    })
    await loadData()
  }

  async function handleCreateTag(name) {
    await api.createTag({ name })
    await loadData()
  }

  async function handleDeleteTag(id) {
    if (!confirm('Delete this tag? Todos using it will lose the tag.')) return
    await api.deleteTag(id)
    setFilterTagId((prev) => (prev === id ? null : prev))
    await loadData()
  }

  // --- Derived lists ---

  const incompleteTodos = todos.filter(
    (t) =>
      t.status === 'incomplete' &&
      (filterTagId === null || t.tag_id === filterTagId)
  )

  const completedTodos = todos.filter((t) => t.status === 'complete')

  // --- Render ---

  return (
    <div className={view === 'dashboard' ? 'app app--wide' : 'app'}>
      <header className="app-header">
        <div className="app-header__left">
          <h1 className="app-title">Todo-vibe</h1>
          <nav className="app-nav">
            <button
              className={`app-nav__link ${view === 'todos' ? 'app-nav__link--active' : ''}`}
              onClick={() => setView('todos')}
            >
              Todos
            </button>
            <button
              className={`app-nav__link ${view === 'dashboard' ? 'app-nav__link--active' : ''}`}
              onClick={() => setView('dashboard')}
            >
              Dashboard
            </button>
          </nav>
        </div>
        <div className="app-header__actions">
          {view === 'todos' && (
            <>
              <button
                className="btn btn--secondary"
                onClick={() => setShowTagPanel(true)}
              >
                Tags
              </button>
              <button
                className="btn btn--primary"
                onClick={() => setModalTodo(null)}
              >
                + New todo
              </button>
            </>
          )}
        </div>
      </header>

      {view === 'dashboard' && <Dashboard />}

      <main className="app-main" style={view === 'dashboard' ? { display: 'none' } : {}}>
        {error && <p className="error-banner">{error}</p>}

        {/* Filter bar */}
        <div className="filter-bar">
          <span className="filter-bar__label">Filter:</span>
          <button
            className={`btn btn--chip ${filterTagId === null ? 'btn--chip-active' : ''}`}
            onClick={() => setFilterTagId(null)}
          >
            All
          </button>
          {tags.map((t) => (
            <button
              key={t.id}
              className={`btn btn--chip ${filterTagId === t.id ? 'btn--chip-active' : ''}`}
              onClick={() => setFilterTagId(filterTagId === t.id ? null : t.id)}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Incomplete todos */}
        {loading ? (
          <p className="loading-text">Loading…</p>
        ) : incompleteTodos.length === 0 ? (
          <p className="empty-text">
            {filterTagId ? 'No todos for this tag.' : 'Nothing to do — add a todo to get started.'}
          </p>
        ) : (
          <ul className="todo-list">
            {incompleteTodos.map((todo) => (
              <li key={todo.id}>
                <TodoCard
                  todo={todo}
                  onEdit={setModalTodo}
                  onDelete={handleDelete}
                  onToggleComplete={handleToggleComplete}
                />
              </li>
            ))}
          </ul>
        )}

        {/* Completed section */}
        {completedTodos.length > 0 && (
          <section className="completed-section">
            <button
              className="completed-section__toggle"
              onClick={() => setShowCompleted((v) => !v)}
            >
              {showCompleted ? '▾' : '▸'} Completed ({completedTodos.length})
            </button>
            {showCompleted && (
              <ul className="todo-list todo-list--completed">
                {completedTodos.map((todo) => (
                  <li key={todo.id}>
                    <TodoCard
                      todo={todo}
                      onEdit={setModalTodo}
                      onDelete={handleDelete}
                      onToggleComplete={handleToggleComplete}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>

      {/* Modals */}
      {modalTodo !== undefined && (
        <TodoModal
          todo={modalTodo}
          tags={tags}
          onSave={handleSaveTodo}
          onClose={() => setModalTodo(undefined)}
        />
      )}
      {showTagPanel && (
        <TagPanel
          tags={tags}
          onCreateTag={handleCreateTag}
          onDeleteTag={handleDeleteTag}
          onClose={() => setShowTagPanel(false)}
        />
      )}
    </div>
  )
}
