import mongoose, { Document, Model, Types } from "mongoose";

export interface OpportunityDoc extends Document {
  title: string;
  organization: string;
  city: string;
  date: string;
  startTime: string;
  endTime: string;
  description?: string;
  categories: string[];
  createdBy?: Types.ObjectId;
  volunteers: Types.ObjectId[];
}

const opportunitySchema = new mongoose.Schema<OpportunityDoc>(
  {
    title: { type: String, required: true },
    organization: { type: String, required: true },
    city: { type: String, required: true },
    date: { type: String, required: true }, // ISO date string (YYYY-MM-DD)
    startTime: { type: String, required: true }, // HH:mm
    endTime: { type: String, required: true }, // HH:mm
    description: String,
    categories: { type: [String], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    volunteers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

const Opportunity: Model<OpportunityDoc> = mongoose.model<OpportunityDoc>(
  "Opportunity",
  opportunitySchema
);

export default Opportunity;
