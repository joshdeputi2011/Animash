import { useState, useEffect } from 'react';
import { supabase, Character } from '../lib/supabase';
import { LeaderboardRow } from './LeaderboardRow';
import { sampleCharacters } from '../data/characters';

export function Leaderboard() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .order('rating', { ascending: false })
        .limit(100);

      if (error || !data || data.length === 0) {
        console.log('Database not available or empty, using mock data');
        setUseMockData(true);
        // Use mock data with generated IDs, sorted by rating
        const mockData = sampleCharacters
          .map((char, index) => ({
            ...char,
            id: `mock-${index}`,
          }))
          .sort((a, b) => b.rating - a.rating);
        setCharacters(mockData);
      } else {
        setUseMockData(false);
        setCharacters(data);
      }
    } catch (err) {
      console.error('Error in fetchLeaderboard:', err);
      // Fall back to mock data
      setUseMockData(true);
      const mockData = sampleCharacters
        .map((char, index) => ({
          ...char,
          id: `mock-${index}`,
        }))
        .sort((a, b) => b.rating - a.rating);
      setCharacters(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (isLoading) {
    return (
      <div style={{
        minHeight: 'calc(100vh - var(--animash-nav-height))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          fontSize: 'var(--animash-text-base)',
          color: 'var(--animash-text-muted)',
        }}>
          Loading rankings...
        </div>
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <div style={{
        minHeight: 'calc(100vh - var(--animash-nav-height))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
      }}>
        <div style={{
          fontSize: 'var(--animash-text-base)',
          color: 'var(--animash-text-muted)',
        }}>
          No rankings available yet
        </div>
        <div style={{
          fontSize: 'var(--animash-text-sm)',
          color: 'var(--animash-text-muted)',
        }}>
          Start voting to build the leaderboard
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - var(--animash-nav-height))',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '64px 24px',
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '48px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: 600,
          color: 'var(--animash-text)',
          marginBottom: '12px',
          letterSpacing: '-1px',
        }}>
          Rankings
        </h1>
        <p style={{
          fontSize: 'var(--animash-text-base)',
          color: 'var(--animash-text-muted)',
        }}>
          Global character rankings powered by Elo algorithm
        </p>
      </div>

      {/* Leaderboard Table */}
      <div style={{
        background: 'var(--animash-surface)',
        border: '1px solid var(--animash-border)',
        borderRadius: '16px',
        overflow: 'hidden',
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '80px 80px 1fr 120px 120px',
          gap: '24px',
          padding: '20px 32px',
          background: 'rgba(18, 18, 22, 0.5)',
          borderBottom: '1px solid var(--animash-border)',
        }}>
          <div style={{
            fontSize: 'var(--animash-text-xs)',
            fontWeight: 600,
            color: 'var(--animash-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            textAlign: 'center',
          }}>
            Rank
          </div>
          <div /> {/* Empty space for image column */}
          <div style={{
            fontSize: 'var(--animash-text-xs)',
            fontWeight: 600,
            color: 'var(--animash-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
          }}>
            Character
          </div>
          <div style={{
            fontSize: 'var(--animash-text-xs)',
            fontWeight: 600,
            color: 'var(--animash-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            textAlign: 'center',
          }}>
            Rating
          </div>
          <div style={{
            fontSize: 'var(--animash-text-xs)',
            fontWeight: 600,
            color: 'var(--animash-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            textAlign: 'center',
          }}>
            Matches
          </div>
        </div>

        {/* Leaderboard Rows */}
        {characters.map((character, index) => (
          <LeaderboardRow
            key={character.id}
            character={character}
            rank={index + 1}
          />
        ))}
      </div>

      {/* Footer Info */}
      <div style={{
        marginTop: '32px',
        textAlign: 'center',
        fontSize: 'var(--animash-text-xs)',
        color: 'var(--animash-text-muted)',
      }}>
        Rankings update in real-time based on community votes
      </div>
    </div>
  );
}