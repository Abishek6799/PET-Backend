import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import Shelter from "../Models/Shelter.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided, authorization declined" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }
        const user = await User.findById(decoded.id).select("-password"); 
        if (user) {
            req.user = user;
            req.shelter = null;
            return next();
        }
        const shelter = await Shelter.findById(decoded.id);
        if(shelter){
            req.shelter = shelter;
            req.user = null;
            return next();
        }
        return res.status(401).json({ message: "User or Shelter not found, authorization declined" });
    } catch (error) {
        if(error instanceof jwt.TokenExpiredError){
            return res.status(401).json({ message: "Token expired, Please login again" });

        }
        if(error instanceof jwt.JsonWebTokenError){
            return res.status(401).json({ message: "Invalid token, authorization failed" });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
};


export const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        if(req.user && req.user.role && req.user.role === "foster" && allowedRoles.includes('foster')){
            return next();
    } if (req.user && req.user.role && req.user.role === "shelter"  && allowedRoles.includes('shelter')) {
        return next();
    }

    if (req.user && req.user.role && req.user.role === "adopter" && allowedRoles.includes('adopter')) {
        return next();
    }
    return res.status(403).json({ message: "Access denied" });
    }
}
