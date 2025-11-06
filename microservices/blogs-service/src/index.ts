import express from "express"
import dotenv from "dotenv"
dotenv.config();

const app = express();

app.use(express.json());



app.get("/" ,(req,res) => {
    res.status(200).json({
        "message":"blogs pe agaye!"
    })
})

app.listen(3000, ()=> {
    console.log("Listening to port 3000 ")
})