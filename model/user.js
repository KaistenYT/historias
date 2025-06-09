import supabase from "../config/DatabaseConfig.js";


class User{
    static async findByUsername(username){
        const {data, error} = await supabase.from("user")
        .select("*")
        .eq("username", username)
       .maybeSingle();

        if(error){
            console.log(error);
            throw error;
        }

        return data;
    }

    static async create(user){
     const {data, error} = await supabase.from("user").insert([user]).select().maybeSingle();

     if(error){
        console.log(error);
        throw error;
     }

     return data;
    }

    static async findById(id){
        const {data, error} = await supabase.from("user").select("*").eq("id", id).maybeSingle();

        if(error){
            console.log(error);
            throw error;
        }

        return data;
    }

}


export default User;
