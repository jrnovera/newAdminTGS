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
const supabaseKey = envLoader('VITE_SUPABASE_SERVICE_ROLE_KEY') || envLoader('VITE_SUPABASE_ANON_KEY');

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function check() {
    console.log('Using key:', supabaseKey?.substring(0, 15) + '...');

    // Check columns using standard PostgREST way (by selecting 1 row)
    const { data: rows, error } = await supabase.from('venue_reviews').select('*').limit(1);
    if (error) {
        console.error('Error fetching reviews:', error);
    } else {
        console.log('Columns in first row (if any):', rows && rows.length > 0 ? Object.keys(rows[0]) : 'No rows');
    }

    // Check if venue_type is indeed required by attempting an insert with service role bypass
    const { data: retreats } = await supabase.from('retreat_venues').select('id').limit(1);
    if (!retreats || retreats.length === 0) return;

    const retreatId = retreats[0].id;
    console.log('Attempting insert without venue_type...');

    const { data: insertData, error: insertError } = await supabase.from('venue_reviews').insert({
        venue_id: retreatId,
        user_name: 'Test',
        rating: 5,
        review_text: 'Test review'
    }).select();

    console.log('Result:', insertError ? insertError : insertData);

    if (insertData && insertData.length > 0) {
        await supabase.from('venue_reviews').delete().eq('id', insertData[0].id);
    }
}

check().catch(console.error);
