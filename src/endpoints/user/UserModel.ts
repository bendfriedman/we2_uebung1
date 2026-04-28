import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IPublicUser extends Document {
  userID: string;
  password: string;
  firstName?: string;
  lastName?: string;
  isAdministrator?: boolean;
}

const publicUserSchema: Schema<IPublicUser> = new Schema({
  userID: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  isAdministrator: { type: Boolean, required: false, default: false },
});

const SALT = 10;

publicUserSchema.pre("save", async function (this: IPublicUser) {
  if (!this.isModified) {
    return;
  }
  this.password = await bcrypt.hash(this.password, SALT);
});

export const PublicUser: Model<IPublicUser> = mongoose.model<IPublicUser>(
  "PublicUser",
  publicUserSchema,
);
