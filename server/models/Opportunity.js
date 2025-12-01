import mongoose from "mongoose";

const opportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    organization: { type: String, required: true },
    city: { type: String, required: true },
    date: String,
    time: String,
    description: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    volunteers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Opportunity", opportunitySchema);
