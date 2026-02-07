/**
 * Database operations for Animash
 * All database interactions go through these functions
 */

import { getSupabaseClient } from './supabase.tsx';

export type Character = {
  id: string;
  name: string;
  universe: string;
  image_url: string;
  rating: number;
  matches: number;
  wins: number;
  losses: number;
};

/**
 * Get a character by ID
 */
export async function getCharacterById(id: string): Promise<Character | null> {
  const supabase = getSupabaseClient();
  
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching character ${id}:`, error);
    return null;
  }

  return data;
}

/**
 * Update character after a match result
 */
export async function updateCharacterAfterMatch(
  characterId: string,
  newRating: number,
  won: boolean,
): Promise<boolean> {
  const supabase = getSupabaseClient();

  // Increment matches, and either wins or losses
  const { error } = await supabase.rpc('update_character_stats', {
    char_id: characterId,
    new_rating: newRating,
    is_win: won,
  });

  if (error) {
    // If RPC doesn't exist, fall back to manual update
    console.log('RPC not available, using manual update');
    
    const character = await getCharacterById(characterId);
    if (!character) return false;

    const updateData = {
      rating: newRating,
      matches: character.matches + 1,
      wins: won ? character.wins + 1 : character.wins,
      losses: won ? character.losses : character.losses + 1,
    };

    const { error: updateError } = await supabase
      .from('characters')
      .update(updateData)
      .eq('id', characterId);

    if (updateError) {
      console.error(`Error updating character ${characterId}:`, updateError);
      return false;
    }
  }

  return true;
}

/**
 * Record a vote in the database
 */
export async function recordVote(
  winnerId: string,
  loserId: string,
): Promise<boolean> {
  const supabase = getSupabaseClient();

  const { error } = await supabase
    .from('votes')
    .insert({
      winner: winnerId,
      loser: loserId,
    });

  if (error) {
    console.error('Error recording vote:', error);
    return false;
  }

  return true;
}
