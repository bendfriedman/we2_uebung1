import { MissingInfoError } from "../../errors/MissingInfoError";
import { NotFoundError } from "../../errors/NotFoundError";
import {
  IDegreeCourseApplication,
  DegreeCourseApplication,
} from "./DegreeCourseApplicationModel";

export async function getAllDegreeCourseApplications(
  degreeCourseID?: string,
  applicantUserID?: string,
): Promise<IDegreeCourseApplication[]> {
  if (degreeCourseID) {
    return await getDegreeCourseApplicationsByDegreeCourseID(degreeCourseID);
  }
  if (applicantUserID) {
    return await getDegreeCourseApplicationsByApplicantUserID(applicantUserID);
  }
  return await DegreeCourseApplication.find();
}

export async function getDegreeCourseApplicationByID(
  id: string,
): Promise<IDegreeCourseApplication> {
  const degreeCourseApplication = await DegreeCourseApplication.findById(id);
  if (!degreeCourseApplication)
    throw new NotFoundError(`DegreeCourseApplication with id ${id} not found!`);
  return degreeCourseApplication;
}

export async function getDegreeCourseApplicationsByDegreeCourseID(
  degreeCourseID: string,
): Promise<IDegreeCourseApplication[]> {
  return await DegreeCourseApplication.find({ degreeCourseID });
}

export async function getDegreeCourseApplicationsByApplicantUserID(
  applicantUserID?: string,
): Promise<IDegreeCourseApplication[]> {
  if (!applicantUserID) {
    throw new MissingInfoError(
      "applicantUserID is required to get degree course applications for a specific user!",
    );
  }
  return await DegreeCourseApplication.find({ applicantUserID });
}

export async function createDegreeCourseApplication(data: {
  applicantUserID: string;
  degreeCourseID: string;
  targetPeriodYear: number;
  targetPeriodShortName: string;
}): Promise<IDegreeCourseApplication> {
  const degreeCourseApplication = new DegreeCourseApplication(data);
  return await degreeCourseApplication.save();
}

export async function updateDegreeCourseApplication(
  id: string,
  updateData: Partial<IDegreeCourseApplication>,
): Promise<IDegreeCourseApplication> {
  const degreeCourseApplication = await getDegreeCourseApplicationByID(id);
  Object.assign(degreeCourseApplication, updateData);
  return await degreeCourseApplication.save();
}

export async function deleteDegreeCourseApplication(
  id: string,
): Promise<IDegreeCourseApplication> {
  const degreeCourseApplication =
    await DegreeCourseApplication.findByIdAndDelete(id);
  if (!degreeCourseApplication)
    throw new NotFoundError(`DegreeCourseApplication with id ${id} not found!`);
  return degreeCourseApplication;
}

export async function deleteAllDegreeCourseApplications(): Promise<void> {
  await DegreeCourseApplication.deleteMany({});
}
