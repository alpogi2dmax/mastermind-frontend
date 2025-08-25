import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [game, setGame] = useState([])
  const [guess, setGuess] = useState([])
  const [message, setMessage] = useState('')
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`)
        const data = await response.json()
        setSettings(data)
        console.log(data)
      } catch (error) {
        console.error('Error fetching settings:', error)
        alert('Failed to fetch settings')
      }
    }
    fetchSettings()
  }, [])

  const handleSecret = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate`, {
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ settings: settings })
      })
      const data = await response.json()
      console.log(data)
      setGame(data)
      setMessage('Game Started! Make your guess.')
      setGuess(new Array(data.secret.length).fill(''))
    } catch (error) {
      console.error('Error fetching secret code:', error);
      alert('Failed to generate code.')
    }
  }

  const handleSubmitGuess = async () => {
    if (!game || game.finished) return
    try {
      const guessNumbers = guess.map(Number)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/evaluate`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ guess: guessNumbers } )
      })
      const data = await response.json()
      setGame(data)
      if (data.finished) {
        setMessage('Game finished!')
      } else {
        setMessage('Guess submitted')
      }
    } catch (error) {
      console.error('Error evaluating guess:', error)
      alert('Failed to evaluate guess.')
    }
  }

  const handleHint = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/gethint`)
      const data = await response.json()
      const hint = data.hint.join(', ')
      if (data.finished) {
        setMessage(`Game is finished. Code is ${hint}`)
      } else {
        setMessage(hint)
      }
      setGame(data)
    } catch (error) {
      console.error('Error in getting hint:', error)
      alert('Failed to get hint')
    }
  }

  return (
    <main>
      {settings && (
        <>
          <label>
            Number of digits:
            <select
              value={settings.num}
              onChange={(e) =>
                setSettings({...settings, num: parseInt(e.target.value)})
              }
            >
              {[4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
          <label>
            Max digits:
            <select
              value={settings.max}
              onChange={(e) =>
                setSettings({...settings, max: parseInt(e.target.value)})
              }
            >
              {[7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </>
      )}
      <button onClick={handleSecret}>Start Game</button>
      {game && game.secret && <p>Secret Code: {game.secret.join(' ')}</p>}
      {game && game.secret && (
        <>
          <p>Attempts: {game.attempts} / {game.max_attempts}</p>
          <div>
            {guess.map((val, i) => (
              <input 
                key={i} 
                type='number' 
                min='0'
                max='7' 
                value={val} 
                onChange={e => {
                  const newGuess = [...guess]
                  newGuess[i] = e.target.value
                  setGuess(newGuess)
                }}
              />
            ))}
            <button onClick={handleSubmitGuess} disabled={game.finished}>
              Submit Guess
            </button>
          </div>
          <button onClick={handleHint}>Hint</button>

          <h2>History</h2>
          <ul>
            {game.history.map((entry, idx) => (
              <li key={idx}>
                Guess: {entry.guess.join(' ')} | Correct number: {entry.correct_number} | Correct location: {entry.correct_location}
              </li>
            ))}
          </ul>
          {game.finished && <p>Game Over! The secret code was: {game.secret.join(' ')}</p>}
          <p>{message}</p>
        </>
      )}
    </main>
  )
}

export default App
