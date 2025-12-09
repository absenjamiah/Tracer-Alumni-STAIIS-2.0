import { createClient } from '@supabase/supabase-js';

// The Supabase URL and anonymous key are hardcoded here as requested to re-establish the connection.
const supabaseUrl = "https://fcfobaexqphjkibsepou.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZm9iYWV4cXBoamtpYnNlcG91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwODQ2MjYsImV4cCI6MjA4MDY2MDYyNn0.2s-AIF8X07Iei10rflNpdYR3daZlBbPKFIzmNRkIvMk";

// The client is created directly using the provided credentials.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
