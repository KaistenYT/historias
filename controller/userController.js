const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
import User  from "../model/user";

export class UserController{

    static async register(req, res){
        try {
         const {username, password} = req.body;

         if(!username || !password){
            return res.status(400).json({message: "Username and password are required"});
         }

         const user = await User.findByUsername(username);

         if(user){
            return res.status(400).json({message: "User already exists"});
         }

         const hashedPassword = await bcrypt.hash(password, 10);

         const newUser = await User.create({username, password: hashedPassword});

         const token = jwt.sign({id: newUser.id}, process.env.JWT_SECRET, {expiresIn: "1h"});

         res.json({token});
            


        } catch (error) {
            console.log(error);
            return res.status(500).json({message: "Internal server error"});
        }
    }

    static async login(req, res){
        try {
            const {username, password} = req.body;

            if(!username || !password){
                return res.status(400).json({message: "Username and password are required"});
            }

            const user = await User.findByUsername(username);

            if(!user){
                return res.status(400).json({message: "User not found"});
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if(!isPasswordValid){
                return res.status(400).json({message: "Invalid password"});
            }

            const token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: "1h"});

            res.json({token});

        } catch (error) {
            console.log(error);
            return res.status(500).json({message: "Internal server error"});
        }
    }
    static async getProfile (req , res){
        try{
          const user = await User.findById(req.user.id);
          if(!user){
            return res.status(404).json({message: "User not found"});
          }
          const { password, ...userWithoutPassword } = user;
            res.json(userWithoutPassword);
        }catch(error){
            console.log(error);
            return res.status(500).json({message: "Internal server error"});
        }
    }
}
