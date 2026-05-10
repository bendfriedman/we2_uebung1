import { NotFoundError } from "../../errors/NotFoundError";
import { IDegreeCourse, DegreeCourse } from "./DegreeCourseModel";

export async function getAllDegreeCourses(universityShortName?: string): Promise<IDegreeCourse[]> {
  if (universityShortName) {
    return await DegreeCourse.find({ universityShortName });
  }
  return await DegreeCourse.find();
}

export async function getDegreeCourseByID(id: string): Promise<IDegreeCourse> {
  const degreeCourse = await DegreeCourse.findById(id);
  if (!degreeCourse) throw new NotFoundError(`DegreeCourse with id ${id} not found!`);
  return degreeCourse;
}

export async function createDegreeCourse(data: {
  universityName: string;
  universityShortName: string;
  departmentName: string;
  departmentShortName: string;
  name: string;
  shortName: string;
}): Promise<IDegreeCourse> {
  const degreeCourse = new DegreeCourse(data);
  return await degreeCourse.save();
}

export async function updateDegreeCourse(id: string, updateData: Partial<IDegreeCourse>): Promise<IDegreeCourse> {
  const degreeCourse = await getDegreeCourseByID(id);
  Object.assign(degreeCourse, updateData);
  return await degreeCourse.save();
}

export async function deleteDegreeCourse(id: string): Promise<IDegreeCourse> {
  const degreeCourse = await DegreeCourse.findByIdAndDelete(id);
  if (!degreeCourse) throw new NotFoundError(`DegreeCourse with id ${id} not found!`);
  return degreeCourse;
}

export async function deleteAllCourses(): Promise<void> {
  await DegreeCourse.deleteMany({});
}
