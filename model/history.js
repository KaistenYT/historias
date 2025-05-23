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
      console.log('Datos de historia recibidos en el backend para creación:', historyData);

      // Paso 1: Preparar solo los datos de la historia que van a la tabla 'history'
      // Ya no incluimos idactor ni idautor directamente en la tabla history
      const insertHistoryData = {
        titulo: historyData.titulo,
        descripcion: historyData.descripcion,
        imagen: historyData.imagen // Asegúrate de que la imagen también se envíe en historyData
        // Agrega aquí cualquier otra columna que vaya directamente en la tabla 'history'
      };

      console.log('Datos finales para insertar en la tabla history:', JSON.stringify(insertHistoryData, null, 2));

      const { data: newHistory, error: historyError } = await supabase
        .from('history')
        .insert([insertHistoryData]) // Supabase insert espera un array si no es single()
        .select() // Importante para obtener el objeto completo con el idhistory generado
        .single(); // Para obtener un solo objeto directamente

      if (historyError) {
        console.error("Error al crear la historia:", historyError);
        throw historyError;
      }

      console.log('Historia creada exitosamente:', newHistory);

      // Paso 2: Gestionar las relaciones de actores (historia_actor)
      const actores_ids = historyData.actores_ids || [];
      if (Array.isArray(actores_ids) && actores_ids.length > 0) {
        const actorInserts = actores_ids.map(actorId => ({
          idhistory: newHistory.idhistory, // Usa el ID de la historia recién creada
          idactor: actorId // Asegúrate que el campo en tu tabla pivote se llame id_actor
        }));

        console.log('Datos para insertar en historia_actor:', JSON.stringify(actorInserts, null, 2));

        const { error: actorInsertError } = await supabase
          .from('historia_actor') // Asegúrate que este es el nombre de tu tabla pivote
          .insert(actorInserts);

        if (actorInsertError) {
          console.error("Error al insertar en historia_actor:", actorInsertError);
          // Puedes decidir qué hacer aquí: si es un error crítico o solo de relación
          // En un escenario real, considerar una transacción o un rollback si fallan las relaciones.
          throw actorInsertError; // Lanzo el error para que sea capturado por el catch principal
        }
        console.log(`Relaciones de ${actores_ids.length} actores insertadas.`);
      } else {
        console.log('No se proporcionaron IDs de actores para asociar.');
      }

      // Paso 3: Gestionar las relaciones de autores (historia_autor)
      const autores_ids = historyData.autores_ids || [];
      if (Array.isArray(autores_ids) && autores_ids.length > 0) {
        const autorInserts = autores_ids.map(autorId => ({
          idhistory: newHistory.idhistory, // Usa el ID de la historia recién creada
          idautor: autorId // Asegúrate que el campo en tu tabla pivote se llame id_autor
        }));

        console.log('Datos para insertar en historia_autor:', JSON.stringify(autorInserts, null, 2));

        const { error: authorInsertError } = await supabase
          .from('historia_autor') // Asegúrate que este es el nombre de tu tabla pivote
          .insert(autorInserts);

        if (authorInsertError) {
          console.error("Error al insertar en historia_autor:", authorInsertError);
          throw authorInsertError;
        }
        console.log(`Relaciones de ${autores_ids.length} autores insertadas.`);
      } else {
        console.log('No se proporcionaron IDs de autores para asociar.');
      }

      // Retornar la historia recién creada (con su ID)
      return newHistory;

    } catch (error) {
      console.error("Error general en la función create de History:", error);
      throw error; // Re-lanza el error para que el controlador lo capture
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

  static async uploadImage(historyId, image) {
    try {
      const filename = `history-${historyId}.jpg`;
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('imagenes-web')
        .upload(`historias/${filename}`, image, {
          cacheControl: '3600',
          upsert: false
        });
      if (storageError) throw storageError;
      const { data: publicUrlData } = supabase
        .storage
        .from('imagenes-web')
        .getPublicUrl(`historias/${filename}`);
      const publicImageUrl = publicUrlData?.publicUrl;
      if (!publicImageUrl) throw new Error('No se pudo obtener la URL pública de la imagen.');
      const { data: historyData, error: historyError } = await supabase
        .from('history')
        .update({ imagen: publicImageUrl })
        .eq('idhistory', historyId)
        .select()
        .single();
      if (historyError) throw historyError;
      return historyData;
    } catch (error) {
      throw error;
    }
  }

  static async deleteImage(historyId) {
    try {
      const { data: historyData, error: historyError } = await supabase
        .from('history')
        .select('imagen')
        .eq('idhistory', historyId)
        .single();
      if (historyError) throw historyError;
      const { data: storageData, error: storageError } = await supabase
        .storage
        .from('imagenes-web')
        .remove([`historias/${historyData.imagen.split('/').pop()}`]);
      if (storageError) throw storageError;
      const { data: deletedHistoryData, error: deletedHistoryError } = await supabase
        .from('history')
        .update({ imagen: null })
        .eq('idhistory', historyId)
        .select()
        .single();
      if (deletedHistoryError) throw deletedHistoryError;
      return deletedHistoryData;
    } catch (error) {
      throw error;
    }
  }
}