import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  userID: string;
  password: string;
  firstName?: string;
  lastName?: string;
  isAdministrator?: boolean;
}

const userSchema: Schema<IUser> = new Schema({
  userID: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  isAdministrator: { type: Boolean, required: false, default: false },
});

const SALT = 10;

userSchema.pre("save", async function (this: IUser) {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, SALT);
});

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
