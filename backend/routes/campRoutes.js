const express = require("express");
const router = express.Router();
const Camp = require("../models/camp");

// Add a new camp
router.post("/add", async (req, res) => {
  try {
    const { name, location, capacity } = req.body;
    if (!name || !location || !capacity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newCamp = new Camp({ name, location, capacity });
    await newCamp.save();
    res.status(201).json({ message: "Camp added successfully", camp: newCamp });
  } catch (error) {
    res.status(500).json({ message: "Error adding camp", error: error.message });
  }
});

// Get all camps
router.get("/", async (req, res) => {
  try {
    const camps = await Camp.find();
    res.status(200).json(camps);
  } catch (error) {
    res.status(500).json({ message: "Error fetching camps", error: error.message });
  }
});

// Delete a camp
router.delete("/:id", async (req, res) => {
  try {
    const camp = await Camp.findByIdAndDelete(req.params.id);
    if (!camp) {
      return res.status(404).json({ message: "Camp not found" });
    }
    res.status(200).json({ message: "Camp deleted successfully", camp });
  } catch (error) {
    res.status(500).json({ message: "Error deleting camp", error: error.message });
  }
});

module.exports = router;
