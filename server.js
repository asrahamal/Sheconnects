const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const connectDB = require("./config/db");

// DOTENV
dotenv.config();

// MongoDB Connection
connectDB();


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Test Route
// app.get("/", (req, res) => {
//     res.send("hello world");
// });

app.use("/api/v1/auth", require("./routes/userRoutes"));

// Port Configuration
const PORT = process.env.PORT || 3000;

// Server Listen
app.listen(PORT, () => {
    console.log(`Server Running on port ${PORT}`.bgCyan.white);
});