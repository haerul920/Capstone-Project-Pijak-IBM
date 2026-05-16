
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCategories() {
  const { data, error } = await supabase.from('products').select('category');
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Categories found:', data);
    const unique = [...new Set(data.map(p => p.category))];
    console.log('Unique categories:', unique);
  }
}

checkCategories();
