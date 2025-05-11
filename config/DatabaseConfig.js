import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey);
console.log('Supabase Anon Key:', supabaseAnonKey);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
