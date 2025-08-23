import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [game, setGame] = useState([])
  const [guess, setGuess] = useState(['','','',''])
  const [result, setResult] = useState(null)
  const [message, setMessage] = useState('')

  const handleSecret = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/generate')
      const data = await response.json()
      console.log(data)
      setGame(data)
      setMessage('Game Started! Make your guess.')
      setGuess(['','','',''])
    } catch (error) {
      console.error('Error fetching secret code:', error);
      alert('Failed to generate code.')
    }
  }

  const handleSubmitGuess = async () => {
    if (!game || game.finished) return
    try {
      const guessNumbers = guess.map(Number)
      const response = await fetch('http://localhost:5000/api/evaluate', {
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

  return (
    <main>
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
