const userModel = require("../models/userModel")
const JWT = require("jsonwebtoken")
const { hashPassword, comparePassword } = require("../helpers/authHelper")
const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body
        if (!name) {
            return res.status(400).send({
                success: false,
                message: "Name is required"
            })
        }
        if (!email) {
            return res.status(400).send({
                success: false,
                message: "Email is required"
            })
        }
        if (!cnic) {
            return res.status(400).send({
                success: false,
                message: "CNIC is required"
            })
        }
        if (!password || password.length < 8) {
            return res.status(400).send({
                success: false,
                message: "Password is required and should be 8 character long"
            })
        }
        //existing user
        const existingUser = await userModel.findOne({ email })
        const existingUser2 = await userModel.findOne({ cnic })
        if (existingUser || existingUser2) {
            return res.status(500).send({
                success: false,
                message: "User Already Registered with this Email or CNIC"
            })

        }
        //hash password
        const hashPassword = await hashPassword(password)
        const user = await userModel({ name, email, cnic, password: hashPassword }).save()
        return res.status(201).send({
            success: true,
            message: "Registeration Successful please Login"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: "Error in Register API",
            error,
        });
    }
};
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(500).send({
                success: false,
                message: "Email and Password are Required Field",
            })
        }
        const user = userModel.findOne({ email })
        if (!user) {
            return res.status(500).send({
                success: false,
                message: "user not found",
            })
        }
        //match password
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(500).send({
                success: false,
                message: "Invalid username or password",
            })
        }
        //token jwt
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d"
        })
        //undefined
        user.password = undefined
        res.status(200).send({
            success: true,
            message: "login successful",
            token,
            user,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "error in login api",
            error,
        })
    }

}
module.exports = { registerController, loginController }