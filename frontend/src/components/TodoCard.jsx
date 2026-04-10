export default function TodoCard({ todo, onEdit, onDelete, onToggleComplete }) {
  const isComplete = todo.status === 'complete'

  function formatDate(dt) {
    if (!dt) return null
    return new Date(dt).toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const isOverdue =
    todo.due_at && !isComplete && new Date(todo.due_at) < new Date()

  return (
    <div className={`todo-card ${isComplete ? 'todo-card--complete' : ''}`}>
      <div className="todo-card__left">
        <button
          className={`todo-card__check ${isComplete ? 'todo-card__check--checked' : ''}`}
          onClick={() => onToggleComplete(todo)}
          title={isComplete ? 'Mark incomplete' : 'Mark complete'}
          aria-label={isComplete ? 'Mark incomplete' : 'Mark complete'}
        />
      </div>

      <div className="todo-card__body">
        <div className="todo-card__title-row">
          <span className="todo-card__title">{todo.title}</span>
          <div className="todo-card__badges">
            {todo.priority && (
              <span className={`badge badge--priority badge--${todo.priority}`}>
                {todo.priority}
              </span>
            )}
            {todo.tag && (
              <span className="badge badge--tag">{todo.tag.name}</span>
            )}
          </div>
        </div>

        {todo.description && (
          <p className="todo-card__desc">{todo.description}</p>
        )}

        <div className="todo-card__meta">
          {todo.due_at && (
            <span className={`todo-card__due ${isOverdue ? 'todo-card__due--overdue' : ''}`}>
              {isOverdue ? 'Overdue: ' : 'Due: '}
              {formatDate(todo.due_at)}
            </span>
          )}
          {todo.reminders.length > 0 && (
            <span className="todo-card__reminders">
              {todo.reminders.length} reminder{todo.reminders.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      <div className="todo-card__actions">
        <button
          className="btn btn--icon"
          onClick={() => onEdit(todo)}
          title="Edit"
          aria-label="Edit todo"
        >
          ✏️
        </button>
        <button
          className="btn btn--icon btn--danger"
          onClick={() => onDelete(todo.id)}
          title="Delete"
          aria-label="Delete todo"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}
