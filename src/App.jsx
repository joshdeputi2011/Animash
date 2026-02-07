import { Routes, Route, Link } from "react-router-dom";
import Arena from "./pages/Arena";
import Leaderboard from "./pages/Leaderboard";

export default function App() {
  return (
    <>
      <nav className="nav">
        <h1>Animash</h1>
        <div>
          <Link to="/">Arena</Link>
          <Link to="/leaderboard">Leaderboard</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Arena />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </>
  );
}
