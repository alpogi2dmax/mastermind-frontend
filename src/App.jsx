import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [secret, setSecret] = useState([])

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

  return (
    <main>
      <button onClick={handleSecret}>Start Game</button>
      {secret.length > 0 && <p>{secret.join('')}</p>}
    </main>
  )
}

export default App
