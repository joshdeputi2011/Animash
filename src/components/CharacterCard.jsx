export default function CharacterCard({ character, onVote }) {
  return (
    <div className="card" onClick={() => onVote(character.id)}>
      <img src={character.image} alt={character.name} />
      <h3>{character.name}</h3>
    </div>
  );
}
