// scripts/setup-supabase.js
// Node.js script to test and seed Supabase tables from CLI or backend

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.argv[2] || 'https://qbxbfqjzpxiyzobyojex.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_tHwdETTQZKzPhsf1A-_uMQ_Iyx-kXXQ';

if (!SUPABASE_URL || !SUPABASE_URL.startsWith('http')) {
  console.log('⚠️ Please provide a valid Supabase Project URL:');
  console.log('node scripts/setup-supabase.js https://your-project-id.supabase.co');
  process.exit(0);
}

console.log('🚀 Connecting to Supabase at:', SUPABASE_URL);
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function run() {
  try {
    const { data, error } = await supabase.from('courses').select('id, course_name').limit(5);
    if (error) {
      console.error('❌ Table check error:', error.message);
      console.log('👉 Make sure you ran /supabase/schema.sql in your Supabase SQL Editor first!');
    } else {
      console.log('✅ Successfully connected to Supabase!');
      console.log('Existing courses in database:', data);
    }
  } catch (err) {
    console.error('Connection error:', err);
  }
}

run();
