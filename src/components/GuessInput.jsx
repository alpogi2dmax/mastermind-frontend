export default function GuessInput({ guess, setGuess, handleSubmitGuess, game, settings }) {
  return (
    <div className='guess-input'>
      <div className='guess-input-container'>
        {guess.map((val, i) => (
          <input
            key={i}
            type='number'
            min={settings.min}
            max={settings.max}
            value={val}
            onChange={e => {
              const newGuess = [...guess]
              newGuess[i] = e.target.value
              setGuess(newGuess)
            }}
          />
        ))}
      </div>
      
      <button onClick={handleSubmitGuess} disabled={game.finished}>
        Submit Guess
      </button>
    </div>
  )
}