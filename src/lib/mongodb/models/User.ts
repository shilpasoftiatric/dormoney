import mongoose, { Schema, Document, Model } from "mongoose";

export type UserRole =
  | "student"
  | "parent"
  | "donor"
  | "organization"
  | "admin"
  | "super_admin";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  passwordHash: string;
  role: UserRole;

  // Student & Parent fields
  firstName?: string;
  lastName?: string;
  phone?: string;
  smsOptIn?: boolean;
  termsAgreed?: boolean;

  // Organization fields
  organizationName?: string;
  contactName?: string;

  // Donor fields
  givingInterests?: string[];

  // System & Status Flags
  isActive: boolean;
  onboardingComplete: boolean;
  isTestAccount: boolean;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "parent", "donor", "organization", "admin", "super_admin"],
      default: "student",
      required: true,
    },
    firstName: {
      type: String,
      default: "",
      trim: true,
    },
    lastName: {
      type: String,
      default: "",
      trim: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    smsOptIn: {
      type: Boolean,
      default: false,
    },
    termsAgreed: {
      type: Boolean,
      default: true,
    },
    organizationName: {
      type: String,
      default: "",
      trim: true,
    },
    contactName: {
      type: String,
      default: "",
      trim: true,
    },
    givingInterests: {
      type: [String],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    onboardingComplete: {
      type: Boolean,
      default: false,
    },
    isTestAccount: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite compile error in Next.js hot reload
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
