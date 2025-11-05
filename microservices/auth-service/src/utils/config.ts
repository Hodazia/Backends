import z from "zod"
export const jwt_secret = process.env.JWT_SECRET;

/*
Define  a schema signin signup

*/

export const signupSchema = z.object({
    email:z.string(),
    password:z.string()
})


export const signinSchema = z.object({
    email:z.string(),
    password:z.string()
})
