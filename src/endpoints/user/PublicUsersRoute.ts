import express, { Request, Response } from "express";
import { IPublicUser } from "./UserModel";
import { createUser, deleteUser, getAllUsers, getUserByUserID, updateUser } from "./PublicUsersService";
import { mapUser } from "./UserMapper";

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
    const user: IPublicUser | null = await getUserByUserID(userID);

    if (!user) return res.status(404).json({ Error: "User not found!" });

    res.status(200).json(mapUser(user));
  } catch (error) {
    res.status(500).json({ Error: "Failed to get user!" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { userID, password, firstName, lastName, isAdministrator } = req.body;

    if (!userID || !password) return res.status(400).json({ error: "user id and password are required!" });

    const existingUser: IPublicUser | null = await getUserByUserID(userID);
    if (existingUser) return res.status(400).json({ Error: "UserID already exists!" });

    const newUser: IPublicUser = await createUser({
      userID,
      password,
      firstName,
      lastName,
      isAdministrator,
    });

    res.status(201).json(mapUser(newUser)); //201 created
  } catch (error) {
    res.status(500).json({ Error: "Failed to create user!" });
  }
});

router.put("/:userID", async (req: Request, res: Response) => {
  try {
    const { password, firstName, lastName, isAdministrator } = req.body;
    const userID: string = req.params.userID as string;

    if ("userID" in req.body)
      return res.status(400).json({
        Error: "userID not allowed in body as it cannot be changed!",
      });

    const updatedUser: IPublicUser | null = await updateUser(userID, {
      password,
      firstName,
      lastName,
      isAdministrator,
    });

    if (!updatedUser) return res.status(404).json({ Error: "User not found!" });

    res.status(200).json(mapUser(updatedUser));
  } catch (error) {
    res.status(500).json({ Error: "Failed to update user!" });
  }
});

router.delete("/:userID", async (req: Request, res: Response) => {
  try {
    const userID: string = req.params.userID as string;
    const deletedUser: IPublicUser | null = await deleteUser(userID);
    if (!deletedUser) return res.status(404).json({ Error: "User not found!" });

    res.status(200).json(mapUser(deletedUser));
  } catch (error) {
    res.status(500).json({ Error: "Failed to delete user!" });
  }
});

export default router;
