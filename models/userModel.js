const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide your name"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        unique: true,
        trim: true
    },
    cnic: {
        type: Number,
        unique: true,
        required: [true, "Please provide your CNIC"],
    },
    password: {
        type: String,
        required: [true, "Please provide your password"],
        min: 8,
        max: 64
    }
    // role: {
    //     type: String,
    //     default: "user"
    // }
}, { timestamps: true })
module.exports = mongoose.model('User', userSchema);