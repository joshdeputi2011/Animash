const mockLeaderboard = [
  { name: "Asuna Yuuki", rating: 1342 },
  { name: "Mikasa Ackerman", rating: 1298 },
  { name: "Hinata Hyuga", rating: 1250 }
];

export default function Leaderboard() {
  return (
    <div className="leaderboard">
      <h2>Leaderboard</h2>
      <ul>
        {mockLeaderboard.map((c, i) => (
          <li key={i}>
            #{i + 1} {c.name} — {c.rating}
          </li>
        ))}
      </ul>
    </div>
  );
}
