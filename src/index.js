import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import ImageModel from "./models/Image.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    process.exit(1);
  }
};

// Call the database connection function
connectDB();

// Profile image upload route
app.post("/profile-image", async (req, res) => {
  const { email, image } = req.body;
  console.log(req.body, "req.body");

  if (!email || !image) {
    return res.status(400).json({ error: "Email and image are required" });
  }

  try {
    // Save image to MongoDB
    const imageDoc = new ImageModel({
      email,
      image,
      contentType: "image/jpeg", // optional, set based on your needs
    });

    await imageDoc.save();

    res.status(201).json({ message: "Profile image saved successfully" });
  } catch (error) {
    console.error("Error saving image:", error);
    res.status(500).json({ error: "Failed to save profile image" });
  }
});

// Route to get image data by email
app.get("/profile-image/:email", async (req, res) => {
  const { email } = req.params;

  try {
    const imageDoc = await ImageModel.findOne({ email });

    if (!imageDoc) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.status(200).json({
      email: imageDoc.email,
      image: imageDoc.image,
      contentType: imageDoc.contentType,
    });
  } catch (error) {
    console.error("Error fetching image:", error);
    res.status(500).json({ error: "Failed to fetch profile image" });
  }
});

app.get("/test", (req, res) => {
  res.send("Hello World");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
