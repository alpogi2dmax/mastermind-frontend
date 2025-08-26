import { SystemMessage } from "@langchain/core/messages"
import { useState } from "react"

export default function Leaderboard({leaderboard, difficulty, setStartGame, setMessage}) {

    const [diff, setDiff] = useState(difficulty)

    useState(() => {
        setDiff(difficulty)
    }, [difficulty])

    const handleclick = () => {
        setStartGame(true)
        setMessage('')
    }

    return (
        <div className='leaderboard'>
            <h2>Leaderboard</h2>
            <button onClick={handleclick}
                >Play Again
            </button>
            <label>
                Difficulty:
                <select
                    value={diff}
                    onChange={(e) => setDiff(e.target.value)}
                    >
                    <option>Easy</option>
                    <option>Normal</option>
                    <option>Hard</option>
                </select>
            </label>
             {leaderboard[diff]?.length > 0 ? (
                leaderboard[diff].map(player => {
                    let min = Math.floor(player.elapsed_time / 60)
                    let sec = Math.floor(player.elapsed_time % 60)
                    return (
                        <p key={player.id}>
                            {player.player_name} {min}:{sec}
                        </p>
                )})
            ) : (
                <p>No players yet for {diff}</p>
            )}
        </div>
    )
}