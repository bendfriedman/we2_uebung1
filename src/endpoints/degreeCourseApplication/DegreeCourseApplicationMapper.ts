import { IDegreeCourseApplication } from "./DegreeCourseApplicationModel";

export interface DegreeCourseApplicationResponse {
  id: string;
  applicantUserID: string;
  degreeCourseID: string;
  targetPeriodYear: number;
  targetPeriodShortName: string;
}

export function mapDegreeCourseApplication(
  degreeCourseApplication: IDegreeCourseApplication,
): DegreeCourseApplicationResponse {
  return {
    id: degreeCourseApplication._id.toString(),
    applicantUserID: degreeCourseApplication.applicantUserID,
    degreeCourseID: degreeCourseApplication.degreeCourseID,
    targetPeriodYear: degreeCourseApplication.targetPeriodYear,
    targetPeriodShortName: degreeCourseApplication.targetPeriodShortName,
  };
}
