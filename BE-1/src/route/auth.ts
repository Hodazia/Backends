
import express from "express";
import { getmetadata, signin } from "../controller/auth.controller";
import { authmiddleware } from "../middleware/authmiddleware";

const authRouter = express.Router();

authRouter.post("/signin1", signin);
authRouter.get("/details",authmiddleware, getmetadata);
export default authRouter;