export default function GameControls({ handleSecret, handleHint }) {
  return (
    <div>
      <button onClick={handleSecret}>Start Game</button>
      <button onClick={handleHint}>Hint</button>
    </div>
  )
}