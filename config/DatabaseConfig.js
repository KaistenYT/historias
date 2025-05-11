import { createClient } from '@supabase/supabase-js';

// Get environment variables from Vercel
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing required environment variables');
  console.error('SUPABASE_URL:', supabaseUrl);
  console.error('SUPABASE_ANON_KEY:', supabaseAnonKey);
  console.error('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  throw new Error('Missing required environment variables');
}

// Log environment variables
console.log('Initializing Supabase client...');
console.log('Using SUPABASE_URL:', !!process.env.SUPABASE_URL);
console.log('Using NEXT_PUBLIC_SUPABASE_URL:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Using SUPABASE_ANON_KEY:', !!process.env.SUPABASE_ANON_KEY);
console.log('Using NEXT_PUBLIC_SUPABASE_ANON_KEY:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test connection
async function testConnection() {
  try {
    const { data, error } = await supabase.from('history').select('*').limit(1);
    if (error) {
      console.error('Error testing Supabase connection:', error);
      throw error;
    }
    console.log('Successfully connected to Supabase');
  } catch (error) {
    console.error('Failed to connect to Supabase:', error);
    throw error;
  }
}

// Run connection test
try {
  await testConnection();
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  throw error;
}

async function connectActorTable() {
  const { error } = await supabase
    .from('actor')
    .insert([])
    //.single();  Removed .single()

  if (error) {
    console.error('Error al interactuar con la tabla "actor":', error);
    console.error('Detalles del error:', error);
  } else {
    console.log('Tabla "actor" creada. ');
  }
}

async function connectTableAuthor() {
  const { error } = await supabase
    .from('autor')
    .insert([]);
    //.single(); Removed .single()

  if (error) {
    console.error('Error al interactuar con la tabla "autor":', error);
    console.error('Detalles del error:', error);
  } else {
    console.log('Tabla "autor" creada.');
  }
}
    

async function connectHistoryTable() {
  const { data, error } = await supabase //added data
    .from('history')
    .insert([]);
    //.single(); Removed .single()

  if (error) {
    console.error('Error al interactuar con la tabla "history":', error);
    console.error('Detalles del error:', error);
  } else {
    console.log('Tabla "history" creada.');
  }
}

/*async function connectParticipationTable() {
  const { error } = await supabase
    .from('participation')
    .insert([]);
    //.single(); Removed .single()

  if (error) {
    console.error('Error al interactuar con la tabla "participation":', error);
    console.error('Detalles del error:', error);
  } else {
    console.log('Tabla "participation" creada.');
  }
}*/



async function connectInitialTables() {
  await connectActorTable();
  await connectTableAuthor();
  await connectHistoryTable();
 // await connectParticipationTable();
  console.log('Tablas iniciales existentes. 😁');
}

connectInitialTables();

export default supabase;

// Export as named export for compatibility
export const supabaseClient = supabase;
