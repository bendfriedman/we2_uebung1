import express, { Request, Response } from "express";
import { IDegreeCourseApplication } from "./DegreeCourseApplicationModel";
import { mapDegreeCourseApplication } from "./DegreeCourseApplicationMapper";
import {
  getAllDegreeCourseApplications,
  getDegreeCourseApplicationByID,
  createDegreeCourseApplication,
  updateDegreeCourseApplication,
  deleteDegreeCourseApplication,
  deleteAllDegreeCourseApplications,
  getDegreeCourseApplicationsByApplicantUserID,
} from "./DegreeCourseApplicationService";
import { NotFoundError } from "../../errors/NotFoundError";
import { MissingInfoError } from "../../errors/MissingInfoError";
import { DuplicateError } from "../../errors/DuplicateError";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  if (!req.user?.isAdministrator) {
    return res.status(403).json({ Error: "Access denied!" });
  }

  try {
    const degreeCourseID: string | undefined = req.query.degreeCourseID as
      | string
      | undefined;
    const applicantUserID: string | undefined = req.query.applicantUserID as
      | string
      | undefined;
    const degreeCourseApplications: IDegreeCourseApplication[] =
      await getAllDegreeCourseApplications(degreeCourseID, applicantUserID);
    res
      .status(200)
      .json(degreeCourseApplications.map(mapDegreeCourseApplication));
  } catch (error: unknown) {
    return res
      .status(500)
      .json({ Error: "failed to fetch get course applications" });
  }
});

router.get("/myApplications", async (req: Request, res: Response) => {
  try {
    const applicantUserID: string | undefined = req.user?.userID;
    const degreeCourseApplications: IDegreeCourseApplication[] =
      await getDegreeCourseApplicationsByApplicantUserID(applicantUserID);
    res
      .status(200)
      .json(degreeCourseApplications.map(mapDegreeCourseApplication));
  } catch (error: unknown) {
    if (error instanceof MissingInfoError) {
      return res.status(error.statusCode).json({ Error: error.message });
    }
    return res
      .status(500)
      .json({ Error: "failed to fetch get course applications" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  if (!req.user?.isAdministrator) {
    return res.status(403).json({ Error: "Access denied!" });
  }

  try {
    const degreeCourseApplication: IDegreeCourseApplication =
      await getDegreeCourseApplicationByID(req.params.id as string);
    res.status(200).json(mapDegreeCourseApplication(degreeCourseApplication));
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      return res.status(error.statusCode).json({ Error: error.message });
    }
    return res
      .status(500)
      .json({ Error: "failed to fetch get course application by id" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  // wenn keine userID im body übergeben, dann userID aus dem token nehmen und body ergänzen
  if (!req.body.applicantUserID) {
    req.body.applicantUserID = req.user?.userID;
  }

  if (
    req.user?.userID !== req.body.applicantUserID &&
    !req.user?.isAdministrator
  ) {
    return res.status(403).json({ Error: "Access denied!!!" });
  }

  try {
    const newDegreeCourseApplication: IDegreeCourseApplication =
      await createDegreeCourseApplication(req.body);
    res
      .status(201)
      .json(mapDegreeCourseApplication(newDegreeCourseApplication));
  } catch (error: unknown) {
    if (error instanceof DuplicateError) {
      return res.status(error.statusCode).json({ Error: error.message });
    }
    if (error instanceof NotFoundError) {
      return res.status(error.statusCode).json({ Error: error.message });
    }
    return res
      .status(500)
      .json({ Error: "failed to create degree course application" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  if (!req.user?.isAdministrator) {
    return res.status(403).json({ Error: "Access denied!" });
  }

  try {
    const updatedDegreeCourseApplication: IDegreeCourseApplication =
      await updateDegreeCourseApplication(req.params.id as string, req.body);
    res
      .status(200)
      .json(mapDegreeCourseApplication(updatedDegreeCourseApplication));
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      return res.status(error.statusCode).json({ Error: error.message });
    }
    return res
      .status(500)
      .json({ Error: "failed to update degree course application" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    if (!req.user?.isAdministrator) {
      return res.status(403).json({ Error: "Access denied!" });
    }

    await deleteDegreeCourseApplication(req.params.id as string);

    res.status(204).json();
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      return res.status(error.statusCode).json({ Error: error.message });
    }
    return res
      .status(500)
      .json({ Error: "failed to delete degree course application" });
  }
});

if (process.env.NODE_ENV === "development") {
  //!!!only usable in dev mode to prevent accidental deletion of all users in production!!
  router.delete("/", async (req: Request, res: Response) => {
    if (!req.user?.isAdministrator) {
      return res.status(403).json({ Error: "Access denied!" });
    }

    try {
      await deleteAllDegreeCourseApplications();
      res.status(204).json();
    } catch (error: unknown) {
      res
        .status(500)
        .json({ Error: "failed to delete degree course applications" });
    }
  });
}

export default router;
