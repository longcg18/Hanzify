import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://vwuikidgncknuozufiyi.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_Tl4-IAKBx5KT9d2CiL8tog_fzEq4qc2';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

// Health check helper to test if tables exist and are reachable
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    if (error) {
      return { connected: false, error: error.message, tableExists: !error.message.includes('Could not find') };
    }
    return { connected: true, error: null, tableExists: true };
  } catch (err) {
    return { connected: false, error: err.message, tableExists: false };
  }
}
