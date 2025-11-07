import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// attach user to Request
declare global {
  namespace Express {
    interface Request {
      user?: { email: string };
    }
  }
}

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
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

    const decoded = jwt.verify(token, secret) as { email?: string; iat?: number; exp?: number };

    if (!decoded || typeof decoded.email !== "string") {
      return res.status(403).json({ message: "Invalid token payload" });
    }

    // attach to req
    req.user = { email: decoded.email };
    console.log("the user in the middleware is ", req.user);

    next();
  } catch (err: any) {
    // jwt.verify throws for invalid/expired tokens
    return res.status(403).json({ message: "Invalid or expired token", details: err.message });
  }
};
