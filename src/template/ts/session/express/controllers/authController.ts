import mongoose from "mongoose";
import User from "../../../jwt/express/models/userModel.ts";
import dbConnect from "../config/dbConnect.ts";
import type { Request , Response } from "express";
import bcrypt from 'bcryptjs'


//THIS IS USED FOR IMPLENTING THE REDIS FOR BLACKLSITIG THE SID SO THAT USER CAN'T STEAL AND USE IN ANOTHER  
export const blockListedSID : string[] = [];

//=================INTERFACES=================//
interface AppCookie{
    SID : string
}
// ================CONTROLLERS================//

const registerUser = async(req : Request<{} , {} , {username : string  ,email : string , password : string}> , res : Response)=> {
    try {
        await dbConnect()
        const {username , email , password} = req.body;
        if(!username || !email || !password){
            return res.status(210).json({
                message : "Credentials are required !!!",
                success : false
            });
        };
        
        
        const user = await User.findOne({
            $or : [
                {email},
                {username}
            ]
        });
        if(user){
            return res.status(409).json({
                message : "User is already registered !!!",
                success : false
            });
        }
        const newUser = new User({
            username,
            email,
            password : bcrypt.hashSync(password , 10) as string
        });
        const savedUser = await newUser.save();
        req.session.regenerate((err) => {
            if (err) {
                console.error("Session regeneration error:", err);
                return res.status(500).json({ message: "Internal server error", success: false });
            };
            
            req.session.user = {
                _id: savedUser._id.toString(),
                email: savedUser.email,
            };
            
            req.session.save((err) => {
                if (err) {
                    console.error("Session save error:", err);
                    return res.status(500).json({ message: "Internal server error", success: false });
                }
                
                res.status(201).json({
                    message: "Signup successful",
                    success: true,
                    userId: savedUser._id,
                });
            });
        });
    } catch (error : any) {
        return res.status(500).json({
            message : "Internal server error !!!",
            success : false,
            error : error.message | error
        })
    }
};

const loginUser = async (req : Request<{} , {} , {identifier : string , password : string }>, res : Response) => {
    try {
        
        await dbConnect()
        const {identifier , password} = req.body;
        if(!identifier || !password){
            return res.status(209).json({
                message : "Credentails are required !!!",
                success : false
            });
        };
        
        const user = await User.findOne({
            $or : [
                {email  : identifier},
                {username : identifier}
            ]
        });
        if(!user){
            return res.status(404).json({
                message : "User not found !!!",
                success : false
            });
        };
        if(!bcrypt.compareSync(password , user.password)){
            return res.status(403).json({
                message : "Invalid Credentials !!!",
                success : false
            });
        };
        
        req.session.regenerate((err) => {
            if (err) {
                console.error("Session regeneration error:", err);
                return res.status(500).json({ message: "Internal server error", success: false });
            };
            
            req.session.user = {
                _id: user._id.toString(),
                email: user.email,
            };
            
            //THIS IS MAINLY USED FOR STOLE SID PROTECTION LIKE SESSION HI-JACKING
            if(req.session.meta)
                req.session.meta.ua === req.headers["user-agent"];
            
            req.session.save((err) => {
                if (err) {
                    console.error("Session save error:", err);
                    return res.status(500).json({ message: "Internal server error", success: false });
                }
                
                res.status(200).json({
                    message: "Signup successful",
                    success: true,
                    userId: user._id,
                });
            });
        });
    } catch (error : any) {
        return res.status(500).json({
            message :  "Internal server error !!!",
            success : false,
            error : error.message || error
        })
    }
}

const logout = async (req : Request , res : Response) => {
    try {
        if(!req.cookies.SID){
            return res.status(209).json({
                message : "Cookie is not found !!!",
                success : false
            })
        }
        const sid = (req.cookies as Partial<AppCookie>).SID
        if (sid) {
            blockListedSID.push(sid)
        }

        req.session.destroy((err) => {
            if(err){
                return res.status(500).json({
                    message : "Internal server error !!!",
                    success : false,
                    error : err.message | err
                });
            };
            try {
                
                res.clearCookie("SID", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                });
                return res.status(200).json({
                    message : "Logout successfully !!!",
                    success : true
                });
            } catch (error : any) {
                return res.status(500).json({
                    message : "Error while destroyiong session !!!",
                    success : false,
                    error : error.message | error
                })
            }
        });
    } catch (error : any) {
        return res.status(500).json({
            message : "Internal server error !!!",
            success : false,
            error : error.message | error
        })
    }
}

const returnMe = async (req : Request , res : Response) => {
    try {
        await dbConnect();

        const userId = req.session.user!._id 
        const user = await User.findById(new mongoose.Types.ObjectId());
        if (!user){
            return res.status(404).json({
                message : "User is tempored !!!",
                success  : false
            });
        }

        return res.status(200).json({
            message : "User fetched successfully !!!",
            success : true,
            user
        })
        
    } catch (error) {
        return res.status(500).json({
            message : "Internal server error !!!",
            success : false
        })
    }
}
export {
    registerUser,
    loginUser,
    logout,
    returnMe
}