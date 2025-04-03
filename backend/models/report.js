const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true, 
    enum: ['Damage Assessment', 'Resource Needs', 'General Incident'] 
  },
  location: { type: String, required: true },
  description: { type: String, required: true },
  images: [String], // Store image URLs
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
