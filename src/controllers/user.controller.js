import User from "../models/user.model.js";
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        if ([firstName, lastName, email, password].some((field) => field?.trim() === "")) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existinguser = await User.findOne({ email });

        if (existinguser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ firstName, lastName, email, password: hashedPassword });

        // Remove password before sending response
        const { password: _, ...userWithoutPassword } = user.toObject();

        res.status(201).json({ message: "User registered successfully", data: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if ([email, password].some((field) => field?.trim() === "")) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await user.isPasswordMatched(password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const accessToken = user.generateAccessToken();

        const options = {
            httpOnly: true,
            secure: true,
            maxAge: 15 * 60 * 1000,
        }

        const { password: _, ...userWithoutPassword } = user.toObject();

        res.cookie("accessToken", accessToken, options);
        res.status(200).json({ message: "Login successful", data: userWithoutPassword });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const protectedRoute = async (req, res) => {
    res.status(200).json({ message: `Welcome ${req.user.firstName} ${req.user.lastName}! This is a protected route.` });
};

const logoutUser = async (req, res) => {
    const options = {
        httpOnly: true,
        secure: true,
    }

    try {
        res.clearCookie("accessToken", options);
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong" });
    }
}

export { registerUser, loginUser, protectedRoute, logoutUser };
