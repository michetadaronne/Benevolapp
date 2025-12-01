import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["organizer", "volunteer"],
      required: true,
      default: "volunteer",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
