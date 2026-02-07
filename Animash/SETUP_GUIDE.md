# Animash Setup Guide

## Quick Start

**Good news!** Animash is currently running in **demo mode** with mock data. You can:
- ✅ See the full UI and design
- ✅ Browse characters in the Arena
- ✅ View the Leaderboard
- ✅ Test all interactions

The app will automatically fall back to mock data if Supabase is not connected.

---

## Full Setup (Connect to Supabase)

To enable real voting, Elo calculations, and persistent data, follow these steps:

### Step 1: Get Your Supabase Project Details

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Open your project (or create a new one)
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **Project Reference ID** (the part before `.supabase.co`)
   - **`anon` public key** (starts with `eyJ...`)
   - **`service_role` secret key** (starts with `eyJ...`)

### Step 2: Set Up the Database

1. In your Supabase Dashboard, go to **SQL Editor**
2. Open the file `DATABASE_SETUP.md` in this project
3. Copy and paste each SQL block into the SQL Editor
4. Run them in this order:
   - ✅ Create `characters` table
   - ✅ Create `votes` table
   - ✅ Create `update_character_stats` function
   - ✅ Enable RLS and create policies
   - ✅ Insert sample character data

### Step 3: Configure Environment Variables

The app needs your Supabase credentials. In Figma Make:

1. Your Project ID and Anon Key should already be configured in `/utils/supabase/info.tsx`
2. The Edge Function needs the Service Role Key for server-side operations
3. Make sure the `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set in your Supabase Edge Functions environment

### Step 4: Deploy the Edge Function

The Edge Function in `/supabase/functions/server/` handles:
- Secure Elo rating calculations
- Vote submission and recording
- Character stat updates

To deploy:
1. Install Supabase CLI: `npm install -g supabase`
2. Link to your project: `supabase link --project-ref YOUR_PROJECT_ID`
3. Deploy the function: `supabase functions deploy`

Or manually copy the server code to your Supabase Dashboard → Edge Functions.

### Step 5: Verify It Works

Once set up:
1. Refresh the app
2. Check the browser console - you should see "Database available" instead of "using mock data"
3. Click a character to vote
4. Go to Rankings page - ratings should update in real-time
5. Check your Supabase Dashboard → Table Editor to see vote records

---

## Troubleshooting

### "Database not available or empty"
- Check that you've created the `characters` and `votes` tables
- Verify you've inserted the sample character data
- Check RLS policies are enabled

### "Vote submission error"
- Check the Edge Function is deployed
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set in Edge Function environment
- Check browser console for detailed error messages

### Images not loading
- The app uses Unsplash images which should load automatically
- If images fail, check your internet connection
- The app will gracefully handle missing images

---

## Architecture Overview

```
Frontend (React)
    ↓
Supabase Client (reads characters, leaderboard)
    ↓
Edge Function (POST /vote)
    ↓
Elo Algorithm (server-side, never exposed)
    ↓
PostgreSQL (updates ratings, records votes)
```

**Key Security Features:**
- ✅ Elo calculations happen only on the server
- ✅ Client cannot manipulate ratings
- ✅ Input validation prevents duplicate votes
- ✅ RLS policies protect data access
- ✅ Service role key never exposed to frontend

---

## Next Steps

Once connected to Supabase, you can:
- Add more characters to the database
- View vote history and analytics
- Customize the Elo K-factor (currently 32)
- Add user authentication (already supported in backend)
- Deploy to production on Vercel

**Note:** This is a production-ready MVP. The code follows best practices and is fully scalable.
