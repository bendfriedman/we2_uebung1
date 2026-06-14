import { IUser } from "../user/UserModel";

export interface UserAbnahmeResponse {
  userID: string;
  isAdministrator?: boolean;
}

export function mapAbnahmeUser(user: IUser): UserAbnahmeResponse {
  return {
    userID: user.userID,
    isAdministrator: user.isAdministrator,
  };
}
