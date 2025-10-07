import { createClient } from '@supabase/supabase-js';

// NOTE: The user needs to set up their own Supabase project and configure
// environment variables for this application to function correctly.
// We are providing placeholder values here to prevent the app from crashing on start.
const placeholderUrl = 'https://your-project-id.supabase.co';
const placeholderAnonKey = 'your-supabase-anon-key';

const supabaseUrl = process.env.SUPABASE_URL || placeholderUrl;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || placeholderAnonKey;

export const isSupabaseConfigured = supabaseUrl !== placeholderUrl && supabaseAnonKey !== placeholderAnonKey;

// A more prominent warning for the developer.
if (!isSupabaseConfigured) {
    console.warn(
`********************************************************************************
*                                                                              *
*           !!! SUPABASE ENVIRONMENT VARIABLES NOT SET !!!                     *
*                                                                              *
*   The application is using placeholder credentials.                          *
*   Authentication and database features will not work.                        *
*   - Using mock user for development -                                        *
*                                                                              *
*   Please create a .env file in the root directory and add your               *
*   Supabase project URL and Anon Key.                                         *
*   (Or use your platform's secret management tools)                           *
*                                                                              *
*   SUPABASE_URL=...                                                           *
*   SUPABASE_ANON_KEY=...                                                      *
*                                                                              *
********************************************************************************`
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);