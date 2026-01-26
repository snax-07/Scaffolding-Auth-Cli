import jwt from "jsonwebtoken";
import dbConnect from "../config/dbConnect.js";
import User from "../models/userModel.js";
import {
  generateToken,
  rotateRefreshToken,
  isTokenBlacklisted,
  csrfSecrets
} from "../controllers/authController.js";


const ACCESS_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "Production",
  sameSite: "strict",
  maxAge: 15 * 60 * 1000,
  path: "/",
};

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "Production",
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: "/",
};

const CSRF_COOKIE_OPTIONS = {
  httpOnly: false,
  secure: process.env.NODE_ENV === "Production",
  sameSite: "strict",
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: "/",
};

/**
 * Auth Guard Middleware
 * - Handles access token and their exp time range
 * - Handles refresh token rotation meanse remove the old refreshToken and new one for next operation and also handle the exp
 * - Enforces CSRF
 * - Attaches user to req
 */

/**
 * THIS IS MIDDLEMAN WHO CHECKS FOR THE ACTIVE SESSION AND CSRF TOKEN FOR AVOIDING THE SESSION HI-JACKING
 * @param {*} req 
 * @param {*} res 
 * @returns {ResponseObject} return the response object and fetched by frontend
 * @throws {ErrorResponseObject}
 */
export const authGuard = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;
    const csrfHeader = req.headers["x-csrf-token"];

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Access token missing",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.JWT_SECRET, {
        issuer: "AUTOMA",
      });

      if (isTokenBlacklisted(accessToken)) {
        throw new Error("Access token blacklisted");
      }
    } catch (err) {
 
      if (err.name !== "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Invalid access token",
        });
      }

      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: "Refresh token missing",
        });
      }

      let refreshDecoded;
      try {
        refreshDecoded = jwt.verify(refreshToken, process.env.JWT_SECRET, {
          issuer: "AUTOMA",
        });

        if (isTokenBlacklisted(refreshToken)) {
          throw new Error("Refresh token blacklisted");
        }
      } catch {
        return res.status(401).json({
          success: false,
          message: "Invalid refresh token",
        });
      }


      rotateRefreshToken(refreshDecoded.sub, refreshDecoded.jti);

      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        csrfToken,
      } = generateToken(refreshDecoded.sub);

      res.cookie("accessToken", newAccessToken, ACCESS_COOKIE_OPTIONS);
      res.cookie("refreshToken", newRefreshToken, REFRESH_COOKIE_OPTIONS);
      res.cookie("csrfToken", csrfToken, CSRF_COOKIE_OPTIONS);

      decoded = jwt.decode(newAccessToken);
    }

    if (req.method !== "GET") {
      const expectedCsrf = csrfSecrets[decoded.jti];

      if (!csrfHeader || csrfHeader !== expectedCsrf) {
        return res.status(403).json({
          success: false,
          message: "CSRF token mismatch",
        });
      }
    }


    await dbConnect();

    const user = await User.findById(decoded.sub).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    req.auth = {
      userId: decoded.sub,
      jti: decoded.jti,
    };

    return next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};
