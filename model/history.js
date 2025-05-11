import supabase from '../config/DatabaseConfig.js';

export default class History {
  static async getAll() {
    try {
      const { data, error } = await supabase
        .from('history')
        .select(`
          *,
          actores:historia_actor(idactor, actor(descripcion)),
          autores:historia_autor(idautor, autor(descripcion))
        `);

      if (error) {
        console.error('Error al obtener historias:', error);
        throw error;
      }
      return data || [];
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      console.log('[HISTORY MODEL] Buscando historia con ID:', id);
      console.log('[HISTORY MODEL] Tipo de ID:', typeof id);
      console.log('[HISTORY MODEL] Longitud de ID:', id?.length);
      
      // Primero intentar obtener la historia básica
      const { data: historyData, error: historyError } = await supabase
        .from('history')
        .select('idhistory, titulo, descripcion, idactor, idautor')
        .eq('idhistory', id)
        .single();

      if (historyError) {
        console.error('[HISTORY MODEL] Error al obtener historia básica:', historyError);
        throw historyError;
      }

      if (!historyData) {
        console.log('[HISTORY MODEL] Historia no encontrada en la tabla history');
        console.log('[HISTORY MODEL] Consulta ejecutada:', {
          table: 'history',
          condition: `idhistory = '${id}'`
        });
        return null;
      }

      // Si encontramos la historia, ahora obtenemos las relaciones
      const { data: actorsData, error: actorsError } = await supabase
        .from('historia_actor')
        .select('idactor, actor(descripcion)')
        .eq('idhistory', id);

      if (actorsError) {
        console.error('[HISTORY MODEL] Error al obtener actores:', actorsError);
        throw actorsError;
      }

      const { data: authorsData, error: authorsError } = await supabase
        .from('historia_autor')
        .select('idautor, autor(descripcion)')
        .eq('idhistory', id);

      if (authorsError) {
        console.error('[HISTORY MODEL] Error al obtener autores:', authorsError);
        throw authorsError;
      }

      // Combinar los datos
      const result = {
        ...historyData,
        actores: actorsData || [],
        autores: authorsData || []
      };

      console.log('[HISTORY MODEL] Resultado completo:', {
        history: !!historyData,
        actors: actorsData?.length || 0,
        authors: authorsData?.length || 0
      });

      // Devolver solo la historia básica si se está usando para eliminación
      if (result.idhistory) {
        return result;
      }
      return null;
    } catch (error) {
      console.error('[HISTORY MODEL] Error general:', error);
      throw error;
    }
  }

  static async deleteActors(historyId) {
    try {
      const { data, error } = await supabase
        .from('history_actors')
        .delete()
        .eq('idhistory', historyId);

      if (error) {
        console.error('Error al eliminar actores de la historia:', error);
        throw error;
      }
      return { data, error };
    } catch (error) {
      throw error;
    }
  }

  static async deleteAuthors(historyId) {
    try {
      const { data, error } = await supabase
        .from('history_authors')
        .delete()
        .eq('idhistory', historyId);

      if (error) {
        console.error('Error al eliminar autores de la historia:', error);
        throw error;
      }
      return { data, error };
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      console.log('[HISTORY MODEL] Iniciando eliminación de historia con ID:', id);
      
      // Verificar si existe la historia
      const { data: history, error: getError } = await supabase
        .from('history')
        .select('*')
        .eq('idhistory', id)
        .single();

      if (getError) {
        console.error('[HISTORY MODEL] Error al verificar existencia de historia:', getError);
        throw getError;
      }

      if (!history) {
        console.log('[HISTORY MODEL] Historia no encontrada al intentar eliminar');
        throw new Error('Historia no encontrada');
      }

      // Eliminar relaciones primero
      const deleteRelations = await Promise.all([
        supabase.from('history_actors').delete().eq('idhistory', id),
        supabase.from('history_authors').delete().eq('idhistory', id)
      ]);

      // Verificar si hubo errores en la eliminación de relaciones
      const relationErrors = deleteRelations.filter(result => result.error);
      if (relationErrors.length > 0) {
        console.error('[HISTORY MODEL] Error al eliminar relaciones:', relationErrors[0].error);
        throw new Error('Error al eliminar relaciones de la historia');
      }

      // Eliminar la historia
      const { data, error } = await supabase
        .from('history')
        .delete()
        .eq('idhistory', id);

      if (error) {
        console.error('[HISTORY MODEL] Error al eliminar historia:', error);
        throw error;
      }

      if (data && data.length > 0) {
        console.log('[HISTORY MODEL] Historia y sus relaciones eliminadas exitosamente');
        return { success: true };
      } else {
        console.log('[HISTORY MODEL] No se eliminó ninguna fila');
        throw new Error('No se eliminó ninguna fila');
      }
    } catch (error) {
      console.error('[HISTORY MODEL] Error general al eliminar historia:', error);
      throw error;
    }
  }
  static async create(historyData) {
    try {
      // First create the history record
      console.log('Datos de historia recibidos en el backend:', {
        titulo: historyData.titulo,
        descripcion: historyData.descripcion,
        idactor: historyData.idactor,
        idautor: historyData.idautor,
        actores_ids: historyData.actores_ids,
        autores_ids: historyData.autores_ids
      });

      // Solo usar null cuando el valor es undefined o una cadena vacía
      const idactor = historyData.idactor === '' || historyData.idactor === undefined ? null : historyData.idactor;
      const idautor = historyData.idautor === '' || historyData.idautor === undefined ? null : historyData.idautor;
      
      console.log('Valores procesados:', { idactor, idautor });

      // Crear datos de forma más directa para Supabase
      const insertData = {
        titulo: historyData.titulo,
        descripcion: historyData.descripcion
      };

      // Asignar explícitamente los valores de idactor e idautor
      if (idactor !== null && idactor !== undefined) {
        console.log(`Añadiendo idactor: ${idactor} (${typeof idactor}) a los datos a insertar`);
        insertData.idactor = idactor;
      }

      if (idautor !== null && idautor !== undefined) {
        console.log(`Añadiendo idautor: ${idautor} (${typeof idautor}) a los datos a insertar`);
        insertData.idautor = idautor;
      }

      console.log('Datos finales para Supabase:', JSON.stringify(insertData, null, 2));
      
      const { data: history, error: historyError } = await supabase
        .from('history')
        .insert(insertData)
        .select()
        .single();
  
      if (historyError) {
        console.error("Error al crear la historia:", historyError);
        throw historyError;
      }
  
      // Then create actor relationships
      if (historyData.actores_ids && Array.isArray(historyData.actores_ids) && historyData.actores_ids.length > 0) {
        const actorInserts = historyData.actores_ids.map(idactor => ({
          idhistory: history.idhistory,
          idactor
        }));
  
        const { error: actorInsertError } = await supabase
          .from('historia_actor')
          .insert(actorInserts);
  
        if (actorInsertError) {
          console.error("Error al insertar en historia_actor:", actorInsertError);
          throw actorInsertError;
        }
      }
  
      // Then create author relationships
      if (historyData.autores_ids && Array.isArray(historyData.autores_ids) && historyData.autores_ids.length > 0) {
        const autorInserts = historyData.autores_ids.map(idautor => ({
          idhistory: history.idhistory,
          idautor
        }));
  
        const { error: authorInsertError } = await supabase
          .from('historia_autor')
          .insert(autorInserts);
  
        if (authorInsertError) {
          console.error("Error al insertar en historia_autor:", authorInsertError);
          throw authorInsertError;
        }
      }
  
      return history;
    } catch (error) {
      console.error("Error general en la función create:", error);
      throw error;
    }
  }

