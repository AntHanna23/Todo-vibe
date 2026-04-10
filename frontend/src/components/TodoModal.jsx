import { useState } from 'react'

const PRIORITIES = ['', 'low', 'medium', 'high']

function toDatetimeLocal(isoString) {
  if (!isoString) return ''
  // Trim seconds/ms so datetime-local input accepts it
  return isoString.slice(0, 16)
}

function calcRemindAt(dueAt, offsetMinutes) {
  if (!dueAt) return null
  const d = new Date(dueAt)
  d.setMinutes(d.getMinutes() - offsetMinutes)
  return d.toISOString()
}

export default function TodoModal({ todo, tags, onSave, onClose }) {
  const isEditing = !!todo

  const [title, setTitle] = useState(todo?.title ?? '')
  const [description, setDescription] = useState(todo?.description ?? '')
  const [priority, setPriority] = useState(todo?.priority ?? '')
  const [dueAt, setDueAt] = useState(toDatetimeLocal(todo?.due_at))
  const [tagId, setTagId] = useState(todo?.tag_id ?? '')
  // reminders: array of { id (existing), offset_minutes, _key (local tracking) }
  const [reminders, setReminders] = useState(
    (todo?.reminders ?? []).map((r) => ({
      id: r.id,
      offset_minutes: r.offset_minutes,
      _key: r.id,
    }))
  )
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  function addReminder() {
    setReminders((prev) => [
      ...prev,
      { id: null, offset_minutes: 15, _key: Date.now() },
    ])
  }

  function removeReminder(key) {
    setReminders((prev) => prev.filter((r) => r._key !== key))
  }

  function updateReminderOffset(key, value) {
    setReminders((prev) =>
      prev.map((r) => (r._key === key ? { ...r, offset_minutes: Number(value) } : r))
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title is required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      await onSave(
        {
          title: title.trim(),
          description: description.trim() || null,
          priority: priority || null,
          due_at: dueAt ? new Date(dueAt).toISOString() : null,
          tag_id: tagId ? Number(tagId) : null,
        },
        reminders.map((r) => ({
          id: r.id,
          offset_minutes: r.offset_minutes,
          remind_at: calcRemindAt(dueAt ? new Date(dueAt).toISOString() : null, r.offset_minutes),
        }))
      )
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>{isEditing ? 'Edit Todo' : 'New Todo'}</h2>
          <button className="btn btn--icon" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="todo-form">
          <label className="form-label">
            Title <span className="required">*</span>
            <input
              className="input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              placeholder="What needs to be done?"
            />
          </label>

          <label className="form-label">
            Description
            <textarea
              className="input input--textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details…"
              rows={3}
            />
          </label>

          <div className="form-row">
            <label className="form-label">
              Priority
              <select
                className="input"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="">None</option>
                {PRIORITIES.filter(Boolean).map((p) => (
                  <option key={p} value={p}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-label">
              Tag
              <select
                className="input"
                value={tagId}
                onChange={(e) => setTagId(e.target.value)}
              >
                <option value="">None</option>
                {tags.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="form-label">
            Due date &amp; time
            <input
              className="input"
              type="datetime-local"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
            />
          </label>

          <div className="reminders-section">
            <div className="reminders-section__header">
              <span className="form-label-text">Reminders</span>
              <button
                type="button"
                className="btn btn--secondary btn--small"
                onClick={addReminder}
                disabled={!dueAt}
                title={!dueAt ? 'Set a due date first' : 'Add reminder'}
              >
                + Add reminder
              </button>
            </div>
            {!dueAt && reminders.length === 0 && (
              <p className="hint-text">Set a due date to add reminders.</p>
            )}
            {reminders.map((r) => (
              <div key={r._key} className="reminder-row">
                <input
                  className="input input--small"
                  type="number"
                  min={1}
                  value={r.offset_minutes}
                  onChange={(e) => updateReminderOffset(r._key, e.target.value)}
                />
                <span className="reminder-row__label">minutes before due</span>
                {dueAt && (
                  <span className="reminder-row__preview">
                    ({new Date(calcRemindAt(new Date(dueAt).toISOString(), r.offset_minutes)).toLocaleString(
                      undefined,
                      { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
                    )})
                  </span>
                )}
                <button
                  type="button"
                  className="btn btn--icon btn--danger"
                  onClick={() => removeReminder(r._key)}
                  aria-label="Remove reminder"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="modal__footer">
            <button type="button" className="btn btn--secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={saving}>
              {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Create todo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
