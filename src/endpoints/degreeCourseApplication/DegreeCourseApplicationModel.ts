import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDegreeCourseApplication extends Document {
  applicantUserID?: string;
  degreeCourseID: string;
  targetPeriodYear: number;
  targetPeriodShortName: string;
}

const degreeCourseApplicationSchema: Schema<IDegreeCourseApplication> =
  new Schema({
    applicantUserID: { type: String, required: false },
    degreeCourseID: { type: String, required: true },
    targetPeriodYear: { type: Number, required: true },
    targetPeriodShortName: { type: String, required: true },
  });

export const DegreeCourseApplication: Model<IDegreeCourseApplication> =
  mongoose.model<IDegreeCourseApplication>(
    "DegreeCourseApplication",
    degreeCourseApplicationSchema,
  );
