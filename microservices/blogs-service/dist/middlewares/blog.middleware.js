"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const AuthMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"] || req.headers["Authorization"];
        if (!authHeader || typeof authHeader !== "string") {
            return res.status(401).json({ message: "Authorization header missing" });
        }
        const parts = authHeader.split(" ");
        if (parts.length !== 2 || parts[0] !== "Bearer") {
            return res.status(401).json({ message: "Malformed Authorization header. Expect 'Bearer <token>'" });
        }
        const token = parts[1];
        const secret = process.env.JWT_SECRET || "zia21";
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (!decoded || typeof decoded.email !== "string") {
            return res.status(403).json({ message: "Invalid token payload" });
        }
        // attach to req
        req.user = { email: decoded.email };
        console.log("the user in the middleware is ", req.user);
        next();
    }
    catch (err) {
        // jwt.verify throws for invalid/expired tokens
        return res.status(403).json({ message: "Invalid or expired token", details: err.message });
    }
};
exports.AuthMiddleware = AuthMiddleware;
