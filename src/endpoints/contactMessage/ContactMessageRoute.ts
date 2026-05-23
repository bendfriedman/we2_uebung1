import express, { Request, Response } from "express";
import { IContactMessage } from "./ContactMessageModel";
import { mapContactMessage } from "./ContactMessageMapper";
import {
  getAllContactMessages,
  getContactMessageByID,
  createContactMessage,
  updateContactMessage,
  deleteContactMessage,
  deleteAllContactMessages,
} from "./ContactMessageService";
import { NotFoundError } from "../../errors/NotFoundError";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  if (!req.user?.isAdministrator) {
    return res.status(403).json({ Error: "Access denied!" });
  }

  try {
    const contactMessages: IContactMessage[] = await getAllContactMessages();
    res.status(200).json(contactMessages.map(mapContactMessage));
  } catch (error: unknown) {
    return res.status(500).json({ Error: "failed to get contact messages!" });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  if (!req.user?.isAdministrator) {
    return res.status(403).json({ Error: "Access denied!" });
  }

  try {
    const contactMessage: IContactMessage = await getContactMessageByID(
      req.params.id as string,
    );
    res.status(200).json(mapContactMessage(contactMessage));
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      return res.status(error.statusCode).json({ Error: error.message });
    }
    return res.status(500).json({ Error: "Failed to get contact message" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const newContactMessage: IContactMessage = await createContactMessage(
      req.body,
    );
    res.status(201).json(mapContactMessage(newContactMessage));
  } catch (error: unknown) {
    return res.status(500).json({ Error: "Failed to create contact message" });
  }
});

router.put("/:id", async (req: Request, res: Response) => {
  if (!req.user?.isAdministrator) {
    return res.status(403).json({ Error: "Access denied!" });
  }

  try {
    const updated: IContactMessage = await updateContactMessage(
      req.params.id as string,
      req.body.status,
    );
    res.status(200).json(mapContactMessage(updated));
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      return res.status(error.statusCode).json({ Error: error.message });
    }
    return res.status(500).json({ Error: "Failed to update contact message" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  if (!req.user?.isAdministrator) {
    return res.status(403).json({ Error: "Access denied!" });
  }

  try {
    await deleteContactMessage(req.params.id as string);
    res.status(204).json();
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      return res.status(error.statusCode).json({ Error: error.message });
    }
    return res.status(500).json({ Error: "Failed to delete contact message" });
  }
});

if (process.env.NODE_ENV === "development") {
  //!!!only usable in dev mode to prevent accidental deletion of all users in production!!
  router.delete("/", async (req: Request, res: Response) => {
    if (!req.user?.isAdministrator) {
      return res.status(403).json({ Error: "Access denied!" });
    }

    try {
      await deleteAllContactMessages();
      res.status(204).json();
    } catch (error: unknown) {
      res.status(500).json({ Error: "failed to delete contact messages" });
    }
  });
}

export default router;
