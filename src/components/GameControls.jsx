export default function GameControls({ handleSecret, handleHint, game, startGame }) {
  return (
    <div>
      {startGame && <button onClick={handleSecret}>Start Game</button>}
      {(game.secret && !game.finished) && <button onClick={handleHint}>Hint</button>}
    </div>
  )
}