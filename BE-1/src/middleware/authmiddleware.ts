import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export const authmiddleware  = (req:Request,res:Response,next:NextFunction) => {

    const token = req.headers.authorization;

    if(!token) {
        return res.status(401).json({
            "message":"Unauthorized"
        })
    }
    try {
        const user = jwt.verify(token, 'ZIA2025');
        //@ts-ignore
        req.user = user;
        next();
      } catch (err: any) {
        if (err.name === "TokenExpiredError") {
          return res.status(429).json({
            message: "Token expired - please sign in again!"
          });
        }
        return res.status(401).json({
          message: "Invalid token"
        });
      }

    // // const user = jwt.verify(token, 'ZIA2025');
    // // console.log("What is the user! ", user)

    // //@ts-ignore
    // req.user = user,
    // next();
}

export const authroleteacher = (req:Request,res:Response,next:NextFunction) => {
    const token = req.headers.authentication

    if(!token) 
    {
        return res.status(401).json({
            "message":"Share the token!"
        })
    }
    else{
        const auth = jwt.verify(token as string, 'ZIA');
        console.log("What is in the destructured object of auth ", auth);
        //@ts-ignore
        if(auth.role=='teacher')
        {
            //@ts-ignore
            req.role = auth.role   
            next();
        }
        else{
            res.status(401).json({
                "message":"chutiya mat banao hame!"
            })
        }
    }
}