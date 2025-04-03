const express = require("express");
const router = express.Router();
const Complaint = require("../models/complaints");

// Create a new complaint
router.post("/", async (req, res) => {
  try {
    const { title, description, username } = req.body;
    if (!title || !description || !username) {
      return res.status(400).json({ message: "Title, description, and username are required" });
    }

    const complaint = new Complaint({ title, description, username });
    await complaint.save();
    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get all complaints with optional username filter
router.get("/", async (req, res) => {
  try {
    const { username } = req.query;
    const query = username ? { username } : {};
    const complaints = await Complaint.find(query);
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get a specific complaint by ID
router.get("/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update complaint status (e.g., mark as resolved)
router.put("/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, { status }, { new: true });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Add new route for marking complaint as viewed and updating status
router.patch("/:id/view", async (req, res) => {
  try {
    const { viewed, status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id, 
      { viewed, status }, 
      { new: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete a complaint
router.delete("/:id", async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    res.json({ message: "Complaint deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
