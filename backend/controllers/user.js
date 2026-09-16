const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const RegisterUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Username, email and password are required",
            });
        }

        const existingUsername = await User.findOne({ username });

        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: "Username already exists",
            })
        }

        const existingEmail = await User.findOne({ email })

        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                email: user.email,
            },
            "krish@123",
            {
                expiresIn: "1d",
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

const GetUser = async (req, res) => {
    try {
        const users = await User.find().select("-password");
        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: users,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

module.exports = {
    RegisterUser,
    LoginUser,
    GetUser,
};