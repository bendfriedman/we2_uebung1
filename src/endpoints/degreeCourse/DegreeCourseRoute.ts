import express, { Request, Response } from "express";
import { IDegreeCourse } from "./DegreeCourseModel";
import {
  getAllDegreeCourses,
  getDegreeCourseByID,
  createDegreeCourse,
  updateDegreeCourse,
  deleteDegreeCourse,
  deleteAllCourses,
} from "./DegreeCourseService";
import { mapDegreeCourse } from "./DegreeCourseMapper";
import { NotFoundError } from "../../errors/NotFoundError";
import { mapDegreeCourseApplication } from "../degreeCourseApplication/DegreeCourseApplicationMapper";
import { getDegreeCourseApplicationsByDegreeCourseID } from "../degreeCourseApplication/DegreeCourseApplicationService";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const universityShortName: string | undefined = req.query
      .universityShortName as string | undefined;
    const degreeCourses: IDegreeCourse[] =
      await getAllDegreeCourses(universityShortName);
    res.status(200).json(degreeCourses.map(mapDegreeCourse));
  } catch (error) {
    res.status(500).json({ Error: "failed to fetch degree courses" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const degreeCourse: IDegreeCourse = await getDegreeCourseByID(
      req.params.id as string,
    );
    res.status(200).json(mapDegreeCourse(degreeCourse));
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(error.statusCode).json({ Error: error.message });
    }
    res.status(500).json({ Error: "failed to fetch degree course" });
  }
});

router.get(
  "/:id/degreeCourseApplications",
  async (req: Request, res: Response) => {
    if (!req.user?.isAdministrator) {
      return res.status(403).json({ Error: "Access denied!" });
    }
    try {
      const degreeCourseApplications =
        await getDegreeCourseApplicationsByDegreeCourseID(
          req.params.id as string,
        );
      res
        .status(200)
        .json(degreeCourseApplications.map(mapDegreeCourseApplication));
    } catch (error) {
      res.status(500).json({
        Error: "failed to fetch degree course applications for degree course",
      });
    }
  },
);

router.post("/", async (req: Request, res: Response) => {
  if (!req.user?.isAdministrator) {
    return res.status(403).json({ Error: "Access denied!" });
  }
  try {
    const newDegreeCourse: IDegreeCourse = await createDegreeCourse(req.body);
    res.status(201).json(mapDegreeCourse(newDegreeCourse));
  } catch (error) {
    res.status(500).json({ Error: "failed to create degree course" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  if (!req.user?.isAdministrator) {
    return res.status(403).json({ Error: "Access denied!" });
  }
  try {
    const updatedDegreeCourse: IDegreeCourse = await updateDegreeCourse(
      req.params.id as string,
      req.body,
    );
    res.status(200).json(mapDegreeCourse(updatedDegreeCourse));
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(error.statusCode).json({ Error: error.message });
    }
    res.status(500).json({ Error: "failed to update degree course" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  if (!req.user?.isAdministrator) {
    return res.status(403).json({ Error: "Access denied!" });
  }
  try {
    await deleteDegreeCourse(req.params.id as string);
    res.status(204).json();
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(error.statusCode).json({ Error: error.message });
    }
    res.status(500).json({ Error: "failed to delete degree course" });
  }
});

if (process.env.NODE_ENV === "development") {
  router.delete("/", async (req: Request, res: Response) => {
    if (!req.user?.isAdministrator) {
      return res.status(403).json({ Error: "Access denied!" });
    }
    try {
      await deleteAllCourses();
      res
        .status(200)
        .json({ message: "All degree courses deleted successfully!!" });
    } catch (error) {
      res.status(500).json({ Error: "failed to delete all degree courses!!" });
    }
  });
}

export default router;
