import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";


export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log("token..", token);

    if (!token) {
      res.status(400).json({
        message: "Bad token Request"
      });
      return;
    }
    const decoded = jwt.verify(token, 'zia21') as { id: string };
    // 
    console.log("what is inside decoded  ", decoded);
    //@ts-ignore
    req.userId = decoded.id;
    next();
}
    catch(e)
    {
        res.status(401).json({ message: "Invalid token" });
    }
}