import supabase from '../config/DatabaseConfig.js'; // Importa tu instancia de Supabase

class Author {
  static async getAll() {
    try {
      const { data, error } = await supabase
        .from('autor')
        .select('*');

      if (error) {
        console.error('Error al obtener todos los autores:', error);
        throw error; // Lanza el error para que el controlador lo maneje
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const { data, error } = await supabase
        .from('autor')
        .select('*')
        .eq('idautor', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async create(author) {
    try {
      const { data, error } = await supabase
        .from('autor')
        .insert([author])
        .select()
        .single();

      if (error) {
        console.error('Error al crear autor:', error);
        throw error;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, author) {
    try {
      const { data, error } = await supabase
        .from('autor')
        .update(author)
        .eq('idautor', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const { data, error } = await supabase
        .from('autor')
        .delete()
        .eq('idautor', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default Author;
