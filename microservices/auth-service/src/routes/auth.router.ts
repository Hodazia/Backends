import express from "express"
import { Signup } from "../controllers/auth.controller";

const authrouter = express.Router();
authrouter.post("/signup",Signup);
// authrouter.post("/signin");
// authrouter.post("/logout");

export default authrouter