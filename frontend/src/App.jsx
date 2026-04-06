import { useEffect, useState } from 'react'

function App() {
  const [status, setStatus] = useState('Connecting...')

  useEffect(() => {
    fetch('http://localhost:8000/health')
      .then(res => res.json())
      .then(data => setStatus(data.message))
      .catch(() => setStatus('Could not reach API'))
  }, [])

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Todo-vibe</h1>
      <p>API status: <strong>{status}</strong></p>
    </div>
  )
}

export default App
