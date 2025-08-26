import { useState, useEffect } from 'react'
import SettingsSelector from './components/SettingsSelector'
import GuessInput from './components/GuessInput'
import History from './components/History'
import GameControls from './components/GameControls'
import Leaderboard from './components/Leaderboard'
import './App.css'

function App() {
  const [game, setGame] = useState([])
  const [guess, setGuess] = useState([])
  const [message, setMessage] = useState('')
  const [settings, setSettings] = useState(null)
  const [difficulty, setDifficulty] = useState('Normal')
  const [player, setPlayer] = useState('')
  const [leaderboard, setLeaderboard] = useState(null)

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

  const fetchLeaderBoard = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/getleaderboard`)
      const data = await response.json()
      setLeaderboard(data)
    } catch (error) {
      console.error('Error in getting leaderboard:', error)
      alert('Failed to get leaderboard')
    }
  }

  const handleSecret = async () => {
    let updatedSettings = {...settings}
    if (difficulty === 'Easy') {
      updatedSettings = {...updatedSettings, num: 3, min: 0, max: 5}
    } else if (difficulty === 'Hard') {
      updatedSettings = {...updatedSettings, num: 5, min: 0, max: 9}
    } else {
      updatedSettings = {...updatedSettings, num: 4, min: 0, max: 7}
    }

    if (player.length < 3) {
      setMessage('Player name should be have 3 or more characters')
      return
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/generate`, {
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ settings: updatedSettings, difficulty: difficulty, player: player })
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

      for (let num of guess) {
        if (num === '') {
          setMessage(`All numbers must be filled between ${settings.min} and ${settings.max}`)
          return
        }
      }

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
      const isCorrect = data.secret.every((num, idx) => num === guessNumbers[idx])

      if (isCorrect) {
        let min = Math.floor(data.elapsed_time / 60)
        let sec = Math.floor(data.elapsed_time % 60)
        setMessage(`🎉 Congratulations! You guessed it! Elapsed Time: ${min}:${sec}`)
        fetchLeaderBoard()
        setDifficulty('Normal')
        setPlayer('')
      } else if (data.finished) {
        setMessage(`Game over! The secret was ${data.secret.join(' ')}. Thank you for playing.`)
        fetchLeaderBoard()
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
        setMessage(`Game is finished. Code is ${hint}. Thank you for playing!`)
        setPlayer('')
      } else {
        setMessage(`${hint}. You now have ${data.attempts} attempts.`)
      }
      setGame(data)
    } catch (error) {
      console.error('Error in getting hint:', error)
      alert('Failed to get hint')
    }
  }


  

  return (
    <main>
      <h1>Mastermind</h1>
      {(!game.secret ||game.finished)  && 
        <SettingsSelector 
          settings={settings} 
          setSettings={setSettings} 
          difficulty={difficulty} 
          setDifficulty={setDifficulty}
          player={player}
          setPlayer={setPlayer}
        />
      }
      <GameControls handleSecret={handleSecret} handleHint={handleHint} game={game}/>
      {game && game.secret && !game.finished && <p>Secret Code: {game.secret.join(' ')}</p>}
      {game && game.secret && !game.finished && (
        <>
          <p>Attempts: {game.attempts} / {game.max_attempts}</p>
          <GuessInput guess={guess} setGuess={setGuess} handleSubmitGuess={handleSubmitGuess} game={game} settings={settings}/>
          {game.history.length > 0 &&<History history={game.history} />}
          {/* {game.finished && <p>Game Over! The secret code was: {game.secret.join(' ')}</p>} */}
        </>
      )}
      <p>{message}</p>
      {leaderboard && game.finished && <Leaderboard leaderboard={leaderboard} difficulty={difficulty}/>}
    </main>
  )
}

export default App
