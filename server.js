const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const colors = require("colors")
const morgan = require("morgan")
const connectDB = require("./config/db")

//DOTENV
dotenv.config();

//mongodb connection
connectDB();

//REST OBJECT
const app = express()


//middlewares
app.use(cors({
    origin: [
        "0.0.0.0",
    ],
}))
app.use(express, express.json())
app.use(morgan("dev"))
app.get("/", (req, res) => {
    res.send("hello world")
})
//ROUTES 
app.use("api/v1/auth", require("./routes/userRoutes"))
//PORT
const PORT = process.env.PORT || 3000

//listen
app.listen(PORT, () => {
    console.log(`Server Running ${PORT}`.bgCyan.white);
});