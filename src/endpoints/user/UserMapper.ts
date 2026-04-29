import { IUser } from "./UserModel";

export interface PublicUserResponse {
  id: string;
  userID: string;
  password: string;
  firstName?: string;
  lastName?: string;
  isAdministrator?: boolean;
}

export function mapPublicUser(user: IUser): PublicUserResponse {
  return {
    id: user._id.toString(),
    userID: user.userID,
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
    isAdministrator: user.isAdministrator,
  };
}

export interface UserResponse {
  id: string;
  userID: string;
  firstName?: string;
  lastName?: string;
  isAdministrator?: boolean;
}

export function mapUser(user: IUser): UserResponse {
  return {
    id: user._id.toString(),
    userID: user.userID,
    firstName: user.firstName,
    lastName: user.lastName,
    isAdministrator: user.isAdministrator,
  };
}
