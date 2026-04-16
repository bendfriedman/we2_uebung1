import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPublicUser extends Document {
  userID: string;
  password: string;
  firstName: string;
  lastName: string;
  istAdministrator: boolean;
}

const PublicUserSchema: Schema<IPublicUser> = new Schema({
  userID: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  istAdministrator: { type: Boolean, required: true },
});

export const PublicUser: Model<IPublicUser> = mongoose.model<IPublicUser>("PublicUser", PublicUserSchema);
