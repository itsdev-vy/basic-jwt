import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
}, { timestamps: true });


userSchema.methods.isPasswordMatched = async function (passwordEnteredByUser) {
    return await bcrypt.compare(passwordEnteredByUser, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ _id: this._id, email: this.email, firstName: this.firstName, lastName: this.lastName }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
}


export default mongoose.model("User", userSchema);