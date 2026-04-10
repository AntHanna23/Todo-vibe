import { useState } from 'react'

export default function TagPanel({ tags, onCreateTag, onDeleteTag, onClose }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    try {
      await onCreateTag(trimmed)
      setName('')
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>Manage Tags</h2>
          <button className="btn btn--icon" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="tag-form">
          <input
            className="input"
            type="text"
            placeholder="New tag name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <button className="btn btn--primary" type="submit">Add</button>
        </form>
        {error && <p className="error-text">{error}</p>}

        <ul className="tag-list">
          {tags.length === 0 && <li className="tag-list__empty">No tags yet.</li>}
          {tags.map((tag) => (
            <li key={tag.id} className="tag-list__item">
              <span>{tag.name}</span>
              <button
                className="btn btn--icon btn--danger"
                onClick={() => onDeleteTag(tag.id)}
                title="Delete tag"
                aria-label={`Delete tag ${tag.name}`}
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
