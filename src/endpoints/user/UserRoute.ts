import express, { Request, Response } from "express";
import { IUser } from "./UserModel";
import { createUser, deleteAllUsers, deleteUser, getAllUsers, getUserByUserID, updateUser } from "./UserService";
import { mapUser } from "./UserMapper";
import { NotFoundError } from "../../errors/NotFoundError";
import { DuplicateError } from "../../errors/DuplicateError";
import { MissingInfoError } from "../../errors/MissingInfoError";
import { WrongInfoError } from "../../errors/WrongInfoError";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    if (!req.user?.isAdministrator) {
      return res.status(403).json({ Error: "Access denied!" });
    }

    const users: IUser[] = await getAllUsers();

    res.status(200).json(users.map(mapUser));
  } catch (error: unknown) {
    res.status(500).json({ Error: "Failed to get users!!" });
  }
});

// only allow users to access their own data, unless admin, then they can access all users??
router.get("/:userID", async (req: Request, res: Response) => {
  if (req.user?.userID !== req.params.userID && !req.user?.isAdministrator) {
    return res.status(403).json({ Error: "Access denied!" });
  }

  try {
    const userID: string = req.params.userID as string;
    const user: IUser = await getUserByUserID(userID);

    res.status(200).json(mapUser(user));
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      return res.status(error.statusCode).json({ Error: error.message });
    }

    res.status(500).json({ Error: "Failed to get user!!" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    if (!req.user?.isAdministrator) {
      return res.status(403).json({ Error: "Access denied!" });
    }

    const newUser: IUser = await createUser(req.body);

    res.status(201).json(mapUser(newUser));
  } catch (error: unknown) {
    if (error instanceof DuplicateError || error instanceof MissingInfoError) {
      return res.status(error.statusCode).json({ Error: error.message });
    }

    res.status(500).json({ Error: "Failed to create user!" });
  }
});

router.put("/:userID", async (req: Request, res: Response) => {
  try {
    if (req.user?.userID !== req.params.userID && !req.user?.isAdministrator) {
      return res.status(403).json({ Error: "Access denied!" });
    }

    const userID: string = req.params.userID as string;
    const updatedUser: IUser = await updateUser(userID, req.body);

    res.status(200).json(mapUser(updatedUser));
  } catch (error: unknown) {
    if (error instanceof WrongInfoError) {
      return res.status(error.statusCode).json({ Error: error.message });
    }
    if (error instanceof NotFoundError) {
      return res.status(error.statusCode).json({ Error: error.message });
    }
    res.status(500).json({ Error: "Failed to update user!" });
  }
});

router.delete("/:userID", async (req: Request, res: Response) => {
  try {
    if (!req.user?.isAdministrator) {
      return res.status(403).json({ Error: "Access denied!" });
    }

    const userID: string = req.params.userID as string;
    await deleteUser(userID);

    res.status(204).json();
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      return res.status(error.statusCode).json({ Error: error.message });
    }
    res.status(500).json({ Error: "Failed to delete user!" });
  }
});

if (process.env.NODE_ENV === "development") {
  //!!!only usable in dev mode to prevent accidental deletion of all users in production!!
  router.delete("/", async (req: Request, res: Response) => {
    try {
      if (!req.user?.isAdministrator) {
        return res.status(403).json({ Error: "Access denied!" });
      }

      await deleteAllUsers();
      res.status(200).json({ Success: "All users deleted" });
    } catch (error: unknown) {
      res.status(500).json({ Error: "Failed to delete all users!" });
    }
  });
}

export default router;
