import { useState, useEffect } from 'react';
import { supabase, Character } from '../lib/supabase';
import { CharacterCard } from './CharacterCard';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import { sampleCharacters } from '../data/characters';

export function Arena() {
  const [characters, setCharacters] = useState<[Character, Character] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastMatchup, setLastMatchup] = useState<string | null>(null);
  const [useMockData, setUseMockData] = useState(false);

  // Fetch two random characters for a matchup
  const fetchMatchup = async () => {
    try {
      setIsLoading(true);
      
      // Try to fetch from database first
      const { data, error } = await supabase
        .from('characters')
        .select('*')
        .limit(10);

      let characterPool: any[];

      if (error || !data || data.length < 2) {
        console.log('Database not available or empty, using mock data');
        setUseMockData(true);
        // Use mock data with generated IDs
        characterPool = sampleCharacters.map((char, index) => ({
          ...char,
          id: `mock-${index}`,
        }));
      } else {
        setUseMockData(false);
        characterPool = data;
      }

      // Randomly select 2 different characters
      let char1, char2;
      do {
        const shuffled = [...characterPool].sort(() => Math.random() - 0.5);
        char1 = shuffled[0];
        char2 = shuffled[1];
        
        // Create a unique key for this matchup
        const matchupKey = [char1.id, char2.id].sort().join('-');
        
        // If it's the same as last matchup, try again
        if (matchupKey === lastMatchup && characterPool.length > 2) {
          continue;
        }
        
        setLastMatchup(matchupKey);
        break;
      } while (true);

      setCharacters([char1, char2]);
    } catch (err) {
      console.error('Error in fetchMatchup:', err);
      // Fall back to mock data on any error
      setUseMockData(true);
      const mockPool = sampleCharacters.map((char, index) => ({
        ...char,
        id: `mock-${index}`,
      }));
      const shuffled = [...mockPool].sort(() => Math.random() - 0.5);
      setCharacters([shuffled[0], shuffled[1]]);
    } finally {
      setIsLoading(false);
    }
  };

  // Submit vote to backend
  const handleVote = async (winner: Character, loser: Character) => {
    if (isSubmitting) return;

    // If using mock data, just load next matchup
    if (useMockData) {
      console.log('Mock mode: skipping vote submission');
      await fetchMatchup();
      return;
    }

    try {
      setIsSubmitting(true);

      // Call the backend Edge Function
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-dc5b0864/vote`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            winner_id: winner.id,
            loser_id: loser.id,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('Vote submission error:', error);
        return;
      }

      const result = await response.json();
      console.log('Vote submitted successfully:', result);

      // Load next matchup
      await fetchMatchup();
    } catch (err) {
      console.error('Error submitting vote:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle skip (just load next matchup without voting)
  const handleSkip = () => {
    if (!isSubmitting) {
      fetchMatchup();
    }
  };

  useEffect(() => {
    fetchMatchup();
  }, []);

  if (isLoading || !characters) {
    return (
      <div style={{
        minHeight: 'calc(100vh - var(--animash-nav-height))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div className="animash-skeleton" style={{
          width: '300px',
          height: '400px',
          borderRadius: 'var(--animash-card-radius)',
        }} />
      </div>
    );
  }

  return (
    <div style={{
      minHeight: 'calc(100vh - var(--animash-nav-height))',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      gap: '32px',
    }}>
      {/* Instruction Text */}
      <p style={{
        fontSize: 'var(--animash-text-sm)',
        color: 'var(--animash-text-muted)',
        textAlign: 'center',
        marginBottom: '16px',
      }}>
        Choose your preference
      </p>

      {/* Matchup Container */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '64px',
        flexWrap: 'wrap',
        maxWidth: '1200px',
      }}>
        {/* Character 1 */}
        <CharacterCard
          character={characters[0]}
          onClick={() => handleVote(characters[0], characters[1])}
          disabled={isSubmitting}
        />

        {/* VS Divider */}
        <div 
          className="animash-vs-pulse"
          style={{
            fontSize: '32px',
            fontWeight: 600,
            color: 'var(--animash-red)',
            letterSpacing: '8px',
            userSelect: 'none',
          }}
        >
          VS
        </div>

        {/* Character 2 */}
        <CharacterCard
          character={characters[1]}
          onClick={() => handleVote(characters[1], characters[0])}
          disabled={isSubmitting}
        />
      </div>

      {/* Skip Button */}
      <button
        onClick={handleSkip}
        disabled={isSubmitting}
        style={{
          marginTop: '24px',
          padding: '12px 32px',
          fontSize: 'var(--animash-text-sm)',
          fontWeight: 500,
          color: 'var(--animash-text-muted)',
          background: 'transparent',
          border: '1px solid var(--animash-border)',
          borderRadius: '8px',
          cursor: isSubmitting ? 'default' : 'pointer',
          transition: 'all var(--animash-transition)',
          opacity: isSubmitting ? 0.5 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isSubmitting) {
            e.currentTarget.style.borderColor = 'var(--animash-text-muted)';
            e.currentTarget.style.color = 'var(--animash-text)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isSubmitting) {
            e.currentTarget.style.borderColor = 'var(--animash-border)';
            e.currentTarget.style.color = 'var(--animash-text-muted)';
          }
        }}
      >
        Skip
      </button>
    </div>
  );
}