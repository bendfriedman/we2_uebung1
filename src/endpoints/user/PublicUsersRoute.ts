import express, { Request, Response } from "express";
import { IPublicUser } from "./UserModel";
import { createUser, deleteUser, getAllUsers, getUserByUserID, updateUser } from "./PublicUsersService";
import { mapUser } from "./UserMapper";
import { NotFoundError } from "../../errors/NotFoundError";
import { DuplicateError } from "../../errors/DuplicateError";
import { MissingInfoError } from "../../errors/MissingInfoError";
import { WrongInfoError } from "../../errors/WrongInfoError";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const users: IPublicUser[] = await getAllUsers();

    res.status(200).json(users.map(mapUser));
  } catch (error) {
    res.status(500).json({ Error: "Failed to get users!!" });
  }
});

router.get("/:userID", async (req: Request, res: Response) => {
  try {
    const userID: string = req.params.userID as string;
    const user: IPublicUser = await getUserByUserID(userID);

    res.status(200).json(mapUser(user));
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      return res.status(error.statusCode).json({ Error: error.message });
    }

    res.status(500).json({ Error: "Failed to get user!!" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const newUser: IPublicUser = await createUser(req.body);

    res.status(201).json(mapUser(newUser));
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
    const updatedUser: IPublicUser = await updateUser(userID, req.body);

    res.status(200).json(mapUser(updatedUser));
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
    const deletedUser: IPublicUser = await deleteUser(userID);

    res.status(200).json(mapUser(deletedUser));
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(error.statusCode).json({ Error: error.message });
    }
    res.status(500).json({ Error: "Failed to delete user!" });
  }
});

export default router;
