import mongoose from "mongoose";
import User from '../models/userModel.js'
import dbConnect from "../config/dbConnect.js";
import bcrypt from 'bcryptjs'


//THIS IS USED FOR IMPLENTING THE REDIS FOR BLACKLSITIG THE SID SO THAT USER CAN'T STEAL AND USE IN ANOTHER  
export const blockListedSID = [];
// ================CONTROLLERS================//

const registerUser = async(req , res)=> {
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
            password : bcrypt.hashSync(password , 10)
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
    } catch (error) {
        return res.status(500).json({
            message : "Internal server error !!!",
            success : false,
            error : error.message | error
        })
    }
};

const loginUser = async (req , res) => {
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
            req.session.meta.ua = req.headers["user-agent"];
            
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
    } catch (error) {
        return res.status(500).json({
            message :  "Internal server error !!!",
            success : false,
            error : error.message || error
        })
    }
}

const logout = async (req , res) => {
    try {
        if(!req.cookies.SID){
            return res.status(209).json({
                message : "Cookie is not found !!!",
                success : false
            })
        }
        blockListedSID.push(req.cookies.SID);
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
            } catch (error) {
                return res.status(500).json({
                    message : "Error while destroyiong session !!!",
                    success : false,
                    error : error.message | error
                })
            }
        });
    } catch (error) {
        return res.status(500).json({
            message : "Internal server error !!!",
            success : false,
            error : error.message | error
        })
    }
}

const returnMe = async (req , res) => {
    try {
        await dbConnect();

        const user = await User.findById(new mongoose.Types.ObjectId(req.session.user._id));
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