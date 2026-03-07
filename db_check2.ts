import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envFile = fs.readFileSync(envPath, 'utf-8');
const envLoader = (key: string) => {
    const match = envFile.match(new RegExp(`^${key}=(.*)$`, 'm'));
    return match ? match[1] : undefined;
};

const supabaseUrl = envLoader('VITE_SUPABASE_URL');
const supabaseKey = envLoader('VITE_SUPABASE_ANON_KEY');

// In order to perform administrative tasks, we might need the service role key if anon key can't see pg_policies.
// But we can try anon key first or try using the REST API if available. 
// However, Supabase anon key might not have access to pg_policies. Let's try executing raw SQL via rpc if one exists, or we ask the user.
// Wait, we can check `supabase/migrations/` if the project is using local supabase!
