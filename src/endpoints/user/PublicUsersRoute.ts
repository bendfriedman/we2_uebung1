import express, { Request, Response } from "express";
import { IUser } from "./UserModel";
import {
  createUser,
  deleteAllUsers,
  deleteUser,
  getAllUsers,
  getUserByUserID,
  updateUser,
} from "./UserService";
import { mapPublicUser } from "./UserMapper";
import { NotFoundError } from "../../errors/NotFoundError";
import { DuplicateError } from "../../errors/DuplicateError";
import { MissingInfoError } from "../../errors/MissingInfoError";
import { WrongInfoError } from "../../errors/WrongInfoError";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const users: IUser[] = await getAllUsers();

    res.status(200).json(users.map(mapPublicUser));
  } catch (error) {
    res.status(500).json({ Error: "Failed to get users!!" });
  }
});

router.get("/:userID", async (req: Request, res: Response) => {
  try {
    const userID: string = req.params.userID as string;
    const user: IUser = await getUserByUserID(userID);

    res.status(200).json(mapPublicUser(user));
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(error.statusCode).json({ Error: error.message });
    }

    res.status(500).json({ Error: "Failed to get user!!" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const newUser: IUser = await createUser(req.body);

    res.status(201).json(mapPublicUser(newUser));
  } catch (error) {
    if (error instanceof DuplicateError || error instanceof MissingInfoError) {
      return res.status(error.statusCode).json({ Error: error.message });
    }

    res.status(500).json({ Error: "Failed to create user!" });
  }
});

router.put("/:userID", async (req: Request, res: Response) => {
  try {
    const userID: string = req.params.userID as string;
    const updatedUser: IUser = await updateUser(userID, req.body);

    res.status(200).json(mapPublicUser(updatedUser));
  } catch (error) {
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
    const userID: string = req.params.userID as string;
    const deletedUser: IUser = await deleteUser(userID);

    res.status(200).json(mapPublicUser(deletedUser));
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(error.statusCode).json({ Error: error.message });
    }
    res.status(500).json({ Error: "Failed to delete user!" });
  }
});

if (process.env.NODE_ENV === "development") {
  //!!!only usable in development mode to prevent accidental deletion of all users in production!!!
  router.delete("/", async (req: Request, res: Response) => {
    try {
      await deleteAllUsers();
      res.status(200).json({ Success: "All users deleted" });
    } catch (error: any) {
      res.status(500).json({ Error: "Failed to delete all users!" });
    }
  });
}

export default router;
