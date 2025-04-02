const express = require("express");
const bcrypt = require("bcryptjs");
const Volunteer = require("../models/volunteer");

const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
    const { teamName, password, phoneNumber } = req.body;

    try {
        if (!teamName || !password || !phoneNumber) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        // Check if team name exists
        let existingTeam = await Volunteer.findOne({ teamName });
        if (existingTeam) {
            return res.status(400).json({ message: "Team name already exists" });
        }

        // Check if phone number exists
        let existingPhone = await Volunteer.findOne({ phoneNumber });
        if (existingPhone) {
            return res.status(400).json({ message: "Phone number already registered" });
        }

        // Create new volunteer
        const newVolunteer = new Volunteer({ teamName, password, phoneNumber });
        await newVolunteer.save();

        res.status(201).json({ message: "Volunteer registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    const { teamName, password } = req.body;

    try {
        if (!teamName || !password) {
            return res.status(400).json({ message: "Please fill all fields" });
        }

        // Find the volunteer
        const volunteer = await Volunteer.findOne({ teamName });
        if (!volunteer) {
            return res.status(400).json({ message: "Invalid team name or password" });
        }

        // Check password
        const isMatch = await volunteer.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid team name or password" });
        }

        res.json({
            message: "Login successful",
            volunteer: {
                id: volunteer._id,
                teamName: volunteer.teamName,
                phoneNumber: volunteer.phoneNumber,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
