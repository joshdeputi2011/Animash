import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as elo from "./elo.tsx";
import * as db from "./database.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-dc5b0864/health", (c) => {
  return c.json({ status: "ok" });
});

// Vote submission endpoint
app.post("/make-server-dc5b0864/vote", async (c) => {
  try {
    const body = await c.req.json();
    const { winner_id, loser_id } = body;

    // Validate inputs
    if (!winner_id || !loser_id) {
      return c.json(
        { error: "Missing winner_id or loser_id" },
        400
      );
    }

    if (winner_id === loser_id) {
      return c.json(
        { error: "Winner and loser cannot be the same character" },
        400
      );
    }

    // Fetch both characters from database
    const [winner, loser] = await Promise.all([
      db.getCharacterById(winner_id),
      db.getCharacterById(loser_id),
    ]);

    if (!winner || !loser) {
      return c.json(
        { error: "One or both characters not found" },
        404
      );
    }

    // Calculate new Elo ratings (NEVER exposed to client)
    const { winnerNewRating, loserNewRating } = elo.processMatchup(
      winner.rating,
      loser.rating
    );

    console.log(`Elo calculation: ${winner.name} ${winner.rating} -> ${winnerNewRating}, ${loser.name} ${loser.rating} -> ${loserNewRating}`);

    // Update both characters in database
    const [winnerUpdated, loserUpdated] = await Promise.all([
      db.updateCharacterAfterMatch(winner_id, winnerNewRating, true),
      db.updateCharacterAfterMatch(loser_id, loserNewRating, false),
    ]);

    if (!winnerUpdated || !loserUpdated) {
      return c.json(
        { error: "Failed to update character ratings" },
        500
      );
    }

    // Record the vote
    const voteRecorded = await db.recordVote(winner_id, loser_id);

    if (!voteRecorded) {
      console.error("Failed to record vote, but ratings were updated");
    }

    return c.json({
      success: true,
      winner: {
        id: winner_id,
        old_rating: winner.rating,
        new_rating: winnerNewRating,
      },
      loser: {
        id: loser_id,
        old_rating: loser.rating,
        new_rating: loserNewRating,
      },
    });
  } catch (error) {
    console.error("Error processing vote:", error);
    return c.json(
      { error: "Internal server error while processing vote" },
      500
    );
  }
});

Deno.serve(app.fetch);