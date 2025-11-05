// suppose u sign in via jwt u use jwt for getting some details, 
/*
but the jwt expires in 2 minutes, will u be able to access the jwt anyways, !
- access your resources

So write a sign up, sign in endpoint, 
use arrays for storing the data,
- write a  /me endpoint which uses middleware authmiddleware, if jwt expires the middleware
will throws an error , 429 error no response found!

*/


import jwt from "jsonwebtoken";
import { Request,Response } from "express";
import { signupSchema } from "../utils/schema";

interface userSchema {
    email : string,
    password: string,
    token?: string
}
const users: userSchema[] = [] ;

export const signin = (req:Request, res:Response) => {

    const parsedSchema = signupSchema.safeParse(req.body);
    if(!parsedSchema.success)
    {
        return res.status(429).json({
            "message":"enter valid credentials!"
        })
    }
    const {email, password } = req.body;

    if(!email || !password)
    {
        return res.status(429).json({
            "message":"enter all the credentials!"
        })
    }

    let exists = false;
    for(let i=0;i<users.length;i++)
    {
        if(users[i]?.email == email)
        {
            exists=true;
        }
    }
    if(exists)
    {
        return res.status(429).json({
            "message":"User already exists enter new credentials!"
        })
    }
    else{
        const token = jwt.sign({email, password},'ZIA2025',{ expiresIn: 120 })
        users.push({
            email,
            password,
        })

        res.status(200).json({
            "message":"user signed in successfully!",
            "token":token
        })
}
}

export const getmetadata = (req:Request,res:Response) => {
    //@ts-ignore
    const user = req.user;
    let metadata = [];

    for(let i=0;i<users.length;i++)
    {
        if(users[i]?.email == user.email)
        {
            metadata.push(users[i]?.email);
            metadata.push(users[i]?.password);
        }
    }

    return res.status(200).json({
        "message":"we get the metadata!",
        "metadata-email":metadata[0],
        "metadata-password":metadata[1]
    })
}