  static async update(id, historyData) {
    try {
      console.log('Actualizando historia con ID:', id);
      console.log('Datos recibidos para actualización:', historyData);

      // Procesar idactor e idautor de manera consistente
      const idactor = historyData.idactor === '' || historyData.idactor === undefined ? null : historyData.idactor;
      const idautor = historyData.idautor === '' || historyData.idautor === undefined ? null : historyData.idautor;
      
      console.log('Valores procesados:', { idactor, idautor });

      // Crear datos de forma más directa para Supabase
      const updateData = {
        titulo: historyData.titulo,
        descripcion: historyData.descripcion
      };

      // Asignar explícitamente los valores de idactor e idautor
      if (idactor !== null && idactor !== undefined) {
        console.log(`Añadiendo idactor: ${idactor} (${typeof idactor}) a los datos a actualizar`);
        updateData.idactor = idactor;
      }

      if (idautor !== null && idautor !== undefined) {
        console.log(`Añadiendo idautor: ${idautor} (${typeof idautor}) a los datos a actualizar`);
        updateData.idautor = idautor;
      }

      console.log('Datos finales para actualización:', JSON.stringify(updateData, null, 2));
      
      // First update the history record
      const { data: history, error: historyError } = await supabase
        .from('history')
        .update(updateData)
        .eq('idhistory', id)
        .select()
        .single();

      if (historyError) throw historyError;

      // Update actor relationships
      if (historyData.actores_ids && Array.isArray(historyData.actores_ids)) {
        // Delete existing relationships
        const { error: deleteActorError } = await supabase
          .from('historia_actor')
          .delete()
          .eq('idhistory', id);

        if (deleteActorError) throw deleteActorError;

        // Create new relationships if any
        if (historyData.actores_ids.length > 0) {
          const actorInserts = historyData.actores_ids.map(idactor => ({
            idhistory: id,
            idactor
          }));

          const { error: actorInsertError } = await supabase
            .from('historia_actor')
            .insert(actorInserts);

          if (actorInsertError) throw actorInsertError;
        }
      }

      // Update author relationships
      if (historyData.autores_ids && Array.isArray(historyData.autores_ids)) {
        // Delete existing relationships
        const { error: deleteAuthorError } = await supabase
          .from('historia_autor')
          .delete()
          .eq('idhistory', id);

        if (deleteAuthorError) throw deleteAuthorError;

        // Create new relationships if any
        if (historyData.autores_ids.length > 0) {
          const autorInserts = historyData.autores_ids.map(idautor => ({
            idhistory: id,
            idautor
          }));

          const { error: authorInsertError } = await supabase
            .from('historia_autor')
            .insert(autorInserts);

          if (authorInsertError) throw authorInsertError;
        }
      }

      return history;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      // Delete relationships first to avoid foreign key constraints
      const { error: deleteActorError } = await supabase
        .from('historia_actor')
        .delete()
        .eq('idhistory', id);

      if (deleteActorError) throw deleteActorError;

      const { error: deleteAuthorError } = await supabase
        .from('historia_autor')
        .delete()
        .eq('idhistory', id);

      if (deleteAuthorError) throw deleteAuthorError;

      // Then delete the history record
      const { error: historyDeleteError } = await supabase
        .from('history')
        .delete()
        .eq('idhistory', id);

      if (historyDeleteError) throw historyDeleteError;

    } catch (error) {
      throw error;
    }
  }
}