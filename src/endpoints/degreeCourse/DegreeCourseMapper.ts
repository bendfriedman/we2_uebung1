import { IDegreeCourse } from "./DegreeCourseModel";

export interface DegreeCourseResponse {
  id: string;
  universityName: string;
  universityShortName: string;
  departmentName: string;
  departmentShortName: string;
  name: string;
  shortName: string;
}

export function mapDegreeCourse(degreeCourse: IDegreeCourse): DegreeCourseResponse {
  return {
    id: degreeCourse._id.toString(),
    universityName: degreeCourse.universityName,
    universityShortName: degreeCourse.universityShortName,
    departmentName: degreeCourse.departmentName,
    departmentShortName: degreeCourse.departmentShortName,
    name: degreeCourse.name,
    shortName: degreeCourse.shortName,
  };
}
