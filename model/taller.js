import supabase from "../config/DatabaseConfig.js";

class Taller{

    static async getAll(){
        const {data, error} = await supabase.from("talleres").select("*");

        if(error){
            console.log(error);
            throw error;
        }

        return data;
    }

    static async getOne(id){
        const {data, error} = await supabase.from("talleres").select("*").eq("id_taller", id);

        if(error){
            console.log(error);
            throw error;
        }

        return data;
    }

    static async getById(id){
        const {data, error} = await supabase.from("talleres").select("*").eq("id_taller", id);

        if(error){
            console.log(error);
            throw error;
        }

        return data;
    }

    static async create(taller){
        const {data, error} = await supabase.from("talleres").insert([taller])
        .select()
        .single();

        if(error){
            console.log(error);
            throw error;
        }

        return data;
    }

    static async update(id, taller){
        const {data, error} = await supabase.from("talleres").update(taller).eq("id_taller", id)
        .select()
        .single();

        if(error){
            console.log(error);
            throw error;
        }

        return data;
    }

    static async delete(id){
        const {data, error} = await supabase.from("talleres").delete().eq("id_taller", id)
        .select()
        .single();

        if(error){
            console.log(error);
            throw error;
        }

        return data;
    }
}

export default Taller;
