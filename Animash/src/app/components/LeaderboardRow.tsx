import { Character } from '../lib/supabase';

interface LeaderboardRowProps {
  character: Character;
  rank: number;
}

export function LeaderboardRow({ character, rank }: LeaderboardRowProps) {
  const isTopRank = rank === 1;
  const isTopThree = rank <= 3;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '80px 80px 1fr 120px 120px',
      alignItems: 'center',
      gap: '24px',
      padding: '20px 32px',
      background: isTopRank ? 'rgba(225, 6, 0, 0.05)' : 'transparent',
      borderBottom: '1px solid var(--animash-border)',
      transition: 'background var(--animash-transition)',
    }}
    onMouseEnter={(e) => {
      if (!isTopRank) {
        e.currentTarget.style.background = 'rgba(18, 18, 22, 0.5)';
      }
    }}
    onMouseLeave={(e) => {
      if (!isTopRank) {
        e.currentTarget.style.background = 'transparent';
      }
    }}
    >
      {/* Rank Number */}
      <div style={{
        fontSize: isTopRank ? '32px' : '24px',
        fontWeight: isTopRank ? 700 : 600,
        color: isTopRank ? 'var(--animash-red)' : 'var(--animash-text-muted)',
        textAlign: 'center',
        textShadow: isTopRank ? '0 0 20px rgba(225, 6, 0, 0.5)' : 'none',
      }}>
        #{rank}
      </div>

      {/* Character Image */}
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: isTopRank ? '2px solid var(--animash-red)' : '2px solid var(--animash-border)',
        boxShadow: isTopRank ? '0 0 16px rgba(225, 6, 0, 0.3)' : 'none',
      }}>
        <img
          src={character.image_url}
          alt={character.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Character Info */}
      <div>
        <h3 style={{
          fontSize: 'var(--animash-text-base)',
          fontWeight: isTopThree ? 600 : 500,
          color: 'var(--animash-text)',
          marginBottom: '4px',
        }}>
          {character.name}
        </h3>
        <p style={{
          fontSize: 'var(--animash-text-xs)',
          color: 'var(--animash-text-muted)',
        }}>
          {character.universe}
        </p>
      </div>

      {/* Elo Rating */}
      <div style={{
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 'var(--animash-text-base)',
          fontWeight: 600,
          color: isTopRank ? 'var(--animash-red)' : 'var(--animash-text)',
        }}>
          {character.rating}
        </div>
        <div style={{
          fontSize: 'var(--animash-text-xs)',
          color: 'var(--animash-text-muted)',
          marginTop: '2px',
        }}>
          Rating
        </div>
      </div>

      {/* Matches Played */}
      <div style={{
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 'var(--animash-text-base)',
          fontWeight: 500,
          color: 'var(--animash-text)',
        }}>
          {character.matches}
        </div>
        <div style={{
          fontSize: 'var(--animash-text-xs)',
          color: 'var(--animash-text-muted)',
          marginTop: '2px',
        }}>
          Matches
        </div>
      </div>
    </div>
  );
}
