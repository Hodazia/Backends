import express from "express"
import { Signup,Signin } from "../controllers/auth.controller";

const authrouter = express.Router();
authrouter.post("/signup",Signup);
authrouter.post("/signin", Signin);
// authrouter.post("/logout");

export default authrouter