import express, { Request, Response } from "express";
import { PublicUser } from "./UserModel";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await PublicUser.find();
    console.log("users:", users);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ Error: "Failed to load users." });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { userID, password, firstName, lastName, istAdministrator } =
      req.body;

    const newUser = new PublicUser({
      userID,
      password,
      firstName,
      lastName,
      istAdministrator,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ Error: "Failed to create user." });
  }
});

export default router;
