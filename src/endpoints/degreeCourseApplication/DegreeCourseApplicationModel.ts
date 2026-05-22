import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDegreeCourseApplication extends Document {
  applicantUserID: string;
  degreeCourseID: string;
  targetPeriodYear: number;
  targetPeriodShortName: string;
}

const degreeCourseApplicationSchema: Schema<IDegreeCourseApplication> =
  new Schema({
    applicantUserID: { type: String, required: true },
    degreeCourseID: { type: String, required: true },
    targetPeriodYear: { type: Number, required: true },
    targetPeriodShortName: { type: String, required: true },
  });

// create a unique index on the combination of attributes to prevent duplicate applications
degreeCourseApplicationSchema.index(
  {
    applicantUserID: 1,
    degreeCourseID: 1,
    targetPeriodYear: 1,
    targetPeriodShortName: 1,
  },
  { unique: true },
);

export const DegreeCourseApplication: Model<IDegreeCourseApplication> =
  mongoose.model<IDegreeCourseApplication>(
    "DegreeCourseApplication",
    degreeCourseApplicationSchema,
  );
