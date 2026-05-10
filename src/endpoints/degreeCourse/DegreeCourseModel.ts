import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDegreeCourse extends Document {
  universityName: string;
  universityShortName: string;
  departmentName: string;
  departmentShortName: string;
  name: string;
  shortName: string;
}

const degreeCourseSchema: Schema<IDegreeCourse> = new Schema({
  universityName: { type: String, required: true },
  universityShortName: { type: String, required: true },
  departmentName: { type: String, required: true },
  departmentShortName: { type: String, required: true },
  name: { type: String, required: true },
  shortName: { type: String, required: true },
});

export const DegreeCourse: Model<IDegreeCourse> = mongoose.model<IDegreeCourse>("DegreeCourse", degreeCourseSchema);
