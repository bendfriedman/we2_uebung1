import { IPublicUser } from "./UserModel";

export interface PublicUserResponse {
  id: string;
  userID: string;
  password: string;
  firstName?: string;
  lastName?: string;
  isAdministrator: boolean;
}

export function mapUser(user: IPublicUser): PublicUserResponse {
  return {
    id: user._id.toString(),
    userID: user.userID,
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
    isAdministrator: user.isAdministrator,
  };
}
