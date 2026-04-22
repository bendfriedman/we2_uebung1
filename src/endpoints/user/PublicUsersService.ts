import { IPublicUser, PublicUser } from "./UserModel";
import bcrypt from "bcryptjs";

const SALT = 10;

export async function getAllUsers(): Promise<IPublicUser[]> {
  return await PublicUser.find();
}

export async function getUserByUserID(userID: string): Promise<IPublicUser | null> {
  return await PublicUser.findOne({ userID });
}

export async function createUser(userData: {
  userID: string;
  password: string;
  firstName?: string;
  lastName?: string;
  isAdministrator?: boolean;
}): Promise<IPublicUser> {
  const hashedPassword: string = await bcrypt.hash(userData.password, SALT);
  const newUser = new PublicUser({ ...userData, password: hashedPassword });

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
): Promise<IPublicUser | null> {
  if (updateData.password !== undefined) {
    updateData.password = await bcrypt.hash(updateData.password, SALT);
  }

  return await PublicUser.findOneAndUpdate({ userID }, updateData, {
    new: true, // returns updated user instead of the older version of the user
    runValidators: true, // checks my schema and validates requirements
  });
}

export async function deleteUser(userID: string): Promise<IPublicUser | null> {
  return await PublicUser.findOneAndDelete({ userID });
}
