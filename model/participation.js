import supabase from '../config/DatabaseConfig';

class Participation {
    static async getAll() {
        try {
            const { data, error } = await supabase
                .from('participation')
                .select('*');

            if (error) {
                console.error('Error al obtener todas las participaciones:', error);
                throw error;
            }
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async getById(id) {
        try {
            const { data, error } = await supabase
                .from('participation')
                .select('*')
                .eq('idParticipation', id)
                .single();

            if (error) {
                console.error('Error al obtener participacion por ID:', error);
                throw error;
            }
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async create(participation) {
        try {
            const { data, error } = await supabase
                .from('participation')
                .insert([participation])
                .select()
                .single();

            if (error) {
                console.error('Error al crear participacion:', error);
                throw error;
            }
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async update(id, participation) {
        try {
            const { data, error } = await supabase
                .from('participation')
                .update(participation)
                .eq('idParticipation', id)
                .select()
                .single();

            if (error) {
                console.error('Error al actualizar participacion:', error);
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
                .from('participation')
                .delete()
                .eq('idParticipation', id)
                .select()
                .single();

            if (error) {
                console.error('Error al eliminar participacion:', error);
                throw error;
            }
            return data;
        } catch (error) {
            throw error;
        }
    }

    static async getHistoryById(id) {
        try {
            const { data, error } = await supabase
                .from('participation')
                .select('*')
                .eq('idParticipation', id)
                .single();

            if (error) {
                console.error('Error al obtener participacion por ID:', error);
                throw error;
            }
            return data;
        } catch (error) {
            throw error;
        }
    }
}

export default Participation

