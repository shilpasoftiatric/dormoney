import mongoose, { Schema, Document, Model } from "mongoose";

export type DonationFrequency = "daily" | "weekly" | "monthly";
export type CampaignStatus = "active" | "draft" | "completed" | "paused";

export interface ICampaign extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  campaignTitle: string;
  campaignStory: string;
  goalAmount: number;
  donationFrequency: DonationFrequency;
  status: CampaignStatus;
  givingInterests?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema = new Schema<ICampaign>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    campaignTitle: {
      type: String,
      required: true,
      trim: true,
    },
    campaignStory: {
      type: String,
      default: "",
      trim: true,
    },
    goalAmount: {
      type: Number,
      default: 0,
    },
    donationFrequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      default: "monthly",
    },
    status: {
      type: String,
      enum: ["active", "draft", "completed", "paused"],
      default: "active",
    },
    givingInterests: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Campaign: Model<ICampaign> =
  mongoose.models.Campaign || mongoose.model<ICampaign>("Campaign", CampaignSchema);

export default Campaign;
