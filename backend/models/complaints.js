const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  username: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Resolved"], default: "Pending" },
  viewed: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Complaint", ComplaintSchema);
