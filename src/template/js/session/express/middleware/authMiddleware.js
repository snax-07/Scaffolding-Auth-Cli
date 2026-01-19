import mongoose from "mongoose";
import User from '../models/userModel.js'
import { redis } from "../index.js";

export const authGuard = async (req, res, next) => {
  try {
    if (!redis.isOpen) {
      return res.status(503).json({
        message: "Auth service temporarily unavailable",
        success: false,
      });
    }

    if (!req.session || !req.session.user || !req.session.user._id) {
        return res.status(401).json({
            message: "Session or user info not detected",
            success: false,
        });
    }

    if(!req.session.meta.ua !== req.headers["user-agent"]){
        return res.status(401).json({
            message : "Session HI-JACKING detected !!!",
            success : false
        })
    }

    const userId = req.session.user._id;
    if (!mongoose.isValidObjectId(userId)) {
      await destroySession(req);
      return res.status(401).json({
        message: "Invalid session user ID",
        success: false,
      });
    }

    req.session.touch();

    const user = await User.findById(userId);
    if (!user) {
      await destroySession(req);
      return res.status(401).json({
        message: "User not found or invalid",
        success: false,
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Helper function to destroy session safely
async function destroySession(req) {
  return new Promise((resolve) => {
    req.session.destroy((err) => {
      if (err) console.error("Error destroying session:", err);
      resolve();
    });
  });
}
