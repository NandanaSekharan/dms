const express = require("express");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");  // Fixed import path

const router = express.Router();

// Register Route
router.post(
    "/register",
    [
        body("username").notEmpty().withMessage("Username is required"),
        body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
        body("gender").notEmpty().withMessage("Gender is required"),
        body("age").isInt({ min: 1 }).withMessage("Valid age is required"),
        body("address").notEmpty().withMessage("Address is required"),
        body("phoneNumber").notEmpty().withMessage("Phone number is required"),
    ],
    async (req, res) => {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password, gender, age, address, phoneNumber } = req.body;

        try {
            // Check if user already exists
            let userExists = await User.findOne({ username });
            if (userExists) return res.status(400).json({ message: "Username already exists" });

            let phoneExists = await User.findOne({ phoneNumber });
            if (phoneExists) return res.status(400).json({ message: "Phone number already registered" });

            // Create new user
            const newUser = new User({ username, password, gender, age, address, phoneNumber });
            await newUser.save();

            res.status(201).json({ message: "User registered successfully" });
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
);

// Login Route
router.post(
    "/login",
    [
        body("username").notEmpty().withMessage("Username is required"),
        body("password").notEmpty().withMessage("Password is required"),
    ],
    async (req, res) => {
        // Validate input
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, password } = req.body;

        try {
            // Check if user exists
            const user = await User.findOne({ username });
            if (!user) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            // Verify password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials" });
            }

            res.status(200).json({ message: "Login successful", user: {
                username: user.username,
                gender: user.gender,
                age: user.age,
                address: user.address,
                phoneNumber: user.phoneNumber
            }});
        } catch (error) {
            res.status(500).json({ message: "Server error", error: error.message });
        }
    }
);

module.exports = router;
