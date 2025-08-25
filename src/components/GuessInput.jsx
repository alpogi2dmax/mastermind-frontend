export default function GuessInput({ guess, setGuess, handleSubmitGuess, game }) {
  return (
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
  )
}