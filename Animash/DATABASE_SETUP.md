# Animash Database Setup

This document contains the SQL schema and setup instructions for Animash.

## Database Schema

Execute these SQL commands in your Supabase SQL Editor to set up the database:

### 1. Characters Table

```sql
-- Create characters table
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  universe TEXT NOT NULL,
  image_url TEXT NOT NULL,
  rating INTEGER DEFAULT 1200,
  matches INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster leaderboard queries
CREATE INDEX IF NOT EXISTS idx_characters_rating ON characters(rating DESC);
```

### 2. Votes Table

```sql
-- Create votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  winner UUID REFERENCES characters(id) ON DELETE CASCADE,
  loser UUID REFERENCES characters(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for analytics
CREATE INDEX IF NOT EXISTS idx_votes_winner ON votes(winner);
CREATE INDEX IF NOT EXISTS idx_votes_loser ON votes(loser);
CREATE INDEX IF NOT EXISTS idx_votes_created_at ON votes(created_at DESC);
```

### 3. Database Function (Optional but Recommended)

This RPC function makes character updates atomic and more efficient:

```sql
-- Create function to update character stats atomically
CREATE OR REPLACE FUNCTION update_character_stats(
  char_id UUID,
  new_rating INTEGER,
  is_win BOOLEAN
)
RETURNS VOID AS $$
BEGIN
  UPDATE characters
  SET 
    rating = new_rating,
    matches = matches + 1,
    wins = CASE WHEN is_win THEN wins + 1 ELSE wins END,
    losses = CASE WHEN NOT is_win THEN losses + 1 ELSE losses END
  WHERE id = char_id;
END;
$$ LANGUAGE plpgsql;
```

### 4. Row Level Security (RLS) Policies

Enable RLS and set up policies for security:

```sql
-- Enable Row Level Security
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to characters
CREATE POLICY "Allow public read access to characters"
  ON characters FOR SELECT
  TO public
  USING (true);

-- Allow service role to insert/update characters
CREATE POLICY "Allow service role full access to characters"
  ON characters FOR ALL
  TO service_role
  USING (true);

-- Allow service role full access to votes
CREATE POLICY "Allow service role full access to votes"
  ON votes FOR ALL
  TO service_role
  USING (true);

-- Optionally allow public to view vote statistics
CREATE POLICY "Allow public read access to votes"
  ON votes FOR SELECT
  TO public
  USING (true);
```

## Seeding Sample Data

After creating the tables, insert sample characters:

```sql
INSERT INTO characters (name, universe, image_url) VALUES
  ('Violet Evergarden', 'Violet Evergarden', 'https://images.unsplash.com/photo-1760551937537-a29dbbfab30b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd29tYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzA0ODY3Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080'),
  ('Mikasa Ackerman', 'Attack on Titan', 'https://images.unsplash.com/photo-1758600588854-56536665fc9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25maWRlbnQlMjB3b21hbiUyMGZhY2V8ZW58MXx8fHwxNzcwNDk1MzA3fDA&ixlib=rb-4.1.0&q=80&w=1080'),
  ('Nezuko Kamado', 'Demon Slayer', 'https://images.unsplash.com/photo-1676369134323-243e00148e54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjB3b21hbiUyMGhlYWRzaG90fGVufDF8fHx8MTc3MDQ5NTMwN3ww&ixlib=rb-4.1.0&q=80&w=1080'),
  ('Yor Forger', 'Spy x Family', 'https://images.unsplash.com/photo-1644945591333-d9ee9dffccff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b21hbiUyMHBob3RvfGVufDF8fHx8MTc3MDQ5NTMwOHww&ixlib=rb-4.1.0&q=80&w=1080'),
  ('Makima', 'Chainsaw Man', 'https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDQyMzE5OXww&ixlib=rb-4.1.0&q=80&w=1080'),
  ('Zero Two', 'Darling in the Franxx', 'https://images.unsplash.com/photo-1760551937537-a29dbbfab30b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHlsaXNoJTIwd29tYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzA0OTUzMDd8MA&ixlib=rb-4.1.0&q=80&w=1080'),
  ('Erza Scarlet', 'Fairy Tail', 'https://images.unsplash.com/photo-1676369134323-243e00148e54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjB3b21hbiUyMGhlYWRzaG90fGVufDF8fHx8MTc3MDQ5NTMwN3ww&ixlib=rb-4.1.0&q=80&w=1080'),
  ('Rem', 'Re:Zero', 'https://images.unsplash.com/photo-1758600588854-56536665fc9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25maWRlbnQlMjB3b21hbiUyMGZhY2V8ZW58MXx8fHwxNzcwNDk1MzA3fDA&ixlib=rb-4.1.0&q=80&w=1080'),
  ('Nami', 'One Piece', 'https://images.unsplash.com/photo-1644945591333-d9ee9dffccff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3b21hbiUyMHBob3RvfGVufDF8fHx8MTc3MDQ5NTMwOHww&ixlib=rb-4.1.0&q=80&w=1080'),
  ('Hinata Hyuga', 'Naruto', 'https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc3MDQyMzE5OXww&ixlib=rb-4.1.0&q=80&w=1080'),
  ('Asuna Yuuki', 'Sword Art Online', 'https://images.unsplash.com/photo-1760551937537-a29dbbfab30b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd29tYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzA0ODY3Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080'),
  ('Saber', 'Fate Series', 'https://images.unsplash.com/photo-1676369134323-243e00148e54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWF1dGlmdWwlMjB3b21hbiUyMGhlYWRzaG90fGVufDF8fHx8MTc3MDQ5NTMwN3ww&ixlib=rb-4.1.0&q=80&w=1080');
```

## Setup Checklist

1. ✅ Copy SQL commands from this file
2. ✅ Open Supabase Dashboard → SQL Editor
3. ✅ Create characters table with indexes
4. ✅ Create votes table with indexes
5. ✅ Create update_character_stats function
6. ✅ Enable RLS and create policies
7. ✅ Insert sample character data
8. ✅ Verify tables exist in Table Editor

## Notes

- All Elo calculations happen server-side in the Edge Function
- The default starting rating is 1200
- The K-factor is set to 32 (standard chess rating)
- Ratings update in real-time as users vote
- The leaderboard automatically reflects the latest rankings