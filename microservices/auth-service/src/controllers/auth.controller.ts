import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../../prisma/generated/client";
import { signupSchema, signinSchema } from "../utils/config";
import { jwt_secret } from "../utils/config";

const prisma = new PrismaClient();


const generateToken = (email: string) => {
  return jwt.sign({ email }, 'zia21', { expiresIn: "7d" });
};


export const Signup = async (req: Request, res: Response) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid input data",
      });
    }

    const { email, password } = parsed.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists. Please log in instead.",
      });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    const user = await prisma.user.create({
      data: { email, password: hashedPassword },
    });


    const token = generateToken(email);

    return res.status(201).json({
      message: "User registered successfully!",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error("Signup Error:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

// 🔵 SIGNIN CONTROLLER
export const Signin = async (req: Request, res: Response) => {
  try {
    const parsed = signinSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid input data",
      });
    }

    const { email, password } = parsed.data;


    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({
        message: "No such user found. Please sign up.",
      });
    }


    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        message: "Incorrect password. Please try again.",
      });
    }


    const token = generateToken(email);

    return res.status(200).json({
      message: "Signed in successfully!",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (err) {
    console.error("Signin Error:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

/*
Get email and password,
For logout best is to remove from the Frontend rather than the backend!
*/

export const Getalluser = async (req:Request,res:Response) => {
  try {
    const allusers = await prisma.user.findMany({});
    return res.status(200).json({
      "message":"Succesfully fetched all the users! ",
      "users": allusers
    })
  }
  catch(err)
  {
    console.error("Error fetching users ", err);
    return res.status(500).json({
      "message":"Internal server error "
    })
  }
}