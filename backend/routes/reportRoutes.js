const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Report = require('../models/report');

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Setup for Image Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    console.log('Multer processing file:', file.originalname);
    if (file.mimetype.startsWith('image/')) {
      console.log('File type accepted:', file.mimetype);
      cb(null, true);
    } else {
      console.log('File type rejected:', file.mimetype);
      cb(new Error('Only images are allowed'));
    }
  }
});

// Submit a new report
router.post('/submit', upload.array('images', 5), async (req, res) => {
  try {
    console.log('Full request body:', JSON.stringify(req.body, null, 2));
    console.log('Files array:', req.files);
    console.log('Files details:', req.files ? req.files.map(f => ({
      fieldname: f.fieldname,
      originalname: f.originalname,
      mimetype: f.mimetype,
      size: f.size
    })) : 'No files');
    
    const { type, location, description } = req.body;
    
    if (!type || !location || !description) {
      console.log('Missing required fields:', { type, location, description });
      return res.status(400).json({ message: "All fields are required" });
    }

    const imageUrls = (req.files || []).map(file => {
      console.log('Processing file:', file.filename);
      return `/uploads/${file.filename}`;
    });

    console.log('Generated image URLs:', imageUrls);

    const newReport = new Report({
      type,
      location,
      description,
      images: imageUrls
    });

    await newReport.save();
    res.status(201).json({ 
      message: 'Report submitted successfully', 
      report: newReport 
    });
  } catch (error) {
    console.error('Report submission error:', error);
    res.status(500).json({ 
      message: 'Failed to submit report',
      error: error.message 
    });
  }
});

// Get all reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a report
router.delete('/:id', async (req, res) => {
  try {
    console.log('Delete request received for report ID:', req.params.id);
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid report ID' });
    }

    const report = await Report.findById(req.params.id);
    
    if (!report) {
      console.log('Report not found:', req.params.id);
      return res.status(404).json({ message: 'Report not found' });
    }

    // Delete associated images from filesystem
    for (const imagePath of report.images) {
      const fullPath = path.join(__dirname, '..', imagePath);
      console.log('Attempting to delete image:', fullPath);
      if (fs.existsSync(fullPath)) {
        try {
          fs.unlinkSync(fullPath);
          console.log('Image deleted successfully:', fullPath);
        } catch (err) {
          console.error('Error deleting image:', fullPath, err);
        }
      } else {
        console.log('Image file not found:', fullPath);
      }
    }

    // Delete the report from database
    const deleteResult = await Report.findByIdAndDelete(req.params.id);
    console.log('MongoDB delete result:', deleteResult);
    console.log('Report deleted successfully:', req.params.id);
    res.status(200).json({ message: 'Report deleted successfully' });

  } catch (error) {
    console.error('Error deleting report:', error);
    res.status(500).json({ message: 'Server error while deleting report' });
  }
});

module.exports = router;
