import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "config";
import { getUserByUserID } from "../user/UserService";
import { NotFoundError } from "../../errors/NotFoundError";
import { IUser } from "../user/UserModel";

export async function authenticate(userID: string, password: string): Promise<string> {
  let user: IUser;

  try {
    user = await getUserByUserID(userID);
  } catch (error: unknown) {
    if (error instanceof NotFoundError) {
      throw new NotFoundError("User not found!!");
    }
    throw error;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new Error("Invalid credentials!!!");
  }

  const jwtKey: string = config.get<string>("session.tokenKey");
  const token: string = jwt.sign({ userID: user.userID, isAdministrator: user.isAdministrator }, jwtKey, {
    algorithm: "HS256",
    expiresIn: config.get<number>("session.timeout"),
  });

  return token;
}
