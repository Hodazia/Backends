

import express from "express"
import authrouter from "./routes/auth.router";
import dotenv from "dotenv"

dotenv.config();
const app = express();
app.use(express.json());

app.get("/", (req,res) => {
    res.status(200).json({
        "message":"AA gaye tum!"
    })
})

app.use("/api/v1",authrouter);

app.listen(3000, ()=> {
    console.log("the  service is running on port 3000! ")
})