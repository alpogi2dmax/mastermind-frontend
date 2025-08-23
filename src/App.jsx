import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [secret, setSecret] = useState([])
  const [guess, setGuess] = useState('')
  const [result, setResult] = useState(null)

  const handleSecret = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/generate')
      const data = await response.json()
      setSecret(data.secret)
    } catch (error) {
      console.error('Error fetching secret code:', error);
      alert('Failed to generate code.')
    }
  }

  const handleGuess = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/evaluate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ guess: guess.split('').map(Number)} )
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error evaluating guess:', error)
      alert('Failed to evaluate guess.')
    }
  }

  return (
    <main>
      <button onClick={handleSecret}>Start Game</button>
      {secret.length > 0 && <p>Secret Code: {secret.join('')}</p>}
      {secret.length > 0 && (
        <>
          <input
            value={guess}
            onChange={e => setGuess(e.target.value)}
            maxLength={secret.length}
            placeholder="Enter your guess"
          />
          <button onClick={handleGuess}>Submit Guess</button>
        </>
      )}

      {result && <p>Correct Number: {result.correct_number} and Correct Location: {result.correct_location}</p>}
    </main>
  )
}

export default App
