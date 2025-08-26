import { useState } from "react"

export default function Leaderboard({leaderboard, difficulty}) {

    const [diff, setDiff] = useState(difficulty)

    useState(() => {
        setDiff(difficulty)
    }, [difficulty])

    return (
        <div>
            <h2>Leaderboard</h2>
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
                leaderboard[diff].map(player => (
                    <p key={player.id}>
                        {player.player_name} {player.elapsed_time}
                    </p>
                ))
            ) : (
                <p>No players yet for {diff}</p>
            )}
        </div>
    )
}