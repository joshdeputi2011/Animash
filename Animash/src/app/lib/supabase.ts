import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const supabaseUrl = `https://${projectId}.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey);

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

export type Vote = {
  id: string;
  winner: string;
  loser: string;
  created_at: string;
};
