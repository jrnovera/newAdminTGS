import { createClient } from '@supabase/supabase-js';

// read from .env
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

const supabase = createClient(supabaseUrl!, supabaseKey!);

async function check() {
    // 1. Get a retreat venue id
    const { data: retreats } = await supabase.from('retreat_venues').select('id').limit(1);
    if (!retreats || retreats.length === 0) {
        console.log('No retreats found');
        return;
    }
    const retreatId = retreats[0].id;
    console.log('Got retreat ID:', retreatId);

    // 2. Try inserting a review
    const { data, error } = await supabase.from('venue_reviews').insert({
        venue_id: retreatId,
        user_name: 'Test Agent',
        rating: 5,
        review_text: 'Test review'
    }).select();

    if (error) {
        console.error('INSERT ERROR:', error);
    } else {
        console.log('INSERT SUCCESS:', data);
        await supabase.from('venue_reviews').delete().eq('id', data[0].id);
    }
}

check().catch(console.error);
