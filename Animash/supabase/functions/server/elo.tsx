/**
 * Elo Rating System Implementation
 * Standard chess-style Elo algorithm for character rankings
 */

const K_FACTOR = 32; // Standard K-factor for Elo calculations

/**
 * Calculate expected score for a player with given rating against opponent
 * @param playerRating - The player's current rating
 * @param opponentRating - The opponent's current rating
 * @returns Expected score (probability of winning, 0-1)
 */
export function calculateExpectedScore(
  playerRating: number,
  opponentRating: number,
): number {
  return 1 / (1 + Math.pow(10, (opponentRating - playerRating) / 400));
}

/**
 * Calculate new rating after a match
 * @param currentRating - Player's current rating
 * @param expectedScore - Expected score (from calculateExpectedScore)
 * @param actualScore - Actual result (1 for win, 0 for loss, 0.5 for draw)
 * @returns New rating (rounded to nearest integer)
 */
export function calculateNewRating(
  currentRating: number,
  expectedScore: number,
  actualScore: number,
): number {
  const newRating = currentRating + K_FACTOR * (actualScore - expectedScore);
  return Math.round(newRating);
}

/**
 * Process a matchup and return new ratings for both characters
 * @param winnerRating - Current rating of winner
 * @param loserRating - Current rating of loser
 * @returns Object with new ratings for both winner and loser
 */
export function processMatchup(
  winnerRating: number,
  loserRating: number,
): { winnerNewRating: number; loserNewRating: number } {
  // Calculate expected scores
  const winnerExpected = calculateExpectedScore(winnerRating, loserRating);
  const loserExpected = calculateExpectedScore(loserRating, winnerRating);

  // Calculate new ratings (winner gets 1, loser gets 0)
  const winnerNewRating = calculateNewRating(winnerRating, winnerExpected, 1);
  const loserNewRating = calculateNewRating(loserRating, loserExpected, 0);

  return {
    winnerNewRating,
    loserNewRating,
  };
}
