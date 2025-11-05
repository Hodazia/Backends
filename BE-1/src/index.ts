import express from "express"
import { Request, Response } from "express";
import jwt from "jsonwebtoken"
import { authroleteacher } from "./middleware/authmiddleware";
import authRouter from "./route/auth";
import rateLimit from "express-rate-limit";



const app = express();
app.use(express.json());

// Define rate limit rule
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 15 minutes
    max: 2, // Limit each IP to 100 requests per `window` (15 mins)
    message: "Too many requests from this IP, please try again later.",
    headers: true, // send rate limit info in response headers
  });
  
// Apply to all routes

app.use("/api/auth",authRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.get("/about", limiter, (req:Request,res:Response) => {
    res.status(200).json({
        "message":"successfully generated!"
    })
})

/*
 - student
 - teacher
 - admin


{ email , password, role:'student' | 'teacher' | 'admin' }
*/

app.post("/teacher/attendance",  authroleteacher , (req:Request,res:Response) => {
    //@ts-ignore
    const role = req.role

    if(!role)
    {
        return res.status(401).json({
            message:"no role wrong role given"
        })
    }

    else{

        return res.status(200).json({
            message:"i am a teacher, izzat karo meri!",
            role:role
        })
    }
})
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});