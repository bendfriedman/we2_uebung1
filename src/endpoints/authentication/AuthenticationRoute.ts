import express, { Request, Response } from "express";
import { authenticate } from "./AuthenticationService";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(400).json({ Error: "invalid or missingauthentication header!" });
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
  // credentials are in format "userID:password"
  const [userID, password] = credentials.split(":");

  try {
    const token = await authenticate(userID, password);
    res.setHeader("Authorization", "Bearer " + token);
    res.status(200).json({ message: "Authentication successful!!!" });
  } catch (error) {
    return res.status(401).json({ Error: "invalid authentication credentials!!" });
  }
});

export default router;
