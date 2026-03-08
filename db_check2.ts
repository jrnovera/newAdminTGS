import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://xxx.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'xxx'
const supabase = createClient(supabaseUrl, supabaseKey)

async function run() {
  const { data, error } = await supabase.from('venue_amenities').select('venue_type').limit(10)
  console.log('Results:', data, error)
}
run()
