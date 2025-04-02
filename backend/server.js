require("dotenv").config();

if (!process.env.MONGO_URI || !process.env.PORT) {
    console.error("Error: Missing required environment variables (MONGO_URI or PORT).");
    process.exit(1);
}

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();


app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI, {

    })
    .then(() => console.log("MongoDB Connected"))
    .catch((error) => {
        console.error(`MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    });





// Basic route
app.get("/", (req, res) => {
    res.send("API is running...");
});
const authRoute = require("./routes/authRoute");
app.use("/api/auth", authRoute);
const volunteerRoutes = require("./routes/volunteerRoutes");
app.use("/api/volunteer", volunteerRoutes)

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
