import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
  email: { type: String, required: true },
  image: { type: String, required: true }, // Base64 string
  contentType: { type: String, required: true }, // Image content type
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Image", ImageSchema);
