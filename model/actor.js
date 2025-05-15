import supabase from '../config/DatabaseConfig.js'; // Importa tu instancia de Supabase

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

  static async addImage(idactor, file, filename) {
    try {
      // 1. Construct the storage path
      const storagePath = `actores/${idactor}/${filename}`;

      // 2. Upload the file to Supabase Storage
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('imagenes-web') 
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (storageError) {
        console.error('Error uploading image to storage:', storageError);
        throw storageError;
      }

      // 3. Construct the public URL of the uploaded image
      const publicImageUrl = supabase.storage
        .from('imagenes-web')   
        .getPublicUrl(storagePath).data.publicUrl;

      // 4. Update the 'actores' table with the image URL
      const { data: actorData, error: actorError } = await supabase
        .from('actores') 
        .update({ imagen_url: publicImageUrl }) 
        .eq('idactor', idactor)
        .single(); 

      if (actorError) {
        console.error('Error updating actor with image URL:', actorError);
        throw actorError;
      }

      return { ...actorData, publicImageUrl }; 
    } catch (error) {
      console.error('Error in addImage function:', error);
      throw error;
    }
  }

  
}

export default Actor;
