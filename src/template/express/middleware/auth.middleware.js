import {Authnticator} from '../utils/jwt.<%= ext %>'
import dotenv from 'dotenv'
export default async function AuthMiddleware(req , res , next){
    try {
        
        const authHeader = req.header.authorization;
        if( !authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({
            message : "TOKEN is missing !!"
        });
        const token = authHeader.split("")[1];

        const response = await Authnticator({
            token,
            secret,
        })
        
    } catch (error) {
        return res.status(500).json({
            message : "Internal server error !!!",
            error : error.message || error
        });
    }
}