const userModel = require("../models/userModel")
const JWT = require("jsonwebtoken")
const { hashPassword, comparePassword } = require("../helpers/authHelper")
const { expressjwt: jwt } = require("express-jwt")
//middleware
const requireSignIn = jwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
});

const registerController = async (req, res) => {
    try {
        const { name, email, cnic, password } = req.body
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
        const hashedPassword = await hashPassword(password)
        const user = await userModel({ name, email, cnic, password: hashedPassword }).save()
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
        //validation
        if (!email || !password) {
            return res.status(500).send({
                success: false,
                message: "Please Provide Email Or Password",
            });
        }
        // find user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(500).send({
                success: false,
                message: "User Not Found",
            });
        }
        //match password
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(500).send({
                success: false,
                message: "Invalid usrname or password",
            });
        }
        //TOKEN JWT
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        // undeinfed password
        user.password = undefined;
        res.status(200).send({
            success: true,
            message: "login successfully",
            token,
            user,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "error in login api",
            error,
        });
    }
};
const updateUserController = async (req, res) => {
    try {
        const { name, password, email, cnic } = req.body;
        //user find
        const user = await userModel.findOne({ email });
        //password validate
        if (password && password.length < 6) {
            return res.status(400).send({
                success: false,
                message: "Password is required and should be 6 character long",
            });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        //updated useer
        const updatedUser = await userModel.findOneAndUpdate(
            { email },
            {
                name: name || user.name,
                password: hashedPassword || user.password,
            },
            { new: true }
        );
        updatedUser.password = undefined;
        res.status(200).send({
            success: true,
            message: "Profile Updated Please Login",
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In User Update Api",
            error,
        });
    }
};

module.exports = {
    requireSignIn,
    registerController,
    loginController,
    updateUserController,
};