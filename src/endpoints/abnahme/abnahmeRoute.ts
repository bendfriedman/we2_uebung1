import express, { Request, Response } from "express";
import { authenticate } from "../authentication/AuthenticationService";
import { IUser, User } from "../user/UserModel";
import { mapAbnahmeUser } from "./AbnahmeMapper";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  return res.json({ Message: "hello abnahme" });
});

router.get("/getAdmins", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res
      .status(400)
      .json({ Error: "invalid or missingauthentication header!" });
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii",
  );
  // credentials are in format "userID:password"
  const [userID, password] = credentials.split(":");

  try {
    const token = await authenticate(userID, password);

    let users: IUser[] = await User.find({ isAdministrator: true });
    res.status(200).json(users.map(mapAbnahmeUser));
  } catch (error) {
    return res
      .status(401)
      .json({ Error: "invalid authentication credentials for abnahme!!" });
  }
});

export default router;
