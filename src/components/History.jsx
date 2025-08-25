export default function History({ history }) {
  return (
    <div>
      <h2>History</h2>
      <ul>
        {history.map((entry, idx) => (
          <li key={idx}>
            Guess: {entry.guess.join(' ')} | Correct number: {entry.correct_number} | Correct location: {entry.correct_location}
          </li>
        ))}
      </ul>
    </div>
  )
}