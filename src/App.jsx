import { useState, useEffect } from 'react'
import SettingsSelector from './components/SettingsSelector'
import GuessInput from './components/GuessInput'
import History from './components/History'
import GameControls from './components/GameControls'
import './App.css'

function App() {
  const [game, setGame] = useState([])
  const [guess, setGuess] = useState([])
  const [message, setMessage] = useState('')
  const [settings, setSettings] = useState(null)
  const [difficulty, setDifficulty] = useState('Normal')

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`)
        const data = await response.json()
        setSettings(data)
      } catch (error) {
        console.error('Error fetching settings:', error)
        alert('Failed to fetch settings')
      }
    }
    fetchSettings()
  }, [])

  const handleSecret = async () => {
    let updatedSettings = {...settings}
    if (difficulty === 'Easy') {
      updatedSettings = {...updatedSettings, num: 3, min: 0, max: 5}
    } else if (difficulty === 'Hard') {
      updatedSettings = {...updatedSettings, num: 5, min: 0, max: 9}
    } else {
      updatedSettings = {...updatedSettings, num: 4, min: 0, max: 7}
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate`, {
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ settings: updatedSettings })
      })
      const data = await response.json()
      console.log(data)
      setGame(data)
      setSettings(updatedSettings)
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

      if (guessNumbers.some(n => n < settings.min || n > settings.max)) {
        setMessage(`All numbers must be between ${settings.min} and ${settings.max}`)
        return
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/evaluate`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ guess: guessNumbers } )
      })
      const data = await response.json()
      setGame(data)
      if (data.finished) {
        setMessage('Game finished!')
        setDifficulty('Normal')
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
      {(!game.secret ||game.finished)  && <SettingsSelector settings={settings} setSettings={setSettings} difficulty={difficulty} setDifficulty={setDifficulty}/>}
      <GameControls handleSecret={handleSecret} handleHint={handleHint} game={game}/>
      {game && game.secret && <p>Secret Code: {game.secret.join(' ')}</p>}
      {game && game.secret && (
        <>
          <p>Attempts: {game.attempts} / {game.max_attempts}</p>
          <GuessInput guess={guess} setGuess={setGuess} handleSubmitGuess={handleSubmitGuess} game={game} settings={settings}/>
          <History history={game.history} />
          {game.finished && <p>Game Over! The secret code was: {game.secret.join(' ')}</p>}
          <p>{message}</p>
        </>
      )}
    </main>
  )
}

export default App
