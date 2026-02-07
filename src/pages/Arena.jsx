import CharacterCard from "../components/CharacterCard";

const mockCharacters = [
  { id: 1, name: "Asuna Yuuki", image: "https://via.placeholder.com/250" },
  { id: 2, name: "Mikasa Ackerman", image: "https://via.placeholder.com/250" }
];

export default function Arena() {
  const vote = (id) => {
    console.log("Voted for:", id);
    // later → send to Supabase Edge Function
  };

  return (
    <div className="arena">
      <CharacterCard character={mockCharacters[0]} onVote={vote} />
      <span className="vs">VS</span>
      <CharacterCard character={mockCharacters[1]} onVote={vote} />
    </div>
  );
}
