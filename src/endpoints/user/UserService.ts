import { DuplicateError } from "../../errors/DuplicateError";
import { MissingInfoError } from "../../errors/MissingInfoError";
import { NotFoundError } from "../../errors/NotFoundError";
import { WrongInfoError } from "../../errors/WrongInfoError";
import { IUser, User } from "./UserModel";

export async function getAllUsers(): Promise<IUser[]> {
  return await User.find();
}

export async function getUserByUserID(userID: string): Promise<IUser> {
  const user = await User.findOne({ userID });
  if (!user) throw new NotFoundError(`User with id ${userID} not found!`);

  return user;
}

export async function userExists(userID: string): Promise<boolean> {
  const user = await User.findOne({ userID });
  return user !== null;
}

export async function createUser(userData: {
  userID: string;
  password: string;
  firstName?: string;
  lastName?: string;
  isAdministrator?: boolean;
}): Promise<IUser> {
  const userID = userData.userID;
  const password = userData.password;

  if (!userID || !password) {
    throw new MissingInfoError("user id and password are required!!");
  }

  if (await userExists(userID))
    throw new DuplicateError(`User with ID ${userID} already exists!!!!`);

  const newUser = new User(userData);

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
): Promise<IUser> {
  if ("userID" in updateData) {
    throw new WrongInfoError(
      "user id not allowed in body as it cannot be changed!",
    );
  }

  const user: IUser = await getUserByUserID(userID);

  Object.assign(user, updateData);
  await user.save();

  return user;
}

export async function deleteUser(userID: string): Promise<IUser> {
  const user: IUser | null = await User.findOneAndDelete({
    userID,
  });
  if (!user) throw new NotFoundError(`User with ID ${userID} not found!`);

  return user;
}

export async function deleteAllUsers(): Promise<void> {
  await User.deleteMany({});
}
