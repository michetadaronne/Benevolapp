import mongoose, { Document, Model } from "mongoose";

export interface UserDoc extends Document {
  name?: string;
  email: string;
  passwordHash: string;
  role: "organizer" | "volunteer";
}

const userSchema = new mongoose.Schema<UserDoc>(
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

const User: Model<UserDoc> = mongoose.model<UserDoc>("User", userSchema);

export default User;
