import jwt from "jsonwebtoken";

export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
        expiresIn: '7d'
    });
}

export const generateToken = (payload) => {
    return  jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '40m'
    });
}