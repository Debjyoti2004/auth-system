import express from "express"
import cors from "cors"
import "dotenv/config"
import cookieParser from "cookie-parser"

import connectDB from "./config/mongodb.js"
import authRouth from "./routes/authRoutes.js"
import userRouter from "./routes/userRoutes.js"


const app = express()
const port = process.env.PORT || 4000
connectDB()


app.use(express.json())
app.use(cookieParser())
app.use(cors({origin: process.env.CLIENT_URL ,credentials:true}))

//API Endpoint
app.get("/", (req, res) => res.send("API WORKING FINE"))
app.use('/api/auth',authRouth)
app.use('/api/user',userRouter)


app.listen(port, () => console.log(`Server started on PORT : ${port}`))