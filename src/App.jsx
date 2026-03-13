import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [filter, setFilter] = useState('all')
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const addTodo = () => {
    const trimmed = input.trim()
    if (!trimmed) return
    setTodos([...todos, { id: Date.now(), text: trimmed, completed: false }])
    setInput('')
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const deleteTodo = (id) => {
    setTodos(todos.filter(t => t.id !== id))
  }

  const clearCompleted = () => {
    setTodos(todos.filter(t => !t.completed))
  }

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const activeCount = todos.filter(t => !t.completed).length

  return (
    <div className="app">
      <div className="header">
        <div>
          <h1>My Tasks</h1>
          <p className="subtitle">{activeCount} task{activeCount !== 1 ? 's' : ''} remaining</p>
        </div>
        <button className="theme-btn" onClick={() => setDark(d => !d)} aria-label="Toggle dark mode">
          {dark ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="input-row">
        <input
          type="text"
          placeholder="What needs to be done?"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
        />
        <button className="add-btn" onClick={addTodo}>Add</button>
      </div>

      {todos.length === 0 ? (
        <div className="empty-state">No tasks yet. Add one above.</div>
      ) : (
        <div className="todo-box">
          <ul>
            {filtered.map(todo => (
              <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span>{todo.text}</span>
                <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>×</button>
              </li>
            ))}
          </ul>

          <div className="footer">
            <div className="filters">
              {['all', 'active', 'completed'].map(f => (
                <button
                  key={f}
                  className={filter === f ? 'active' : ''}
                  onClick={() => setFilter(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
            {todos.some(t => t.completed) && (
              <button className="clear-btn" onClick={clearCompleted}>Clear completed</button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
