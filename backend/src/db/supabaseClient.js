const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_SERVICE_KEY:", process.env.SUPABASE_SERVICE_KEY);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not set in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey);
module.exports = supabase;
