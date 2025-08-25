export default function GameControls({ handleSecret, handleHint, game }) {
  return (
    <div>
      {(!game.secret || game.finished) && <button onClick={handleSecret}>Start Game</button>}
      {(game.secret && !game.finished) && <button onClick={handleHint}>Hint</button>}
    </div>
  )
}