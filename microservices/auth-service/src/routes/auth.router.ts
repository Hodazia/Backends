import express from "express"
import { Signup,Signin, Getalluser } from "../controllers/auth.controller";

const authrouter = express.Router();
authrouter.post("/signup",Signup);
authrouter.post("/signin", Signin);
// authrouter.post("/logout");
authrouter.get("/all",Getalluser);


export default authrouter