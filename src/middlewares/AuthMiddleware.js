import jwt from "jsonwebtoken";
import { config } from "../config";
import { getUserByParam } from "../models";

export const AuthMiddleware = async (req, res, next) => {
    try {
        const token = req.headers["authorization"];
        if (token) {
            const verify = jwt.verify(token, config.private_key);
            if (verify) {
                req.user = verify;
                next();
            } else {
                return res.status(400).json({
                    status: false,
                    message: "Invalid token.",
                });
            }
        } else {
            return res.status(400).json({
                status: false,
                message: "The token is required.",
            });
        }
    } catch (e) {
        return res.status(500).json({
            status: false,
            message: e.message,
        });
    }
};
