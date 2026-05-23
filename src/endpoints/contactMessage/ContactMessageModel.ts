import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContactMessage extends Document {
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  createdAt: Date;
  status: "new" | "read" | "answered";
}

const contactMessageSchema: Schema<IContactMessage> = new Schema(
  {
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["new", "read", "answered"],
      default: "new",
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

export const ContactMessage: Model<IContactMessage> =
  mongoose.model<IContactMessage>("ContactMessage", contactMessageSchema);
