const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const volunteerSchema = new mongoose.Schema(
    {
        teamName: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phoneNumber: { type: String, required: true, unique: true },
    },
    { timestamps: true }
);

// Hash password before saving
volunteerSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
volunteerSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Volunteer = mongoose.model("Volunteer", volunteerSchema);
module.exports = Volunteer;
