import jwt from "jsonwebtoken"
import { Request,Response } from "express"

import bcrypt from "bcrypt"
import  { jwt_secret } from "../utils/config"
import { signupSchema } from "../utils/config";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const Signup = async (req:Request, res:Response) => {
    const parsedschema = signupSchema.safeParse(req.body);

    if(!parsedschema.success)
    {
        res.status(429).json({
            "message":"Wrong credentials, enter the correct ones"
        })
    }

    // check if the user exists or not
    const { email, password} = req.body;
    const existinguser = await prisma.user.findUnique({
        where: {
            email:email
        }
    })

    if(existinguser)
    {
        return res.status(429).json({
            "message":"The user already exists!, enter new credentials!"
        })
    }

    const hashedpassword = await bcrypt.hash(password,10);
    const token = jwt.sign({email,password}, jwt_secret as string);


    const user = await prisma.user.create({
        data:{
            email:email,
            password:hashedpassword
        }
    })

    return res.status(200).json({
        "message":"signed up successfully!",
        "token":token,
        "user":user
    })

}

// const Signin = async (req:Request,res:Response) => {

// }