import { DuplicateError } from "../../errors/DuplicateError";
import { MissingInfoError } from "../../errors/MissingInfoError";
import { NotFoundError } from "../../errors/NotFoundError";
import { WrongInfoError } from "../../errors/WrongInfoError";
import { IPublicUser, PublicUser } from "./UserModel";

export async function getAllUsers(): Promise<IPublicUser[]> {
  return await PublicUser.find();
}

export async function getUserByUserID(userID: string): Promise<IPublicUser> {
  const user = await PublicUser.findOne({ userID });
  if (!user) throw new NotFoundError(`User with id ${userID} not found!`);

  return user;
}

async function userExists(userID: string): Promise<boolean> {
  const user = await PublicUser.findOne({ userID });
  return user !== null;
}

export async function createUser(userData: {
  userID: string;
  password: string;
  firstName?: string;
  lastName?: string;
  isAdministrator?: boolean;
}): Promise<IPublicUser> {
  const userID = userData.userID;
  const password = userData.password;

  if (!userID || !password) {
    throw new MissingInfoError("user id and password are required!!");
  }

  if (await userExists(userID)) throw new DuplicateError(`User with ID ${userID} already exists!!!!`);

  const newUser = new PublicUser(userData);

  return await newUser.save();
}

export async function updateUser(
  userID: string,
  updateData: {
    password?: string;
    firstName?: string;
    lastName?: string;
    isAdministrator?: boolean;
  },
): Promise<IPublicUser> {
  if ("userID" in updateData) {
    throw new WrongInfoError("user id not allowed in body as it cannot be changed!");
  }

  const user: IPublicUser = await getUserByUserID(userID);

  Object.assign(user, updateData);
  await user.save();

  return user;
}

export async function deleteUser(userID: string): Promise<IPublicUser> {
  const user: IPublicUser | null = await PublicUser.findOneAndDelete({ userID });
  if (!user) throw new NotFoundError(`User with ID ${userID} not found!`);

  return user;
}
