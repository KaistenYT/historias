import supabase from '../config/DatabaseConfig'; // Importa tu instancia de Supabase

class Actor {
  static async getAll() {
    try {
      const { data, error } = await supabase
        .from('actor')
        .select('*');

      if (error) {
        console.error('Error al obtener todos los actores:', error);
        throw error;
      }
      return data;
    } catch (error) {
      throw error; // Re-lanza el error para el manejo centralizado
    }
  }

  static async getById(id) {
    try {
      const { data, error } = await supabase
        .from('actor')
        .select('*')
        .eq('idactor', id)
        .single();

      if (error) {
        console.error('Error al obtener actor por ID:', error);
        throw error;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async create(actor) {
    try {
      const { data, error } = await supabase
        .from('actor')
        .insert([actor])
        .select()
        .single();

      if (error) {
        console.error('Error al crear actor:', error);
        throw error;
      }
      return data;
    } catch (error) {
        throw error;
    }
  }

  static async update(id, actor) {
    try {
      const { data, error } = await supabase
        .from('actor')
        .update(actor)
        .eq('idactor', id)
        .select()
        .single();

      if (error) {
        console.error('Error al actualizar actor:', error);
        throw error;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const { data, error } = await supabase
        .from('actor')
        .delete()
        .eq('idactor', id)
        .select()
        .single();

      if (error) {
        console.error('Error al eliminar actor:', error);
        throw error;
      }
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default Actor;
